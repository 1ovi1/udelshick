import { ApplicationStatus } from '../models/candidate/application-status.type';

export type CandidateApplicationStatusColor = 'green' | 'gold' | 'cyan' | 'red' | 'default';

export function toCandidateApplicationStatusLabel(status: ApplicationStatus): string {
  if (status === 'new') {
    return 'Отправлен';
  }

  if (status === 'viewed') {
    return 'Отправлен';
  }

  if (status === 'invited') {
    return 'Приглашение';
  }

  if (status === 'accepted') {
    return 'Приглашение';
  }

  if (status === 'withdrawn') {
    return 'Удален';
  }

  return 'Отказ';
}

export function toCandidateApplicationStatusColor(
  status: ApplicationStatus,
): CandidateApplicationStatusColor {
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
