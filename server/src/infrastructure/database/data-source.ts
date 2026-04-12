import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AuthEntity } from '../entities/auth.entity';
import { CandidateProfileEntity } from '../entities/candidate-profile.entity';
import { CompanyProfileEntity } from '../entities/company-entity.profile';
import { VacancyEntity } from '../entities/vacancy.entity';
import { SkillEntity } from '../entities/skill.entity';
import { ApplicationEntity } from '../entities/application.entity';
import { CandidateResumeEntity } from '../entities/candidate-resume.entity';
import { CandidateResumeExperienceEntity } from '../entities/candidate-resume-experience.entity';
import { CandidateResumeEducationEntity } from '../entities/candidate-resume-education.entity';

const databaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://nestjs_user:nestjs_password@localhost:5432/nestjs_postgres';

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [
    AuthEntity,
    CandidateProfileEntity,
    CompanyProfileEntity,
    VacancyEntity,
    SkillEntity,
    ApplicationEntity,
    CandidateResumeEntity,
    CandidateResumeExperienceEntity,
    CandidateResumeEducationEntity,
  ],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
