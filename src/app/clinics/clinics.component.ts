import {ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {Role} from "../shared/interfaces/user.interface";
import {Router} from "@angular/router";
import {AuthService} from "../shared/data-access/auth.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {provideNgxMask} from "ngx-mask";
import CreateClinicComponent from "./features/create-clinic/create-clinic.component";
import {VetClinicComponent} from "./vet-clinic/vet-clinic.component";



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

        @if (user()!.role === Role.Vet && !user()?.clinicId) {
          <app-create-clinic/>

        } @else if (user()!.role === Role.Vet && user()?.clinicId) {
          @let clinicId = user()?.clinicId;

          @if (clinicId) {
            <app-vet-clinic [clinicId]="clinicId"/>
          }
        }
      </div>
    </main>
  `,
  styles: `
    /* Kontener główny */
    .map-container {
      height: calc(100vh - 98px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ClinicsComponent {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  @ViewChild('fileInput') fileInputElement!: ElementRef<HTMLInputElement>;

  user = this.authService.user
  protected readonly Role = Role;

  constructor() {
    effect(() => {
      const user = this.user()
      if (!user) {
        this.router.navigate(['auth'])
      }
      if (user && user.role === Role.Vet && !user.clinicId) {
        console.log('Weterynarz bez kliniki: Pokaż formularz tworzenia/dołączania.');
      }
    })

    effect(() => {
      console.log(this.user()?.clinicId)
    })
  }

}
