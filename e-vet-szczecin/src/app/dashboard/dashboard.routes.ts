import { Route } from '@angular/router';
import {roleGuard} from "../shared/guards/auth.guard";
import {AuthService} from "../shared/data-access/auth.service";
import {inject} from "@angular/core";

const Roles = {
  User: 'user',
  Vet: 'vet',
} as const;

type RolesType = (typeof Roles)[keyof typeof Roles];

const Routes = {
  User: 'user',
  Vet: 'vet',
  Login: 'auth',
} as const;

type RoutesType = (typeof Routes)[keyof typeof Routes];

const routesMap = new Map<RolesType, RoutesType>([
  [Roles.Vet, Routes.Vet],
  [Roles.User, Routes.User],
]);

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      const auth = inject(AuthService)
      const role = auth.role()
      if (!role) return Routes.Login
      return routesMap.get(role) || Routes.User;
    }
  },
  {
    path: 'user',
    canActivate: [roleGuard],
    loadComponent: () => import('./user/user.component'),
  },
  {
    path: 'vet',
    canActivate: [roleGuard],
    loadComponent: () => import('./vet/vet.component'),
  },

];
