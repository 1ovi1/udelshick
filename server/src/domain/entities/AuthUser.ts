import { Role } from './enums/role.enum';

export class AuthUser {
  id: string;
  email: string;
  password: string;
  role: Role;
}
