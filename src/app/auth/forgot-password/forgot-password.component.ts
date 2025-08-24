import {ChangeDetectionStrategy, Component, inject, resource, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../shared/data-access/auth.service';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 class="mb-4 text-center">
      Zresetuj hasło
    </h3>

    <form class="d-flex flex-column gap-3">
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

      <div class="mb-2">
        @if (onSubmitResetPassword.error()) {
          <span class="text-black">{{ onSubmitResetPassword.error() }}</span>
        }
        @if (onSubmitResetPassword.status() === 'resolved') {
          <span class="text-black">Na podany email wysłaliśmy mail z linkiem do resetu hasła.</span>
        }
      </div>

      <button
        (click)="onSubmit()"
        [disabled]="onSubmitResetPassword.isLoading()"
        class="btn btn-lg btn-warning rounded-5 mb-3 shadow-lg w-75 mx-auto"
        type="button">
        Resetuj
      </button>

      <button
        (click)="onDestroy()"
        class="btn btn-lg btn-warning rounded-5 mb-3 shadow-lg w-75 mx-auto"
        type="button">
        Destroy
      </button>

      <button
        (click)="onReload()"
        class="btn btn-lg btn-warning rounded-5 mb-3 shadow-lg w-75 mx-auto"
        type="button">
        Reload
      </button>

      <a class="btn bg-transparent text-decoration-none" [routerLink]="['/auth', 'login']">
        Znasz hasło?
        <b>Powróć do logowania</b>
      </a>

    </form>
  `,
  styles: ``
})
export default class ForgotPasswordComponent {
  public authService = inject(AuthService);
  protected email = new FormControl('', [Validators.required, Validators.email]);

  userEmail = signal<string | undefined>(undefined);
  onSubmitResetPassword = resource({
    loader: async () => {
      const email = this.userEmail();
      if (!email) {
        throw new Error('Brak adresu email');
      }
      return await this.authService.resetPassword(email);
    }
  })

  onSubmit() {
    const emailToReset = this.email.getRawValue();
    if (this.email.valid && emailToReset) {
      console.log(emailToReset)
      this.userEmail.set(emailToReset);
    }
  }

  onDestroy() {
    this.onSubmitResetPassword.destroy()
  }

  onReload() {
    this.onSubmitResetPassword.reload()
  }
}
