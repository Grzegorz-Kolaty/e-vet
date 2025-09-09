import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {Role} from "../shared/interfaces/user.interface";
import {Router} from "@angular/router";
import {AuthService} from "../shared/data-access/auth.service";
import CreateClinicComponent from "./features/create-clinic/create-clinic.component";
import BrowseClinicsComponent from "./user-browse-clinics/browse-clinics.component";
import {VetClinicComponent} from "./vet-clinic/vet-clinic.component";
import {MapComponent} from "./features/map/map.component";


@Component({
  selector: 'app-clinics',
  imports: [
    CreateClinicComponent,
    BrowseClinicsComponent,
    VetClinicComponent,
    MapComponent
  ],
  template: `
    <section class="h-100">
      @if (user()?.role === Role.User) {
        <app-browse-clinics/>
      }

      @if (user()?.role === Role.Vet) {
        @if (user()?.clinicId) {
          <app-vet-clinic [clinicId]="user()!.clinicId"/>
        } @else {
<!--          <app-create-clinic/>-->
          <app-map>

          </app-map>
        }
      }
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
