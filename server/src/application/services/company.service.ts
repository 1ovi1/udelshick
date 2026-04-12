import { CompanyApplicationItem } from '@domain/entities/company/company-application-item';
import { CompanyCandidateItem } from '@domain/entities/company/company-candidate-item';
import { CompanyCandidateResume } from '@domain/entities/company/company-candidate-resume';
import { CompanySkillItem } from '@domain/entities/company/company-skill-item';
import { CompanyVacancyItem } from '@domain/entities/company/company-vacancy-item';
import { PaginatedResult } from '@domain/entities/common/paginated-result';
import { PaginationQuery } from '@domain/entities/common/pagination-query';
import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
import {
  CreateCompanyVacancyData,
  InviteCandidateData,
  UpdateCompanyVacancyData,
} from '@domain/interfaces/repositories/company-repository.interface';
import { CompanyRepository } from '@infrastructure/repository/company.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async listSkills(): Promise<CompanySkillItem[]> {
    return this.companyRepository.listSkills();
  }

  async createVacancy(
    authId: string,
    data: CreateCompanyVacancyData,
  ): Promise<CompanyVacancyItem> {
    return this.companyRepository.createVacancy(authId, data);
  }

  async updateVacancy(
    authId: string,
    vacancyId: string,
    data: UpdateCompanyVacancyData,
  ): Promise<CompanyVacancyItem> {
    return this.companyRepository.updateVacancy(authId, vacancyId, data);
  }

  async publishVacancyForReview(
    authId: string,
    vacancyId: string,
  ): Promise<void> {
    await this.companyRepository.publishVacancyForReview(authId, vacancyId);
  }

  async archiveVacancy(authId: string, vacancyId: string): Promise<void> {
    await this.companyRepository.archiveVacancy(authId, vacancyId);
  }

  async getCompanyVacancies(
    authId: string,
    query: PaginationQuery,
    status?: VacancyStatus,
  ): Promise<PaginatedResult<CompanyVacancyItem>> {
    return this.companyRepository.getCompanyVacancies(authId, query, status);
  }

  async getCandidatesWithResume(
    query: PaginationQuery,
  ): Promise<PaginatedResult<CompanyCandidateItem>> {
    return this.companyRepository.getCandidatesWithResume(query);
  }

  async getCandidateResume(
    candidateProfileId: string,
  ): Promise<CompanyCandidateResume> {
    return this.companyRepository.getCandidateResume(candidateProfileId);
  }

  async inviteCandidate(
    authId: string,
    data: InviteCandidateData,
  ): Promise<void> {
    await this.companyRepository.inviteCandidate(authId, data);
  }

  async getCompanyApplications(
    authId: string,
    query: PaginationQuery,
    status?: ApplicationStatus,
  ): Promise<PaginatedResult<CompanyApplicationItem>> {
    return this.companyRepository.getCompanyApplications(authId, query, status);
  }

  async inviteApplication(
    authId: string,
    applicationId: string,
  ): Promise<void> {
    await this.companyRepository.setApplicationStatus(
      authId,
      applicationId,
      ApplicationStatus.INVITED,
    );
  }

  async rejectApplication(
    authId: string,
    applicationId: string,
  ): Promise<void> {
    await this.companyRepository.setApplicationStatus(
      authId,
      applicationId,
      ApplicationStatus.REJECTED,
    );
  }

  async getApplicationResume(
    authId: string,
    applicationId: string,
  ): Promise<CompanyCandidateResume> {
    return this.companyRepository.getApplicationResume(authId, applicationId);
  }
}
