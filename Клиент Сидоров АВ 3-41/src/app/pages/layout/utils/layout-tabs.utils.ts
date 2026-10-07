import { UserRole } from '../../auth/models/user-role.type';
import { LayoutMenuItem } from '../models/layout-menu-item';
import { TabsByRole } from '../models/layout-tabs.const';

export function getLayoutMenu(role: UserRole | null): readonly LayoutMenuItem[] {
  if (!role) {
    return [];
  }

  return TabsByRole[role];
}

export function getDefaultLayoutPath(role: UserRole | null): string {
  if (!role) {
    return '/auth';
  }

  return `/layout/${TabsByRole[role][0].path}`;
}
