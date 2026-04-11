import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./auth/auth').then((m) => m.Auth) },
  { path: 'login', pathMatch: 'full', redirectTo: 'login/user' },
  { path: 'register', pathMatch: 'full', redirectTo: 'register/user' },
  { path: 'register/admin', pathMatch: 'full', redirectTo: 'login/admin' },
  { path: 'login/:role', loadComponent: () => import('./login/login').then((m) => m.Login) },
  {
    path: 'register/:role',
    loadComponent: () => import('./registration/registration').then((m) => m.Registration),
  },
  { path: '**', redirectTo: '/404' },
];
