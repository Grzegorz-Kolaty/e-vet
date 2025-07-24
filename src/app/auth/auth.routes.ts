import {Routes} from '@angular/router';


export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth.component'),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component')
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./register/register.component')
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./forgot-password/forgot-password.component')
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./password-reset/password-reset.component')
      },
      {
        path: 'verify-email',
        loadComponent: () =>
          import('./email-verification/email-verification.component')
      },
      {
        path: 'action',
        loadComponent: () => import('./actions/actions.component')
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'login',
      }
    ]
  }
];
