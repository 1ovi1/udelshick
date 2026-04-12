import { AdminDashboardData } from '@domain/entities/admin/admin-dashboard-data';
import { AdminActivityItem } from '@domain/entities/admin/admin-activity-item';
import { AdminVacancyItem } from '@domain/entities/admin/admin-vacancy-item';
import { PaginatedResult } from '@domain/entities/common/paginated-result';
import { PaginationQuery } from '@domain/entities/common/pagination-query';
import { AdminRepository } from '@infrastructure/repository/admin.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getDashboard(query: PaginationQuery): Promise<AdminDashboardData> {
    const [metrics, recentActivity] = await Promise.all([
      this.adminRepository.getDashboardMetrics(),
      this.adminRepository.getRecentActivity(query),
    ]);

    return {
      metrics,
      recentActivity,
    };
  }

  async getUsers(
    query: PaginationQuery,
  ): Promise<PaginatedResult<AdminActivityItem>> {
    return this.adminRepository.getUsers(query);
  }

  async deleteUser(authId: string): Promise<void> {
    await this.adminRepository.deleteUser(authId);
  }

  async getVacancies(
    query: PaginationQuery,
  ): Promise<PaginatedResult<AdminVacancyItem>> {
    return this.adminRepository.getVacancies(query);
  }

  async publishVacancy(vacancyId: string): Promise<void> {
    await this.adminRepository.publishVacancy(vacancyId);
  }

  async archiveVacancy(vacancyId: string): Promise<void> {
    await this.adminRepository.archiveVacancy(vacancyId);
  }

  async deleteArchivedVacancy(vacancyId: string): Promise<void> {
    await this.adminRepository.deleteArchivedVacancy(vacancyId);
  }
}
