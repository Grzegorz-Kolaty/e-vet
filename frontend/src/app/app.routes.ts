import {Routes} from '@angular/router';
import {HomeComponent} from './home_404/home.component';
import {emailVerificationGuard, isAuthenticatedGuard} from "./shared/guards/accessGuards";
import {Loading} from "./home_404/loading";

export const routes: Routes = [
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
    canActivate: [isAuthenticatedGuard()],
    loadComponent: () =>
      import('./dashboard/dashboard.component')
  },
  {
    path: 'pets',
    canActivate: [isAuthenticatedGuard()],
    loadComponent: () =>
      import('./pets/pets.component')
  },
  {
    path: 'clinics',
    canActivate: [isAuthenticatedGuard(), emailVerificationGuard()],
    loadChildren: () =>
      import('./clinics/clinic.routes').then(m => m.CLINIC_ROUTES)
  },
  {
    path: 'appointments',
    canActivate: [isAuthenticatedGuard()],
    loadChildren: () =>
      import('./appointments/appointments.routes').then(m => m.APPOINTMENTS_ROUTES)
  },
  {
    path: 'loading',
    component: Loading
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];
