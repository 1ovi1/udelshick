import { AuthUser } from '@domain/entities/AuthUser';
import { Role } from '@domain/entities/enums/role.enum';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthDomainService {
  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isPasswordValid(password: string): boolean {
    // Min 8 chars, at least one lowercase, one uppercase, and one digit.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  validateUserCreation(userData: { email: string; password: string }): void {
    if (!this.isEmailValid(userData.email)) {
      throw new Error('Invalid email format');
    }

    if (!this.isPasswordValid(userData.password)) {
      throw new Error(
        'Password must include at least 8 characters, uppercase, lowercase and number',
      );
    }
  }

  canCreateUser(existingUser: AuthUser | null): boolean {
    return !existingUser;
  }

  createUserEntity(
    userData: { email: string; password: string; role: Role },
    existingUser: AuthUser | null,
  ): AuthUser {
    this.validateUserCreation(userData);

    if (!this.canCreateUser(existingUser)) {
      throw new Error('User already exists with this email');
    }

    return {
      id: `auth-${randomUUID()}`,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    };
  }
}
