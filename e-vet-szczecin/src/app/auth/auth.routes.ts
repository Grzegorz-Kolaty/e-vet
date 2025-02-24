import {Route} from '@angular/router';
// import { authGuard, noAuthGuard } from '../shared/guards/auth.guard';

export const AUTH_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    // canActivate: [noAuthGuard],
    loadComponent: () => import('./login/login.component'),
  },
  {
    path: 'register',
    // canActivate: [noAuthGuard],
    loadComponent: () => import('./register/register.component'),
  },
  {
    path: 'password-reset',
    loadComponent: () => import('./forgot-password/forgot-password.component')
  },
  // {
  //   path: 'email-verification',
  //   canActivate: [authGuard],
  //   loadComponent: () =>
  //     import('./email-verification/email-verification.component'),
  // },
  // {
  //   path: 'role-assignment',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./role-assignment/role-assignment.component'),
  // },
  {
    path: 'profile',
    // canActivate: [authGuard],
    loadComponent: () => import('./profile/profile.component'),
  },
];
