import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";

// container component
@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  template: `
    <section class="background__paws background__coloured h-100">
      <div class="mt-5 row h-100 justify-content-center align-content-start">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="p-4 p-xl-5 rounded-5 glass shadow-lg border border-1">
            <router-outlet/>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthComponent {}
