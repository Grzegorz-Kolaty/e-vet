import {ChangeDetectionStrategy, Component, effect, inject, resource, signal} from '@angular/core';
import {AuthService} from '../../shared/data-access/auth.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-email-verification',
  template: `
    <h3 class="mb-4 text-center">
      Weryfikacja email
    </h3>

    @if (!token()) {
      <div class="bg-danger text-center rounded-4 pulse-box p-3 mb-4">
        <span class="text-white">
          Brakuje tokena weryfikacyjnego.
        </span>
      </div>
    }

    @if (emailVerification.status() === 'loading') {
      <div class="d-flex justify-content-center mb-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Ładowanie...</span>
        </div>
      </div>
    }

    @if (emailVerification.status() === 'error') {
      <div class="bg-danger text-center rounded-4 pulse-box p-3 mb-4">
        <span class="text-white">
          Link weryfikacyjny jest nieprawidłowy, wygasł albo został już użyty.
        </span>
      </div>
    }

    @if (emailVerification.status() === 'resolved') {
      <div class="bg-success text-center rounded-4 pulse-box p-3 mb-4">
        <span class="text-white">
          Email został potwierdzony!
        </span>
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EmailVerificationComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly token = signal<string | undefined>(
    this.route.snapshot.queryParamMap.get('token') ?? undefined
  );

  readonly emailVerification = resource({
    params: this.token,
    loader: async ({params}) => {
      if (!params) {
        throw new Error('Missing verification token');
      }
      return await this.authService.verifyEmail(params);
    },
  });

  constructor() {
    effect(() => {
      if (this.emailVerification.status() !== 'resolved') {
        return;
      }

      if (!this.authService.initialized()) {
        return;
      }

      setTimeout(async () => {
        if (!this.authService.user()) {
          await this.router.navigateByUrl('/auth/login');
          return;
        }

        const refreshedUser = await this.authService.refreshCurrentUser();

        if (refreshedUser) {
          await this.router.navigateByUrl('/dashboard');
          return;
        }

        await this.router.navigateByUrl('/auth/login');
      }, 1500);
    });
  }
}
