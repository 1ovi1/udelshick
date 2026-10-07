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

import { authGuard } from './auth-guard';
import { Auth } from '../pages/auth/auth.service';

describe('authGuard', () => {
  const isAuthenticated = signal(false);

  const executeGuard: CanActivateChildFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: Auth,
          useValue: {
            isAuthenticated,
          } as Pick<Auth, 'isAuthenticated'>,
        },
      ],
    });

    isAuthenticated.set(false);
  });

  it('allows navigation for authenticated user', () => {
    isAuthenticated.set(true);

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

    expect(result).toBe(true);
  });

  it('redirects unauthenticated user to /auth', () => {
    isAuthenticated.set(false);

    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result as UrlTree)).toBe('/auth');
  });
});
