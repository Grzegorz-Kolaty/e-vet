import { Route } from '@angular/router';

export const APPOINTMENTS_ROUTES: Route[] = [
  {
    path: 'create',
    loadComponent: () => import('./create/create.component'),
  },
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },
];
