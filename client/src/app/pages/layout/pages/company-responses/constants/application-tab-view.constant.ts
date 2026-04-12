import { CompanyApplicationTab } from '../../../models/company/company-application-tab.type';

export interface ApplicationTabView {
  key: CompanyApplicationTab;
  title: string;
}

export const COMPANY_APPLICATION_TABS: readonly ApplicationTabView[] = [
  { key: 'all', title: 'Все' },
  { key: 'new', title: 'Новые' },
  { key: 'viewed', title: 'Просмотренные' },
  { key: 'invited', title: 'Приглашенные' },
  { key: 'rejected', title: 'Отклоненные' },
];
