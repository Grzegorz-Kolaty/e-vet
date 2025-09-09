import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";

// container component
@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  template: `
    <section class="background__paws h-100 row g-0 justify-content-center align-items-center">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="p-5 rounded-5 glass shadow-sm">
          <router-outlet></router-outlet>
        </div>
      </div>
    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthComponent {}
