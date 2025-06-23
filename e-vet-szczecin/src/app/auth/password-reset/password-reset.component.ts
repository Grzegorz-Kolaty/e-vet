import {ChangeDetectionStrategy, Component, computed, inject, input, resource, signal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from '../../shared/data-access/auth.service';


@Component({
  selector: 'app-password-reset',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    @if (oobCode()) {
      <h4 class="mb-3">Wprowadź nowe hasło</h4>

      <input type="password"
             minlength="6"
             maxlength="24"
             #codeInput
             class="form-control mb-3"/>

      <button type="button" (click)="newPassword.set(codeInput.value)" class="btn btn-lg btn-primary mb-3">
        Zatwierdź nowe hasło!
      </button>

      @if (onPasswordReset.isLoading()) {
        <div class="d-flex justify-content-center my-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Ładowanie...</span>
          </div>
        </div>
      }

      <div class="mb-3">
        @if (onErrorPasswordReset()) {
          <span class="text-danger">
          Wystapił błąd podczas zmiany hasła - spróbuj ponownie
        </span>
          <br>
          <span class="text-muted">{{ onErrorPasswordReset() }}</span>
        } @else if (onSuccessPasswordReset()) {
          <span class="text-success">Hasło zmienione!</span>
        } @else {
          <span class="invisible">Nothing</span>
        }

      </div>

    } @else {
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

        <div class="mb-2 fs-5">
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
          class="btn btn-lg btn-warning rounded-4 shadow-lg"
          type="button">
          Wyślij mail resetujący
        </button>

      </form>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PasswordResetComponent {
  public authService = inject(AuthService);
  protected email = new FormControl('', [Validators.required, Validators.email]);

  oobCode = input.required<string>();

  userEmail = signal<string | undefined>(undefined);
  onSubmitResetPassword = resource({
    request: () => this.userEmail(),
    loader: ({request}) => this.authService.resetPassword(request)
  })

  newPassword = signal<string | undefined>(undefined)
  onPasswordReset = resource({
    request: () => this.newPassword(),
    loader: ({request}) => this.authService.confirmPasswordReset(this.oobCode(), request)
  })

  onErrorPasswordReset = computed(() => this.onPasswordReset.error());
  onSuccessPasswordReset = computed(() => this.onPasswordReset.status() === 4)


  onSubmit() {
    const emailToReset = this.email.getRawValue();
    if (!!emailToReset) {
      console.log(emailToReset)
      this.userEmail.set(emailToReset);
    }
  }
}
