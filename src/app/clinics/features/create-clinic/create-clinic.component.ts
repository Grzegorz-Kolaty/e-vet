import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from "../../../shared/data-access/auth.service";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import ClinicService from "../../../shared/data-access/clinic.service";
import {SelectVoivodenship} from "../select-voivodenship/select-voivodenship";
import {SelectLocation} from "../select-location/select-location";
import {Router} from "@angular/router";
import {LocationResult, Voivodeship} from "../../../shared/data-access/geo.service";
import {Clinic} from "../../../shared/interfaces/clinics.interface";
import {MapComponent} from "../map/map.component";


@Component({
  selector: 'app-create-clinic',
  imports: [
    FormsModule,
    NgxMaskDirective,
    ReactiveFormsModule,
    SelectVoivodenship,
    SelectLocation,
    MapComponent,
  ],
  providers: [provideNgxMask()],
  template: `
    <app-map [clinicLocationSelected]="onSelectClinicLocation()"
             [voivodeshipSelected]="onSelectVoivodenshipLocation()"/>

    <div class="floating-panel col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3
              position-absolute top-50 start-0 translate-middle-y my-auto ms-2
              bg-white rounded-3 shadow-lg z-2
              d-flex flex-column">

      <div class="p-4 pb-0">
        <h3 class="mb-1 fw-bold">Nowa Klinika</h3>
        <p class="text-muted small mb-3">
          Wypełnij dane, aby zarejestrować placówkę.
        </p>
      </div>

      <form [formGroup]="clinicForm" (ngSubmit)="submitClinic()" class="p-4 pt-2">

        <div class="mb-2">
          <app-select-voivodenship
            (voivodenshipSelected)="onSelectVoivodenship.set($event)"
            (voivodenshipLocation)="onSelectVoivodenshipLocation.set($event)"/>
        </div>

        @if (onSelectVoivodenship()) {
          <div class="mb-2">
            <label class="form-label fw-bold small">Wyszukaj dokładny adres</label>
            <app-select-location
              (clinicLocationSelection)="onSelectClinicLocation.set($event)"
              [voivodeship]="onSelectVoivodenship()"/>
          </div>
        }

        @if (onSelectClinicLocation(); as loc) {
          <div class="mb-2">
            <label class="form-label fw-bold small">Ulica / Lokalizacja</label>
            <input class="form-control form-control-sm bg-light"
                   formControlName="street"
                   readonly>
          </div>

          <div class="row g-2 mb-3">
            <div class="col-4">
              <label class="form-label fw-bold small">Nr budynku</label>
              <input type="text"
                     class="form-control form-control-sm"
                     formControlName="houseNumber"
                     [class.is-invalid]="clinicForm.get('houseNumber')?.invalid"
                     placeholder="Wpisz nr">
              @if (!loc.address.house_number) {
                <div class="small text-warning">
                  Mapa nie podała numeru, wpisz go ręcznie.
                </div>
              }
            </div>

            <div class="col-4">
              <label class="form-label fw-bold small">Mieszkanie</label>
              <input type="text"
                     class="form-control form-control-sm"
                     formControlName="apartmentNumber"
                     placeholder="opcja">
            </div>

            <div class="col-4">
              <label class="form-label fw-bold small">Kod pocztowy</label>
              <input type="text"
                     class="form-control form-control-sm"
                     formControlName="postcode"
                     mask="00-000"
                     [class.is-invalid]="clinicForm.get('postcode')?.invalid && clinicForm.get('postcode')?.touched">
            </div>
          </div>
        }

        <hr class="my-3 text-muted">

        <div class="mb-2">
          <label class="form-label fw-bold small">Nazwa kliniki</label>
          <input type="text"
                 class="form-control form-control-sm"
                 formControlName="clinicName"
                 [class.is-invalid]="clinicForm.get('clinicName')?.touched && clinicForm.get('clinicName')?.invalid"
                 placeholder="np. Klinika Weterynaryjna Pupil">
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold small">Numer telefonu</label>
          <input type="tel"
                 class="form-control form-control-sm"
                 mask="000 000 000"
                 prefix="+48 "
                 formControlName="phoneNumber"
                 [class.is-invalid]="clinicForm.get('phoneNumber')?.touched && clinicForm.get('phoneNumber')?.invalid">
        </div>

        <div class="d-grid mt-4 bg-white pt-2">
          <button type="submit"
                  class="btn btn-success w-100 fw-bold"
                  [disabled]="clinicForm.invalid || !onSelectClinicLocation()">
            Utwórz klinikę
          </button>
        </div>

      </form>

    </div>
  `,
  styles: `
    .map-container {
      height: calc(100vh - 98px);
    }

    .floating-panel {
      max-height: calc(100vh - 98px); /* 2rem na marginesy m-md-4 */
      transition: all 0.3s ease-out;
    }

    @media (max-width: 575.98px) {
      .floating-panel {
        margin: 0 !important;
        top: auto !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 1rem 1rem 0 0 !important; /* Zaokrąglone tylko górne rogi */
      }
    }

    .overflow-y-auto::-webkit-scrollbar {
      width: 5px;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb {
      background: #e0e0e0;
      border-radius: 10px;
    }

    .overflow-y-auto::-webkit-scrollbar-track {
      background: transparent;
    }

    /* Twój stary styl dla drop-area, lekko pomniejszony */
    .file-drop-area {
      border: 1px dashed #ccc;
      cursor: pointer;
      background-color: #f8f9fa;
    }

    .file-drop-area:hover {
      border-color: var(--bs-success);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CreateClinicComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly clinicService = inject(ClinicService);

  user = this.authService.user;
  onSelectClinicLocation = signal<LocationResult | null>(null);

  onSelectVoivodenship = signal<Voivodeship | null>(null);
  onSelectVoivodenshipLocation = signal<LocationResult | null>(null);

  clinicForm = this.fb.nonNullable.group({
    clinicName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    houseNumber: ['', Validators.required],
    apartmentNumber: [''],
    postcode: ['', Validators.required],
    street: ['', Validators.required],
  });


  constructor() {
    effect(() => {
      if (!this.user()) this.router.navigate(['auth']);
    });

    effect(() => {
      const loc = this.onSelectClinicLocation();
      if (loc) {
        this.clinicForm.patchValue({
          street: loc.address.road || loc.address.village || loc.address.city || '',
          postcode: loc.address.postcode?.replace('-', '') || '', // maska ngx-mask może tego wymagać
          houseNumber: loc.address.house_number || ''
        });

        if (loc.address.house_number) {
          this.clinicForm.get('houseNumber')?.markAsTouched();
        }
      }
    });

    effect(() => {
      const voivo = this.onSelectVoivodenship()
      if (voivo) {
        this.onSelectVoivodenshipLocation.set(null)
        this.clinicForm.reset()
      }
    })
  }


  protected combineAllData(): Clinic {
    const form = this.clinicForm.getRawValue();
    const loc = this.onSelectClinicLocation();
    const voivo = this.onSelectVoivodenship();
    const profile = this.user()

    if (!loc || !profile) throw new Error("No location clinicLocationSelection");

    return {
      rawGeoData: loc,
      clinicCreator: {
        uid: profile.uid,
        name: profile.name,
        email: profile.email,
        email_verified: profile.email_verified,
        pic: profile.picture,
        role: profile.role,
        clinicId: profile.clinicId
      },
      clinicName: form.clinicName.trim(),
      phoneNumber: form.phoneNumber ?? null,
      voivodenship: voivo,
      latitude: loc.lat,
      longitude: loc.lon,
      geojson: loc.geojson || "",
      city: loc.address.city || loc.address.village || loc.address.town || "",
      street: loc.address.road || loc.address.village || "",
      houseNumber: form.houseNumber,
      postcode: form.postcode,
      apartmentNumber: form.apartmentNumber,
    }
  }

  async submitClinic() {
    if (this.clinicForm.invalid || !this.onSelectVoivodenshipLocation()) return;

    const dto = this.combineAllData();

    await this.clinicService.createClinic(dto);
  }

}
