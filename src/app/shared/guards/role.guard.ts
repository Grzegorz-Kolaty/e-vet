import {inject} from "@angular/core";
import {AuthService} from "../../core/services/auth.service";
import {map, Observable, take} from "rxjs";
import {ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree} from "@angular/router";

export const veterinaryGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.getUserClaims().pipe(
    take(1),
    map(claims => {
      if (claims && claims["admin"] === true) {
        console.log('User is admin, navigating to /vet', claims);
        return router.createUrlTree(['/dashboard/vet']);
      } else {
        console.log('User is not admin, navigating to /user', claims);
        return true
      }
    })
  );
};
