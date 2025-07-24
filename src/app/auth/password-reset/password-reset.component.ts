import {ChangeDetectionStrategy, Component, computed, inject, input, resource, signal} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from '../../shared/data-access/auth.service';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";


@Component({
  selector: 'app-password-reset',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <h3 class="mb-4 text-center">
      Wprowadź nowe hasło
    </h3>

    <form class="d-flex flex-column gap-3">
      <div class="form-floating mb-2">
        <input class="form-control form-control-lg shadow-lg"
               type="password"
               minlength="6"
               maxlength="24"
               #newPasswordInput
               placeholder="Nowe hasło"
               id="newPasswordInput"
               aria-describedby="newPasswordInput"
               required/>
        <label for="newPasswordInput">
          Nowe hasło
        </label>
      </div>

      <button class="btn btn-lg btn-warning rounded-5 mb-3 shadow-lg w-75 mx-auto"
              type="button"
              (click)="newPassword.set(newPasswordInput.value)"
              [disabled]="onPasswordReset.isLoading()">
        @if (onPasswordReset.isLoading()) {
          <div class="d-flex justify-content-center my-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Ładowanie...</span>
            </div>
          </div>
        } @else {

        Zatwierdź nowe hasło!
        }
      </button>



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

      <a class="btn bg-transparent text-decoration-none" [routerLink]="['/auth', 'login']">
        Znasz hasło?
        <b>Powróć do logowania</b>
      </a>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PasswordResetComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  protected email = new FormControl('', [Validators.required, Validators.email]);

  oobCode = signal<string | undefined>(undefined);
  newPassword = signal<string | undefined>(undefined)
  onPasswordReset = resource({
    request: () => this.newPassword(),
    loader: ({request}) => this.authService.confirmPasswordReset(this.oobCode()!, request)
  })

  onErrorPasswordReset = computed(() => this.onPasswordReset.error());
  onSuccessPasswordReset = computed(() => this.onPasswordReset.status() === 4)

  constructor() {
    const queryParams = this.route.snapshot.queryParams
    const oobCode = queryParams['oobCode']
    this.oobCode.set(oobCode)
  }
}
