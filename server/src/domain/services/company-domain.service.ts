import { ApplicationStatus } from '@domain/entities/enums/application-status.enum';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyDomainService {
  getInitialVacancyStatus(): VacancyStatus {
    return VacancyStatus.ARCHIVED;
  }

  getStatusAfterVacancyUpdate(currentStatus: VacancyStatus): {
    status: VacancyStatus;
    resetPublishedAt: boolean;
  } {
    if (currentStatus === VacancyStatus.PUBLISHED) {
      return {
        status: VacancyStatus.PENDING_REVIEW,
        resetPublishedAt: true,
      };
    }

    return {
      status: currentStatus,
      resetPublishedAt: false,
    };
  }

  getReviewStatus(): VacancyStatus {
    return VacancyStatus.PENDING_REVIEW;
  }

  getArchivedStatus(): VacancyStatus {
    return VacancyStatus.ARCHIVED;
  }

  validateCanInviteForVacancy(status: VacancyStatus): void {
    if (status === VacancyStatus.ARCHIVED) {
      throw new Error('Нельзя приглашать кандидатов на архивную вакансию');
    }
  }

  getInvitedApplicationStatus(): ApplicationStatus {
    return ApplicationStatus.INVITED;
  }

  shouldAttachResumeForInvitation(
    status: ApplicationStatus,
    resumePdfUrl: string | null,
  ): boolean {
    return status === ApplicationStatus.INVITED && !resumePdfUrl;
  }
}
