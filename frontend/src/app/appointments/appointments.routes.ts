import {Routes} from '@angular/router';

export const APPOINTMENTS_ROUTES: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./create/create.component').then(m => m.default),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./history/history.component').then(m => m.default),
  },
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },
];
