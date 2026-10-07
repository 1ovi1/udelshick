import { AdminActivityItem } from '@domain/entities/admin/admin-activity-item';
import { AdminVacancyDetails } from '@domain/entities/admin/admin-vacancy-details';
import { AdminDashboardMetrics } from '@domain/entities/admin/admin-dashboard-metrics';
import { AdminVacancyItem } from '@domain/entities/admin/admin-vacancy-item';
import { PaginatedResult } from '@domain/entities/common/paginated-result';
import { PaginationQuery } from '@domain/entities/common/pagination-query';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';

export interface IAdminRepository {
  getDashboardMetrics(): Promise<AdminDashboardMetrics>;
  getRecentActivity(
    query: PaginationQuery,
  ): Promise<PaginatedResult<AdminActivityItem>>;
  getUsers(query: PaginationQuery): Promise<PaginatedResult<AdminActivityItem>>;
  deleteUser(authId: string): Promise<void>;
  getVacancies(
    query: PaginationQuery,
    status?: VacancyStatus,
  ): Promise<PaginatedResult<AdminVacancyItem>>;
  getVacancyDetails(vacancyId: string): Promise<AdminVacancyDetails>;
  publishVacancy(vacancyId: string): Promise<void>;
  archiveVacancy(vacancyId: string): Promise<void>;
  deleteArchivedVacancy(vacancyId: string): Promise<void>;
}
