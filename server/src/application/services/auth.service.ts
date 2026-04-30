import { Role } from '@domain/entities/enums/role.enum';
import { AuthDomainService } from '@domain/services/auth-domain.service';
import { CandidateProfileEntity } from '@infrastructure/entities/candidate-profile.entity';
import { CompanyProfileEntity } from '@infrastructure/entities/company-entity.profile';
import { AuthRepository } from '@infrastructure/repository/auth.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

type RegisterCommand = {
  email: string;
  password: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  contactPerson?: string;
  address?: string;
};

type LoginCommand = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepo: AuthRepository,
    private jwtService: JwtService,
    private readonly authDomainService: AuthDomainService,
    @InjectRepository(CandidateProfileEntity)
    private readonly candidateProfileRepository: Repository<CandidateProfileEntity>,
    @InjectRepository(CompanyProfileEntity)
    private readonly companyProfileRepository: Repository<CompanyProfileEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureInitialAdmin();
  }

  async register(dto: RegisterCommand) {
    if (dto.role === Role.ADMIN) {
      throw new BadRequestException('Регистрация админа выключена');
    }
    const existing = await this.authRepo.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Пользователь уже существует');
    }

    let userToCreate;

    try {
      userToCreate = this.authDomainService.createUserEntity(
        {
          email: dto.email,
          password: dto.password,
          role: dto.role,
        },
        existing,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Invalid registration data';
      throw new BadRequestException(message);
    }

    const user = await this.authRepo.create(userToCreate);

    let profileId: string | undefined;

    if (dto.role === Role.CANDIDATE) {
      if (!dto.firstName || !dto.lastName || !dto.phone) {
        throw new BadRequestException(
          'Имя, фамилия и телефон нужны для регистрации',
        );
      }

      const profile = this.candidateProfileRepository.create({
        id: `candidate-${randomUUID()}`,
        authId: user.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      });
      const saved = await this.candidateProfileRepository.save(profile);
      profileId = saved.id;
    }

    if (dto.role === Role.COMPANY) {
      if (
        !dto.companyName ||
        !dto.contactPerson ||
        !dto.phone ||
        !dto.address
      ) {
        throw new BadRequestException(
          'companyName, contactPerson, phone and address are required for company registration',
        );
      }

      const profile = this.companyProfileRepository.create({
        id: `company-${randomUUID()}`,
        authId: user.id,
        companyName: dto.companyName,
        contactPerson: dto.contactPerson,
        phone: dto.phone,
        address: dto.address,
      });
      const saved = await this.companyProfileRepository.save(profile);
      profileId = saved.id;
    }

    const tokens = this.generateTokens(user);

    return {
      message: 'Registration successful',
      authId: user.id,
      profileId,
      ...tokens,
    };
  }

  async login(dto: LoginCommand) {
    const user = await this.authRepo.findByEmail(dto.email, true);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      authId: user.id,
      ...this.generateTokens(user),
    };
  }

  async me(userId: string) {
    const user = await this.authRepo.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const profileName = await this.resolveProfileDisplayName(
      user.id,
      user.role,
      user.email,
    );

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: profileName,
    };
  }

  private async resolveProfileDisplayName(
    authId: string,
    role: Role,
    email: string,
  ): Promise<string> {
    if (role === Role.CANDIDATE) {
      const profile = await this.candidateProfileRepository.findOne({
        where: { authId },
      });

      if (profile) {
        return `${profile.firstName} ${profile.lastName}`.trim();
      }
    }

    if (role === Role.COMPANY) {
      const profile = await this.companyProfileRepository.findOne({
        where: { authId },
      });

      if (profile) {
        return profile.companyName;
      }
    }

    if (role === Role.ADMIN) {
      return 'Администратор';
    }

    return email.split('@')[0] || 'User';
  }

  private async ensureInitialAdmin(): Promise<void> {
    const existingAdmin = await this.authRepo.findFirstByRole(Role.ADMIN);

    if (existingAdmin) {
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        'Admin seed skipped: set ADMIN_EMAIL and ADMIN_PASSWORD to create initial admin',
      );
      return;
    }

    const userToCreate = this.authDomainService.createUserEntity(
      {
        email: adminEmail,
        password: adminPassword,
        role: Role.ADMIN,
      },
      null,
    );

    const created = await this.authRepo.create(userToCreate);
    this.logger.log(`Initial admin created with id ${created.id}`);
  }

  private generateTokens(user: { id: string; email: string; role: Role }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
