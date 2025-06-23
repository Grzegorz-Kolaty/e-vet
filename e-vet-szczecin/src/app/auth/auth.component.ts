import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {NgClass} from "@angular/common";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";


@Component({
  selector: 'app-auth',
  imports: [NgClass, RouterOutlet],
  template: `
    <section [ngClass]="getBackgroundClass()" class="p-5 h-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-8 col-xl-6">
            <div class="p-5 rounded-5 glass shadow-lg fw-semibold">
              <router-outlet/>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    const queryParams = this.route.snapshot.queryParams;
    const mode = queryParams['mode'];
    const oobCode = queryParams['oobCode'];

    if (mode === 'verifyEmail' && oobCode) {
      this.router.navigate(['/auth/verify-email'], {queryParams: {oobCode}});
    } else if (mode === 'resetPassword' && oobCode) {
      this.router.navigate(['/auth/reset-password'], {queryParams: {oobCode}});
    }
  }

  getBackgroundClass(): string {
    const location = window.location.pathname;
    return location.includes('register') ? 'cat__background1' : 'cat__background2';
  }
}
