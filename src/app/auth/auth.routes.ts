import {Route} from "@angular/router";
import {isNotAuthenticated} from "../shared/guards/auth.guard";

export const AUTH_ROUTES: Route[] = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    // canActivate: [isNotAuthenticated()]
  },
  {
    path: 'register-user',
    loadComponent: () => import('./register-user/register-user.component'),
    canActivate: [isNotAuthenticated()]
  }

];
