// import { computed, inject, Injectable, signal } from '@angular/core';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { catchError, EMPTY, Subject, switchMap } from 'rxjs';
// import { AuthService } from '../../../shared/data-access/auth.service';
//
// export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';
//
// interface RegisterState {
//   status: RegisterStatus;
// }
//
// @Injectable()
// export class RegisterService {
//   private authService = inject(AuthService);
//
//   createUser$ = new Subject<Credentials>();
//
//   // createUserWithGoogle$ = new Subject<void>();
//   // createUserWithGoogleRedirect$ = new Subject<void>();
//
//   error$ = new Subject<unknown>();
//
//   userCreated$ = this.createUser$.pipe(
//     switchMap((credentials: Credentials) =>
//       this.authService.createAccount(credentials).pipe(
//         catchError(error => {
//           this.error$.next(error);
//           return EMPTY;
//         })
//       )
//     )
//   );
//
//   // userCreatedWithGoogleRedirect$ = this.createUserWithGoogleRedirect$.pipe(
//   //   switchMap(() =>
//   //     this.authService.createAccountWithGoogleRedirect().pipe(
//   //       catchError(error => {
//   //         this.error$.next(error);
//   //         return EMPTY;
//   //       })
//   //     )
//   //   )
//   // );
//
//   // userCreatedWithGoogle$ = this.createUserWithGoogle$.pipe(
//   //   switchMap(() =>
//   //     this.authService.createAccountWithGoogle().pipe(
//   //       catchError(error => {
//   //         this.error$.next(error);
//   //         return EMPTY;
//   //       })
//   //     )
//   //   )
//   // );
//
//   // state
//   private state = signal<RegisterState>({
//     status: 'pending',
//   });
//
//   // selectors
//   status = computed(() => this.state().status);
//
//   constructor() {
//     this.userCreated$
//       .pipe(takeUntilDestroyed())
//       .subscribe(() =>
//         this.state.update(state => ({ ...state, status: 'success' }))
//       );
//
//     // this.userCreatedWithGoogle$
//     //   .pipe(takeUntilDestroyed())
//     //   .subscribe(() =>
//     //     this.state.update(state => ({ ...state, status: 'success' }))
//     //   );
//     //
//     // this.userCreatedWithGoogleRedirect$
//     //   .pipe(takeUntilDestroyed())
//     //   .subscribe(() =>
//     //     this.state.update(state => ({ ...state, status: 'success' }))
//     //   );
//
//     // this.authService
//     //   .getProfileAndRedirect()
//     //   .pipe(takeUntilDestroyed())
//     //   .subscribe(data => console.log(data?.operationType));
//
//     this.error$
//       .pipe(takeUntilDestroyed())
//       .subscribe(() =>
//         this.state.update(state => ({ ...state, status: 'error' }))
//       );
//   }
// }
