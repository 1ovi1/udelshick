import { ApiProperty } from '@nestjs/swagger';
import { AdminDashboardMetricsDto } from './admin-dashboard-metrics.dto';
import { PaginatedAdminActivityDto } from './paginated-admin-activity.dto';

export class AdminDashboardDto {
  @ApiProperty({ type: AdminDashboardMetricsDto })
  metrics: AdminDashboardMetricsDto;

  @ApiProperty({ type: PaginatedAdminActivityDto })
  recentActivity: PaginatedAdminActivityDto;
}
