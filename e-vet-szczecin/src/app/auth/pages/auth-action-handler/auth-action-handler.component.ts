import {ChangeDetectionStrategy, Component, effect, inject, ResourceStatus} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {EmailVerificationComponent} from '../../email-verification/email-verification.component';
import {PasswordResetComponent} from '../../password-reset/password-reset.component';


@Component({
  selector: 'app-auth-action-handler',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto my-5 col-lg-6 p-5 rounded glass shadow fw-semibold p-5">

      @switch (queryParams().mode) {
        @case ('resetPassword') {
          <app-password-reset [oobCode]="queryParams().oobCode"></app-password-reset>
        }
        @case ('verifyEmail') {
          <app-email-verification [oobCode]="queryParams().oobCode"></app-email-verification>
        }
        @default {
          <p>Nieznany tryb.</p>
        }
      }

    </section>
  `,
  imports: [EmailVerificationComponent, PasswordResetComponent],
  styles: ``
})
export class AuthActionHandlerComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);

  queryParams = toSignal(this.route.queryParams.pipe(
      map(params => ({
        mode: params['mode'],
        oobCode: params['oobCode'],
      }))
    ),
    {initialValue: {mode: null, oobCode: null}}
  )

}
