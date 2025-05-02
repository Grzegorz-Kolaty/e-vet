import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './shared/ui/header/header.component';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faCalendarDays, faNotesMedical, faPaw, faStore, faUser} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from './shared/data-access/auth.service';
import {SidebarComponent} from './shared/ui/sidebar/sidebar.component';
// import {app} from "./app.config";
// import {initializeAppCheck, ReCaptchaV3Provider} from "firebase/app-check";
// import {environment} from "../environments/environment";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="d-flex flex-column h-100">
      <app-header [userinfo]="authService.user()" (logoutUser)="authService.logout()"/>
      <div class="flex-fill">
        <button type="button" class="btn btn-danger" (click)="getCheck()">getcheck</button>
        <div class="row row-cols-2 g-0 h-100">
          @if (authService.user()?.emailVerified) {
            <app-sidebar class="col-2 col-sm-1 shadow-lg z-1"/>
          }
          <div class="flex-fill">
            <router-outlet/>
          </div>
        </div>
      </div>
    </div>`,
  styles: ``
})
export class AppComponent {
  public authService = inject(AuthService);
  public library = inject(FaIconLibrary);

  constructor() {
    this.library.addIcons(faPaw, faStore, faUser, faNotesMedical, faCalendarDays)
  }

  getCheck() {
    console.log(window)
    try {
      // (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = environment.firebase.recaptchaToken

      // const check = initializeAppCheck(app, {
      //   provider: new ReCaptchaV3Provider(environment.firebase.recaptchaToken),
      //   isTokenAutoRefreshEnabled: true
      // })
    } catch (err) {
      console.log(err)
    }
  }
}
