import { ChangeDetectionStrategy, Component, computed, inject, input, resource, signal } from '@angular/core';
import { UserProfile } from "../../../shared/interfaces/userProfile";
import { AppointmentsService } from "../../../shared/data-access/appointments.service";
import { DatePipe } from "@angular/common";
import { Appointment } from "../../../shared/interfaces/appointments.interface";
import {DatepickerRangeComponent} from "../../../shared/ui/datepicker-range/datepicker-range.component";

@Component({
  selector: 'app-get-appointments-for-vet',
  imports: [
    DatePipe,
    DatepickerRangeComponent,
  ],
  template: `
    <div class="container text-start mt-4">
      <div class="row">

        <div class="col mb-4">
          <h5 class="mb-3">Weterynarz: {{ veterinary().name }}</h5>
        </div>

        <div class="col">
          <app-datepicker-range
            [availableDays]="availableDaysStrings()"
            [selectSingleDay]="true"
            (daySelection)="onDaySelected($event)">
          </app-datepicker-range>
        </div>

        <div class="col">
          @if (selectedDay()) {
            <div class="card p-3 shadow-sm">
              <h6 class="mb-3 text-secondary">
                Dostępne godziny na dzień: <strong>{{ selectedDay() | date: 'fullDate' }}</strong>
              </h6>

              <div class="row row-cols-auto g-2">
                @for (appointment of appointmentsForSelectedDay(); track appointment.id) {
                  <div class="col">
                    <button class="btn btn-outline-primary rounded-3 px-3">
                      {{ appointment.dateTimeFrom.toDate() | date: 'HH:mm' }}
                    </button>
                  </div>
                } @empty {
                  <div class="col w-100 text-muted py-3">
                    Brak zaplanowanych wizyt w tym dniu.
                  </div>
                }
              </div>
            </div>
          }
        </div>

      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetAppointmentsForVet {
  appointmentsService = inject(AppointmentsService);
  veterinary = input.required<UserProfile>();
  clinicId = input.required<string>(); // <-- NOWY INPUT

  vetId = computed(() => this.veterinary().user_id);
  selectedDay = signal<string | null>(null);

  onGetAppointments = resource({
    params: () => ({ vetId: this.vetId(), clinicId: this.clinicId() }),
    loader: async ({ params }) => {
      if (!params.vetId || !params.clinicId) return;

      const data = await this.appointmentsService.getAppointmentsForVetGroupedByDay(
        params.vetId,
        params.clinicId
      );

      if (data && Object.keys(data).length > 0) {
        this.selectedDay.set(Object.keys(data)[0]);
      }

      return data;
    }
  });

  availableDaysStrings = computed<any[]>(() => {
    const data = this.onGetAppointments.value();
    return data ? Object.keys(data) : [];
  });

  appointmentsForSelectedDay = computed<Appointment[]>(() => {
    const rawData = this.onGetAppointments.value();
    const currentDay = this.selectedDay();

    if (!rawData || !currentDay) return [];
    return rawData[currentDay] || [];
  });

  onDaySelected(date: Date) {
    const dateKey = this.appointmentsService.buildDateKey(date)
    this.selectedDay.set(dateKey);
  }
}
