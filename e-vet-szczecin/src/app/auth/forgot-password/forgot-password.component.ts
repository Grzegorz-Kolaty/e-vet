import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../shared/data-access/auth.service';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto my-5 col-lg-5 p-5 rounded glass shadow fw-semibold p-5">

      <h3 class="mb-3 text-center fw-bold">Zresetuj hasło</h3>

      <div class="mb-3">
        <label for="emailInput" class="form-label"> Email address </label>
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

      <div class="mb-3">
        @if (onSubmitResetPassword.error()) {
          <span class="text-danger">{{ onSubmitResetPassword.error() }}</span>
        } @else if (onSubmitResetPassword.status() === 4) {
          <span class="text-success">Wysłaliśmy dla Ciebie mail</span>
        } @else {
          <span class="invisible">Nothing</span>
        }
      </div>

      <button
        (click)="onSubmit()"
        [disabled]="onSubmitResetPassword.isLoading()"
        class="btn btn-lg btn-primary mb-3"
        type="button">
        Zatwierdź
      </button>

    </section>
  `,
  styles: ``
})
export default class ForgotPasswordComponent {
  authService = inject(AuthService);
  email = new FormControl('', [Validators.required, Validators.email]);

  userEmail = signal<string | undefined>(undefined);
  onSubmitResetPassword = rxResource({
    request: () =>  this.userEmail(),
    loader: obj => this.authService.resetPassword(obj.request)
  })

  onSubmit() {
    const emailToReset = this.email.getRawValue();
    if (!!emailToReset) {
    console.log(emailToReset)
    this.userEmail.set(emailToReset);
    }
  }
}
