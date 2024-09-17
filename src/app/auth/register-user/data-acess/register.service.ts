import {inject, Injectable, OnDestroy} from '@angular/core';
import {AuthService} from "../../../core/services/auth.service";
import {catchError, EMPTY, Subject, switchMap} from "rxjs";
import {Credentials} from "../../../core/interfaces/user.interface";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SubscriptionsManager} from "../../../shared/utils/subscriber-manager";

@Injectable({
  providedIn: 'root'
})
export class RegisterService implements OnDestroy {
  private authService = inject(AuthService);
  private error$ = new Subject<unknown>()
  private subs = new SubscriptionsManager()

  createUser$ = new Subject<Credentials>()

  userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.createAccount(credentials).pipe(
        catchError(error => {
          this.error$.next(error);
          return EMPTY
        })
      )
    )
  )

  constructor() {
    this.subs.add = this.userCreated$.pipe(takeUntilDestroyed())
      .subscribe(() => console.log("userCreated successfully"))
  }

  ngOnDestroy() {
    this.subs.dispose()
  }
}
