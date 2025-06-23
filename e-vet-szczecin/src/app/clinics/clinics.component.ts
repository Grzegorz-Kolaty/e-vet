import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {Role} from "../shared/interfaces/user.interface";
import {ActivatedRoute, Router} from "@angular/router";
import VetClinicComponent from "./vet-clinic/vet-clinic.component";
import UserBrowseClinicsComponent from "./user-browse-clinics/user-browse-clinics.component";
import {AuthService} from "../shared/data-access/auth.service";


@Component({
  selector: 'app-clinics',
  imports: [
    VetClinicComponent,
    UserBrowseClinicsComponent
  ],
  template: `
    <section class="p-5 h-100">
      {{ viewMode() }}
      @if (viewMode() === Role.User) {
        @defer {
          <app-user-browse-clinics/>
        } @loading (minimum 100) {
          <h3>Loading</h3>
        }
      }

      @if (viewMode() === Role.Vet) {
        @if (clinicId()) {
          <app-vet-clinic/>
        } @else {
          <p>clinic neds to be crtd</p>
        }
      }

    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ClinicsComponent {
  private authService = inject(AuthService)
  private router = inject(Router)
  protected readonly viewMode = signal<Role | null>(null)
  protected readonly clinicId = signal<string | null>(null)
  protected readonly Role = Role;
  private readonly route = inject(ActivatedRoute)

  constructor() {
    this.viewMode.set(this.route.snapshot.data['user']['role'])
    this.clinicId.set(this.route.snapshot.data['user']['clinicId'])


    effect(() => {
      if (!this.authService.firebaseUser()) {
        this.router.navigate(['auth'])
      }
    })

  }
}
