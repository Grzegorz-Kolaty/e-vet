import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {Appointment} from "../../../shared/interfaces/appointments.interface";
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-pet-upcoming-appointments',
  imports: [
    RouterLink,
    FaIconComponent,
    DatePipe
  ],
  template:`
    @for (app of upcomingAppointments(); track app.id) {
      <div class="d-flex flex-row justify-content-between align-items-center p-3 bg-light rounded-3 border-start border-primary border-4 shadow-sm">

        <div class="fw-semibold">
          <h6>Wizyta kontrolna</h6>

          <span class="d-inline-flex gap-2 align-items-center text-primary">
            <fa-icon [icon]="['fas', 'calendar']" size="xl"/>
            {{ app.dateTimeFrom | date: 'EEEE, d MMMM yyyy, HH:mm' }}
          </span>
        </div>

        <button class="btn p-0 text-start"
                [routerLink]="['/clinics', 'vet-clinic', app.clinicId]">
          🩺 Lekarz: <span class="fw-medium text-decoration-none">{{ app.vetDisplayName }}</span>
          <br>
          <span class="text-decoration-underline">
              🏢 Klinika: <span class="fw-medium">{{ app.clinicName }}</span>
            ({{ app.city }})
          </span>
        </button>

        @if (app.reserved) {
          <span class="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2">
              Zarezerwowana
          </span>
        }
      </div>

    } @empty {
      <p class="text-muted py-2 m-0 small">Brak zaplanowanych wizyt dla tego zwierzaka.</p>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetUpcomingAppointments {
  upcomingAppointments = input<Appointment[]>([]);
}
