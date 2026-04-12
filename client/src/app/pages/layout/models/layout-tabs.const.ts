import { UserRole } from '../../auth/models/user-role.type';
import { LayoutMenuItem } from './layout-menu-item';

const CandidateTabs: readonly LayoutMenuItem[] = [
  { label: 'Вакансии', icon: 'search', path: 'candidate/vacancies' },
  { label: 'Резюме', icon: 'profile', path: 'candidate/resume' },
  { label: 'Отклики', icon: 'send', path: 'candidate/responses' },
];

const CompanyTabs: readonly LayoutMenuItem[] = [
  { label: 'Вакансии', icon: 'solution', path: 'company/vacancies' },
  { label: 'Кандидаты', icon: 'team', path: 'company/candidates' },
  { label: 'Отклики', icon: 'inbox', path: 'company/responses' },
  { label: 'Профиль', icon: 'profile', path: 'company/profile' },
];

const AdminTabs: readonly LayoutMenuItem[] = [
  { label: 'Статистика', icon: 'bar-chart', path: 'admin/statistics' },
  { label: 'Вакансии', icon: 'solution', path: 'admin/vacancies' },
  { label: 'Пользователи', icon: 'user', path: 'admin/users' },
];

export const TabsByRole: Record<UserRole, readonly LayoutMenuItem[]> = {
  candidate: CandidateTabs,
  company: CompanyTabs,
  admin: AdminTabs,
};
