import { UserRole } from './user-role.type';

export type AuthRouteRole = 'user' | 'company' | 'admin';

export interface AuthRoleMeta {
  readonly routeRole: AuthRouteRole;
  readonly title: string;
  readonly loginSubtitle: string;
  readonly registerSubtitle: string;
  readonly loginPath: string;
  readonly registerPath: string | null;
  readonly serviceRole: UserRole;
}

export const AUTH_ROLE_META: Record<AuthRouteRole, AuthRoleMeta> = {
  user: {
    routeRole: 'user',
    title: 'Соискатель',
    loginSubtitle: 'Найдите работу мечты',
    registerSubtitle: 'Создайте аккаунт для поиска работы',
    loginPath: '/auth/login/user',
    registerPath: '/auth/register/user',
    serviceRole: 'candidate',
  },
  company: {
    routeRole: 'company',
    title: 'Работодатель',
    loginSubtitle: 'Управляйте вакансиями и откликами',
    registerSubtitle: 'Создайте аккаунт для размещения вакансий',
    loginPath: '/auth/login/company',
    registerPath: '/auth/register/company',
    serviceRole: 'company',
  },
  admin: {
    routeRole: 'admin',
    title: 'Администратор',
    loginSubtitle: 'Панель администрирования и контроль доступа',
    registerSubtitle: 'Регистрация администратора отключена',
    loginPath: '/auth/login/admin',
    registerPath: null,
    serviceRole: 'admin',
  },
};
