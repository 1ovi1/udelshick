import { ApplicationStatus } from '../models/company/application-status.type';

export type ApplicationStatusColor = 'green' | 'gold' | 'cyan' | 'red' | 'default';

export function toApplicationStatusLabel(status: ApplicationStatus): string {
  if (status === 'new') {
    return 'Новый';
  }

  if (status === 'viewed') {
    return 'Просмотрен';
  }

  if (status === 'invited') {
    return 'Приглашен';
  }

  if (status === 'accepted') {
    return 'Принят';
  }

  if (status === 'withdrawn') {
    return 'Отозван';
  }

  return 'Отклонен';
}

export function toApplicationStatusColor(status: ApplicationStatus): ApplicationStatusColor {
  if (status === 'new') {
    return 'gold';
  }

  if (status === 'viewed') {
    return 'cyan';
  }

  if (status === 'invited' || status === 'accepted') {
    return 'green';
  }

  if (status === 'rejected') {
    return 'red';
  }

  return 'default';
}
