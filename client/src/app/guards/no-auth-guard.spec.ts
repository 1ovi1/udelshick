import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';

import { noAuthGuard } from './no-auth-guard';
import { Auth } from '../pages/auth/auth.service';
import { UserRole } from '../pages/auth/models/user-role.type';

describe('noAuthGuard', () => {
  const isAuthenticated = signal(false);
  const role = signal<UserRole | null>(null);

  const executeGuard: CanActivateChildFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => noAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: Auth,
          useValue: {
            isAuthenticated,
            role,
          } as Pick<Auth, 'isAuthenticated' | 'role'>,
        },
      ],
    });

    isAuthenticated.set(false);
    role.set(null);
  });

  it('allows unauthenticated users', () => {
    isAuthenticated.set(false);

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(result).toBe(true);
  });

  it('redirects authenticated candidate to candidate default page', () => {
    isAuthenticated.set(true);
    role.set('candidate');

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result as UrlTree)).toBe('/layout/candidate/vacancies');
  });
});
