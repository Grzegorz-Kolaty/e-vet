import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Appointment } from '../../interfaces/user.interface';

@Component({
  selector: 'app-appointments-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (appointment of appointments(); track appointment.id) {
        <li>
          {{ appointment }}
          <button (click)="reserve.emit(appointment)">Reserve</button>
          <button (click)="deleteReservation.emit(appointment)">Delete</button>
        </li>
      }
    </ul>
  `,
})
export class AppointmentsListComponent {
  appointments = input.required<Appointment[]>();
  reserve = output<Appointment>();
  deleteReservation = output<Appointment>();
  delete = output<Appointment>();
}
