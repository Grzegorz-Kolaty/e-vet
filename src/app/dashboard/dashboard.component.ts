import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {AuthService} from "../shared/data-access/auth.service";
import {Router} from "@angular/router";
import {SendVerificationEmailComponent} from "../auth/send-verification-email/ui/send-verification-email.component";


@Component({
  selector: 'app-dashboard',
  imports: [
    SendVerificationEmailComponent
  ],
  template: `
    <section class="container-fluid h-100 p-5">
      @if (!authService.firebaseUser()?.emailVerified) {
        <app-send-email-verification />
      } @else {
        <p>Witaj</p>
      }
    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DashboardComponent {
  public authService = inject(AuthService)
  private router = inject(Router)

  user = this.authService.firebaseUser

  constructor() {
    effect(() => {
      if (!this.authService.firebaseUser()) {
        this.router.navigate(['auth'])
      }
    })
  }


}
