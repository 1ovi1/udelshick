import { ApplicationStatus } from './application-status.type';

export interface CompanyApplicationItem {
  applicationId: string;
  candidateProfileId: string;
  firstName: string;
  lastName: string;
  vacancyId: string;
  vacancyPosition: string;
  appliedAt: string;
  status: ApplicationStatus;
  resumePdfUrl: string | null;
}
