import {Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AUTH} from './app.config';
import {HeaderComponent} from './shared/ui/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header/>
    <router-outlet/>`,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  auth = inject(AUTH)
  title = 'e-vet-szczecin';
}
