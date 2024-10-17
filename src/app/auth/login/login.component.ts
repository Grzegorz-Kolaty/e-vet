import {Component, effect, inject} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {LoginFormComponent} from "./ui/login-form/login-form.component";
import {LoginService} from "./data-access/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  providers: [LoginService],
  template: `
    <div class="container">
      <app-login-form (login)="loginService.login$.next($event)"/>
    </div>
  `,
})
export default class LoginComponent {
  authService = inject(AuthService);
  loginService = inject(LoginService);
  router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['dashboard'])
      }
    })
  }
}
