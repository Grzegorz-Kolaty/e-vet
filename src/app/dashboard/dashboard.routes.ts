import {Route} from "@angular/router";


// const adminOnly = () => hasCustomClaim('role');

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'user', // This will be handled dynamically based on user permissions
    pathMatch: 'full',
    // canActivate: [AuthGuard],
  },
  {
    path: 'user',
    loadComponent: () => import('./dashboard-user/dashboard-user.component'),

  },
  {
    path: 'vet',
    loadComponent: () => import('./dashboard-vet/dashboard-vet.component'),
    // canActivate: [AuthGuard],
    // data: { authGuardPipe: adminOnly }
  }
];
