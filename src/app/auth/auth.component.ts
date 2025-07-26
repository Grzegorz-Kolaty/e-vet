import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";

// container component
@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  template: `
    <section class="background__paws h-100 pt-5">
      <div class="container col-12 col-md-6 col-lg-4 p-0">
        <div class="p-4 p-xl-5 rounded-5 glass shadow-lg border border-1">
          <router-outlet/>
        </div>
      </div>
    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthComponent {}
