import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal, resource,
  signal,
} from '@angular/core';
import {AppointmentsService} from '../../shared/data-access/appointments.service';
import {AuthService} from '../../shared/data-access/auth.service';
import {User} from 'firebase/auth';
import {Appointment} from "../../shared/interfaces/user.interface";

@Component({
  selector: 'app-create',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <div class="row m-0 mb-4">
        <h4 class="text-center bg-dark-subtle p-3">Wskaż tydzień</h4>
      </div>

      <div class="alert alert-primary d-flex align-items-center m-4"
           role="alert">

        <svg class="bi bi-info-square m-3"
             xmlns="http://www.w3.org/2000/svg"
             width="30"
             height="30"
             fill="currentColor"
             viewBox="0 0 16 16">
          <path
            d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
          <path
            d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
        </svg>

        <div>
          Znajdujesz się w panelu zarządzania rezerwacjami - wskaż tydzień a
          następnie kliknij na slot godzinowy aby udostępnić dostępny termin
          pacjentom 🦝

          <br/>

          <span class="text-muted">
            Terminy są gotowe do rezerwacji od razu po udostępnieniu.
          </span>
        </div>
      </div>

      @let userProfile = user();

      @if (userProfile) {
        <div class="row mx-5">
          <div class="col text-center">
            <!--            <app-datepicker-range-->
            <!--              (weekSelection)="onSetWeekSelection($event)"/>-->
          </div>

          <!--          <button class="btn btn-outline-info" type="button" (click)="onConfirmUpdateAppointments()">-->
          <!--            Confirm-->
          <!--          </button>-->

          <div class="col-xxl-9">
            <!--            <app-appointments-table-->
            <!--              [weekData]="onSelectWeekSig()"-->
            <!--              [existingAppointments]="appointments()"-->
            <!--              (addAppointment)="onAddAppointment($event, userProfile)"-->
            <!--              (removeAppointment)="onRemoveAppointment($event, userProfile)"-->
            <!--              [isLoading]="isLoading()"/>-->
          </div>
        </div>
      }
    </section>
  `,
  styles: ``,
})
export default class CreateComponent {
  authService = inject(AuthService);
  appointmentService = inject(AppointmentsService);

  user = this.authService.firebaseUser;

  onSelectWeekSig = signal<Date[]>([]);
  onGetAppointmentsResource = resource({
    loader: async () => {
      return await this.appointmentService.getAppointmentsForVet(this.onSelectWeekSig());
    }
  });

  appointments = computed(() => this.onGetAppointmentsResource.value() ?? []);
  isLoading = linkedSignal(() => this.onGetAppointmentsResource.isLoading());

  buildAppointment(dateWithTime: Date, user: User): Appointment {
    const dateFormatted = dateWithTime.toISOString();
    const dateSplitted = dateFormatted.split('T');

    return {
      vetId: user.uid,
      vetDisplayName: user.displayName!,
      reserved: false,
      realised: false,
      city: 'Szczecin',
      dateTimeFrom: dateWithTime.toISOString(),
      dateTimeTo: dateWithTime.toISOString(),
      date: dateSplitted[0],
      time: dateSplitted[1],
    };
  }

  onSetWeekSelection(date: Date[]) {
    this.onSelectWeekSig.set(date);
  }

  async onAddAppointment(dateWithTime: Date, userProfile: User) {
    // this.isLoading.set(true);
    const appointment = this.buildAppointment(dateWithTime, userProfile);
    // this.onGetAppointmentsResource.update(
    //   appointments => appointments ? [appointment, ...appointments] : [appointment]
    // )
    await this.appointmentService.addAppointment(appointment)
    // this.appointmentService.addAppointment(appointment).subscribe({
    //   next: () => this.onGetAppointmentsResource.reload(),
    //   error: err => console.error(err),
    //   complete: () => this.isLoading.set(false),
    // });
    // toSignal(this.appointmentService.addAppointment(appointment))
  }

  // confirmUpdateAppointments
  // async onConfirmUpdateAppointments() {
  //   console.log(this.appointments())
  //   await this.appointmentService.addAppointment(this.appointments())
  // }

  onRemoveAppointment(dateWithTime: Date, userProfile: User) {
    this.isLoading.set(true);
    const appointment = this.buildAppointment(dateWithTime, userProfile);
    this.appointmentService.removeAppointment(appointment).subscribe({
      next: () => this.onGetAppointmentsResource.reload(),
      error: err => console.error(err),
      complete: () => this.isLoading.set(false),
    });
  }
}
