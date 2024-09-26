import {Route} from "@angular/router";
import {AuthGuard, hasCustomClaim} from "@angular/fire/auth-guard";
import {veterinaryGuard} from "../shared/guards/role.guard";

const adminOnly = () => hasCustomClaim('admin');


export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user'
  },
  {
    path: 'user',
    canActivate: [AuthGuard, veterinaryGuard],
    loadComponent: () => import('./dashboard-user/dashboard-user.component'),
  },
  {
    path: 'vet',
    canActivate: [AuthGuard],
    loadComponent: () => import('./dashboard-vet/dashboard-vet.component'),
    data: {authGuardPipe: adminOnly}

  },
  {
    path: '**',
    redirectTo: 'user'
  }
];
