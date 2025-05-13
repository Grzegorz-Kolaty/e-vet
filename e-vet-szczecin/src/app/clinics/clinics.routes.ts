import {Route} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../shared/data-access/auth.service";
import {roleGuard} from "../shared/guards/auth.guard";

const Roles = {
  User: 'user',
  Vet: 'vet',
} as const;

type RolesType = (typeof Roles)[keyof typeof Roles];

const Routes = {
  User: 'user-browse-clinics',
  Vet: 'vet-clinic',
  Dashboard: 'dashboard',
} as const;

type RoutesType = (typeof Routes)[keyof typeof Routes];


const routesMap = new Map<RolesType, RoutesType>([
  [Roles.Vet, Routes.Vet],
  [Roles.User, Routes.User],
]);

export const CLINICS_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      const auth = inject(AuthService)
      const role = auth.role()
      if (!role) return Routes.Dashboard
      return routesMap.get(role) || Routes.User;
    }
  },
  {
    path: 'user-browse-clinics',
    canActivate: [roleGuard],
    loadComponent: () => import('./user-browse-clinics/user-browse-clinics.component'),
  },
  {
    path: 'vet-clinic',
    canActivate: [roleGuard],
    loadComponent: () => import('./vet-clinic/vet-clinic.component'),
  },

];
