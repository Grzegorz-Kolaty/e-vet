import {Routes} from '@angular/router';
import {HomeComponent} from './home_404/home.component';
import {authGuard, emailVerifiedGuard} from './shared/guards/accessGuards';
import {LayoutComponent} from "./layout/layout.component";
import {userDataResolver} from "./shared/resolvers/role.resolver";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
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
        resolve: {user: userDataResolver},
        loadComponent: () =>
          import('./dashboard/dashboard.component')
      },
      {
        path: 'clinics',
        canActivate: [authGuard, emailVerifiedGuard],
        resolve: {user: userDataResolver},
        loadComponent: () =>
          import('./clinics/clinics.component')
      },
      {
        path: 'appointments',
        canActivate: [authGuard],
        resolve: {user: userDataResolver},
        loadChildren: () =>
          import('./appointments/appointments.routes').then(m => m.APPOINTMENTS_ROUTES)
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];
