import {AfterViewInit, ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './shared/ui/header/header.component';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faCalendarDays, faNotesMedical, faPaw, faStore, faUser} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from './shared/data-access/auth.service';
import {SidebarComponent} from './shared/ui/sidebar/sidebar.component';
import {environment} from '../environments/environment';
import {initializeAppCheck, ReCaptchaV3Provider, getToken} from 'firebase/app-check';
import {app} from './app.config';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex flex-column h-100">
      <app-header/>
      <div class="flex-fill">
        <div class="row row-cols-2 g-0 h-100">
          @if (authService.verifiedEmailedUser()) {
            <app-sidebar class="col-2 col-sm-1 shadow-lg z-1"/>
          }
          <div class="flex-fill">
            <router-outlet/>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AppComponent implements AfterViewInit {
  public authService = inject(AuthService);
  public library = inject(FaIconLibrary);

  constructor() {
    this.library.addIcons(faPaw, faStore, faUser, faNotesMedical, faCalendarDays)
  }

  async ngAfterViewInit() {
    console.log('production: ', environment.production, 'captchakey: ', environment.firebase.recaptchaToken);
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = environment.production ? false : environment.firebase.recaptchaToken
    console.log(app)
    const check = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(environment.firebase.recaptchaToken),
        isTokenAutoRefreshEnabled: true
      }
    )
    await getToken(check, true).then(r => console.log(r))
  }
}
