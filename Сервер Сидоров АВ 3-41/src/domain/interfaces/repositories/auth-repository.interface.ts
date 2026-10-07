import { AuthUser } from '@domain/entities/AuthUser';

export interface IAuthRepository {
  create(user: Partial<AuthUser>): Promise<AuthUser>;
  findByEmail(email: string, withPassword?: boolean): Promise<AuthUser | null>;
  findById(id: string, withPassword?: boolean): Promise<AuthUser | null>;
}
