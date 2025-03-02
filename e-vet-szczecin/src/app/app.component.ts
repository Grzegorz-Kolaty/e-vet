import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './shared/ui/header/header.component';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {faCalendarDays, faNotesMedical, faPaw, faStore, faUser} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from './shared/data-access/auth.service';
import {SidebarComponent} from './shared/ui/sidebar/sidebar.component';


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
export class AppComponent {
  public authService = inject(AuthService);
  public library = inject(FaIconLibrary);

  constructor() {
    this.library.addIcons(faPaw, faStore, faUser, faNotesMedical, faCalendarDays);
  }
}
