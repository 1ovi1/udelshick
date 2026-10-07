import { Routes } from '@angular/router';
import { noAuthGuard } from './guards/no-auth-guard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/auth' },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    canActivate: [noAuthGuard],
    canActivateChild: [noAuthGuard],
  },
  {
    path: 'layout',
    loadChildren: () => import('./pages/layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
    canActivate: [authGuard],
    canActivateChild: [authGuard],
  },
  { path: '**', redirectTo: '/404' },
];
