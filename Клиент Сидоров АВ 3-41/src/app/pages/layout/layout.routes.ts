import { Routes } from '@angular/router';
import { roleTabGuard } from '../../guards/role-tab-guard';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/404' },
      {
        path: 'candidate/vacancies',
        loadComponent: () =>
          import('./pages/candidate-vacancies/candidate-vacancies.page').then(
            (m) => m.CandidateVacanciesPage,
          ),
        canActivate: [roleTabGuard],
        data: { roles: ['candidate'] },
      },
      {
        path: 'candidate/resume',
        loadComponent: () =>
          import('./pages/candidate-resume/candidate-resume.page').then(
            (m) => m.CandidateResumePage,
          ),
        canActivate: [roleTabGuard],
        data: { roles: ['candidate'] },
      },
      {
        path: 'candidate/responses',
        loadComponent: () =>
          import('./pages/candidate-responses/candidate-responses.page').then(
            (m) => m.CandidateResponsesPage,
          ),
        canActivate: [roleTabGuard],
        data: { roles: ['candidate'] },
      },
      {
        path: 'vacancy/:vacancyId',
        loadComponent: () =>
          import('./pages/vacancy-details/vacancy-details.page').then((m) => m.VacancyDetailsPage),
        canActivate: [roleTabGuard],
        data: { roles: ['candidate', 'company', 'admin'] },
      },
      {
        path: 'company/vacancies',
        loadComponent: () =>
          import('./pages/company-vacancies/company-vacancies.page').then(
            (m) => m.CompanyVacanciesPage,
          ),
        canActivate: [roleTabGuard],
        data: { roles: ['company'] },
      },
      {
        path: 'company/candidates',
        loadComponent: () =>
          import('./pages/company-candidates/company-candidates.page').then(
            (m) => m.CompanyCandidatesPage,
          ),
        canActivate: [roleTabGuard],
        data: { roles: ['company'] },
      },
      {
        path: 'company/responses',
        loadComponent: () =>
          import('./pages/company-responses/company-responses.page').then(
            (m) => m.CompanyResponsesPage,
          ),
        canActivate: [roleTabGuard],
        data: { roles: ['company'] },
      },
      {
        path: 'admin/statistics',
        loadComponent: () =>
          import('./pages/admin-statistics/admin-statistics.page').then(
            (m) => m.AdminStatisticsPage,
          ),
        canActivate: [roleTabGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'admin/vacancies',
        loadComponent: () =>
          import('./pages/admin-companies/admin-companies.page').then((m) => m.AdminVacanciesPage),
        canActivate: [roleTabGuard],
        data: { roles: ['admin'] },
      },
      { path: 'admin/companies', pathMatch: 'full', redirectTo: 'admin/vacancies' },
      {
        path: 'admin/users',
        loadComponent: () =>
          import('./pages/admin-users/admin-users.page').then((m) => m.AdminUsersPage),
        canActivate: [roleTabGuard],
        data: { roles: ['admin'] },
      },
      { path: '**', redirectTo: '/404' },
    ],
  },
];
