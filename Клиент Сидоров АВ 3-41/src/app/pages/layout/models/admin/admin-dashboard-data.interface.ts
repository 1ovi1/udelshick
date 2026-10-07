import { PaginatedResult } from './paginated-result.interface';
import { AdminActivityItem } from './admin-activity-item.interface';
import { AdminDashboardMetrics } from './admin-dashboard-metrics.interface';

export interface AdminDashboardData {
  metrics: AdminDashboardMetrics;
  recentActivity: PaginatedResult<AdminActivityItem>;
}
