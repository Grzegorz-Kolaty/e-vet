import {ChangeDetectionStrategy, Component, computed, effect, inject} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {AppointmentsService} from '../../data-access/appointments.service';
import {AuthService} from '../../data-access/auth.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-incoming-appointments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="shadow border-warning-subtle border-2 rounded-2 p-4 m-4">
      <h4 class="mb-4">Nadchodzące wizyty</h4>

      <div class="row row-cols-1 row-cols-md-2 g-4">
        @for (appointment of appointments(); track appointment.id) {
          <div class="col">
            <div class="card bg-secondary-subtle border-0">
              <div class="card-body">
                <p class="mb-1">Data: {{ appointment.date }}</p>
                <p class="mb-1">Godzina: {{ appointment.dateTimeFrom | date: 'HH:mm' }}</p>
                <p class="mb-1">Miasto: {{ appointment.city }}</p>
                <p class="mb-1">Zwierzak: {{ appointment.patientName }}</p>
              </div>
            </div>
          </div>
        } @empty {
          <h6 class="bold">Brak nadchodzących wizyt!</h6>
        }
      </div>
    </section>
  `,
  styles: ``,
  imports: [
    DatePipe
  ]
})
export class IncomingAppointmentsComponent {
  appointmentService = inject(AppointmentsService);
  authService = inject(AuthService)

  onGetAppointmentsForVet = rxResource({
    request: () => this.authService.verifiedEmailedUser()?.uid,
    loader: uid => this.appointmentService.getReservedAppointmentsForVet(uid.request)
  })

  appointments = computed(() => this.onGetAppointmentsForVet.value());
}
