import {ChangeDetectionStrategy, Component, inject, resource, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../shared/data-access/auth.service';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="d-flex flex-column gap-3 fw-semibold">

      <h3 class="mb-3 text-center fw-bold">Zresetuj hasło</h3>

      <div class="mb-2">
        <label for="emailInput" class="form-label">Email</label>
        <input
          [formControl]="email"
          placeholder="email"
          type="email"
          class="form-control form-control-lg shadow"
          id="emailInput"
          aria-describedby="emailHelp"
          required
        />
      </div>

      <div class="mb-2">
        @if (onSubmitResetPassword.error()) {
          <span class="text-black">{{ onSubmitResetPassword.error() }}</span>
        }
        @if (onSubmitResetPassword.status() === 4) {
          <span class="text-black">Na podany email wysłaliśmy mail z linkiem do resetu hasła.</span>
        }
      </div>

      <button
        (click)="onSubmit()"
        [disabled]="onSubmitResetPassword.isLoading()"
        class="btn btn-lg btn-warning rounded-4 shadow-lg mb-3"
        type="button">
        Wyślij mail resetujący
      </button>

      <a class="btn bg-transparent text-decoration-none" [routerLink]="['/auth', 'login']">
        Znasz hasło? <b>Powróć do logowania</b>
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
    request: () => this.userEmail(),
    loader: ({request}) => this.authService.resetPassword(request)
  })

  onSubmit() {
    const emailToReset = this.email.getRawValue();
    if (!!emailToReset) {
      console.log(emailToReset)
      this.userEmail.set(emailToReset);
    }
  }
}
