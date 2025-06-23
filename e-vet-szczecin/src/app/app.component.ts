import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from './shared/data-access/auth.service';
import {FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {
  faBars,
  faCalendarDays,
  faGear, faLocationDot, faMagnifyingGlass, faMap,
  faNotesMedical,
  faPaw,
  faStore,
  faUser, faUserGear
} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <router-outlet/>
  `,
})
export class AppComponent {
  readonly authService = inject(AuthService);
  private readonly library = inject(FaIconLibrary);

  constructor() {
    this.library.addIcons(
      faPaw, faStore, faUser, faNotesMedical, faCalendarDays,
      faGear, faBars, faUserGear, faLocationDot, faMap, faMagnifyingGlass
    );
  }
}
