import { AdminActivityItem } from '@domain/entities/admin/admin-activity-item';
import { AdminDashboardMetrics } from '@domain/entities/admin/admin-dashboard-metrics';
import { AdminVacancyItem } from '@domain/entities/admin/admin-vacancy-item';
import { PaginatedResult } from '@domain/entities/common/paginated-result';
import { PaginationQuery } from '@domain/entities/common/pagination-query';

export interface IAdminRepository {
  getDashboardMetrics(): Promise<AdminDashboardMetrics>;
  getRecentActivity(
    query: PaginationQuery,
  ): Promise<PaginatedResult<AdminActivityItem>>;
  getUsers(query: PaginationQuery): Promise<PaginatedResult<AdminActivityItem>>;
  deleteUser(authId: string): Promise<void>;
  getVacancies(
    query: PaginationQuery,
  ): Promise<PaginatedResult<AdminVacancyItem>>;
  publishVacancy(vacancyId: string): Promise<void>;
  archiveVacancy(vacancyId: string): Promise<void>;
  deleteArchivedVacancy(vacancyId: string): Promise<void>;
}
