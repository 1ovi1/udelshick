import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/company/api-response.interface';
import { ApplicationStatus } from '../models/company/application-status.type';
import { CompanyApplicationItem } from '../models/company/company-application-item.interface';
import { CompanyCandidateItem } from '../models/company/company-candidate-item.interface';
import { CompanyCandidateResume } from '../models/company/company-candidate-resume.interface';
import { CompanySkillItem } from '../models/company/company-skill-item.interface';
import { CompanyVacancyItem } from '../models/company/company-vacancy-item.interface';
import { CreateCompanyVacancyRequest } from '../models/company/create-company-vacancy-request.interface';
import { PaginatedResult } from '../models/company/paginated-result.interface';
import { VacancyStatus } from '../models/company/vacancy-status.type';

@Injectable({
  providedIn: 'root',
})
export class CompanyDataService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = '/api/company';

  getSkills(): Observable<CompanySkillItem[]> {
    return this.http
      .get<ApiResponse<CompanySkillItem[]>>(`${this.apiBaseUrl}/skills`)
      .pipe(map((response) => this.requireData(response, 'skills')));
  }

  getVacancies(
    page: number,
    limit: number,
    status?: VacancyStatus,
  ): Observable<PaginatedResult<CompanyVacancyItem>> {
    const params = this.buildPaginationParams(page, limit, status);

    return this.http
      .get<
        ApiResponse<PaginatedResult<CompanyVacancyItem>>
      >(`${this.apiBaseUrl}/vacancies`, { params })
      .pipe(map((response) => this.requireData(response, 'vacancies')));
  }

  getVacancyDetails(vacancyId: string): Observable<CompanyVacancyItem> {
    return this.http
      .get<ApiResponse<CompanyVacancyItem>>(`${this.apiBaseUrl}/vacancies/${vacancyId}`)
      .pipe(map((response) => this.requireData(response, 'vacancy details')));
  }

  createVacancy(data: CreateCompanyVacancyRequest): Observable<CompanyVacancyItem> {
    return this.http
      .post<ApiResponse<CompanyVacancyItem>>(`${this.apiBaseUrl}/vacancies`, data)
      .pipe(map((response) => this.requireData(response, 'create vacancy')));
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

  getCandidates(page: number, limit: number): Observable<PaginatedResult<CompanyCandidateItem>> {
    const params = this.buildPaginationParams(page, limit);

    return this.http
      .get<ApiResponse<PaginatedResult<CompanyCandidateItem>>>(`${this.apiBaseUrl}/candidates`, {
        params,
      })
      .pipe(map((response) => this.requireData(response, 'candidates')));
  }

  getCandidateResume(candidateProfileId: string): Observable<CompanyCandidateResume> {
    return this.http
      .get<
        ApiResponse<CompanyCandidateResume>
      >(`${this.apiBaseUrl}/candidates/${candidateProfileId}/resume`)
      .pipe(map((response) => this.requireData(response, 'candidate resume')));
  }

  inviteCandidate(candidateProfileId: string, vacancyId: string): Observable<void> {
    return this.http
      .post<ApiResponse<undefined>>(`${this.apiBaseUrl}/candidates/${candidateProfileId}/invite`, {
        vacancyId,
      })
      .pipe(map(() => void 0));
  }

  getApplications(
    page: number,
    limit: number,
    status?: ApplicationStatus,
  ): Observable<PaginatedResult<CompanyApplicationItem>> {
    const params = this.buildPaginationParams(page, limit, status);

    return this.http
      .get<
        ApiResponse<PaginatedResult<CompanyApplicationItem>>
      >(`${this.apiBaseUrl}/applications`, { params })
      .pipe(map((response) => this.requireData(response, 'applications')));
  }

  inviteApplication(applicationId: string): Observable<void> {
    return this.http
      .patch<ApiResponse<undefined>>(`${this.apiBaseUrl}/applications/${applicationId}/invite`, {})
      .pipe(map(() => void 0));
  }

  rejectApplication(applicationId: string): Observable<void> {
    return this.http
      .patch<ApiResponse<undefined>>(`${this.apiBaseUrl}/applications/${applicationId}/reject`, {})
      .pipe(map(() => void 0));
  }

  getApplicationResume(applicationId: string): Observable<CompanyCandidateResume> {
    return this.http
      .get<
        ApiResponse<CompanyCandidateResume>
      >(`${this.apiBaseUrl}/applications/${applicationId}/resume`)
      .pipe(map((response) => this.requireData(response, 'application resume')));
  }

  private buildPaginationParams(
    page: number,
    limit: number,
    status?: VacancyStatus | ApplicationStatus,
  ): HttpParams {
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
