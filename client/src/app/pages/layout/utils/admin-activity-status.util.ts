import { AdminActivityStatus } from '../models/admin/admin-activity-status.type';

export type AdminActivityStatusColor = 'green' | 'default';

export function toAdminActivityStatusLabel(status: AdminActivityStatus): string {
  return status === 'candidate' ? 'Кандидат' : 'Компания';
}

export function toAdminActivityStatusColor(status: AdminActivityStatus): AdminActivityStatusColor {
  return status === 'candidate' ? 'green' : 'default';
}
