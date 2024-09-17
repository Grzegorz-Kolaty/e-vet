import {Component, effect, inject} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";
import {DashboardListComponent} from "../ui/dashboard-list/dashboard-list.component";
import {AppointmentsService} from "../data-access/appointments.service";
import {CreateAppointmentsComponent} from "../ui/create-appointments/create-appointments.component";

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [DashboardListComponent, CreateAppointmentsComponent],
  providers: [AppointmentsService],
  template: `
    <p>dashboard works!</p>
    <button (click)="logout()">Wyloguj</button>
    <app-dashboard-list [appointments]="appointmentsService.appointments()"
                        (reserve)="appointmentsService.patch$.next($event)"
                        (delete)="appointmentsService.delete$.next($event)"/>
    <app-create-appointments (send)="appointmentsService.add$.next($event)"/>
    <button (click)="checkDataFromService()">GetApS</button>
  `
})
export default class DashboardUserComponent {
  authService = inject(AuthService);
  appointmentsService = inject(AppointmentsService)
  private router = inject(Router);

  logout() {
    this.authService.logout();
  }

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
