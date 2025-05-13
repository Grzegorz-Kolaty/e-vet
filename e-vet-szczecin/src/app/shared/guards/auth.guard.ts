import {CanActivateFn, Router} from '@angular/router';
import {computed, inject} from '@angular/core';
import {AuthService} from '../data-access/auth.service';
import {toObservable} from "@angular/core/rxjs-interop";

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!!authService.user() && !!authService.user()?.emailVerified) {
    return true;
  }
  router.navigate(['auth']);
  return false;
};

let isRoleGranted$: any

export const roleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (!isRoleGranted$) {
    const isRoleGranted = computed(() => {
      console.log('this computed role has been read: ', authService.role())
      return authService.role()
    })
    isRoleGranted$ = toObservable(isRoleGranted)
  }

  return isRoleGranted$
};
