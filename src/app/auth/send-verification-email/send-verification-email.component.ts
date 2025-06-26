import {ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, resource, signal} from '@angular/core';
import {AuthService} from "../../shared/data-access/auth.service";
import {User} from "firebase/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-send-email-verification',
  imports: [],
  template: `
    @if (isSending()) {
      <div class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Ładowanie...</span>
        </div>
      </div>
    } @else {
      <h3 class="mb-3 text-center fw-bold">Weryfikacja maila</h3>

      <h5 class="mb-3">
        Na adres mailowy został wysłany mail z kodem autoryzującym.
      </h5>

      <h4 class="mb-3">Nie dotarł?</h4>

      <button (click)="authService.logout()"
              type="button"
              class="btn btn-outline-dark mb-3 rounded-4 shadow-lg">
        Zaloguj się ponownie 😉
      </button>

      <br>

      @if (sendingError()) {
        <span class="text-danger">{{ sendingError() }}</span>
      }
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SendVerificationEmailComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  user = signal<User | null>(null)

  onVerificationEmailSend = resource({
    request: () => this.user(),
    loader: ({request}) => this.authService.initiateEmail(request!)
  })

  isSending = this.onVerificationEmailSend.isLoading;
  sendingError = this.onVerificationEmailSend.error;

  constructor() {
    effect(async () => {
      if (!this.authService.firebaseUser()) {
        await this.router.navigate(['auth'])
      } else {
        this.user.set(this.authService.firebaseUser())
      }
    })
  }
}
