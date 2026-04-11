import { AuthUser } from '@domain/entities/AuthUser';
import { IAuthRepository } from '@domain/interfaces/repositories/auth-repository.interface';
import { AuthEntity } from '@infrastructure/entities/auth.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@domain/entities/enums/role.enum';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(AuthEntity)
    private repo: Repository<AuthEntity>,
  ) {}

  async create(data: Partial<AuthUser>): Promise<AuthUser> {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    return this.mapToDomain(saved);
  }

  async findByEmail(
    email: string,
    withPassword = false,
  ): Promise<AuthUser | null> {
    const qb = this.repo
      .createQueryBuilder('auth')
      .where('auth.email = :email', { email });

    if (withPassword) {
      qb.addSelect('auth.password');
    }

    const found = await qb.getOne();
    return found ? this.mapToDomain(found) : null;
  }

  async findById(id: string, withPassword = false): Promise<AuthUser | null> {
    const qb = this.repo
      .createQueryBuilder('auth')
      .where('auth.id = :id', { id });

    if (withPassword) {
      qb.addSelect('auth.password');
    }

    const found = await qb.getOne();
    return found ? this.mapToDomain(found) : null;
  }

  async findFirstByRole(role: Role): Promise<AuthUser | null> {
    const found = await this.repo
      .createQueryBuilder('auth')
      .where('auth.role = :role', { role })
      .getOne();

    return found ? this.mapToDomain(found) : null;
  }

  private mapToDomain(entity: AuthEntity): AuthUser {
    return {
      id: entity.id,
      email: entity.email,
      password: entity.password || '',
      role: entity.role,
    };
  }
}
