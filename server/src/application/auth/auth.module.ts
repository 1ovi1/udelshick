import { AuthController } from '@api/controllers/auth.controller';
import { JWT_EXPIRATION_TIME, JWT_SECRET } from '@constants';
import { AuthDomainService } from '@domain/services/auth-domain.service';
import { CandidateProfileEntity } from '@infrastructure/entities/candidate-profile.entity';
import { CompanyProfileEntity } from '@infrastructure/entities/company-entity.profile';
import { AuthEntity } from '@infrastructure/entities/auth.entity';
import { AuthRepository } from '@infrastructure/repository/auth.repository';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '@application/services/auth.service';
import { ResponseService } from '@application/services/response.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRATION_TIME },
    }),
    TypeOrmModule.forFeature([
      AuthEntity,
      CandidateProfileEntity,
      CompanyProfileEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    AuthDomainService,
    ResponseService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
