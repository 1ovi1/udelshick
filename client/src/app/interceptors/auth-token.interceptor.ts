import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../pages/auth/auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(Auth);
  const token = auth.token();

  if (!token) {
    return next(request);
  }

  if (
    request.url.includes('/auth/login') ||
    request.url.includes('/auth/register') ||
    request.url.includes('/auth/auth')
  ) {
    return next(request);
  }

  if (request.headers.has('Authorization')) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};