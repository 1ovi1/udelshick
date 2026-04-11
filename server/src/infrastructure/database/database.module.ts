import { Module } from '@nestjs/common';
import { AuthEntity } from '@infrastructure/entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProfileEntity } from '@infrastructure/entities/company-entity.profile';
import { CandidateProfileEntity } from '@infrastructure/entities/candidate-profile.entity';
import { DATABASE_URL } from '@constants';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: process.env.POSTGRES_HOST || 'localhost',
      // port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      // username: process.env.POSTGRES_USER || 'postgres',
      // password: process.env.POSTGRES_PASSWORD ?? '',
      // database: process.env.POSTGRES_DB,
      url: DATABASE_URL,
      entities: [AuthEntity, CompanyProfileEntity, CandidateProfileEntity],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),
    TypeOrmModule.forFeature([
      AuthEntity,
      CompanyProfileEntity,
      CandidateProfileEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
