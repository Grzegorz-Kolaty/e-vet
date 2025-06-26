import {Component, ChangeDetectionStrategy, inject, effect} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
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
  private readonly router = inject(Router)


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
        console.log(userDeserialized)
        this.authService.firebaseUser.set(user)
      } else {
        this.authService.user.set(null)
        this.authService.firebaseUser.set(null)
      }
    })
  }
}
