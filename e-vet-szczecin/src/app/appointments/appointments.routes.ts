import { Route } from '@angular/router';

export const APPOINTMENTS_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'browse',
    pathMatch: 'full',
  },
  {
    path: 'browse',
    loadComponent: () => import('./browse/browse.component'),
  },
  {
    path: 'create',
    loadComponent: () => import('./create/create.component'),
  },
];
