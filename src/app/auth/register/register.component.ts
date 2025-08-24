import {ChangeDetectionStrategy, Component, inject, resource, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from "@angular/router";
import {RegisterCredentials, Role} from '../../shared/interfaces/user.interface';
import {AuthService} from '../../shared/data-access/auth.service';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h3 class="mb-4 text-center">
      {{ isVet() === Role.User ? 'Zarejestruj się' : 'Rejestracja weterynarzy' }}
    </h3>

    @if (registration.error()) {
      <div class="bg-danger text-center rounded-4 p-3 mb-4">
        <span class="text-white">{{ registration.error() }}</span>
      </div>
    }

    @if (registration.status() === 'resolved') {
      <div class="bg-success text-center rounded-4 p-3 mb-4">
        <span class="text-white">
          Rejestracja udana!
          <br>
          Sprawdź skrzynkę email
        </span>
      </div>
    }

    <form [formGroup]="registerForm"
          (ngSubmit)="onSubmit(isVet())"
          #form="ngForm"
          class="d-flex flex-column gap-3">

      <div class="form-floating mb-2">
        <input
          formControlName="displayName"
          placeholder="np. imię i nazwisko"
          type="text"
          class="form-control form-control-lg shadow-lg"
          id="displayNameInput"
          aria-describedby="displayNameInput"
          required/>
        <label for="displayNameInput">
          Imię i nazwisko
        </label>
      </div>

      <div class="form-floating mb-2">
        <input
          formControlName="email"
          placeholder="email"
          type="email"
          class="form-control form-control-lg shadow-lg"
          id="emailInput"
          aria-describedby="emailHelp"
          required/>
        <label for="emailInput">
          Email
        </label>
      </div>

      <div class="form-floating mb-2">
        <input
          formControlName="password"
          type="password"
          class="form-control form-control-lg shadow-lg"
          id="passwordInput"
          placeholder="min. 6 znaków"
          required/>
        <label for="passwordInput">
          Hasło
        </label>
      </div>

      <div class="form-check form-switch ms-auto mb-4">
        <input
          #roleSwitch
          class="form-check-input cursor-pointer"
          type="checkbox"
          role="switch"
          id="vetSwitch"
          [checked]="isVet() === Role.Vet"
          (change)="isVet.set(roleSwitch.checked ? Role.Vet : Role.User)"
        />
        <label class="form-check-label cursor-pointer text-shadow" for="vetSwitch">
          Zarejestruj jako weterynarz
        </label>
      </div>

      <button
        class="btn btn-dark btn-lg rounded-5 mb-3 shadow-lg w-75 mx-auto"
        [disabled]="registration.isLoading()"
        type="submit">
        Zarejestruj
      </button>

      <a class="btn bg-transparent text-decoration-none"
         [routerLink]="['/auth', 'login']">
        Masz już konto?
        <b>Zaloguj się</b>
      </a>

    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {
  public authService = inject(AuthService);
  protected readonly Role = Role;
  private fb = inject(FormBuilder);

  registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]],
    displayName: ['', Validators.required],
    password: ['', Validators.required],
  });

  isVet = signal<Role>(Role.User);

  register = signal<RegisterCredentials | undefined>(undefined);
  registration = resource({
    params: this.register,
    loader: async (creds) => {
      return await this.authService.register(creds.params)
    }
  });

  constructor() {
    this.setRandomData();
  }

  onSubmit(role: Role): void {
    const rawForm = this.registerForm.getRawValue();
    if (this.registerForm.valid) {
      const data = {...rawForm, role}
      this.register.set(data);
    }
  }

  private setRandomData() {
    const randomString = (length: number) => Math.random().toString(36).substring(2, 2 + length);
    const email = `${randomString(5)}@example.com`;
    const displayName = `User${randomString(4)}`;
    const password = randomString(10);

    this.registerForm.setValue({
      email,
      displayName,
      password,
    });
  }
}
