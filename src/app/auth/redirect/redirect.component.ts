import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RedirectComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    console.log('RedirectComponent constructor proc')
    const queryParams = this.route.snapshot.queryParams;
    const mode = queryParams['mode'];
    const oobCode = queryParams['oobCode'];

    if (mode === 'verifyEmail' && oobCode) {
      this.router.navigate(['/auth/verify-email'], {queryParams: {oobCode}});
    } else if (mode === 'resetPassword' && oobCode) {
      this.router.navigate(['/auth/reset-password'], {queryParams: {oobCode}});
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
