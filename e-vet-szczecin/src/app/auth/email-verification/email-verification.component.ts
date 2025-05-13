import {
  Component, computed, effect, inject, input, resource, signal
} from '@angular/core';
import {AuthService} from '../../shared/data-access/auth.service';
import {User} from "firebase/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-email-verification',
  template: `
    @if (!oobCode()) {
      <h3 class="mb-3 text-center fw-bold">Weryfikacja maila</h3>
      <h5 class="mb-3">
        Na adres mailowy został wysłany mail z kodem autoryzującym.
      </h5>
      <h4 class="mb-3">Nie dotarł?</h4>

      <button (click)="user.set(authService.user()!)"
              type="button"
              [disabled]="onEmailResend.status() === 4"
              class="btn btn-outline-dark mb-3 rounded-4 shadow-lg">
        Ponów email weryfikacyjny
      </button>
      <br>

      @if (isSending()) {
        <div class="d-flex justify-content-center mb-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Ładowanie...</span>
          </div>
        </div>
      }

      @if (isSendingSuccessful()) {
        <span class="text-success mb-3">Wysłano nowy mail weryfikacyjny!</span>
      }
      @if (sendingError()) {
        <span class="text-danger">{{ sendingError() }}</span>
      }

    } @else {
      <h3 class="mb-3">Kod weryfikacyjny</h3>
      <input type="text"
             disabled
             [value]="oobCode()"
             #codeInput
             class="form-control mb-3"/>

      @if (isVerifying()) {
        <div class="d-flex justify-content-center mb-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Ładowanie...</span>
          </div>
        </div>
      }

      <div class="mb-3">
        @if (verificationError()) {
          <span class="text-danger">{{ verificationError() }}</span>
        } @else if (isVerificationSuccessful()) {
          <span class="text-success">Weryfikacja udała się!</span>
        }
      </div>
    }

  `,
  styles: ``,
})
export class EmailVerificationComponent {
  public authService = inject(AuthService);
  public router = inject(Router);

  user = signal<User | undefined>(undefined)
  oobCode = input<string | undefined>(undefined);

  onEmailResend = resource({
    request: () => this.user(),
    loader: ({request}) => this.authService.initiateEmail(request!)
  })

  isSending = this.onEmailResend.isLoading;
  sendingError = this.onEmailResend.error;
  isSendingSuccessful = computed(() => this.onEmailResend.status() === 4)

  onEmailVerification = resource({
    request: () => this.oobCode(),
    loader: ({request}) => this.authService.verifyEmail(request)
  })

  isVerifying = this.onEmailVerification.isLoading;
  verificationError = this.onEmailVerification.error;
  isVerificationSuccessful = computed(() => this.onEmailVerification.status() === 4);

  constructor() {
    effect(() => {
      if (this.isVerificationSuccessful() || !!this.authService.user()?.emailVerified) {
        this.router.navigate(['dashboard'])
      }
    });
  }
}
