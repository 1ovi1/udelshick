import { CompanyVacancyTab } from '../../../models/company/company-vacancy-tab.type';

export interface VacancyTabView {
  key: CompanyVacancyTab;
  title: string;
}

export const COMPANY_VACANCY_TABS: readonly VacancyTabView[] = [
  { key: 'all', title: 'Все' },
  { key: 'pending_review', title: 'На рассмотрении' },
  { key: 'published', title: 'Опубликованные' },
  { key: 'archived', title: 'В архиве' },
];
