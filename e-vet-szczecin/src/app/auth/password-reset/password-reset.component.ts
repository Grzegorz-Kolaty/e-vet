import {ChangeDetectionStrategy, Component, computed, effect, inject, input, signal} from '@angular/core';
import {AuthService} from '../../shared/data-access/auth.service';
import {Router} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-password-reset',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 class="mb-3">Wprowadź nowe hasło</h4>

    <input type="password" minlength="6" maxlength="24" #codeInput class="form-control mb-3"/>

    <button type="button" (click)="newPassword.set(codeInput.value)" class="btn btn-lg btn-primary mb-3">
      Resetuj hasło!
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
        <br>
        <button class="btn btn-outline-primary my-3" type="button" (click)="router.navigate(['auth', 'login'])">
          Przejdź do logowania
        </button>
      } @else if (onSuccessPasswordReset()) {
        <span class="text-success">Hasło zmienione!</span>
        <br>
        <button class="btn btn-outline-primary my-3" type="button" (click)="router.navigate(['auth', 'login'])">
          Przejdź do logowania
        </button>
      } @else {
        <span class="invisible">Nothing</span>
      }

    </div>`,
  styles: ``,
})
export class PasswordResetComponent {
  authService = inject(AuthService);
  router = inject(Router);
  oobCode = input.required<string>();

  newPassword = signal<string | undefined>(undefined)

  onPasswordReset = rxResource({
    request: () => this.newPassword(),
    loader: p => this.authService.confirmPasswordReset(this.oobCode(), p.request)
  })

  onErrorPasswordReset = computed(() => this.onPasswordReset.error());
  onSuccessPasswordReset = computed(() => this.onPasswordReset.status() === 4)

  constructor() {
    effect(() => {
      if (this.onSuccessPasswordReset()) {
        this.authService.refreshToken()
      }
    });
    effect(() => {
      if (this.authService.verifiedEmailedUser()) {
        this.router.navigate(['auth', 'profile']);
      }
    });
  }
}
