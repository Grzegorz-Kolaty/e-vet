import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {
  faBars, faBookMedical,
  faCalendarDays, faClock,
  faGear, faImage, faLocationDot, faMagnifyingGlass, faMap,
  faNotesMedical,
  faPaw, faPhone,
  faStore,
  faUser, faUserGear
} from "@fortawesome/free-solid-svg-icons";
import {HeaderComponent} from "./shared/ui/header/header.component";


@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    RouterOutlet,
  ],
  template: `
    <div class="layout-container">
      <app-header></app-header>
      <div class="content-wrapper">
        <main class="main-content bg-body-secondary">
          <router-outlet/>
        </main>
      </div>
    </div>
  `,
  styles: `
    .layout-container {
      display: flex;
      flex-flow: column nowrap;
      min-height: 100vh;
    }

    .content-wrapper {
      display: flex;
      flex: 1;
    }

    .main-content {
      flex: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private library = inject(FaIconLibrary);

  constructor() {
    this.library.addIcons(
      faPaw, faStore, faUser, faNotesMedical, faCalendarDays,
      faGear, faBars, faUserGear, faLocationDot, faMap,
      faMagnifyingGlass, faBookMedical, faImage, faPhone, faClock
    );
  }
}
