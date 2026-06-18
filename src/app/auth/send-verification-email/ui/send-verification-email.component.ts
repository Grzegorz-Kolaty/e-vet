import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import { AuthService } from "../../../shared/data-access/auth.service";
import { LoaderComponent } from "../../../shared/ui/loader/loader.component";

@Component({
  selector: 'app-send-email-verification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoaderComponent],
  template: `
    @if (loading()) {
      <app-loader />
    }

    @if (success()) {
      <div class="bg-success text-center rounded-4 p-3 mb-4">
        <span class="text-white">Email wysłano! Sprawdź skrzynkę</span>
      </div>
    }

    @if (error()) {
      <div class="bg-danger text-center rounded-4 p-3 mb-4">
        <span class="text-white">
          Wystąpił błąd, spróbuj ponownie
        </span>
      </div>
    }

    <div class="d-flex flex-column gap-2 align-items-center">
      <h4 class="text-shadow">
        <u>Twój adres email nie jest zweryfikowany</u>
      </h4>

      <h5>Nie dotarł? Ponów maila weryfikacyjnego</h5>

      <button
        class="btn btn-lg btn-outline-info rounded-4"
        (click)="sendEmail()"
        [disabled]="loading()"
        type="button"
      >
        Wyślij ponownie 📩
      </button>
    </div>
  `
})
export default class SendEmailVerificationComponent {
  private authService = inject(AuthService);

  loading = signal(false);
  success = signal(false);
  error = signal(false);

  async sendEmail() {
    const user = this.authService.user();

    if (!user) return;

    this.loading.set(true);
    this.success.set(false);
    this.error.set(false);

    try {
      await this.authService.initiateEmail(user);
      this.success.set(true);
    } catch (e) {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
