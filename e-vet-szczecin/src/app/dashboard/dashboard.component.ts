import {Component, inject} from '@angular/core';
import {AuthService} from '../shared/data-access/auth.service';
import {IncomingAppointmentsComponent} from '../shared/ui/incoming-appointments/incoming-appointments.component';

@Component({
    selector: 'app-dashboard',
    imports: [IncomingAppointmentsComponent],
    styles: ``,
    template: `
        <app-incoming-appointments></app-incoming-appointments>
    `,
})
export default class DashboardComponent {
    authService = inject(AuthService);
}
