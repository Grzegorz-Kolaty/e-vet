import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from "../data-access/auth.service";


export const isAuthenticatedGuard = (): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.user()) {
      console.log('user is logged in');
      return true;
    }

    console.log('isAuthg login')
    return router.parseUrl('auth/login');
  };
};

export const emailVerificationGuard = (): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.user() && authService.user()?.is_email_verified) {
      console.log('user email verified');
      return true;
    }

    console.log('email verification guard to dash')
    return router.parseUrl('dashboard');
  };
};
