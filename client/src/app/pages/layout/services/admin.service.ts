import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AdminDashboardData } from '../models/admin/admin-dashboard-data.interface';
import { AdminVacancyDetails } from '../models/admin/admin-vacancy-details.interface';
import { AdminActivityItem } from '../models/admin/admin-activity-item.interface';
import { AdminVacancyItem } from '../models/admin/admin-vacancy-item.interface';
import { ApiResponse } from '../models/admin/api-response.interface';
import { PaginatedResult } from '../models/admin/paginated-result.interface';
import { VacancyStatus } from '../models/admin/vacancy-status.type';

@Injectable({
  providedIn: 'root',
})
export class AdminDataService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = '/api/admin';

  getDashboard(page: number, limit: number): Observable<AdminDashboardData> {
    const params = this.buildPaginationParams(page, limit);

    return this.http
      .get<ApiResponse<AdminDashboardData>>(`${this.apiBaseUrl}/dashboard`, {
        params,
      })
      .pipe(map((response) => this.requireData(response, 'dashboard')));
  }

  getUsers(page: number, limit: number): Observable<PaginatedResult<AdminActivityItem>> {
    const params = this.buildPaginationParams(page, limit);

    return this.http
      .get<ApiResponse<PaginatedResult<AdminActivityItem>>>(`${this.apiBaseUrl}/users`, { params })
      .pipe(map((response) => this.requireData(response, 'users')));
  }

  deleteUser(authId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<undefined>>(`${this.apiBaseUrl}/users/${authId}`)
      .pipe(map(() => void 0));
  }

  getVacancies(
    page: number,
    limit: number,
    status?: VacancyStatus,
  ): Observable<PaginatedResult<AdminVacancyItem>> {
    const params = this.buildPaginationParams(page, limit, status);

    return this.http
      .get<
        ApiResponse<PaginatedResult<AdminVacancyItem>>
      >(`${this.apiBaseUrl}/vacancies`, { params })
      .pipe(map((response) => this.requireData(response, 'vacancies')));
  }

  getVacancyDetails(vacancyId: string): Observable<AdminVacancyDetails> {
    return this.http
      .get<ApiResponse<AdminVacancyDetails>>(`${this.apiBaseUrl}/vacancies/${vacancyId}`)
      .pipe(map((response) => this.requireData(response, 'vacancy details')));
  }

  publishVacancy(vacancyId: string): Observable<void> {
    return this.http
      .patch<ApiResponse<undefined>>(`${this.apiBaseUrl}/vacancies/${vacancyId}/publish`, {})
      .pipe(map(() => void 0));
  }

  archiveVacancy(vacancyId: string): Observable<void> {
    return this.http
      .patch<ApiResponse<undefined>>(`${this.apiBaseUrl}/vacancies/${vacancyId}/archive`, {})
      .pipe(map(() => void 0));
  }

  deleteVacancy(vacancyId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<undefined>>(`${this.apiBaseUrl}/vacancies/${vacancyId}`)
      .pipe(map(() => void 0));
  }

  private buildPaginationParams(page: number, limit: number, status?: VacancyStatus): HttpParams {
    let params = new HttpParams().set('page', String(page)).set('limit', String(limit));

    if (status) {
      params = params.set('status', status);
    }

    return params;
  }

  private requireData<T>(response: ApiResponse<T>, endpoint: string): T {
    if (response.data === undefined) {
      throw new Error(`Server returned empty data for ${endpoint}`);
    }

    return response.data;
  }
}
