import {Routes} from '@angular/router';
import {HomeComponent} from './home_404/home.component';
import {NotFoundPageComponent} from './home_404/not-found-page.component';
import {authGuard} from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'auth/action',
    loadComponent: () => import('./auth/pages/auth-action-handler/auth-action-handler.component').then(m => m.AuthActionHandlerComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
  },
  {
    path: 'appointments',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./appointments/appointments.routes').then(
        m => m.APPOINTMENTS_ROUTES
      ),
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
