import {Route} from "@angular/router";
import {veterinaryGuard} from "../shared/guards/role.guard";
import {isAuthenticatedGuard} from "../core/guards/auth.guard";


export const DASHBOARD_ROUTES: Route[] = [
    {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full'
    },
    {
        path: 'user',
        canActivate: [isAuthenticatedGuard, veterinaryGuard],
        loadComponent: () => import('./dashboard-user/dashboard-user.component'),
    },
    {
        path: 'vet',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () => import('./dashboard-vet/dashboard-vet.component'),
    },
    {
        path: '**',
        redirectTo: 'user'
    }
];
