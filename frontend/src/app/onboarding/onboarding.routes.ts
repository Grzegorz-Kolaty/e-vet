import {Routes} from "@angular/router";
import {OnboardingLayout} from "./ui/onboarding-layout/onboarding-layout.component";
import {emailVerificationGuard, isAuthenticatedGuard} from "../shared/guards/accessGuards";

export const ONBOARDING_ROUTES: Routes = [
  {
    path: 'vet',
    component: OnboardingLayout,
    children: [
      {
        path: 'verify-pwz',
        canActivate: [
          isAuthenticatedGuard,
          emailVerificationGuard,
        ],
        loadComponent: () =>
          import('./vet/verify-pwz/verify-pwz')
            .then(m => m.VerifyPwzComponent),
      },
      {
        path: 'workplace',
        loadComponent: () =>
          import('./vet/workplace/workplace.component')
            .then(m => m.VetWorkplaceComponent),
      },
      {
        path: 'join',
        data: {
          onboarding: true,
        },
        loadComponent: () =>
          import('../clinics/join-clinic/join-clinic.component')
            .then(m => m.JoinClinicComponent),
      },
      {
        path: 'create',
        data: {
          onboarding: true,
        },
        loadComponent: () =>
          import('../clinics/create/create-clinic.component')
            .then(m => m.default),
      },
      {
        path: 'join-clinic-requests/:requestId',
        data: {
          onboarding: true,
        },
        loadComponent: () =>
          import('../clinics/join-request/join-request.component')
            .then(m => m.JoinRequestComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'workplace',
      },
    ],
  },
];
