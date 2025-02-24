import {
  ChangeDetectionStrategy,
  Component, computed, effect,
  inject,
  input,
} from '@angular/core';
import {AuthService} from '../../shared/data-access/auth.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';


@Component({
  selector: 'app-email-verification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 class="mb-3">Kod weryfikacyjny</h4>

    <input type="text" disabled [value]="oobCode()" #codeInput class="form-control mb-3" />

    @if (onEmailVerification.isLoading()) {
      <div class="d-flex justify-content-center my-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Ładowanie...</span>
        </div>
      </div>
    }

    <div class="mb-3">
      @if (onErrorVerification()) {
        <span
          class="text-danger">Kod wygasł lub został już użyty - aby wygenerować nowy zaloguj się i ponów email.</span>
        <br>
        <span class="text-muted">{{ onErrorVerification() }}</span>
        <br>
        <button class="btn btn-outline-primary my-3" type="button" (click)="router.navigate(['auth', 'login'])">
          Przejdź do logowania
        </button>
      } @else if (onSuccessVerification()) {
        <span class="text-success">Weryfikacja udała się!</span>
      } @else {
        <span class="invisible">Nothing</span>
      }

    </div>
  `,
  styles: ``,
})
export class EmailVerificationComponent {
  authService = inject(AuthService);
  router = inject(Router);
  oobCode = input.required<string>();

  onEmailVerification = rxResource({
    loader: () => this.authService.verifyEmail(this.oobCode())
  })

  onErrorVerification = computed(() => this.onEmailVerification.error());
  onSuccessVerification = computed(() => this.onEmailVerification.status() === 4)

  constructor() {
    effect(() => {
      if (this.onSuccessVerification()) {
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
