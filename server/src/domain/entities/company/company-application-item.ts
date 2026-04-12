import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';

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
