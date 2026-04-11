import { CanActivateChildFn, Router } from '@angular/router';
import { Auth } from '../pages/auth/auth.service';
import { inject } from '@angular/core';
import { getDefaultLayoutPath } from '../pages/layout/utils/layout-tabs.utils';

export const noAuthGuard: CanActivateChildFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl(getDefaultLayoutPath(authService.role()));
};
