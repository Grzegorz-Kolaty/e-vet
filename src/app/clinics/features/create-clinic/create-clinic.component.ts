import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from "../../../shared/data-access/auth.service";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import ClinicService from "../../../shared/data-access/clinic.service";
import {SelectLocation} from "../select-location/select-location";
import {Router} from "@angular/router";
import {LocationResult, Voivodeship} from "../../../shared/data-access/geo.service";
import {Clinic, ClinicLocation} from "../../../shared/interfaces/clinics.interface";
import {MapComponent} from "../map/map.component";
import {SelectVoivodeship} from "../select-voivodenship/select-voivodeship.component";
import {JsonPipe} from "@angular/common";


@Component({
  selector: 'app-create-clinic',
  imports: [
    FormsModule,
    NgxMaskDirective,
    ReactiveFormsModule,
    SelectLocation,
    MapComponent,
    SelectVoivodeship,
    JsonPipe,
  ],
  providers: [provideNgxMask()],
  template: `
    <div class="row">
      <div class="col"></div>
      <p>onSelectVoivodeship</p>
      {{ onSelectVoivodeship() | json }}

      <div class="col">

        <p>voivodeshipLocation</p>
        <pre>      {{ !!voivodeshipLocation() }}</pre>
      </div>

      <div class="col">

        <p>Formdata</p>
        <pre>{{ clinicForm.getRawValue() | json }}</pre>
      </div>
    </div>
    <app-map [clinicLocationSelected]="clinicLocation()"
             [voivodeshipSelected]="voivodeshipLocation()"/>


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

          <app-select-voivodeship (voivodeshipSelected)="onSelectVoivodeship.set($event)"
                                  (voivodeshipLocation)="voivodeshipLocation.set($event)"/>

        </div>

        @if (onSelectVoivodeship()) {
          <div class="mb-2">
            <label class="form-label fw-bold small">Wyszukaj dokładny adres</label>
            <app-select-location
              (clinicLocationSelection)="clinicLocation.set($event)"
              [voivodeship]="onSelectVoivodeship()"/>
          </div>
        }

        @if (clinicLocation(); as loc) {

          <div class="mb-2">
            <label class="form-label fw-bold small">Miasto</label>
            <input class="form-control form-control-sm bg-light"
                   [value]="loc.city"
                   readonly>
          </div>


          <div class="mb-2">
            <label class="form-label fw-bold small">Ulica</label>
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
              @if (!loc.houseNumber) {
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

        <div class="row mb-3">
          <div class="col-auto">
            <label class="form-label fw-bold small">Godziny rozpoczęcia</label>
            <input type="time"
                   class="form-control form-control-sm"
                   formControlName="timeOpen"
                   [class.is-invalid]="clinicForm.get('timeOpen')?.touched && clinicForm.get('timeOpen')?.invalid">
          </div>

          <div class="col-auto">
            <label class="form-label fw-bold small">Godziny zamknięcia</label>
            <input type="time"
                   class="form-control form-control-sm"
                   formControlName="timeClose"
                   [class.is-invalid]="clinicForm.get('timeClose')?.touched && clinicForm.get('timeClose')?.invalid">
          </div>
        </div>

        <div class="d-grid mt-4 bg-white pt-2">
          <button type="submit"
                  class="btn btn-success w-100 fw-bold"
                  [disabled]="clinicForm.invalid || !clinicLocation()">
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
  clinicLocation = signal<ClinicLocation | null>(null);

  onSelectVoivodeship = signal<Voivodeship | null>(null);
  voivodeshipLocation = signal<LocationResult | null>(null);

  clinicForm = this.fb.nonNullable.group({
    clinicName: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    houseNumber: ['', Validators.required],
    apartmentNumber: [''],
    postcode: ['', Validators.required],
    street: ['', Validators.required],
    timeOpen: ['', Validators.required],
    timeClose: ['', Validators.required],
  });


  constructor() {
    effect(() => {
      if (!this.user) this.router.navigate(['auth']);
    });

    effect(() => {
      const loc = this.clinicLocation();
      if (loc) {
        this.clinicForm.patchValue({
          street: loc.street || loc.city || '',
          postcode: loc.postcode.replace('-', '') || '', // maska ngx-mask może tego wymagać
          houseNumber: loc.houseNumber || ''
        });

        if (loc.houseNumber) {
          this.clinicForm.get('houseNumber')?.markAsTouched();
        }
      }
    });

    effect(() => {
      const changeVoivo = this.onSelectVoivodeship()
      if (changeVoivo) {
        this.voivodeshipLocation.set(null);
        this.clinicLocation.set(null);
        this.clinicForm.reset();
      }
    });

    effect(() => {
      console.log(this.user())
    });
  }


  protected combineAllData(): Clinic {
    const form = this.clinicForm.getRawValue();
    const loc = this.clinicLocation();
    const voivo = this.onSelectVoivodeship();
    const profile = this.user()

    if (!loc || !profile) throw new Error("No location clinicLocationSelection");

    return {
      clinicName: form.clinicName.trim(),
      id: "",
      ownerId: profile.user_id,
      phoneNumber: form.phoneNumber?.trim() ?? '',
      voivodeship: voivo,
      latitude: Number(loc.latitude),
      longitude: Number(loc.longitude),
      geojson: loc.geojson,
      city: loc.city || "",
      street: loc.street || "",
      houseNumber: form.houseNumber,
      postcode: form.postcode,
      apartmentNumber: form.apartmentNumber,
      timeClose: form.timeClose,
      timeOpen: form.timeOpen,
      coverImage: {
        url: "",
      }
    }
  }

  async submitClinic() {
    if (this.clinicForm.invalid || !this.voivodeshipLocation()) return;

    const dto = this.combineAllData();

    console.log(dto);

    await this.clinicService.createClinic(dto);
  }
}
