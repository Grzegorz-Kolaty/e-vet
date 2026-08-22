import {Routes} from "@angular/router";


export const CLINIC_ROUTES: Routes = [
  {
    path: 'browse-clinics',
    loadComponent: () =>
      import('./browse-clinics/browse-clinics.component')
  },
  {
    path: 'clinic/:id',
    loadComponent: () =>
      import('./clinic/./clinic.component')
  },
  {
    path: 'create-clinic',
    loadComponent: () =>
      import('./create-clinic/create-clinic.component')
  },
  {
    path: '',
    redirectTo: 'browse-clinics',
    pathMatch: 'full'
  },
]


