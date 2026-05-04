import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject
} from '@angular/core';
import {Role} from "../shared/interfaces/user.interface";
import {Router} from "@angular/router";
import {AuthService} from "../shared/data-access/auth.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {provideNgxMask} from "ngx-mask";
import CreateClinicComponent from "./features/create-clinic/create-clinic.component";
import {VetClinicComponent} from "./vet-clinic/vet-clinic.component";
import {VetService} from "../shared/data-access/vet.service";


@Component({
  selector: 'app-clinics',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CreateClinicComponent,
    VetClinicComponent,
  ],
  providers: [provideNgxMask()],
  template: `
    <main class="map-container h-100 position-relative">
      <div class="w-100 h-100 position-absolute top-0 start-0 z-1">

        @if (state().isVet && !state().clinicId) {
          <app-create-clinic />
        }

        @if (state().isVet && state().clinicId) {
          <app-vet-clinic [clinicVets]="vets()" [clinic]="clinic()"/>
        }

      </div>
    </main>
  `,
  styles: `
    .map-container {
      height: calc(100vh - 98px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ClinicsComponent {
  private authService = inject(AuthService);
  private vetService = inject(VetService);
  private router = inject(Router);

  user = this.authService.user;
  vet = this.vetService.vet;
  clinic = this.vetService.clinic;
  vets = this.vetService.vets;

  state = computed(() => {
    const user = this.user();
    const vet = this.vet();

    return {
      isLogged: !!user,
      isVet: vet?.role === Role.Vet,
      clinicId: vet?.clinicId,
    };
  });



  constructor() {
    effect(() => {
      const user = this.user();

      if (!user) {
        this.router.navigate(['auth']);
        return;
      }

      // 🔥 INIT ONLY (ważne!)
      if (user?.role === Role.Vet) {
        this.vetService.init(user.user_id);
      }
    });

    effect(() => {
      console.log(this.state());
    })

    effect(() => {
      const clinicId = this.state().clinicId;
      if (clinicId) {
        this.vetService.getVetsByClinic(clinicId, )
      }
    });
  }
}
