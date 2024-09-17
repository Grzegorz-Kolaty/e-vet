import {Component, output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-create-appointments',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <input
      type="text"
      [formControl]="appointmentControl"
      placeholder="type a message..."
    />
    <button
      (click)="send.emit(appointmentControl.value); appointmentControl.reset()"
    >
      send
    </button>`
})
export class CreateAppointmentsComponent {
  send = output()

  appointmentControl = new FormControl()
}
