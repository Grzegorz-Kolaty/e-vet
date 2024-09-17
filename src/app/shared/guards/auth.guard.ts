import {CanActivateFn} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../../core/services/auth.service";

export const isNotAuthenticated = (): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    return !authService.user();
  };
};

// export class AuthGuard2 extends AngularFireAuthGuard {
//   constructor(router: Router, authService: AuthService) {
//     super(router, authService.afAuth);
//
//     const claims =    customClaims
//
//     console.log(claims)
//   }
// }
// export function authGuard(redirectRouter: string): CanActivateFn {
//   return () => {
//     const router = inject(Router);
//     const firebaseGUARD = Inject(AuthGuard)
//
//     console.log(firebaseGUARD, redirectRouter)
//
//     if (firebaseGUARD) {
//       return router.createUrlTree([redirectRouter])
//     }
//
//     return false
//   }
// }
