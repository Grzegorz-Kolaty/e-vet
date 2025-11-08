import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {AuthService} from "../shared/data-access/auth.service";
import {Router} from "@angular/router";
import {SendVerificationEmailComponent} from "../auth/send-verification-email/ui/send-verification-email.component";
import {Role} from "../shared/interfaces/user.interface";
import {VetComponent} from "./vet/vet.component";
import {LoaderComponent} from "../shared/ui/loader/loader.component";


@Component({
  selector: 'app-dashboard',
  imports: [
    SendVerificationEmailComponent,
    VetComponent,
    LoaderComponent
  ],
  template: `
    @let userProfile = authService.user();
    <section class="container-fluid h-100 p-5">
      @defer (when !!userProfile) {
        @if (!userProfile?.email_verified) {
          <app-send-email-verification/>
        } @else {
          @if (userProfile?.role === Role.Vet) {
            <app-vet />
          }
        }
      } @loading (minimum 50) {
        <app-loader />
      }
    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DashboardComponent {
  protected readonly Role = Role;
  public authService = inject(AuthService)
  private router = inject(Router)

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['auth'])
      }
    })
  }


}
