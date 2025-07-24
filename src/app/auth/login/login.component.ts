import {Component, effect, inject, resource, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../shared/data-access/auth.service';
import {Credentials} from '../../shared/interfaces/user.interface';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h3 class="mb-4 text-center">Zaloguj się</h3>

    @if (logger.error()) {
      <div class="bg-danger text-center rounded-4 p-3 mb-4">
        <span class="text-white">{{ logger.error() }}</span>
      </div>
    }

    <form [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
          #form="ngForm"
          class="d-flex flex-column gap-3">


      <div class="form-floating mb-2">
        <input formControlName="email"
               placeholder="email"
               type="email"
               class="form-control form-control-lg shadow-lg"
               id="emailInput"
               aria-describedby="emailHelp"
               required/>
        <label for="emailInput">Email</label>

      </div>

      <div class="form-floating mb-2">
        <input formControlName="password"
               type="password"
               class="form-control form-control-lg shadow-lg"
               id="passwordInput"
               placeholder="password"/>
        <label for="passwordInput">Hasło</label>
      </div>

      <a class="text-end btn bg-transparent mb-4" [routerLink]="['/auth', 'forgot-password']">
        Nie pamiętasz hasła?
      </a>

      <button
        class="btn btn-dark btn-lg rounded-5 mb-3 shadow-lg w-75 mx-auto"
        type="submit"
        [disabled]="logger.isLoading()">
        Loguj
      </button>

      <a class="btn bg-transparent text-decoration-none" [routerLink]="['/auth', 'register']">
        Nie masz konta? <b>Zarejestruj się</b>
      </a>

    </form>
  `,
})
export default class LoginComponent {
  public readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router)

  login = signal<Credentials | undefined>(undefined);
  logger = resource({
    request: () => this.login(),
    loader: ({request}) => this.authService.login(request!)
  });

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor() {
    console.log('login component constructor')
    effect(async () => {

      if (this.logger.status() === 4 || this.authService.firebaseUser()) {
        console.log('login has user, nav to dash')
        this.router.navigate(['dashboard'])
      }
    })
  }

  onSubmit() {
    const form = this.loginForm.getRawValue();
    if (this.loginForm.valid) {
      this.login.set(form);
    }
  }
}
