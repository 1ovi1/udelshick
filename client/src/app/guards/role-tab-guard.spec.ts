import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { Auth } from '../pages/auth/auth.service';
import { UserRole } from '../pages/auth/models/user-role.type';
import { roleTabGuard } from './role-tab-guard';

describe('roleTabGuard', () => {
  const role = signal<UserRole | null>(null);
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => roleTabGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: Auth,
          useValue: {
            role,
          } as Pick<Auth, 'role'>,
        },
      ],
    });

    role.set(null);
  });

  it('redirects anonymous user to /auth', () => {
    const route = {
      data: { roles: ['candidate'] },
    } as unknown as ActivatedRouteSnapshot;
    const result = executeGuard(route, {} as never);
    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result as UrlTree)).toBe('/auth');
  });

  it('allows route when role is present in allowed roles', () => {
    role.set('candidate');

    const route = {
      data: { roles: ['candidate', 'admin'] },
    } as unknown as ActivatedRouteSnapshot;
    const result = executeGuard(route, {} as never);

    expect(result).toBe(true);
  });

  it('redirects to role default route when access is denied', () => {
    role.set('company');

    const route = {
      data: { roles: ['admin'] },
    } as unknown as ActivatedRouteSnapshot;
    const result = executeGuard(route, {} as never);
    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result as UrlTree)).toBe('/layout/company/vacancies');
  });
});
