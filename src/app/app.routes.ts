import {Routes} from '@angular/router';
import {HomeComponent} from './home_404/home.component';
import {authGuard, emailVerifiedGuard} from './shared/guards/accessGuards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component')
  },
  {
    path: 'pets',
    canActivate: [authGuard, emailVerifiedGuard],
    loadChildren: () =>
      import('./pets/pets.routes').then(m => m.PETS_ROUTES)
  },
  {
    path: 'clinics',
    canActivate: [authGuard, emailVerifiedGuard],
    loadComponent: () =>
      import('./clinics/clinics.component')
  },
  {
    path: 'appointments',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./appointments/appointments.routes').then(m => m.APPOINTMENTS_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];
