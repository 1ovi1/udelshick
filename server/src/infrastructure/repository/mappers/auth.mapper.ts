import { AuthUser } from '@domain/entities/AuthUser';
import { AuthEntity } from '@infrastructure/entities/auth.entity';

export class AuthMapper {
  static toDomain(entity: AuthEntity): AuthUser {
    return {
      id: entity.id,
      email: entity.email,
      password: entity.password || '',
      role: entity.role,
    };
  }
}
