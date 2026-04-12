import { AdminActivityStatus } from './admin-activity-status.type';

export interface AdminActivityItem {
  authId: string;
  status: AdminActivityStatus;
  name: string;
  email: string;
  createdAt: string;
}
