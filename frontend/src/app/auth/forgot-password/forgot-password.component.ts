import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/data-access/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 class="mb-4 text-center">
      Zresetuj hasło
    </h3>

    <form class="d-flex flex-column gap-3" (ngSubmit)="onSubmit()">
      <div class="form-floating mb-2">
        <input
          [formControl]="email"
          placeholder="email"
          type="email"
          class="form-control form-control-lg shadow-lg"
          id="emailInput"
          aria-describedby="emailHelp"
          required
        />
        <label for="emailInput">
          Email
        </label>
      </div>

      @if (email.invalid && email.touched) {
        <div class="bg-danger text-center rounded-4 pulse-box p-3 mb-2">
          <span class="text-white">
            Podaj poprawny adres email.
          </span>
        </div>
      }

      @if (forgotPasswordResource.status() === 'error') {
        <div class="bg-danger text-center rounded-4 pulse-box p-3 mb-2">
          <span class="text-white">
            Nie udało się wysłać maila. Spróbuj ponownie później.
          </span>
        </div>
      }

      @if (forgotPasswordResource.status() === 'resolved') {
        <div class="bg-success text-center rounded-4 pulse-box p-3 mb-2">
          <span class="text-white">
            Jeśli konto istnieje, wysłaliśmy mail z linkiem do resetu hasła.
          </span>
        </div>
      }

      <button
        [disabled]="email.invalid || forgotPasswordResource.isLoading()"
        class="btn btn-lg btn-warning rounded-5 mb-3 shadow-lg w-75 mx-auto"
        type="submit">
        @if (forgotPasswordResource.isLoading()) {
          Wysyłanie...
        } @else {
          Resetuj hasło
        }
      </button>

      <a class="btn bg-transparent text-decoration-none" [routerLink]="['/auth', 'login']">
        Znasz hasło?
        <b>Powróć do logowania</b>
      </a>
    </form>
  `,
  styles: ``,
})
export default class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);

  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  private readonly emailToReset = signal<string | undefined>(undefined);

  protected readonly forgotPasswordResource = resource({
    params: this.emailToReset,
    loader: async (params) => {
      if (!params) {
        throw new Error('Brak adresu email');
      }

      return await this.authService.forgotPassword(params.params);
    },
  });

  protected onSubmit() {
    this.email.markAsTouched();

    if (this.email.invalid) {
      return;
    }

    const email = this.email.getRawValue().trim().toLowerCase();

    if (!email) {
      return;
    }

    this.emailToReset.set(email);
  }
}
