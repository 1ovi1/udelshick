import { Role } from '@domain/entities/enums/role.enum';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminDomainService {
  validateCanDeleteUser(role: Role): void {
    if (role === Role.ADMIN) {
      throw new Error('Нельзя удалить администратора');
    }
  }

  getPublishedVacancyState(currentPublishedAt?: Date): {
    status: VacancyStatus;
    publishedAt: Date;
  } {
    return {
      status: VacancyStatus.PUBLISHED,
      publishedAt: currentPublishedAt ?? new Date(),
    };
  }

  getArchivedVacancyStatus(): VacancyStatus {
    return VacancyStatus.ARCHIVED;
  }

  validateCanDeleteVacancy(status: VacancyStatus): void {
    if (
      status !== VacancyStatus.ARCHIVED &&
      status !== VacancyStatus.PENDING_REVIEW
    ) {
      throw new Error(
        'Удалить можно только вакансию на рассмотрении или в архиве',
      );
    }
  }
}
