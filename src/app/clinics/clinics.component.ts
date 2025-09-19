import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {Role} from "../shared/interfaces/user.interface";
import {Router} from "@angular/router";
import {AuthService} from "../shared/data-access/auth.service";
import {SearchClinicComponent} from "./features/search-clinic/search-clinic.component";
import {MapComponent} from "./features/map/map.component";


@Component({
  selector: 'app-clinics',
  imports: [
    SearchClinicComponent,
    MapComponent
  ],
  template: `
    <section class="row h-100">
      <div class="col-4">
        <app-search-clinic></app-search-clinic>
      </div>

<!--      <div class="col-8 h-100">-->
<!--        <app-map></app-map>-->
<!--      </div>-->

    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ClinicsComponent {
  protected readonly Role = Role;
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  user = this.authService.user

  constructor() {
    effect(() => {
      const user = this.user()
      if (!user) {
        this.router.navigate(['auth'])
      }
    })

  }

}
