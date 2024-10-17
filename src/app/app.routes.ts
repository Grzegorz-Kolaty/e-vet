import { Route } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { isAuthenticatedGuard } from "./core/guards/auth.guard";

export const routes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: '**',
    component: HomeComponent
  }
];
