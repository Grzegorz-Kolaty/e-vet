import {Component, effect, inject} from '@angular/core';
import {NgClass} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";

import {PasswordResetComponent} from "./password-reset/password-reset.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {EmailVerificationComponent} from "./email-verification/email-verification.component";
import {AuthService} from "../shared/data-access/auth.service";

@Component({
  selector: 'app-auth',
  imports: [
    NgClass,
    LoginComponent,
    RegisterComponent,
    EmailVerificationComponent,
    PasswordResetComponent,
    RouterLink,
  ],
  template: `
    <section [ngClass]="getBackgroundClass()" class="h-100 p-5">
      <div class="mx-auto col-lg-4 p-5 rounded-4 glass shadow-lg">
        @switch (queryParams().mode) {
          @case ('registration') {
            <app-register/>
            <br>
            <a class="btn btn-lg bg-transparent text-decoration-none"
               [routerLink]="['/auth']">
              Masz już konto? <b>Zaloguj</b>
            </a>
          }
          @case ('resetPassword') {
            <app-password-reset [oobCode]="queryParams().oobCode"/>
          }
          @case ('verifyEmail') {
            <app-email-verification [oobCode]="queryParams().oobCode"/>
          }
          @default {
            <app-login/>
            <a class="btn btn-link mb-3" [routerLink]="['/auth']"
               [queryParams]="{ mode: 'resetPassword'}">
              Nie pamiętasz hasła?
            </a>
            <br>
            <a class="btn btn-lg bg-transparent text-decoration-none" [routerLink]="['/auth']"
               [queryParams]="{ mode: 'registration'}">
              Nie masz konta? <b>Zarejestruj</b>
            </a>
          }
        }

      </div>
    </section>
  `,
  styles: ``,
})
export default class AuthComponent {
  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  public router = inject(Router);


  queryParams = toSignal(this.route.queryParams
    .pipe(map(params => ({
      mode: params['mode'],
      oobCode: params['oobCode'],
    }))), {initialValue: {mode: null, oobCode: null}}
  );

  constructor() {
    effect(() => {
      if (!!this.authService.user()?.emailVerified && this.authService.role()) {
        console.log(this.authService.role())
        this.router.navigate(['dashboard'])
      }
    });
    effect(() => {
      if (!this.authService.user()?.emailVerified) {
        this.router.navigate([], { queryParams: {mode: 'verifyEmail'}})
      }
    });

    effect(() => {
      if (!this.authService.user()) {
        console.log(this.authService.role())
        this.router.navigate(['auth'])
      }
    });

  }

  getBackgroundClass(): string {
    return this.queryParams().mode === 'registration'
      ? 'cat__background'
      : 'brown__cat__background';
  }
}
