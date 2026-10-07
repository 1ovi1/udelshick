import { CandidateApplicationItem } from '@domain/entities/candidate/candidate-application-item';
import { CandidateResume } from '@domain/entities/candidate/candidate-resume';
import { CandidateSkillItem } from '@domain/entities/candidate/candidate-skill-item';
import { CandidateVacancyDetails } from '@domain/entities/candidate/candidate-vacancy-details';
import { CandidateVacancyListItem } from '@domain/entities/candidate/candidate-vacancy-list-item';
import { PaginatedResult } from '@domain/entities/common/paginated-result';
import { PaginationQuery } from '@domain/entities/common/pagination-query';
import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';
import { ApplyCandidateVacancyData } from '@domain/interfaces/repositories/candidate/apply-candidate-vacancy-data.interface';
import { UpsertCandidateResumeData } from '@domain/interfaces/repositories/candidate/upsert-candidate-resume-data.interface';
import { CandidateRepository } from '@infrastructure/repository/candidate.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CandidateService {
  constructor(private readonly candidateRepository: CandidateRepository) {}

  async listSkills(): Promise<CandidateSkillItem[]> {
    return this.candidateRepository.listSkills();
  }

  async getRecommendedVacancies(
    authId: string,
    query: PaginationQuery,
  ): Promise<PaginatedResult<CandidateVacancyListItem>> {
    return this.candidateRepository.getRecommendedVacancies(authId, query);
  }

  async getVacancyDetails(
    authId: string,
    vacancyId: string,
  ): Promise<CandidateVacancyDetails> {
    return this.candidateRepository.getVacancyDetails(authId, vacancyId);
  }

  async applyToVacancy(
    authId: string,
    vacancyId: string,
    data: ApplyCandidateVacancyData,
  ): Promise<void> {
    await this.candidateRepository.applyToVacancy(authId, vacancyId, data);
  }

  async getOwnResume(authId: string): Promise<CandidateResume | null> {
    return this.candidateRepository.getOwnResume(authId);
  }

  async upsertOwnResume(
    authId: string,
    data: UpsertCandidateResumeData,
  ): Promise<CandidateResume> {
    return this.candidateRepository.upsertOwnResume(authId, data);
  }

  async getOwnApplications(
    authId: string,
    query: PaginationQuery,
    status?: ApplicationStatus,
  ): Promise<PaginatedResult<CandidateApplicationItem>> {
    return this.candidateRepository.getOwnApplications(authId, query, status);
  }

  async deleteOwnApplication(
    authId: string,
    applicationId: string,
  ): Promise<void> {
    await this.candidateRepository.deleteOwnApplication(authId, applicationId);
  }
}
