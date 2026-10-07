import { AdminActivityItem } from './admin-activity-item';
import { AdminDashboardMetrics } from './admin-dashboard-metrics';
import { PaginatedResult } from '@domain/entities/common/paginated-result';

export interface AdminDashboardData {
  metrics: AdminDashboardMetrics;
  recentActivity: PaginatedResult<AdminActivityItem>;
}
