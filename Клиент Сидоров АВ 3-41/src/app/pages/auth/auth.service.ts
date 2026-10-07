import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, map, Observable, of, switchMap, throwError } from 'rxjs';
import { User } from './models/user.interface';
import { LoginPayload } from './models/login.interface';
import { CompanyRegistrationPayload } from './models/company-registration.interface';
import { UserRegistrationPayload } from './models/user-registration.interface';
import { UserRole } from './models/user-role.type';
import { ApiResponse } from './models/api-response.interface';
import { AuthResponseData } from './models/auth-response.interface';
import { MeResponseData } from './models/me-response.interface';

interface StoredAuthSession {
  token: string;
  user: User;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly sessionStorageKey = 'auth_session';
  private readonly apiBaseUrl = '/api';
  private readonly apiEndpoints = {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  } as const;

  public readonly token = signal<string | null>(null);
  public readonly user = signal<User | null>(null);
  public readonly role = signal<UserRole | null>(null);
  public readonly isAuthenticated = signal(false);
  public readonly isInitialized = signal(false);

  async initialize(): Promise<void> {
    const raw = localStorage.getItem(this.sessionStorageKey);
    if (!raw) {
      this.clearState();
      this.isInitialized.set(true);
      return;
    }

    try {
      const session = JSON.parse(raw) as Partial<StoredAuthSession>;
      const token = typeof session.token === 'string' ? session.token : '';
      if (!token) {
        this.logout();
        return;
      }

      const profile = await firstValueFrom(this.fetchProfile(token));
      const normalizedRole = this.normalizeRole(profile.role);
      if (!normalizedRole) {
        this.logout();
        return;
      }

      const refreshedSession: StoredAuthSession = {
        token,
        role: normalizedRole,
        user: {
          id: profile.id,
          email: profile.email,
          name: profile.name || this.toDisplayName(profile.email),
        },
      };

      this.persistSession(refreshedSession);
    } catch {
      this.logout();
    } finally {
      this.isInitialized.set(true);
    }
  }

  login(payload: LoginPayload): Observable<UserRole> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.apiBaseUrl}${this.apiEndpoints.login}`, payload)
      .pipe(
        map((response) => response.data?.access_token ?? ''),
        switchMap((token) => {
          if (!token) {
            return throwError(() => new Error('Сервер не вернул access token.'));
          }

          return this.startSession(token);
        }),
      );
  }

  registerUser(payload: UserRegistrationPayload): Observable<UserRole> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.apiBaseUrl}${this.apiEndpoints.register}`, {
        email: payload.email,
        password: payload.password,
        role: 'candidate' as const,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
      })
      .pipe(
        map((response) => response.data?.access_token ?? ''),
        switchMap((token) => {
          if (!token) {
            return throwError(() => new Error('Сервер не вернул access token.'));
          }

          return this.startSession(token);
        }),
      );
  }

  registerCompany(payload: CompanyRegistrationPayload): Observable<UserRole> {
    return this.http
      .post<ApiResponse<AuthResponseData>>(`${this.apiBaseUrl}${this.apiEndpoints.register}`, {
        email: payload.email,
        password: payload.password,
        role: 'company' as const,
        companyName: payload.companyName,
        contactPerson: payload.contactPerson,
        phone: payload.phone,
        address: payload.address,
      })
      .pipe(
        map((response) => response.data?.access_token ?? ''),
        switchMap((token) => {
          if (!token) {
            return throwError(() => new Error('Сервер не вернул access token.'));
          }

          return this.startSession(token);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.sessionStorageKey);
    this.clearState();
  }

  private startSession(token: string): Observable<UserRole> {
    return this.fetchProfile(token).pipe(
      map((profile) => {
        const session: StoredAuthSession = {
          token,
          user: {
            id: profile.id,
            email: profile.email,
            name: profile.name || this.toDisplayName(profile.email),
          },
          role: profile.role,
        };

        this.persistSession(session);

        return profile.role;
      }),
    );
  }

  private applySession(session: StoredAuthSession): void {
    this.token.set(session.token);
    this.user.set(session.user);
    this.role.set(session.role);
    this.isAuthenticated.set(true);
  }

  private clearState(): void {
    this.token.set(null);
    this.user.set(null);
    this.role.set(null);
    this.isAuthenticated.set(false);
  }

  private fetchProfile(token: string): Observable<MeResponseData> {
    return this.http
      .get<ApiResponse<MeResponseData>>(`${this.apiBaseUrl}${this.apiEndpoints.me}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(
        map((response) => response.data as MeResponseData),
        switchMap((data) => {
          if (!data?.id || !data.email || !data.role || !data.name) {
            return throwError(() => new Error('Некорректный ответ профиля пользователя.'));
          }

          return of(data);
        }),
      );
  }

  private persistSession(session: StoredAuthSession): void {
    this.applySession(session);
    localStorage.setItem(this.sessionStorageKey, JSON.stringify(session));
  }

  private toDisplayName(email: string): string {
    return email.split('@')[0] || 'User';
  }

  private normalizeRole(role: string | null | undefined): UserRole | null {
    if (role === 'candidate' || role === 'company' || role === 'admin') {
      return role;
    }

    if (role === 'User') {
      return 'candidate';
    }

    if (role === 'Company') {
      return 'company';
    }

    if (role === 'Admin') {
      return 'admin';
    }

    return null;
  }
}
