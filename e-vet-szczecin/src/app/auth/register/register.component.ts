import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {rxResource} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {RegisterCredentials} from '../../shared/interfaces/user.interface';
import {AuthService} from '../../shared/data-access/auth.service';
import {FunctionsService} from '../../shared/data-access/functions.service';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="brown__cat__background p-5 h-100">
      <form
        [formGroup]="registerForm"
        (ngSubmit)="onSubmit()"
        #form="ngForm"
        class="mx-auto col-lg-5 p-5 d-flex flex-column gap-3 rounded glass shadow fw-semibold">

        <h3 class="mb-3 text-center fw-bold">Zarejestruj się</h3>

        <div class="mb-3">
          <label for="emailInput" class="form-label"> Email address </label>
          <input
            formControlName="email"
            placeholder="email"
            type="email"
            class="form-control form-control-lg shadow"
            id="emailInput"
            aria-describedby="emailHelp"
            required/>

          @if ((registerForm.controls.email.dirty || form.submitted) &&
          !registerForm.controls.email.valid) {
            <div id="emailHelp" class="form-text text-danger">
              Pass proper email adress.
            </div>
          }
        </div>

        <div class="mb-3">
          <label for="displayNameInput" class="form-label"> Imię i nazwisko </label>
          <input
            formControlName="displayName"
            placeholder="Imię i nazwisko"
            type="text"
            class="form-control form-control-lg shadow"
            id="displayNameInput"
            aria-describedby="displayNameInput"
            required/>

        </div>

        <div class="mb-2">
          <label for="passwordInput" class="form-label">Password</label>
          <input
            formControlName="password"
            type="password"
            class="form-control form-control-lg shadow"
            id="passwordInput"
            placeholder="password"/>
        </div>

        <button
          (click)="router.navigate(['auth', 'password-reset'])"
          class="btn text-primary text-start mb-3 px-0"
          type="button">
          Nie pamiętasz hasła?
        </button>

        <button
          [disabled]="registration.isLoading()"
          class="btn btn-lg btn-dark mb-3 p-3"
          type="submit">
          Zarejestruj
        </button>

        @if (registration.error() && form.submitted) {
          <span class="text-danger">{{ registration.error() }}</span>
        } @else if (registration.status() === 4) {
          <span class="text-success">Rejestracja udana - wysłaliśmy mail weryfikacyjny!</span>
        } @else {
          <span class="visually-hidden">Nothing</span>
        }
      </form>


      <button
        (click)="functions.onRoleSelect()"
        class="btn btn-lg btn-dark mb-3 p-3"
        type="button">
        Function check
      </button>
    </section>
  `,
})
export default class RegisterComponent {
  public authService = inject(AuthService);
  public functions = inject(FunctionsService)
  private fb = inject(FormBuilder);
  router = inject(Router);

  register = signal<RegisterCredentials | undefined>(undefined);
  registration = rxResource({
    request: () => this.register(),
    loader: obj => this.authService.register(obj.request!),
  });

  registerForm = this.fb.nonNullable.group({
    email: ['grzegorzkolaty@gmail.com', [Validators.required, Validators.email]],
    displayName: ['', Validators.required],
    password: ['Poszkole1', Validators.required],
  });

  onSubmit(): void {
    const rawForm = this.registerForm.getRawValue();
    if (this.registerForm.valid) {
      this.register.set(rawForm);
    }
  }
}
