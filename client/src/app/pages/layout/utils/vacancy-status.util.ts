import { VacancyStatus } from '../models/admin/vacancy-status.type';

export type VacancyStatusColor = 'green' | 'gold' | 'default';

export function toVacancyStatusLabel(status: VacancyStatus): string {
  if (status === 'published') {
    return 'Опубликована';
  }

  if (status === 'pending_review') {
    return 'На рассмотрении';
  }

  return 'В архиве';
}

export function toVacancyStatusColor(status: VacancyStatus): VacancyStatusColor {
  if (status === 'published') {
    return 'green';
  }

  if (status === 'pending_review') {
    return 'gold';
  }

  return 'default';
}
