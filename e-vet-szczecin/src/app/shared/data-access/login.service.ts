// import { inject, Injectable } from '@angular/core';
// import { AuthService } from '../../../shared/data-access/auth.service';
// import { Subject } from 'rxjs';
// import { Credentials } from '../../../shared/interfaces/user.interface';
//
// @Injectable()
// export class LoginService {
//   authService = inject(AuthService);
//
//   login$ = new Subject<Credentials>();
//
//   // loginWithPhoneNumber$ = new Subject<PhoneCredentials>();
//   // verificationCode$ = new Subject<string>();
//   // confirmationResult?: ConfirmationResult;
//   //
//   // error$ = new Subject<unknown>();
//
//   // userAuthenticated$ = this.login$.pipe(
//   //   switchMap(credentials =>
//   //     this.authService.login(credentials).pipe(
//   //       catchError(err => {
//   //         this.error$.next(err);
//   //         return EMPTY;
//   //       })
//   //     )
//   //   )
//   // );
//
//   // userAuthenticatedWithPhoneNumber$ = this.loginWithPhoneNumber$.pipe(
//   //   switchMap(credentials =>
//   //     this.authService.loginWithPhoneNumber(credentials).pipe(
//   //       switchMap((confirmationResult: ConfirmationResult) => {
//   //         this.confirmationResult = confirmationResult;
//   //         return EMPTY;
//   //       }),
//   //       catchError(err => {
//   //         this.error$.next(err);
//   //         return EMPTY;
//   //       })
//   //     )
//   //   )
//   // );
//
//   // verifyCode$ = this.verificationCode$.pipe(
//   //   switchMap(code => {
//   //     if (this.confirmationResult) {
//   //       return this.confirmationResult.confirm(code).catch(err => {
//   //         this.error$.next(err);
//   //         return EMPTY;
//   //       });
//   //     } else {
//   //       this.error$.next(new Error('Brak ConfirmationResult'));
//   //       return EMPTY;
//   //     }
//   //   })
//   // );
// }
