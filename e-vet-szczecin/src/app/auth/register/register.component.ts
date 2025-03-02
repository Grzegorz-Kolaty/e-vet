import {ChangeDetectionStrategy, Component, computed, effect, inject, signal,} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Params} from '@angular/router';
import {RegisterCredentials, Role} from '../../shared/interfaces/user.interface';
import {AuthService} from '../../shared/data-access/auth.service';
import {FunctionsService} from '../../shared/data-access/functions.service';
import {map} from 'rxjs';
import {JsonPipe} from '@angular/common';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let registerRole = params();
    <!--    {{registerRole}}-->

    <!--    @if (registerRole === Role.User) {-->
    <!--      <div>user</div>-->
    <!--    }-->

    @if (!params()) {
      <div>loading</div>
    } @else {

      <section class="brown__cat__background p-5 h-100">
        <form
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit(params())"
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

          <!--        <button-->
          <!--          (click)="router.navigate(['auth', 'password-reset'])"-->
          <!--          class="btn text-primary text-start mb-3 px-0"-->
          <!--          type="button">-->
          <!--          Nie pamiętasz hasła?-->
          <!--        </button>-->

          <button
            [disabled]="registration.isLoading()"
            class="btn btn-lg btn-dark mb-3 p-3"
            type="submit">
            Zarejestruj
          </button>

          @if (registerRole) {
            <button
              (click)="onSubmit2(registerRole)"
              class="btn btn-lg btn-dark mb-3 p-3"
              type="button">
              Register2
            </button>
          }

          @if (registerRole) {
            <button
              (click)="onSubmit3()"
              class="btn btn-lg btn-dark mb-3 p-3"
              type="button">
              Register3
            </button>
          }
<!--          {{ registerToken() }}-->

<!--          {{ registration2.value()?.data }}-->

          {{ authService.user() | json }}




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
  public functions = inject(FunctionsService)
  private fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  params = toSignal(this.route.params.pipe(
    map((params: Params) => {
      return params['role'];
    })
  ));

  register = signal<RegisterCredentials | undefined>(undefined);
  registration = rxResource({
    request: () => this.register(),
    loader: obj => this.authService.register(obj.request!),
  });

  // registration2 = rxResource({
  //   request: () => this.register(),
  //   loader: obj => this.authService.register(obj.request!),
  // });

  register2 = signal<RegisterCredentials | undefined>(undefined);
  //
  // registration2 = rxResource({
  //   request: () => this.register2(),
  //   loader: obj => this.functions.createUser(obj.request!),
  // });
  //
  // registerToken = computed(() => this.registration2.value()?.data as string);
  token = signal<string | undefined>(undefined)
  login = rxResource({
    request: () => this.token(),
    loader: obj => this.authService.login2(obj.request!)
  })

  registerForm = this.fb.nonNullable.group({
    email: ['grzegorzkolaty@gmail.com', [Validators.required, Validators.email]],
    displayName: ['Grzegorz Kolaty', Validators.required],
    password: ['Poszkole1', Validators.required],
  });

  constructor() {
    effect(() => {
      console.log(this.params())
    });
    effect(() => {
      console.log(this.registration.value())
    });
  }

  onSubmit(role: Role): void {
    const rawForm = this.registerForm.getRawValue();
    if (this.registerForm.valid) {
      const data = {...rawForm, role}
      this.register.set(data);
    }
  }

  onSubmit2(role: Role) {
    const rawForm = this.registerForm.getRawValue();
    if (this.registerForm.valid) {
      const user = this.authService.user();

        const data = {...rawForm, role}
        this.register2.set(data);
        console.log(this.register2())


    }
  }

  onSubmit3() {
    // this.token.set(this.registerToken())
  }


}
