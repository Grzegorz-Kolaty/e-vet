import {Component, effect, inject} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";
import {DashboardListComponent} from "../ui/dashboard-list/dashboard-list.component";
import {AppointmentsService} from "../data-access/appointments.service";
import {CreateAppointmentsComponent} from "../ui/create-appointments/create-appointments.component";

@Component({
  selector: 'app-dashboard-vet',
  standalone: true,
  imports: [DashboardListComponent, CreateAppointmentsComponent],
  providers: [AppointmentsService],
  templateUrl: "dashboard-vet.component.html"
})
export default class DashboardVetComponent {
  authService = inject(AuthService);
  appointmentsService = inject(AppointmentsService)
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['auth', 'login'])
      }
    });
  }

  checkDataFromService() {
    console.log(this.appointmentsService.appointments());
  }
}
