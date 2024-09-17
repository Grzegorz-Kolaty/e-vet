import {Route} from '@angular/router';
import {AuthGuard, redirectUnauthorizedTo} from "@angular/fire/auth-guard";

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth', 'login']);

export const routes: Route[] = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.routes').then((m) => m.HOME_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];
