import { ApplicationStatus } from '../models/company/application-status.type';

export type ApplicationStatusColor = 'green' | 'gold' | 'cyan' | 'red' | 'default';

export function toApplicationStatusLabel(status: ApplicationStatus): string {
  if (status === 'new') {
    return 'Новый';
  }

  if (status === 'viewed') {
    return 'Новый';
  }

  if (status === 'invited') {
    return 'Приглашен';
  }

  if (status === 'accepted') {
    return 'Приглашен';
  }

  if (status === 'withdrawn') {
    return 'Отклонен';
  }

  return 'Отклонен';
}

export function toApplicationStatusColor(status: ApplicationStatus): ApplicationStatusColor {
  if (status === 'new' || status === 'viewed') {
    return 'gold';
  }

  if (status === 'invited' || status === 'accepted') {
    return 'green';
  }

  if (status === 'rejected') {
    return 'red';
  }

  return 'default';
}
