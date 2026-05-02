import {ChangeDetectionStrategy, Component, computed, effect, inject, input, resource, signal} from '@angular/core';
import {LocationResult, Voivodeship} from "../../shared/data-access/geo.service";
import {FirestoreService} from "../../shared/data-access/firestore.service";
import {MapComponent} from "../features/map/map.component";


@Component({
  selector: 'app-vet-clinic',
  template: `
    <div class="container-fluid p-5">
      <div class="row h-50">
    <app-map [clinicLocationSelected]="onSelectClinicLocation()"/>

      <div class="row">

      <div class="col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3
              my-auto ms-2 position-absolute
              bg-white rounded-3 shadow-lg z-3
              d-flex flex-column">
      <div class="p-4 pb-0">
        <h3 class="mb-1 fw-bold">Przychodnia Weterynaryjna {{ clinicData()?.clinicName }}</h3>
        <p class="text-muted small mb-3">Wypełnij dane, aby zarejestrować placówkę.</p>
      </div>
    </div>
    </div>
      </div>

      @if (onGetVetClinic.error()) {
      <span>Wystąpił błąd przy pobieraniu Twojej kliniki</span>
    }
  `,
  styles: ``,
  imports: [
    MapComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VetClinicComponent {
  public readonly firestoreService = inject(FirestoreService)

  clinicId = input<string | undefined>(undefined)
  onGetVetClinic = resource({
    loader: async () => {
      const clinicId = this.clinicId()
      if (!clinicId) {
        throw new Error('Brak kliniki')
      }
      return this.firestoreService.getVetClinicById(clinicId);
    }
  })
  clinicData = computed(() => {
    return this.onGetVetClinic.value() || null;
  });
  onSelectClinicLocation = signal<LocationResult | null>(null)
  onSelectVoivodenship = signal<Voivodeship | null>(null);

  constructor() {
    effect(() => {
      const clinicData = this.clinicData()
      if (clinicData) {
        this.onSelectVoivodenship.set(clinicData.voivodenship)
        this.onSelectClinicLocation.set(clinicData.rawGeoData)
      }
    })

    effect(() => {
      console.log(this.clinicData())
    })
  }
}
