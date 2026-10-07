import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';

export interface CandidateApplicationItem {
  applicationId: string;
  vacancyId: string;
  vacancyPosition: string;
  companyName: string;
  appliedAt: string;
  status: ApplicationStatus;
}
