import {Routes} from '@angular/router';
import {
  emailVerificationGuard,
  isAuthenticatedGuard, vetOnboardingGuard
} from './shared/guards/accessGuards';

export const routes: Routes = [

  // =========================
  // AUTH
  // =========================
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes')
        .then(m => m.AUTH_ROUTES),
  },

  // =========================
  // ONBOARDING
  // =========================
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./onboarding/onboarding.routes')
        .then(m => m.ONBOARDING_ROUTES),
  },

  // =========================
  // NORMALNA APLIKACJA
  // =========================
  {
    path: '',
    loadComponent: () =>
      import('./layout/app-layout/app-layout.component')
        .then(m => m.AppLayoutComponent),

    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home_404/home.component')
            .then(m => m.HomeComponent),
      },

      {
        path: 'dashboard',
        canActivate: [
          isAuthenticatedGuard,
          vetOnboardingGuard,
        ],
        loadComponent: () =>
          import('./dashboard/dashboard.component')
            .then(m => m.default),
      },

      {
        path: 'pets',
        canActivate: [
          isAuthenticatedGuard
        ],
        loadComponent: () =>
          import('./pets/pets.component')
            .then(m => m.default),
      },

      {
        path: 'clinics',
        canActivate: [
          isAuthenticatedGuard,
          emailVerificationGuard
        ],
        loadChildren: () =>
          import('./clinics/clinics.routes')
            .then(m => m.CLINIC_ROUTES),
      },

      {
        path: 'appointments',
        canActivate: [
          isAuthenticatedGuard
        ],
        loadChildren: () =>
          import('./appointments/appointments.routes')
            .then(m => m.APPOINTMENTS_ROUTES),
      },

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
