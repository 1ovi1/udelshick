import { AdminActivityStatus } from '@domain/entities/enums/admin-activity-status.enum';

export interface AdminActivityItem {
  authId: string;
  status: AdminActivityStatus;
  name: string;
  email: string;
  createdAt: string;
}
