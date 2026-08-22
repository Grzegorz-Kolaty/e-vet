import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {IAttachment, ITreatment} from "../../../shared/interfaces/animals.interface";
import {AuthService} from "../../../shared/data-access/auth.service";
import {TreatmentAttachments} from "../treatment-documents/treatment-attachments.component";
import {Appointment} from "../../../shared/interfaces/appointments.interface";
import {Role} from "../../../shared/interfaces/user.interface";
import {
  NgbAccordionBody,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbAccordionToggle
} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-pet-treatment-history',
  imports: [TreatmentAttachments, NgbAccordionDirective, NgbAccordionItem, NgbAccordionHeader, NgbAccordionToggle, NgbAccordionCollapse, NgbAccordionBody, DatePipe],
  template: `
    <div ngbAccordion>
      @for (history of historyList(); track history.id) {
        @let isCurrentActive = activeAppointmentId() && history.appointmentId === activeAppointmentId();

        <div ngbAccordionItem [id]="history.id!" #accordionItem="ngbAccordionItem">

          <div ngbAccordionHeader
               ngbAccordionToggle
               class="accordion-button d-flex flex-row align-items-center p-3 bg-light rounded-3 shadow-sm"
               style="cursor: pointer; gap: 1rem;">

            <div class="w-100">
              <span class="font-monospace text-bg-secondary px-2 rounded-4">{{ history.type }}</span>
            </div>

            <div class="w-100">
          <span class="text-dark-emphasis fw-medium">
            🏢 {{ history.clinic }}
          </span>
            </div>

            <div class="w-100">
          <span class="text-primary-emphasis">
            {{ history.diagnosis }}
          </span>
            </div>

            <div class="w-100 text-center">
              <span class="text-primary-emphasis">
                📅 {{ history.date | date: 'dd.MM.yyyy' }}
              </span>
            </div>

          </div>

          <div ngbAccordionCollapse>
            <div ngbAccordionBody>
              <ng-template>

                <div class="row g-4">

                  <div class="col-md-6 d-flex flex-column gap-3">
                    <div class="d-flex flex-column">
                      <span class="text-muted fw-semibold">Lekarz prowadzący:</span>
                      <span class="text-primary-emphasis fw-medium">{{ history.vet }} ({{ history.clinic }})</span>
                    </div>

                    @if (history.description) {
                      <div>
                        <span class="text-muted d-block small fw-semibold mb-1">Opis badania:</span>
                        <div class="p-2 bg-white border rounded-3 small text-secondary">
                          {{ history.description }}
                        </div>
                      </div>
                    }

                    @if (history.recommendation) {
                      <div>
                        <span class="text-success d-block small fw-semibold mb-1">Zalecenia:</span>
                        <div class="p-2 bg-white border border-success-subtle text-success-emphasis rounded-3 small">
                          {{ history.recommendation }}
                        </div>
                      </div>
                    }

                    @if (history.prescription) {
                      <div>
                        <span class="text-warning-emphasis d-block fw-semibold mb-1">Recepta:</span>
                        <code class="d-block p-2 bg-white border border-warning-subtle rounded text-wrap">
                          {{ history.prescription }}
                        </code>
                      </div>
                    }
                  </div>

                  <div class="col-md-6 d-flex flex-column gap-3">
                    <div>
                      <span class="text-muted d-block fw-semibold mb-2">Dokumentacja medyczna:</span>
                      @if (history.attachments && history.id) {
                        <app-treatment-documents
                          [isDisabledForUser]="!!history.appointmentId"
                          [isActive]="!!isCurrentActive"
                          [attachments]="history.attachments"
                          (deleteDocument)="deleteDocument.emit({ treatmentId: history.id!, attachment: $event })"
                          (addDocument)="addDocument.emit({ treatmentId: history.id!, file: $event })"
                        />
                      }
                    </div>

                    <button
                      class="btn btn-sm btn-outline-primary rounded-3 px-3 d-flex align-items-center mt-auto"
                      (click)="editTreatment.emit(history); $event.stopPropagation()"
                      [disabled]="!history.isCreatedByUser && authService.user() && authService.user()?.role === Role.Vet">
                      <span>✏️</span>
                      <span>Edytuj wpis</span>
                    </button>
                  </div>
                </div>

              </ng-template>

            </div>
          </div>
        </div>

      } @empty {
        <div class="alert alert-info text-center py-4 rounded-4 border-0 shadow-sm" role="alert">
          <span class="d-block mb-2">📋</span>
          <span class="fw-medium">Brak historii medycznej w bazie dla tego zwierzaka.</span>
        </div>
      }

    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetTreatmentHistory {
  protected authService = inject(AuthService);

  historyList = input<ITreatment[]>([]);
  upcomingAppointments = input<Appointment[]>([]);
  isLoading = input<boolean>(false);
  activeAppointmentId = input<string | null>(null);

  editTreatment = output<ITreatment>();
  addDocument = output<{ treatmentId: string, file: File }>();
  deleteDocument = output<{ treatmentId: string, attachment: IAttachment }>();
  protected readonly Role = Role;
}
