import { UserRole } from './user-role.type';

export interface MeResponseData {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}
