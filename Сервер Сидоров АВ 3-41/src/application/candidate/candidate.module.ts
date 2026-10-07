import { CandidateController } from '@api/controllers/candidate.controller';
import { RolesGuard } from '@api/guards/roles.guard';
import { CandidateService } from '@application/services/candidate.service';
import { ResponseService } from '@application/services/response.service';
import { CandidateDomainService } from '@domain/services/candidate-domain.service';
import { ApplicationEntity } from '@infrastructure/entities/application.entity';
import { CandidateProfileEntity } from '@infrastructure/entities/candidate-profile.entity';
import { CandidateResumeEducationEntity } from '@infrastructure/entities/candidate-resume-education.entity';
import { CandidateResumeEntity } from '@infrastructure/entities/candidate-resume.entity';
import { CandidateResumeExperienceEntity } from '@infrastructure/entities/candidate-resume-experience.entity';
import { SkillEntity } from '@infrastructure/entities/skill.entity';
import { VacancyEntity } from '@infrastructure/entities/vacancy.entity';
import { CandidateRepository } from '@infrastructure/repository/candidate.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CandidateProfileEntity,
      SkillEntity,
      VacancyEntity,
      ApplicationEntity,
      CandidateResumeEntity,
      CandidateResumeExperienceEntity,
      CandidateResumeEducationEntity,
    ]),
  ],
  controllers: [CandidateController],
  providers: [
    CandidateService,
    CandidateRepository,
    CandidateDomainService,
    ResponseService,
    RolesGuard,
  ],
})
export class CandidateModule {}
