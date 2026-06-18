import { Route } from '@angular/router';

export const APPOINTMENTS_ROUTES: Route[] = [
  {
    path: 'create',
    loadComponent: () => import('./create/create.component'),
  },
  {
    path: 'history',
    loadComponent: () => import('./history/history.component'),
  },
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },
];
