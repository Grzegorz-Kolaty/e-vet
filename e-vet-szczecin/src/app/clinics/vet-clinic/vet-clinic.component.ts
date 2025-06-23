import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import {AuthService} from "../../shared/data-access/auth.service";
import {ClinicService} from "../../shared/data-access/clinic.service";
import {Router} from "@angular/router";
import {MapComponent} from "../features/map/map.component";


@Component({
  selector: 'app-vet-clinic',
  imports: [MapComponent],
  template: `
    <main class="row h-100">
      <div class="flex-fill">
        <div class="position-relative">
          <div class="position-absolute top-0 start-0 alert bg-dark text-white d-flex align-items-center shadow-lg"
               role="alert">

            <svg class="bi bi-info-square m-3 flex-shrink-0"
                 xmlns="http://www.w3.org/2000/svg"
                 width="30"
                 height="30"
                 fill="currentColor"
                 viewBox="0 0 16 16">
              <path
                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
              <path
                d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
            </svg>

            <div class="p-3">
              <h4 class="mb-3">Nie wykryliśmy przypisanej kliniki, utwórz ją aby móc udostępniać terminy</h4>
              <span>
                Profil kliniki będzie widoczny dla pacjentów - uzupełnij profil kliniki i Twój Profil Weterynarza
              </span>
              <span class="display-4">🗃️</span>

            </div>
          </div>
          <div class="position-absolute top-0 start-50">
            <app-map/>

          </div>
        </div>
      </div>
    </main>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class VetClinicComponent {
  public readonly authService = inject(AuthService);
  public readonly clinicService = inject(ClinicService)
  private readonly router = inject(Router);

  // onGetClinic = resource({
  //   loader: () => this.clinicService.getVetClinic(this.authService.vetClinicId()!)
  // })

  constructor() {
    effect(() => {
      if (!this.authService.firebaseUser()) {
        this.router.navigate(['auth'])
      }
    });
  }

  // async handleClinicCreated() {
  //   console.log('async handleClinicCreated proc')
  //   await this.authService.refreshIdToken();
  //   this.onGetClinic.reload()
  // }

}
