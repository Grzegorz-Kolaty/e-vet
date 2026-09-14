import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {AuthService} from '../data-access/auth.service';


export const isAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();

  if (user) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};


export const emailVerificationGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();

  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  if (user.is_email_verified) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};


export const vetOnboardingGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();

  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  // Zwykłego właściciela zwierzęcia ten flow nie dotyczy.
  if (user.role !== 'vet') {
    return true;
  }

  // Najpierw kończymy istniejący flow weryfikacji emaila.
  // Nie wysyłamy niezweryfikowanego veta do PWZ.
  if (!user.is_email_verified) {
    return true;
  }

  const verificationStatus =
    user.vet_profile?.verification_status;

  if (verificationStatus !== 'verified') {
    return router.createUrlTree([
      '/onboarding/vet/verify-pwz',
    ]);
  }

  return true;
};
