import {ChangeDetectionStrategy, Component, effect, inject, input, output, ResourceStatus} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import {Clinic, ClinicLocation} from "../../../shared/interfaces/clinics.interface";
import {GeoJsonObject} from "geojson";


@Component({
  selector: 'app-create-clinic-form',
  imports: [
    FormsModule,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  providers: [provideNgxMask()],
  template: `
    <form [formGroup]="clinicForm"
          (ngSubmit)="onSubmit()">

      <div formGroupName="address">
        <div class="mb-2">
          <label class="form-label fw-bold small">Miasto</label>
          <input class="form-control form-control-sm bg-light"
                 formControlName="city"
                 readonly>
        </div>

        <div class="mb-2">
          <label class="form-label fw-bold small">Town</label>
          <input class="form-control form-control-sm bg-light"
                 formControlName="town"
                 readonly>
        </div>

        <div class="mb-2">
          <label class="form-label fw-bold small">Town</label>
          <input class="form-control form-control-sm bg-light"
                 formControlName="village"
                 readonly>
        </div>

        <div class="mb-2">
          <label class="form-label fw-bold small">Muni</label>
          <input class="form-control form-control-sm bg-light"
                 formControlName="municipality"
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
                   formControlName="house_number"
                   placeholder="Wpisz nr">

            @if (!clinicForm.get('address.house_number')?.value && !!clinicAddress()) {
              <div class="small text-warning">
                W wyszukanym adresie brak numeru budynku.
              </div>
            }
          </div>

          <div class="col-4">
            <label class="form-label fw-bold small">Mieszkanie</label>
            <input type="text"
                   class="form-control form-control-sm"
                   formControlName="apartment_number"
                   placeholder="opcja">
          </div>

          <div class="col-4">
            <label class="form-label fw-bold small">Kod pocztowy</label>
            <input type="text"
                   class="form-control form-control-sm"
                   formControlName="postal_code"
                   mask="00-000"
                   [class.is-invalid]="clinicForm.get('postcode')?.invalid
                     && clinicForm.get('postcode')?.touched">
          </div>
        </div>

      </div>

      <hr class="my-3 text-muted">

      <div class="mb-2">
        <label class="form-label fw-bold small">Nazwa kliniki</label>
        <input type="text"
               class="form-control form-control-sm"
               formControlName="clinicName"
               [class.is-invalid]="clinicForm.get('clinicName')?.touched
               && clinicForm.get('clinicName')?.invalid"
               placeholder="np. Klinika Weterynaryjna Pupil">
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold small">Numer telefonu</label>
        <input type="tel"
               class="form-control form-control-sm"
               mask="000 000 000"
               prefix="+48 "
               formControlName="phoneNumber"
               [class.is-invalid]="clinicForm.get('phoneNumber')?.touched
               && clinicForm.get('phoneNumber')?.invalid">
      </div>

      <div class="row mb-3">
        <div class="col">
          <label class="form-label fw-bold small">Godziny rozpoczęcia</label>
          <input type="time"
                 class="form-control form-control-sm"
                 formControlName="timeOpen"
                 [class.is-invalid]="clinicForm.get('timeOpen')?.touched
                 && clinicForm.get('timeOpen')?.invalid">
        </div>

        <div class="col">
          <label class="form-label fw-bold small">Godziny zamknięcia</label>
          <input type="time"
                 class="form-control form-control-sm"
                 formControlName="timeClose"
                 [class.is-invalid]="clinicForm.get('timeClose')?.touched
                 && clinicForm.get('timeClose')?.invalid">
        </div>
      </div>

      <div class="d-grid mt-4 bg-white pt-2">
        <button type="submit"
                class="btn btn-success w-100 fw-bold"
                [disabled]="clinicForm.invalid
                || !clinicAddress()
                || createClinicStatus() === 'loading'">
          Utwórz klinikę
        </button>
      </div>

    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateClinicForm {
  vetId = input<string | null>(null);
  createClinicStatus = input<ResourceStatus>();
  clinicAddress = input<ClinicLocation | null>(null);

  createClinic = output<Clinic>();

  private readonly fb = inject(FormBuilder);

  clinicForm = this.fb.group({
    clinicName: ['', Validators.required],
    id: [''],
    ownerId: [''],
    phoneNumber: ['', Validators.required],
    vetIds: this.fb.control<string[]>([], Validators.required),

    address: this.fb.group({
      city: [''],
      town: [''],
      village: [''],
      municipality: [''],
      voivodeship: [''],

      street: [''],
      house_number: ['', Validators.required],
      postal_code: ['', Validators.required],
      apartment_number: [''],

      latitude: [0],
      longitude: [0],

      geojson: this.fb.control<GeoJsonObject | null>(null, Validators.required),
    }),

    timeOpen: ['', Validators.required],
    timeClose: ['', Validators.required],

    coverImage: this.fb.nonNullable.group({
      url: [''],
    }),
  });


  constructor() {
    effect(() => {
      const addr = this.clinicAddress();
      const ownerId = this.vetId()

      if (addr && ownerId) {
        this.clinicForm.controls.ownerId.patchValue(ownerId)
        this.clinicForm.controls.vetIds.patchValue([ownerId])
        this.clinicForm.controls.address.patchValue(addr);
      } else {
        this.clinicForm.reset()
      }
    });
  }

  onSubmit() {
    const form = this.clinicForm;
    if (form.invalid) return;
    this.createClinic.emit(form.getRawValue() as Clinic);
  }
}
