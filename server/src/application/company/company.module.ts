import { CompanyController } from '@api/controllers/company.controller';
import { RolesGuard } from '@api/guards/roles.guard';
import { CompanyService } from '@application/services/company.service';
import { ResponseService } from '@application/services/response.service';
import { ApplicationEntity } from '@infrastructure/entities/application.entity';
import { CandidateProfileEntity } from '@infrastructure/entities/candidate-profile.entity';
import { CandidateResumeEducationEntity } from '@infrastructure/entities/candidate-resume-education.entity';
import { CandidateResumeEntity } from '@infrastructure/entities/candidate-resume.entity';
import { CandidateResumeExperienceEntity } from '@infrastructure/entities/candidate-resume-experience.entity';
import { CompanyProfileEntity } from '@infrastructure/entities/company-entity.profile';
import { SkillEntity } from '@infrastructure/entities/skill.entity';
import { VacancyEntity } from '@infrastructure/entities/vacancy.entity';
import { CompanyRepository } from '@infrastructure/repository/company.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyProfileEntity,
      VacancyEntity,
      SkillEntity,
      ApplicationEntity,
      CandidateProfileEntity,
      CandidateResumeEntity,
      CandidateResumeExperienceEntity,
      CandidateResumeEducationEntity,
    ]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, ResponseService, RolesGuard],
})
export class CompanyModule {}
