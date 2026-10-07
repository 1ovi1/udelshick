import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../pages/auth/auth.service';
import { UserRole } from '../pages/auth/models/user-role.type';
import { getDefaultLayoutPath } from '../pages/layout/utils/layout-tabs.utils';

export const roleTabGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const currentRole = auth.role();
  const allowedRoles = route.data?.['roles'] as readonly UserRole[] | undefined;

  if (!currentRole) {
    return router.parseUrl('/auth');
  }

  if (allowedRoles?.includes(currentRole)) {
    return true;
  }

  return router.parseUrl(getDefaultLayoutPath(currentRole));
};
