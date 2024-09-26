import {Route} from "@angular/router";

export const AUTH_ROUTES: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
  },
  {
    path: 'register-user',
    loadComponent: () => import('./register-user/register-user.component'),
  },
  {
    path: 'register-vet',
    loadComponent: () => import('./register-vet/register-vet.component')
  }
  // {
  //   path: 'register-with-phone',
  //   component: RegisterWithPhoneComponent
  // },
  // {
  //   path: '',
  //   redirectTo: 'register-with-phone',
  //   pathMatch: 'full',
  // },
];
