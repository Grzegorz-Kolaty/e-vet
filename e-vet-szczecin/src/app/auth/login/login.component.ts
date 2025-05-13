import {Component, inject, resource, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../shared/data-access/auth.service';
import {Credentials} from '../../shared/interfaces/user.interface';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
          class="d-flex flex-column gap-3 fw-semibold mb-3"
          #form="ngForm">

      <h3 class="mb-3 text-center fw-bold">Zaloguj się</h3>

      <div class="mb-3">
        <label for="emailInput" class="form-label">Email</label>
        <input formControlName="email"
               placeholder="email"
               type="email"
               class="form-control form-control-lg"
               id="emailInput"
               aria-describedby="emailHelp"
               required/>
      </div>

      <div class="mb-3">
        <label for="passwordInput" class="form-label">Hasło</label>
        <input formControlName="password"
               type="password"
               class="form-control form-control-lg"
               id="passwordInput"
               placeholder="password"/>
      </div>

      <button class="btn btn-lg btn-dark rounded-4 shadow-lg mb-3"
              type="submit"
              [disabled]="logger.isLoading()">
        Loguj
      </button>

      @if (logger.error() && form.submitted) {
        <span class="text-danger">{{ logger.error() }}</span>
      } @else {
        <span class="visually-hidden">Nothing</span>
      }

    </form>
  `,
})
export class LoginComponent {
  public readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  login = signal<Credentials | undefined>(undefined);
  logger = resource({
    request: () => this.login(),
    loader: ({request}) => this.authService.login(request!),
  });

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    const form = this.loginForm.getRawValue();
    if (this.loginForm.valid) {
      this.login.set(form);
    }
  }
}
