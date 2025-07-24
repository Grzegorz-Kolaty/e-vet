import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

// component to redirect firebase actions
@Component({
  selector: 'app-actions',
  imports: [],
  template: ``,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ActionsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    const queryParams = this.route.snapshot.queryParams;
    const mode = queryParams['mode'];
    const oobCode = queryParams['oobCode'];

    if (mode === 'verifyEmail' && oobCode) {
      this.router.navigate(['/auth/verify-email'], {
        queryParams: {mode, oobCode},
        replaceUrl: true
      });
    }
    if (mode === 'resetPassword' && oobCode) {
      this.router.navigate(['/auth/reset-password'], {
        queryParams: {mode, oobCode},
        replaceUrl: true
      });
    }

    if (!mode) {
      this.router.navigate(['auth'])
    }
    if (!oobCode) {
      this.router.navigate(['auth'])
    }
  }


}
