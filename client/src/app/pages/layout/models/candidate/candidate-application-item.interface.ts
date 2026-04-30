import { ApplicationStatus } from './application-status.type';

export interface CandidateApplicationItem {
  applicationId: string;
  vacancyId: string;
  vacancyPosition: string;
  companyName: string;
  appliedAt: string;
  status: ApplicationStatus;
}
