import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../data-access/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.user()) {
    return true;
  }
  router.navigate(['auth', 'login']);
  return false;
};

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.user()) {
    return true;
  }
  router.navigate(['dashboard']);
  return false;
};

// export const profileCompletedGuard: CanActivateFn = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//
//   if (authService.userRole()) {
//     return true;
//   }
//   router.navigate(['auth', 'profile']);
//   return false;
// };
