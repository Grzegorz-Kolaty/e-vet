import {ChangeDetectionStrategy, Component, computed, effect, inject, resource, signal} from '@angular/core';
import {MapComponent} from "../features/map/map.component";
import {Clinic} from "../../shared/interfaces/clinics.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import ClinicService from "../../shared/data-access/clinic.service";
import {UploadableImagesComponent} from "../../shared/ui/uploadable-images/uploadable-images.component";
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {AuthService} from "../../shared/data-access/auth.service";
import {GetAppointmentsForVet} from "../features/get-appointments-for-vet/get-appointments-for-vet";


export interface ClinicPayload {
  file: File;
  clinic: Clinic;
}

@Component({
  selector: 'app-vet-clinic',
  imports: [
    MapComponent,
    FaIconComponent,
    UploadableImagesComponent,
    GetAppointmentsForVet,
  ],
  template: `
    <div class="container h-100 pt-4">
      @let clinicData = clinic();

      @if (clinicData) {
        <div class="row mb-3">
          <div class="col">
            <h2 class="fw-bold">
              Przychodnia Weterynaryjna {{ clinicData?.clinicName }}
            </h2>
          </div>
        </div>

        <div class="row gy-4 justify-content-between">
          <div class="col-lg-9 d-flex flex-column gap-3">
            <app-uploadable-images
              [photoUrl]="clinicData.coverImage.url"
              (photoFile)="onPhotoUpload($event, clinicData)"
              [widerSize]=true
            />

            <h4 class="my-2">Dostępni weterynarze i terminy</h4>

            @for (vet of veterinariesOfClinic(); track vet.user_id) {
              <app-get-appointments-for-vet [veterinary]="vet" [clinicId]="clinicData.id"/>
            }
          </div>


          <div class="col-lg-3">
            <div class="p-4 shadow-lg rounded-4 bg-opacity-25 bg-light d-flex flex-column gap-4 ">

              <h5>Informacje o klinice</h5>

              <div class="d-flex gap-3">
                <fa-icon [icon]="['fas', 'location-dot']" size="lg"/>
                <div>
                  <h6 class="fw-semibold mb-1">Adres</h6>
                  <div>
                    {{ clinicData.address.city || clinicData.address.town || clinicData.address.village }},
                    {{ clinicData.address.street }}
                    {{ clinicData.address.house_number }}
                    {{ clinicData.address.apartment_number }}
                    {{ clinicData.address.postal_code }}
                  </div>
                </div>
              </div>

              <!-- PHONE -->
              <div class="d-flex gap-3">
                <fa-icon [icon]="['fas', 'phone']" size="lg"/>
                <div>
                  <h6 class="fw-semibold mb-1">Telefon</h6>
                  <div>{{ clinicData?.phoneNumber }}</div>
                </div>
              </div>

              <div class="d-flex gap-3">
                <fa-icon [icon]="['fas', 'clock']" size="lg"/>
                <div>
                  <h6 class="fw-semibold mb-1">Godziny przyjęć</h6>
                  <div>{{ clinicData?.timeOpen }} - {{ clinicData?.timeClose }}</div>
                </div>
              </div>

              <div class="small-map rounded-3">
                <app-map [clinicLocation]="onSelectClinicLocation()">
                </app-map>
              </div>

            </div>
          </div>

        </div>

      }
    </div>
  `,
  styles: `
    .small-map {
      height: 350px;
      width: 100%;
    }

    .cursor-pointer {
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class VetClinicComponent {
  private readonly authService = inject(AuthService);
  public readonly clinicService = inject(ClinicService)
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  clinicId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ),
    {
      initialValue: null
    }
  );

  clinic = signal<Clinic | undefined | null>(undefined);
  onSelectClinicLocation = computed(() => this.clinic()?.address ?? null);
  veterinariesOfClinic = computed(() => {
    return this.onGetVeterinariesFromClinic.value() ?? [];
  });

  onUpdateClinicTrigger = signal<ClinicPayload | null>(null)

  constructor() {
    effect(() => {
      const user = this.authService.user()
      if (!user) {
        this.router.navigate(['auth', 'login']);
      }
    });

    effect(() => {
      if (this.onUpdateClinic.status() === 'resolved' && this.onUpdateClinic.value()) {
        this.clinic.set(this.onUpdateClinic.value())
      }
    });

    effect(() => {
      const status = this.onGetClinicInfo.status();
      if (status === 'resolved') {
        this.clinic.set(this.onGetClinicInfo.value())
      }
    });
  }

  onGetClinicInfo = resource({
    params: () => this.clinicId(),
    loader: async ({params}) => {
      if (!params) {
        throw Error('no clinic Id assigned')
      }
      return this.clinicService.getClinicInfo(params)
    }
  })

  onUpdateClinic = resource({
    params: () => this.onUpdateClinicTrigger(),
    loader: async ({params}) => {
      if (!params) {
        throw Error('no clinic Id assigned')
      }
      return this.clinicService.updateCover(params.file, params.clinic)
    }
  })

  onGetVeterinariesFromClinic = resource({
    params: () => this.clinic()?.vetIds,
    loader: async ({params}) => {
      if (!params) {
        return []
      }
      return this.clinicService.getVeterinariesAssignedToClinic(params)
    }
  })

  onPhotoUpload(file: File, clinicData: Clinic) {
    console.log(clinicData, file);
    this.onUpdateClinicTrigger.set({clinic: clinicData, file: file});
  }
}
