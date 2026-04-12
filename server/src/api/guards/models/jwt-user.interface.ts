import { Role } from '@domain/entities/enums/role.enum';

export interface JwtUser {
  id: string;
  email: string;
  role: Role;
}
