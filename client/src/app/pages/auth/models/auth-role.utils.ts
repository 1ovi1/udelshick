import { AuthRouteRole } from './auth-role.const';

export function toAuthRouteRole(value: string | null): AuthRouteRole {
  if (value === 'user' || value === 'company' || value === 'admin') {
    return value;
  }

  return 'user';
}
