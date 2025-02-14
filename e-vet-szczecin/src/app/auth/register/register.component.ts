import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/data-access/auth.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Credentials } from '../../shared/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="brown__cat__background p-5 mt-5">
      <form
        [formGroup]="registerForm"
        (ngSubmit)="onSubmit()"
        #form="ngForm"
        class="mx-auto col-xl-4 p-lg-5 p-4 rounded glass__form fw-semibold">
        <h3 class="mb-3 text-center fw-bold">Zarejestruj się</h3>
        <div class="mb-3">
          <label for="emailInput" class="form-label"> Email address </label>
          <input
            formControlName="email"
            placeholder="email"
            type="email"
            class="form-control form-control-lg"
            id="emailInput"
            aria-describedby="emailHelp" />

          @if (
            (registerForm.controls.email.dirty || form.submitted) &&
            !registerForm.controls.email.valid
          ) {
            <div id="emailHelp" class="form-text text-danger">
              Pass proper email adress.
            </div>
          }
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
          [disabled]="registration.isLoading()"
          class="btn btn-lg btn-dark w-100 mb-3"
          type="submit">
          Zarejestruj
        </button>

        <button
          (click)="onSubmitResetPassword()"
          class="btn btn-lg btn-dark w-100 mb-3"
          type="submit">
          Restetuj hasło
        </button>

        @if (registration.error() && form.submitted) {
          <span class="text-danger">{{ registration.error() }}</span>
        } @else {
          <span class="visually-hidden">Nothing</span>
        }
      </form>
    </section>
  `,
})
export default class RegisterComponent {
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);
  router = inject(Router);

  register = signal<Credentials | null>(null);
  registration = rxResource({
    request: this.register,
    loader: obj => this.authService.register(obj.request!),
  });

  registerForm = this.fb.nonNullable.group({
    email: ['grzegorzkolaty@gmail.com', Validators.required],
    password: ['Poszkole1', Validators.required],
  });

  constructor() {
    effect(() => {
      const userLoggedIn = !!this.authService.user();
      if (userLoggedIn) {
        this.router.navigate(['auth', 'profile']);
      }
    });
  }

  onSubmit(): void {
    const rawForm = this.registerForm.getRawValue();
    if (this.registerForm.valid) {
      this.register.set(rawForm);
    }
  }

  onSubmitResetPassword() {
    const rawForm = this.registerForm;
    if (this.registerForm.valid) {
      const credentials = rawForm.getRawValue()
      this.authService.resetPassword(credentials.email).subscribe(data => console.log(data)
      )
    }

  }
}
