import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/candidate/api-response.interface';
import { ApplicationStatus } from '../models/candidate/application-status.type';
import { ApplyCandidateVacancyRequest } from '../models/candidate/apply-candidate-vacancy-request.interface';
import { CandidateApplicationItem } from '../models/candidate/candidate-application-item.interface';
import { CandidateResume } from '../models/candidate/candidate-resume.interface';
import { CandidateSkillItem } from '../models/candidate/candidate-skill-item.interface';
import { CandidateVacancyDetails } from '../models/candidate/candidate-vacancy-details.interface';
import { CandidateVacancyItem } from '../models/candidate/candidate-vacancy-item.interface';
import { PaginatedResult } from '../models/candidate/paginated-result.interface';
import { UpsertCandidateResumeRequest } from '../models/candidate/upsert-candidate-resume-request.interface';

@Injectable({
  providedIn: 'root',
})
export class CandidateDataService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = '/api/candidate';

  getSkills(): Observable<CandidateSkillItem[]> {
    return this.http
      .get<ApiResponse<CandidateSkillItem[]>>(`${this.apiBaseUrl}/skills`)
      .pipe(map((response) => this.requireData(response, 'candidate skills')));
  }

  getVacancies(page: number, limit: number): Observable<PaginatedResult<CandidateVacancyItem>> {
    const params = this.buildPaginationParams(page, limit);

    return this.http
      .get<ApiResponse<PaginatedResult<CandidateVacancyItem>>>(`${this.apiBaseUrl}/vacancies`, {
        params,
      })
      .pipe(map((response) => this.requireData(response, 'candidate vacancies')));
  }

  getVacancyDetails(vacancyId: string): Observable<CandidateVacancyDetails> {
    return this.http
      .get<ApiResponse<CandidateVacancyDetails>>(`${this.apiBaseUrl}/vacancies/${vacancyId}`)
      .pipe(map((response) => this.requireData(response, 'candidate vacancy details')));
  }

  applyToVacancy(vacancyId: string, payload: ApplyCandidateVacancyRequest): Observable<void> {
    return this.http
      .post<ApiResponse<undefined>>(`${this.apiBaseUrl}/vacancies/${vacancyId}/apply`, payload)
      .pipe(map(() => void 0));
  }

  getOwnResume(): Observable<CandidateResume | null> {
    return this.http
      .get<ApiResponse<CandidateResume | null>>(`${this.apiBaseUrl}/resume`)
      .pipe(map((response) => this.requireData(response, 'candidate resume')));
  }

  upsertResume(payload: UpsertCandidateResumeRequest): Observable<CandidateResume> {
    return this.http
      .put<ApiResponse<CandidateResume>>(`${this.apiBaseUrl}/resume`, payload)
      .pipe(map((response) => this.requireData(response, 'candidate upsert resume')));
  }

  getApplications(
    page: number,
    limit: number,
    status?: ApplicationStatus,
  ): Observable<PaginatedResult<CandidateApplicationItem>> {
    const params = this.buildPaginationParams(page, limit, status);

    return this.http
      .get<ApiResponse<PaginatedResult<CandidateApplicationItem>>>(
        `${this.apiBaseUrl}/applications`,
        {
          params,
        },
      )
      .pipe(map((response) => this.requireData(response, 'candidate applications')));
  }

  deleteApplication(applicationId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<undefined>>(`${this.apiBaseUrl}/applications/${applicationId}`)
      .pipe(map(() => void 0));
  }

  private buildPaginationParams(
    page: number,
    limit: number,
    status?: ApplicationStatus,
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
