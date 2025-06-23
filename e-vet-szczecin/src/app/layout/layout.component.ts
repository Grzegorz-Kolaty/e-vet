import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {HeaderComponent} from '../shared/ui/header/header.component';
import {SidebarComponent} from '../shared/ui/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [
    HeaderComponent,
    RouterOutlet,
    // SidebarComponent // Include SidebarComponent here if you intend to use it in the template
  ],
  template: `
    <div class="layout-container">
      <app-header/>
      <div class="content-wrapper">
        <!--                <app-sidebar></app-sidebar>-->
        <main class="main-content">
          <router-outlet/>
        </main>
      </div>
    </div>
  `,
  styles: `
    .layout-container {
      display: flex;
      flex-flow: column nowrap;
      min-height: 100vh;
    }

    .content-wrapper {
      display: flex;
      flex: 1;
    }

    .main-content {
      flex: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
}
