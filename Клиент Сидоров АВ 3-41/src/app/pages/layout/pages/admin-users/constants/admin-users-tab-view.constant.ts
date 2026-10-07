import { AdminUsersTab } from '../../../models/admin/admin-users-tab.type';

export interface AdminUsersTabView {
  key: AdminUsersTab;
  title: string;
}

export const ADMIN_USERS_TABS: readonly AdminUsersTabView[] = [
  { key: 'all', title: 'Все' },
  { key: 'candidate', title: 'Кандидаты' },
  { key: 'company', title: 'Компании' },
];
