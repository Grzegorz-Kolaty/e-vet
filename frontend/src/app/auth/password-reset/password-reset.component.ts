import {ChangeDetectionStrategy, Component, effect, inject, resource, signal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../shared/data-access/auth.service';

interface PasswordResetPayload {
  token: string;
  password: string;
}

@Component({
  selector: 'app-password-reset',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
  ],
  template: `
    <h3 class="mb-4 text-center">
      Wprowadź nowe hasło
    </h3>

    <form class="d-flex flex-column gap-3" (ngSubmit)="onSubmit()">
      @if (!token()) {
        <div class="bg-danger text-center rounded-4 pulse-box p-3 mb-3">
  <span class="text-white">
    Brakuje tokena resetu hasła. Link jest nieprawidłowy.
  </span>
        </div>
      }

      <div class="form-floating mb-2">
        <input
          class="form-control form-control-lg shadow-lg"
          type="password"
          [formControl]="password"
          placeholder="Nowe hasło"
          id="newPasswordInput"
          required
        />
        <label for="newPasswordInput">
          Nowe hasło
        </label>
      </div>

      <div class="form-floating mb-2">
        <input
          class="form-control form-control-lg shadow-lg"
          type="password"
          [formControl]="confirmPassword"
          placeholder="Powtórz nowe hasło"
          id="confirmPasswordInput"
          required
        />
        <label for="confirmPasswordInput">
          Powtórz nowe hasło
        </label>
      </div>

      @if (password.invalid && password.touched) {
        <div class="bg-danger text-center rounded-4 pulse-box p-3 mb-2">
  <span class="text-white">
    Hasło musi mieć minimum 8 znaków.
  </span>
        </div>
      }

      @if (passwordsMismatch()) {
        <div class="bg-danger text-center rounded-4 pulse-box p-3 mb-2">
  <span class="text-white">
    Hasła nie są takie same.
  </span>
        </div>
      }

      @if (onPasswordReset.status() === 'error') {
        <div class="bg-danger text-center rounded-4 pulse-box p-3 mb-2">
  <span class="text-white">
    Link jest nieprawidłowy, wygasł albo został już użyty.
  </span>
        </div>
      }

      @if (onPasswordReset.status() === 'resolved') {
        <div class="bg-success text-center rounded-4 pulse-box p-3 mb-2">
  <span class="text-white">
    Hasło zostało zmienione. Za chwilę przejdziesz do logowania.
  </span>
        </div>
      }

      <button
        class="btn btn-lg btn-warning rounded-5 mb-3 shadow-lg w-75 mx-auto"
        type="submit"
        [disabled]="!token() || password.invalid || confirmPassword.invalid || passwordsMismatch() || onPasswordReset.isLoading()">
        @if (onPasswordReset.isLoading()) {
          <span class="spinner-border spinner-border-sm me-2"></span>
          Zmienianie hasła...
        } @else {
          Zatwierdź nowe hasło
        }
      </button>

      <a class="btn bg-transparent text-decoration-none" [routerLink]="['/auth', 'login']">
        Znasz hasło?
        <b>Powróć do logowania</b>
      </a>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PasswordResetComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly token = signal<string | undefined>(
    this.route.snapshot.queryParamMap.get('token') ?? undefined
  );

  protected readonly password = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8), Validators.maxLength(128)],
  });

  protected readonly confirmPassword = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8), Validators.maxLength(128)],
  });

  private readonly resetPayload = signal<PasswordResetPayload | undefined>(undefined);

  protected readonly onPasswordReset = resource({
    params: this.resetPayload,
    loader: async (params) => {
      if (!params) {
        throw new Error('Brak tokena lub hasła');
      }

      return await this.authService.resetPassword(params.params.token, params.params.password);
    },
  });

  constructor() {
    effect(() => {
      if (this.onPasswordReset.status() !== 'resolved') {
        return;
      }

      setTimeout(() => {
        this.router.navigateByUrl('/auth/login');
      }, 1500);
    });
  }

  protected passwordsMismatch() {
    return (
      this.password.touched &&
      this.confirmPassword.touched &&
      this.password.getRawValue() !== this.confirmPassword.getRawValue()
    );
  }

  protected onSubmit() {
    this.password.markAsTouched();
    this.confirmPassword.markAsTouched();

    const token = this.token();
    const password = this.password.getRawValue();

    if (!token || this.password.invalid || this.confirmPassword.invalid || this.passwordsMismatch()) {
      return;
    }

    this.resetPayload.set({
      token,
      password,
    });
  }
}
