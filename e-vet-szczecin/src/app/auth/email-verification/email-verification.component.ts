import {ChangeDetectionStrategy, Component, computed, effect, inject, resource, signal} from '@angular/core';
import {AuthService} from '../../shared/data-access/auth.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-email-verification',
  template: `
    <h1 class="mb-4 text-center fw-bolder">Weryfikacja email</h1>

    @if (isVerifying()) {
      <div class="d-flex justify-content-center mb-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Ładowanie...</span>
        </div>
      </div>
    }

    @if (verificationError()) {
      <div class="bg-danger text-danger text-center rounded-4 pulse-box p-3 mb-4">
        <span class="text-white">Wystąpił błąd z weryfikacją email</span>
      </div>
    }

    @if (isVerificationSuccessful()) {
      <div class="bg-success text-center text-success rounded-4 pulse-box p-3 mb-4">
        <span class="text-white">Weryfikacja udała się!</span>
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EmailVerificationComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);


  oobCode = signal<string | undefined>(undefined);
  onEmailVerification = resource({
    request: () => this.oobCode(),
    loader: ({request}) => this.authService.verifyEmail(request)
  })

  isVerifying = computed(() => this.onEmailVerification.isLoading());
  verificationError = computed(() => !!this.onEmailVerification.error());
  isVerificationSuccessful = computed(() => this.onEmailVerification.status() === 4);

  constructor() {
    const queryParams = this.route.snapshot.queryParams;
    const oobCode = queryParams['oobCode'];
    this.oobCode.set(oobCode)
  }

}
