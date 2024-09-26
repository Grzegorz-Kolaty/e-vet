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
    <app-dashboard-list
      [appointments]="appointmentsService.appointments()"
      (reserve)="appointmentsService.patch$.next($event)"
      (deleteReservation)="appointmentsService.delete$.next($event)"
    />

    <button (click)="checkDataFromService()">GetApS</button>
    <button (click)="this.authService.setCustomClaims().subscribe()">update claims</button>
    <button (click)="this.authService.getNumbersFunction()">update claims</button>
  `
})
export default class DashboardUserComponent {
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


  setClaimsForUser() {

    // const userId = this.authService.user()?.uid
    //
    // if (userId) {
    //   const claims = {role: "admin"}; // Przykład custom claims
    //   this.authService.setCustomClaims(userId, claims).subscribe(
    //     (response) => {
    //       console.log(response); // Odbiór wiadomości sukcesu z Firebase
    //     },
    //     (error) => {
    //       console.error('Błąd przy ustawianiu custom claims:', error);
    //     }
    //   );
    // }
  }

  checkDataFromService() {
    console.log(this.appointmentsService.appointments());
  }
}
