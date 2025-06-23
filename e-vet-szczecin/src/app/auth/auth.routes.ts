import {Routes} from '@angular/router';
import {AuthComponent} from "./auth.component";


export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
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
        path: '**',
        redirectTo: 'login',
        pathMatch: "full"
      },
    ]
  },
  // optional fallback for Firebase links
  {path: 'action', redirectTo: 'auth', pathMatch: 'full'}
];
