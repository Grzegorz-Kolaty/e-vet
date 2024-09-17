import {Component, effect, inject} from '@angular/core';
import {RegisterFormComponent} from "./ui/register-form/register-form.component";
import {RegisterService} from "./data-acess/register.service";
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [RegisterFormComponent],
  providers: [RegisterService],
  template: `
    <div class="container-fluid">
      <app-register-form (register)="this.registerService.createUser$.next($event)"/>
    </div>`,
})
export default class RegisterUserComponent {
  public registerService = inject(RegisterService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['dashboard'])
      }
    });
  }
}
