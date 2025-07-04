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


  constructor() {
    this.library.addIcons(
      faPaw, faStore, faUser, faNotesMedical, faCalendarDays,
      faGear, faBars, faUserGear, faLocationDot, faMap, faMagnifyingGlass
    );

    this.authService.user$.pipe(takeUntilDestroyed()).subscribe(async (user) => {
      if (user) {
        console.log('appComponent user exist')

        const token = await user.getIdToken()
        const userDeserialized = this.authService.deserializeUserToken(token)
        this.authService.user.set(userDeserialized)
        this.authService.firebaseUser.set(user)
      } else {
        this.authService.user.set(null)
        this.authService.firebaseUser.set(null)
      }
    })

    // fallback for scenario when
    // user logs in without email verification
    // reassures reload token and user in Firebase
    effect(() => {
      if (this.authService.firebaseUser() && this.authService.firebaseUser()?.emailVerified && !this.authService.user()?.email_verified) {
        console.log('AppComponent firebaase user exist, firebase user email is Verified but authService.user(). email is not')
        this.authService.reloadUser()
      }
    })

  }

}
