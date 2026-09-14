import {Routes} from "@angular/router";

export const CLINIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./browse-clinics/browse-clinics.component')
  },

  {
    path: 'join',
    loadComponent: () =>
      import('./join-clinic/join-clinic.component')
        .then(m => m.JoinClinicComponent),
  },

  {
    path: 'create',
    loadComponent: () =>
      import('./create/create-clinic.component')
        .then(m => m.default),
  },

  {
    path: 'join-clinic-requests/:requestId',
    loadComponent: () =>
      import('./join-request/join-request.component')
        .then(m => m.JoinRequestComponent),
  },

  {
    path: ':clinicId',
    loadComponent: () =>
      import('./clinic/clinic.component')
        .then(m => m.default),
  },
];
