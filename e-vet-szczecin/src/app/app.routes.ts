import {Routes} from '@angular/router';
import {HomeComponent} from './home_404/home.component';
import {NotFoundPageComponent} from './home_404/not-found-page.component';
import {authGuard} from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
  },
  {
    path: 'appointments',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./appointments/appointments.routes').then(m => m.APPOINTMENTS_ROUTES),
  },
  {
    path: 'clinics',
    canActivate: [authGuard],
    loadChildren: () => import('./clinics/clinics.routes').then(m => m.CLINICS_ROUTES)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: "full"
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
