import { CanActivateChildFn, Router } from '@angular/router';
import { Auth } from '../pages/auth/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateChildFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/auth');
};
