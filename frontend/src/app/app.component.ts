import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faBookMedical,
  faCalendar,
  faCalendarDay,
  faCalendarDays,
  faClock,
  faGear,
  faImage,
  faLocationDot,
  faMagnifyingGlass,
  faMap,
  faNotesMedical,
  faPaw,
  faPen,
  faPhone,
  faStore,
  faUser,
  faUserGear,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet/>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly library = inject(FaIconLibrary);

  constructor() {
    this.library.addIcons(
      faPaw,
      faStore,
      faUser,
      faNotesMedical,
      faCalendarDays,
      faGear,
      faBars,
      faUserGear,
      faLocationDot,
      faMap,
      faMagnifyingGlass,
      faBookMedical,
      faImage,
      faPhone,
      faClock,
      faCalendar,
      faPen,
      faCalendarDay,
    );
  }
}
