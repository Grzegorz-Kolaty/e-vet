import {Component, ChangeDetectionStrategy, inject, effect} from '@angular/core';
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
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
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
        <main class="main-content">
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
  readonly authService = inject(AuthService);
  private readonly library = inject(FaIconLibrary);


  constructor() {
    this.library.addIcons(
      faPaw, faStore, faUser, faNotesMedical, faCalendarDays,
      faGear, faBars, faUserGear, faLocationDot, faMap, faMagnifyingGlass
    );

    this.authService.user$.pipe(takeUntilDestroyed()).subscribe(async (user) => {
      if (user) {
        const token = await user.getIdToken()
        const userDeserialized = this.authService.deserializeUserToken(token)
        this.authService.user.set(userDeserialized)
        this.authService.firebaseUser.set(user)
      } else {
        this.authService.user.set(null)
        this.authService.firebaseUser.set(null)
      }
    })

  }

}
