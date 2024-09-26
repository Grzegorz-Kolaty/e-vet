import {Component, inject} from '@angular/core';
import {RegisterFormComponent} from "../register-user/ui/register-form/register-form.component";
import {RegisterService} from "../register-user/data-acess/register.service";

@Component({
  selector: 'app-register-vet',
  standalone: true,
  imports: [RegisterFormComponent],
  template: `
    <div class="container-fluid">
      <app-register-form (registerClinic)="this.registerService.createUser$.next($event)"/>
    </div>
  `
})
export default class RegisterVetComponent {
  public registerService = inject(RegisterService);
}
