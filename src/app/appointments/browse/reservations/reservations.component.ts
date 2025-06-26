import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Appointment } from '../../../shared/interfaces/user.interface';
import { GroupByPipe } from '../../../shared/pipes/group-by.pipe';

@Component({
  selector: 'app-reservations',
  imports: [DatePipe, NgbNavModule, GroupByPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <div class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    }

    @if (!isLoading()) {
      @if (!appointments().length) {
        <div class="alert alert-warning" role="alert">
          Brak wizyt w tym tygodniu 😿
        </div>
      } @else {
        <ul ngbNav #nav="ngbNav" [(activeId)]="activeId" class="nav-tabs">
          @for (day of appointments() | groupBy: 'date'; track day.key) {
            <li [ngbNavItem]="day.key | date">
              <button ngbNavLink>{{ day.key | date }}</button>

              <ng-template ngbNavContent>
                @for (hour of day.value | groupBy: 'dateTimeFrom';
                  track hour.key) {
                  <h4>{{ hour.key | date: 'HH:mm' }}</h4>
                  <hr/>
                  <div class="row row-cols-1 row-cols-xxl-2 g-4 mb-5">
                    @for (appointment of hour.value; track appointment.id) {
                      <div class="col">
                        <div class="card">
                          <div class="card-header">Dostępna wizyta! 🦊</div>

                          <div class="card-body">
                            <h5 class="card-title">
                              vet. {{ appointment.vetDisplayName }}
                            </h5>

                            <p class="card-text">{{ appointment.email }}</p>
                            <hr/>

                            <p class="card-text">
                              {{ appointment.city }}
                            </p>

                            <button
                              type="button"
                              class="btn btn-primary w-100"
                              (click)="onReserveAppointment(appointment)"
                              [disabled]="isLoading()">
                              Rezerwuj&nbsp;
                              {{ appointment.dateTimeFrom | date: 'HH:mm' }}
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </ng-template>
            </li>
          }
        </ul>

        <div [ngbNavOutlet]="nav" class="mt-2"></div>
      }
    }
  `,
  styles: ``
})
export class ReservationsComponent {
  appointments = input<Appointment[]>([]);
  isLoading = input<boolean>(false);

  reserveAppointment = output<Appointment>();
  activeId: string | null = null;

  onReserveAppointment(appointment: Appointment) {
    this.reserveAppointment.emit(appointment);
  }
}
