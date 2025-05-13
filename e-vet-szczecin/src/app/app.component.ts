import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './shared/ui/header/header.component';
import {environment} from "../environments/environment";
import {APPCHECK} from "./firebase.providers";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <div class="d-flex flex-column flex-nowrap h-100">
    <app-header/>
      <div class="flex-fill">
    <router-outlet/>
      </div>
    </div>
  `,
  styles: ``
})
export class AppComponent {
  appCheck = inject(APPCHECK)

  constructor() {
    // console.log('env', environment);
    // console.log(this.appCheck);
  }
}
