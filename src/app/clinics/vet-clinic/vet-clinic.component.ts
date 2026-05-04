import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Input,
  input,
  resource,
  signal
} from '@angular/core';
import {Voivodeship} from "../../shared/data-access/geo.service";
import {FirestoreService} from "../../shared/data-access/firestore.service";
import {MapComponent} from "../features/map/map.component";
import {Clinic} from "../../shared/interfaces/clinics.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import ClinicService from "../../shared/data-access/clinic.service";
import {AppImageUpload} from "../features/app-image-upload/app-image-upload";
import {UserInterface} from "../../shared/interfaces/user.interface";


@Component({
  selector: 'app-vet-clinic',
  imports: [
    MapComponent,
    FaIconComponent,
    AppImageUpload,
  ],
  template: `
    <div class="container-fluid p-5 h-100">

      @if (clinicData(); as clinic) {
        <div class="mb-4">
          <h2 class="fw-bold">Przychodnia Weterynaryjna {{ clinic.clinicName }}</h2>
        </div>

        <div class="row gx-5">

          <div class="col">
            <div class="h-35 shadow-lg rounded-3 mb-3">

              <app-image-upload
                [imageUrl]="clinic.coverImage.url || null"
                (fileSelected)="onImageSelected($event)">
              </app-image-upload>

            </div>

            <h3>Dostępni lekarze i wizyty</h3>
            <div class="row">
              <div class="col">
                @for (vet of clinicVets(); track vet.user_id) {
                  <p>{{vet.user_id}}</p>
                  <p>{{vet.displayName}}</p>

                }
              </div>
              <div class="col">1sza</div>

              <div class="col">1sza</div>

            </div>
          </div>


          <div class="col-4 d-flex flex-column gap-3 p-4 shadow-lg bg-light-subtle rounded-3">
            <h5 class="">
              Informacje o klinice
            </h5>

            <div class="d-flex gap-3 align-items-start">
              <div class="pt-1 align-self-center">
                <fa-icon [icon]="['fas', 'location-dot']" size="xl"/>
              </div>

              <div class="d-flex flex-column">
                <h6 class="fw-semibold">Adres</h6>
                <span>
                  {{ clinic.city }},
                  {{ clinic.street }}
                  {{ ',' }}
                  {{ clinic.houseNumber }}
                  {{ clinic.apartmentNumber }}
                </span>
              </div>
            </div>

            <div class="d-flex gap-3 align-items-start">
              <div class="pt-1 align-self-center">
                <fa-icon [icon]="['fas', 'phone']" size="xl"/>
              </div>

              <div class="d-flex flex-column">
                <h6 class="fw-semibold">Telefon</h6>

                <span>{{ clinic.phoneNumber }}</span>
              </div>
            </div>

            <div class="d-flex gap-3 align-items-start">
              <div class="pt-1 align-self-center">
                <fa-icon [icon]="['fas', 'clock']" size="xl"/>
              </div>

              <div class="d-flex flex-column">
                <h6 class="fw-semibold">Godziny przyjęć</h6>

                <span>{{ clinic.timeOpen }} - {{ clinic.timeClose }}</span>
              </div>
            </div>

            @if (clinicData()) {
              <div class="small-map">
                <app-map (mapReady)="onSelectClinicLocation.set(clinicData())"
                         [clinicLocationSelected]="onSelectClinicLocation()">
                </app-map>
              </div>
            }

          </div>
        </div>
      }

    </div>
  `,
  styles: `
    .small-map {
      height: 350px;
      width: 100%;
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VetClinicComponent {
  public readonly clinicService = inject(ClinicService)

  clinicVets = input<UserInterface[]>([])
  clinic = input<Clinic | null>(null)
  clinicData = computed(() => {
    return this.clinic() || null;
  });

  onSelectClinicLocation = signal<Clinic | null>(null)
  onSelectVoivodeship = signal<Voivodeship | null>(null);

  constructor() {
    effect(() => {
      const clinicData = this.clinicData()
      if (clinicData) {
        this.onSelectVoivodeship.set(clinicData.voivodeship)
      }
    })

    effect(() => {
      console.log(this.onSelectClinicLocation())
    });
  }

  onImageSelected(file: File) {
    const clinicId = this.clinic()?.id;

    if (!clinicId) return;

    this.clinicService.updateCover(file, clinicId)
      .subscribe(url => {
        console.log('uploaded:', url);
      });
  }
}
