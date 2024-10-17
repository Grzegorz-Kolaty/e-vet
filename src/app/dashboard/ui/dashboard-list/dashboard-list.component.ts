import { Component, input, output } from '@angular/core';
import { Appointment } from "../../data-access/appointments.service";

@Component({
  selector: 'app-dashboard-list',
  standalone: true,
  imports: [],
  template: `
        <ul>
            @for (appointment of appointments(); track appointment.id) {
                <li>
                    {{ appointment.content }}
                    <button (click)="reserve.emit(appointment)">Reserve</button>
                    <button (click)="deleteReservation.emit(appointment)">Delete</button>
                </li>
            }
        </ul>
    `
})
export class DashboardListComponent {
  appointments = input.required<Appointment[]>()
  reserve = output<Appointment>()
  deleteReservation = output<Appointment>()
  delete = output<Appointment>()


}
