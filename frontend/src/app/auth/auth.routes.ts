import {Routes} from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth.component').then(m => m.default),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component').then(m => m.default),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./register/register.component').then(m => m.default),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./forgot-password/forgot-password.component').then(m => m.default),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./password-reset/password-reset.component').then(m => m.default),
      },
      {
        path: 'verify-email',
        loadComponent: () =>
          import('./email-verification/email-verification.component').then(m => m.default),
      },
      {
        path: 'confirm-email-change',
        loadComponent: () =>
          import('./confirm-email-change/confirm-email-change').then(m => m.default),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
