import { AdminActivityStatus } from '@domain/entities/enums/admin-activity-status.enum';

export interface AdminActivityRow {
  authId: string;
  status: AdminActivityStatus;
  name: string;
  email: string;
  createdAt: string;
}
