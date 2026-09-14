import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from '../../shared/ui/header/header.component';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-header/>

      <main class="d-flex flex-column flex-grow-1">
        <router-outlet/>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {}
