import { CompanyApplicationItem } from '@domain/entities/company/company-application-item';
import { CompanyCandidateItem } from '@domain/entities/company/company-candidate-item';
import { CompanyCandidateResume } from '@domain/entities/company/company-candidate-resume';
import { CompanySkillItem } from '@domain/entities/company/company-skill-item';
import { CompanyVacancyItem } from '@domain/entities/company/company-vacancy-item';
import { PaginatedResult } from '@domain/entities/common/paginated-result';
import { PaginationQuery } from '@domain/entities/common/pagination-query';
import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';
import { ExperienceLevel } from '@domain/entities/enums/experience-level.enum';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';

export interface CreateCompanyVacancyData {
  position: string;
  location: string;
  salary: number | null;
  requirements: string;
  experienceLevel: ExperienceLevel;
  skillIds: string[];
}

export interface UpdateCompanyVacancyData {
  position?: string;
  location?: string;
  salary?: number | null;
  requirements?: string;
  experienceLevel?: ExperienceLevel;
  skillIds?: string[];
}

export interface InviteCandidateData {
  candidateProfileId: string;
  vacancyId: string;
}

export interface ICompanyRepository {
  listSkills(): Promise<CompanySkillItem[]>;
  createVacancy(
    authId: string,
    data: CreateCompanyVacancyData,
  ): Promise<CompanyVacancyItem>;
  updateVacancy(
    authId: string,
    vacancyId: string,
    data: UpdateCompanyVacancyData,
  ): Promise<CompanyVacancyItem>;
  publishVacancyForReview(authId: string, vacancyId: string): Promise<void>;
  archiveVacancy(authId: string, vacancyId: string): Promise<void>;
  getCompanyVacancies(
    authId: string,
    query: PaginationQuery,
    status?: VacancyStatus,
  ): Promise<PaginatedResult<CompanyVacancyItem>>;
  getCandidatesWithResume(
    query: PaginationQuery,
  ): Promise<PaginatedResult<CompanyCandidateItem>>;
  getCandidateResume(
    candidateProfileId: string,
  ): Promise<CompanyCandidateResume>;
  inviteCandidate(authId: string, data: InviteCandidateData): Promise<void>;
  getCompanyApplications(
    authId: string,
    query: PaginationQuery,
    status?: ApplicationStatus,
  ): Promise<PaginatedResult<CompanyApplicationItem>>;
  setApplicationStatus(
    authId: string,
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<void>;
  getApplicationResume(
    authId: string,
    applicationId: string,
  ): Promise<CompanyCandidateResume>;
}
