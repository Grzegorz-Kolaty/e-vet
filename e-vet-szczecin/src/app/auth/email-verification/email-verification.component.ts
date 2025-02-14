import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../shared/data-access/auth.service';

@Component({
  selector: 'app-email-verification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div>
      <p>Weryfikacja e-maila</p>
      <button
        (click)="authService.initiateEmail()"
        type="button"
        class="btn btn-outline-secondary">
        Wyślij mail weryfikacyjny
      </button>
      <input type="text" #codeInput class="form-control" />
      <button
        (click)="authService.applyEmailVerificationCode(codeInput.value)"
        type="button"
        class="btn btn-outline-secondary">
        Zweryfikuj kod
      </button>
    </div>
  `,
  styles: ``,
})
export default class EmailVerificationComponent {
  authService = inject(AuthService);
}
