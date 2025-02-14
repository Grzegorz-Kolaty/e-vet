import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './shared/ui/header/header.component';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faCalendarDays, faNotesMedical, faPaw, faStore, faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header/>
    <router-outlet/>
  `,
  styles: ``
})
export class AppComponent {
  library = inject(FaIconLibrary);

  constructor() {
    this.library.addIcons(faPaw, faStore, faUser, faNotesMedical, faCalendarDays);
  }
}
