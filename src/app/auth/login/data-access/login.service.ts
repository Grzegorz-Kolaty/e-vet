import {inject, Injectable, OnDestroy} from '@angular/core';
import {catchError, EMPTY, Subject, switchMap} from "rxjs";
import {AuthService} from "../../../core/services/auth.service";
import {Credentials} from "../../../core/interfaces/user.interface";
import {SubscriptionsManager} from "../../../shared/utils/subscriber-manager";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {
  private authService = inject(AuthService);
  private subs = new SubscriptionsManager();

  // sources
  error$ = new Subject<any>();
  login$ = new Subject<Credentials>();

  userAuthenticated$ = this.login$.pipe(
    switchMap((credentials) =>
      this.authService.login(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    )
  );

  constructor() {
    this.subs.add = this.userAuthenticated$.pipe(takeUntilDestroyed()).subscribe()
  }

  ngOnDestroy() {
    this.subs.dispose()
  }

}
