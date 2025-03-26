import {ChangeDetectionStrategy, Component, computed, effect, inject, resource, signal,} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Params} from '@angular/router';
import {RegisterCredentials, Role} from '../../shared/interfaces/user.interface';
import {AuthService} from '../../shared/data-access/auth.service';
import {map} from 'rxjs';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!params()) {
      <div>loading</div>
    } @else {

      <section class="brown__cat__background p-5 h-100">
        <form
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit(params())"
          #form="ngForm"
          class="mx-auto col-lg-5 p-5 d-flex flex-column gap-3 rounded glass shadow fw-semibold">

          <h3 class="mb-3 text-center fw-bold">
            {{ params() === Role.User ? 'Zarejestruj się' : 'Rejestracja weteryanrzy' }}
          </h3>

          <div class="mb-3">
            <label for="displayNameInput" class="form-label">
              {{ params() === Role.User ? 'Nazwa użytkownika' : 'Imię i nazwisko' }}
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

      </section>
    }

  `,
})
export default class RegisterComponent {
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  protected readonly Role = Role;


  params = toSignal(this.route.params.pipe(
    map((params: Params) => {
      return params['role'];
    })
  ));

  register = signal<RegisterCredentials | undefined>(undefined);
  registration = resource({
    request: () => this.register(),
    loader: obj => this.authService.register(obj.request!),
  });


  registerForm = this.fb.nonNullable.group({
    email: ['grzegorzkolaty@gmail.com', [Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)]],
    displayName: ['Grzegorz Kolaty', Validators.required],
    password: ['Poszkole1', Validators.required],
  });

  constructor() {
    effect(() => {
      console.log(this.params())
    });
    effect(() => {
      if (this.registration.value()) {
        this.registerForm.disable()
      }
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
