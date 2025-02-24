import {
  ChangeDetectionStrategy,
  Component,
  computed, effect,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <div class="row m-0 mb-4">
        <h4 class="text-center bg-dark-subtle p-3">Wybierz termin</h4>
      </div>

      <div
        class="alert alert-primary d-flex align-items-center m-4"
        role="alert">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          class="bi bi-info-square-fill m-3"
          viewBox="0 0 16 16">
          <path
            d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
        </svg>
        <div>
          Znajdujesz się w panelu rezerwacji wizyt - wskaż tydzień a następnie
          kliknij Rezerwuj aby zarezerwować wizytę u wybranego weterynarza 🐶
          <br />
          <span class="text-muted">
            Aktualnie możesz zarezerwować tylko jedną wizytę.</span>
        </div>
      </div>

      <div class="row mx-5">
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
  imports: [DatepickerRangeComponent, ReservationsComponent],
  styles: ``,
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
