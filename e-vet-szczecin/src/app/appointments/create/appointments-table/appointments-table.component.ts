import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output, signal,
} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Appointment} from '../../../shared/interfaces/user.interface';
import {CalendarService} from '../../../shared/data-access/calendar.service';
import {FormatHourPipe} from '../../../shared/pipes/format-hour.pipe';

@Component({
  selector: 'app-appointments-table',
  imports: [DatePipe, FormatHourPipe, FormatHourPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-responsive shadow rounded-4 text-nowrap text-start">
      <table class="table table-striped align-middle">
        <thead class="table-light">
        <tr>
          <th></th>
          @for (day of weekData(); track day.getDay()) {
            @if (isWeekend(day) && hideWeekends()) {
              <th class="visually-hidden"></th>
            } @else {
              <th class="py-3">
                {{ day | date: 'mediumDate' }}
              </th>
            }
          }
        </tr>
        </thead>

        <tbody>
          @for (hour of hoursOfDay(); track hour) {
            <tr>
              <th class="p-3">{{ hour | formatHour }}</th>

              @for (day of weekData(); track day.getDay()) {
                @if (isWeekend(day) && hideWeekends()) {
                  <td class="visually-hidden"></td>
                } @else if (isOutdated(day, hour)) {
                  <td class="text-muted">Po terminie</td>
                } @else if (isCreated(day, hour)) {

                  @if (isReserved(day, hour)) {
                    <td>
                      <button
                        class="btn btn-warning d-inline-flex gap-2 align-items-center justify-content-between w-100"
                        type="button"
                        [disabled]="true">
                        Zarezerwowany
                        {{ hour | formatHour }}
                      </button>
                    </td>
                  } @else {
                    <td>
                      <button
                        class="btn btn-success d-inline-flex gap-2 align-items-center justify-content-between w-100 danger__onhover"
                        (click)="onRemoveAppointment(day, hour)"
                        [disabled]="isLoading()"
                        aria-label="Remove appointment"
                        type="button">
                        <span class="default-text">Utworzony {{ hour | formatHour }}</span>
                        <span class="hover-text">Usuń {{ hour | formatHour }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                             class="bi bi-trash" viewBox="0 0 16 16">
                          <path
                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                          <path
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                      </button>
                    </td>
                  }
                } @else {
                  <td>
                    <button
                      class="btn btn-secondary d-inline-flex gap-2 align-items-center justify-content-between w-100"
                      type="button"
                      aria-label="Add appointment"
                      (click)="onAddAppointment(day, hour)"
                      [disabled]="isLoading()">
                      Dodaj
                      {{ hour | formatHour }}
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                           class="bi bi-calendar-plus" viewBox="0 0 16 16">
                        <path
                          d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7"/>
                        <path
                          d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                      </svg>
                    </button>
                  </td>
                }

              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .danger__onhover {
      &:hover {
        color: red !important;
        backdrop-filter: brightness(90%);
        cursor: pointer;
      }
    }

    .danger__onhover .hover-text {
      display: none;
    }

    .danger__onhover:hover .hover-text {
      display: inline;
    }

    .danger__onhover .default-text {
      display: inline;
    }

    .danger__onhover:hover .default-text {
      display: none;
    }
  `
})
export class AppointmentsTableComponent {
  calendarService = inject(CalendarService);
  hoursOfDay = computed(() => this.calendarService.getHoursOfDay());

  weekData = input<Date[]>([]);
  existingAppointments = input<Appointment[]>([]);
  isLoading = input<boolean>(false);
  hideWeekends = signal<boolean>(true);

  addAppointment = output<Date>();
  removeAppointment = output<Date>();


  /**
   * Sends request to add Appointment for specific day and hour
   */
  onAddAppointment(day: Date, hour: number): void {
    const dateWithTime = new Date(day.setHours(hour, 0, 0, 0));
    console.log(dateWithTime);
    this.addAppointment.emit(dateWithTime);
  }

  /**
   * Sends request to add Appointment for specific day and hour
   */
  onRemoveAppointment(day: Date, hour: number): void {
    const dateWithTime = new Date(day.setHours(hour, 0, 0, 0));
    console.log(dateWithTime);
    this.removeAppointment.emit(dateWithTime);
  }

  /**
   * Checks if appointment is created already
   * @param date - Date to parametrize for every hour
   * @param hour - Hour for every Time Slot available
   */
  isCreated(date: Date, hour: number): boolean {
    const dateAndTime = new Date(date.setHours(hour)).toISOString();

    return this.existingAppointments().some(
      appointment => appointment.dateTimeFrom === dateAndTime
    );
  }

  isReserved(date: Date, hour: number): boolean {
    const dateAndTime = new Date(date).setHours(hour, 0, 0, 0);
    const dateString = new Date(dateAndTime).toISOString();

    return this.existingAppointments().some(
      appointment => appointment.dateTimeFrom === dateString && appointment.reserved
    );
  }

  /**
   * Checks if appointment is outdated
   * @param date - Date to parametrize for every hour
   * @param hour - Hour for every Time Slot available
   */
  isOutdated(date: Date, hour: number): boolean {
    const dateAndTime = new Date(date.setHours(hour));
    const currentTime = new Date();

    return currentTime > dateAndTime;
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }
}
