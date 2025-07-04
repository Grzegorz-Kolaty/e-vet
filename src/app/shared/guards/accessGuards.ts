import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from "../data-access/auth.service";
import {map} from "rxjs";


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    map(user => {
      if (user) {
        console.log('AuthGuard user exist, letting in')
        return true
      } else {
        console.log('AuthGuard no user, navigate to login')

        return router.parseUrl('/auth/login');
      }
    })
  )
};


export const emailVerifiedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    map(user => {
      if (user?.emailVerified) {
        return true
      } else {
        return router.parseUrl('/auth/login');
      }
    })
  )
};


