import {ChangeDetectionStrategy, Component, effect, inject, resource, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RegisterCredentials, Role} from '../../shared/interfaces/user.interface';
import {AuthService} from '../../shared/data-access/auth.service';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  template: `
    {{registration.status().toFixed()}}

    <form [formGroup]="registerForm"
          (ngSubmit)="onSubmit(isVet())"
          #form="ngForm"
          class="d-flex flex-column gap-3 fw-semibold">

      <h3 class="mb-3 text-center fw-bold">
        {{ isVet() === Role.User ? 'Zarejestruj się' : 'Rejestracja weterynarzy' }}
      </h3>

      <div class="mb-3">
        <label for="displayNameInput" class="form-label">
          {{ isVet() === Role.User ? 'Nazwa użytkownika' : 'Imię i nazwisko' }}
        </label>
        <input
          formControlName="displayName"
          placeholder="np. imię i nazwisko"
          type="text"
          class="form-control form-control-lg shadow"
          id="displayNameInput"
          aria-describedby="displayNameInput"
          required/>
      </div>

      <div class="mb-3">
        <label for="emailInput" class="form-label">Email</label>
        <input
          formControlName="email"
          placeholder="email"
          type="email"
          class="form-control form-control-lg shadow"
          id="emailInput"
          aria-describedby="emailHelp"
          required/>
      </div>

      <div class="mb-3">
        <label for="passwordInput" class="form-label">Hasło</label>
        <input
          formControlName="password"
          type="password"
          class="form-control form-control-lg shadow"
          id="passwordInput"
          placeholder="min. 6 znaków"
          required/>
      </div>

      <div class="form-check form-switch ms-auto mb-4">
        <input
          #roleSwitch
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="vetSwitch"
          [checked]="isVet() === Role.Vet"
          (change)="isVet.set(roleSwitch.checked ? Role.Vet : Role.User)"
        />
        <label class="form-check-label" for="vetSwitch">
          Zarejestruj jako weterynarz
        </label>
      </div>

      <button
        [disabled]="registration.isLoading()"
        class="btn btn-lg btn-dark rounded-4 mb-3 shadow-lg"
        type="submit">
        {{ isVet() === Role.Vet ? 'Utwórz konto weterynarza! 👩🏻‍⚕️' : 'Zarejestruj' }}
      </button>

      @if (registration.error() && form.submitted) {
        <span class="text-danger">{{ registration.error() }}</span>
      } @else if (registration.status() === 4) {
        <span class="text-success">Rejestracja udana - wysłaliśmy mail weryfikacyjny!</span>
      } @else {
        <span class="visually-hidden">Nothing</span>
      }

    </form>
  `,
})
export class RegisterComponent {
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);
  protected readonly Role = Role;

  isVet = signal<Role>(Role.User)

  registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]],
    displayName: ['', Validators.required],
    password: ['', Validators.required],
  });

  register = signal<RegisterCredentials | undefined>(undefined);
  registration = resource({
    request: () => this.register(),
    loader: ({request}) => {
return       this.authService.register(request!)

    },
  });

  constructor() {
    this.setRandomData();

    effect(() => {
      if (this.registration.value()) {
        this.registerForm.disable()
      }
    });

    effect(() => {
      console.log(this.registration.status())
    })
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

  onSubmit(role: Role): void {
    const rawForm = this.registerForm.getRawValue();
    if (this.registerForm.valid) {
      const data = {...rawForm, role}
      this.register.set(data);
    }
  }
}
