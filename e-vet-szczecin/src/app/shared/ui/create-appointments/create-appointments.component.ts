import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-appointments',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      type="text"
      [formControl]="appointmentControl"
      placeholder="type a message..." />
    <button
      (click)="
        create.emit(appointmentControl.value); appointmentControl.reset()
      ">
      send
    </button>
  `,
})
export class CreateAppointmentsComponent {
  create = output();
  appointmentControl = new FormControl();
}
