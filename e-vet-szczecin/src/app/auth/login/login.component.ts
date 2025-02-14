import {
  ChangeDetectionStrategy,
  Component, effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/data-access/auth.service';
import { Credentials } from '../../shared/interfaces/user.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @defer (when !this.logger.value()) {
      <section class="catbackground p-5">
        <form
          [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
          class="mx-auto col-xl-4 p-lg-5 p-4 rounded glass__form fw-semibold"
          #form="ngForm">
          <h3 class="mb-3 text-center fw-bold">Zaloguj się</h3>
          <div class="mb-4">
            <label for="emailInput" class="form-label">Email address</label>
            <input
              formControlName="email"
              placeholder="email"
              type="email"
              class="form-control form-control-lg"
              id="emailInput"
              aria-describedby="emailHelp" />
          </div>

          <div class="mb-3">
            <label for="passwordInput" class="form-label">Password</label>
            <input
              formControlName="password"
              type="password"
              class="form-control form-control-lg"
              id="passwordInput"
              placeholder="password" />
          </div>

          <button
            class="btn btn-lg btn-dark w-100 mb-3"
            type="submit"
            [disabled]="logger.isLoading()">
            Login
          </button>

          @if (logger.error() && form.submitted) {
            <span class="text-danger">{{ logger.error() }}</span>
          } @else {
            <span class="visually-hidden">Nothing</span>
          }
        </form>
      </section>
    } @loading (minimum 500ms) {
      <div class="d-flex justify-content-center m-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    }
  `,
})
export default class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  login = signal<Credentials | null>(null);
  logger = rxResource({
    request: () => this.login(),
    loader: obj => this.authService.login(obj.request!),
  });

  loginForm = this.fb.nonNullable.group({
    email: ['grzegorzkolaty@gmail.com', Validators.required],
    password: ['Poszkole1', Validators.required],
  });

  constructor() {
    effect(() => {
      const userLoggedIn = !!this.authService.user()
      if (userLoggedIn) {
        this.router.navigate(['auth', 'profile'])
      }
    });
  }

  onSubmit() {
    const form = this.loginForm.getRawValue();
    if (this.loginForm.valid) {
      this.login.set(form);
    }
  }
}
