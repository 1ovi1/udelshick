import { AdminVacancyTab } from '../../../models/admin/admin-vacancy-tab.type';

export interface AdminVacancyTabView {
  key: AdminVacancyTab;
  title: string;
}

export const ADMIN_VACANCY_TABS: readonly AdminVacancyTabView[] = [
  { key: 'all', title: 'Все' },
  { key: 'pending_review', title: 'На рассмотрении' },
  { key: 'published', title: 'Опубликованные' },
  { key: 'archived', title: 'В архиве' },
];
