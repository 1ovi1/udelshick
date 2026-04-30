import { AdminDashboardData } from '@domain/entities/admin/admin-dashboard-data';
import { AdminVacancyDetails } from '@domain/entities/admin/admin-vacancy-details';
import { AdminActivityItem } from '@domain/entities/admin/admin-activity-item';
import { AdminVacancyItem } from '@domain/entities/admin/admin-vacancy-item';
import { PaginatedResult } from '@domain/entities/common/paginated-result';
import { PaginationQuery } from '@domain/entities/common/pagination-query';
import { VacancyStatus } from '@domain/entities/enums/vacancy-status.enum';
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
    status?: VacancyStatus,
  ): Promise<PaginatedResult<AdminVacancyItem>> {
    return this.adminRepository.getVacancies(query, status);
  }

  async getVacancyDetails(vacancyId: string): Promise<AdminVacancyDetails> {
    return this.adminRepository.getVacancyDetails(vacancyId);
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
