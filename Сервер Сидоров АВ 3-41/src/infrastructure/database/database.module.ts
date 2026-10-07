import { Module } from '@nestjs/common';
import { AuthEntity } from '@infrastructure/entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProfileEntity } from '@infrastructure/entities/company-entity.profile';
import { CandidateProfileEntity } from '@infrastructure/entities/candidate-profile.entity';
import { DATABASE_URL } from '@constants';
import { VacancyEntity } from '@infrastructure/entities/vacancy.entity';
import { SkillEntity } from '@infrastructure/entities/skill.entity';
import { ApplicationEntity } from '@infrastructure/entities/application.entity';
import { CandidateResumeEntity } from '@infrastructure/entities/candidate-resume.entity';
import { CandidateResumeExperienceEntity } from '@infrastructure/entities/candidate-resume-experience.entity';
import { CandidateResumeEducationEntity } from '@infrastructure/entities/candidate-resume-education.entity';

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
      entities: [
        AuthEntity,
        CompanyProfileEntity,
        CandidateProfileEntity,
        VacancyEntity,
        SkillEntity,
        ApplicationEntity,
        CandidateResumeEntity,
        CandidateResumeExperienceEntity,
        CandidateResumeEducationEntity,
      ],
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
      VacancyEntity,
      SkillEntity,
      ApplicationEntity,
      CandidateResumeEntity,
      CandidateResumeExperienceEntity,
      CandidateResumeEducationEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
