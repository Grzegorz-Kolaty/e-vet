import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Input,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ITreatment} from '../../../shared/interfaces/animals.interface';
import {AppointmentsService} from "../../../shared/data-access/appointments.service";
import {Role} from "../../../shared/interfaces/user.interface";
import {PetsService} from "../../../shared/data-access/pets.service";
import Datepicker from "../../../shared/ui/datepicker/datepicker";
import {JsonPipe} from "@angular/common";


@Component({
  selector: 'app-treatment-create',
  imports: [ReactiveFormsModule, Datepicker, JsonPipe],
  template: `
    <div class="container p-3">
      <div class="modal-header px-0 pt-0">
        <h5 class="modal-title">
          {{
            treatmentData?.id
              ? 'Edycja wpisu w historii leczenia'
              : 'Nowy wpis w historii leczenia'
          }}
        </h5>
      </div>

      <div class="modal-body px-0">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row mb-3">

            <div class="col-md-6">
              <label class="form-label fw-bold small">
                Typ wizyty *
              </label>
              <input type="text" class="form-control"
                     formControlName="type"
                     placeholder="np. Kontrola, Szczepienie">
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small">Data *</label>
              <app-datepicker
                [isRangeMode]="false"
                (onSingleDateChange)="form.patchValue({ date: $event }); form.get('date')?.markAsDirty();"
              />
              @if (form.get('date')?.touched && form.get('date')?.invalid) {
                <small class="text-danger d-block mt-1">Data jest wymagana.</small>
              }
            </div>

          </div>

          <pre>{{ form.getRawValue() | json }}</pre>

          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label fw-bold small">Lekarz prowadzący *</label>
              <input type="text" class="form-control" formControlName="vet" placeholder="np. Lek. wet. Jan Kowalski">
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small">Klinika *</label>
              <input type="text" class="form-control" formControlName="clinic" placeholder="np. Zdrowy Pupil">
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold small">Diagnoza</label>
            <input type="text" class="form-control" formControlName="diagnosis"
                   placeholder="np. Zapalenie ucha zewnętrznego">
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold small">Opis badania i objawy</label>
            <textarea class="form-control" rows="3" formControlName="description"></textarea>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label fw-bold small">Zalecenia</label>
              <textarea class="form-control" rows="2" formControlName="recommendation"></textarea>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small">Zalecane leki / Recepta</label>
              <textarea class="form-control" rows="2" formControlName="prescription"></textarea>
            </div>
          </div>

          <div class="modal-footer px-0 pb-0 mt-4">
            <button
              type="button"
              class="btn btn-outline-secondary"
              (click)="activeModal.close(false)">
              Anuluj
            </button>

            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="form.invalid || !form.dirty">
              Zapisz wizytę
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreatmentCreateComponent {
  protected appointmentsService = inject(AppointmentsService);
  protected activeModal = inject(NgbActiveModal);
  private fb = inject(FormBuilder);
  private petService = inject(PetsService);

  @Input() role: Role | undefined;
  @Input() treatmentData: ITreatment | null | undefined;
  @Input() petId: string | undefined;

  existingAttachments = signal<{ name: string; url: string }[]>([]);

  form = this.fb.nonNullable.group({
    appointmentId: this.fb.control<string | null>(null),
    clinicId: this.fb.control<string | null>(null),
    vetId: this.fb.control<string | null>(null),
    date: this.fb.control<Date | null>(null, [Validators.required]),

    petId: ['', [Validators.required]],
    type: ['', [Validators.required]],
    vet: ['', [Validators.required]],
    clinic: ['', [Validators.required]],

    diagnosis: [''],
    description: [''],
    recommendation: [''],
    prescription: ['']
  });

  constructor() {
    effect(() => {
      const treatment = this.treatmentData;
      if (!treatment) return;

      this.form.patchValue({
        appointmentId: treatment.appointmentId ?? null,
        clinicId: treatment.clinicId ?? null,
        vetId: treatment.vetId ?? null,
        petId: treatment.petId ?? '',
        type: treatment.type ?? '',
        date: treatment.date ?? null,
        vet: treatment.vet ?? '',
        clinic: treatment.clinic ?? '',
        diagnosis: treatment.diagnosis ?? '',
        description: treatment.description ?? '',
        recommendation: treatment.recommendation ?? '',
        prescription: treatment.prescription ?? ''
      });

      this.existingAttachments.set(treatment.attachments ?? []);
    });

    effect(() => {
      const petId = this.petId;
      if (!petId) return;

      this.form.patchValue({petId: petId});
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const currentPetId = this.petId;
    if (!currentPetId) {
      console.error('Brak wymaganego parametru: petId.');
      return;
    }

    const currentTreatment = this.treatmentData;

    const formValues = this.form.getRawValue();
    const isUser = this.role === Role.User;

    const finalTreatmentData: ITreatment = {
      ...currentTreatment,
      ...formValues,
      petId: currentPetId,
      isCreatedByUser: isUser
    };

    const treatmentId = currentTreatment?.id;

    if (treatmentId) {
      this.petService.updateTreatment(treatmentId, finalTreatmentData)
        .then(() => this.activeModal.close(true))
        .catch((err: unknown) => console.error('Błąd podczas edycji wpisu:', err));
      return;
    }

    if (currentTreatment?.appointmentId) {
      this.appointmentsService.completeAppointmentAndAddTreatment(
        currentPetId,
        currentTreatment.appointmentId,
        finalTreatmentData
      )
        .then(() => this.activeModal.close(true))
        .catch((err: unknown) => console.error('Błąd podczas kończenia wizyty i zapisu wpisu:', err));
      return;
    }

    this.petService.createTreatment(finalTreatmentData)
      .then(() => this.activeModal.close(true))
      .catch((err: unknown) => console.error('Błąd podczas dodawania nowego wpisu:', err));
  }
}

