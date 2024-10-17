import { Component, effect, inject } from '@angular/core';
import { RegisterFormComponent } from "./ui/register-form/register-form.component";
import { RegisterService } from "./data-acess/register.service";
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RegisterFormComponent],
  providers: [RegisterService],
  template: `
        <div class="container-fluid">
            <h1>Create Your Account</h1>
            <app-register-form (register)="this.registerService.createUser$.next($event)"/>
            <button (click)="this.authService.createAccWithGoogle().subscribe()">
                Register with google
            </button>
            <button id="sign-in-button" (click)="authService.signInWithPhone().subscribe()">
                Zaloguj telefonem
            </button>
        </div>
    `,
})
export default class RegisterComponent {
  public registerService = inject(RegisterService);
  authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate(['dashboard'])
      }
    });
  }
}
