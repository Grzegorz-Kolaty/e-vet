import {Component, inject} from '@angular/core';
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

        <button (click)="this.authService.setCustomClaimsToTrue().subscribe()">update claims to vet</button>

        <!--    <button (click)="this.appointmentsService.getAppointments().subscribe()">get apos</button>-->

    `
})
export default class DashboardUserComponent {
    authService = inject(AuthService);
    appointmentsService = inject(AppointmentsService);
    private router = inject(Router);

    constructor() {
        console.log('user dash hit')
        // effect(() => {
        //   if (!this.authService.user()) {
        //     this.router.navigate(['auth', 'login'])
        //   }
        // });
    }
}
