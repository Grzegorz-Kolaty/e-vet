import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { AppointmentsService } from '../../shared/data-access/appointments.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DatepickerRangeComponent } from '../../shared/ui/datepicker-range/datepicker-range.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { Appointment } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-browse',
  imports: [DatepickerRangeComponent, ReservationsComponent],
  template: `
    <section>
      <div class="row">
        <div class="col text-center">
          <app-datepicker-range (weekSelection)="onSelectWeekSig.set($event)" />
          <input
            class="form-control form-control-lg my-3"
            placeholder="Wybierz miasto"
            value="Szczecin"
            disabled />
          <input
            class="form-control form-control-lg my-3"
            placeholder="Wybór veta jeszcze nie dostępny :)"
            disabled />
        </div>

        <div class="col-xxl-9">
          <app-reservations
            [appointments]="appointments()"
            [isLoading]="isLoading()"
            (reserveAppointment)="onReserveAppointment($event)" />
        </div>
      </div>
    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class BrowseComponent {
  appointmentService = inject(AppointmentsService);

  onSelectWeekSig = signal<Date[]>([]);
  onGetAppointmentsResource = rxResource({
    request: this.onSelectWeekSig,
    loader: obj =>
      this.appointmentService.getAppointmentsForReservation(obj.request),
  });
  appointments = computed(() => this.onGetAppointmentsResource.value() ?? []);
  isLoading = linkedSignal(() => this.onGetAppointmentsResource.isLoading());

  onReserveAppointment(appointment: Appointment) {
    this.isLoading.set(true);
    this.appointmentService.reserveAppointment(appointment).subscribe({
      next: () => this.onGetAppointmentsResource.reload(),
      error: err => console.error(err),
      complete: () => this.isLoading.set(false),
    });
  }

}
