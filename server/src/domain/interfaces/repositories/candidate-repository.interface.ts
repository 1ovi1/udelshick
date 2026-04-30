import { CandidateApplicationItem } from '@domain/entities/candidate/candidate-application-item';
import { CandidateResume } from '@domain/entities/candidate/candidate-resume';
import { CandidateSkillItem } from '@domain/entities/candidate/candidate-skill-item';
import { CandidateVacancyDetails } from '@domain/entities/candidate/candidate-vacancy-details';
import { CandidateVacancyListItem } from '@domain/entities/candidate/candidate-vacancy-list-item';
import { PaginatedResult } from '@domain/entities/common/paginated-result';
import { PaginationQuery } from '@domain/entities/common/pagination-query';
import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';
import { ApplyCandidateVacancyData } from './candidate/apply-candidate-vacancy-data.interface';
import { UpsertCandidateResumeData } from './candidate/upsert-candidate-resume-data.interface';

export type { ApplyCandidateVacancyData, UpsertCandidateResumeData };

export interface ICandidateRepository {
  listSkills(): Promise<CandidateSkillItem[]>;
  getRecommendedVacancies(
    authId: string,
    query: PaginationQuery,
  ): Promise<PaginatedResult<CandidateVacancyListItem>>;
  getVacancyDetails(
    authId: string,
    vacancyId: string,
  ): Promise<CandidateVacancyDetails>;
  applyToVacancy(
    authId: string,
    vacancyId: string,
    data: ApplyCandidateVacancyData,
  ): Promise<void>;
  getOwnResume(authId: string): Promise<CandidateResume | null>;
  upsertOwnResume(
    authId: string,
    data: UpsertCandidateResumeData,
  ): Promise<CandidateResume>;
  getOwnApplications(
    authId: string,
    query: PaginationQuery,
    status?: ApplicationStatus,
  ): Promise<PaginatedResult<CandidateApplicationItem>>;
  deleteOwnApplication(authId: string, applicationId: string): Promise<void>;
}
