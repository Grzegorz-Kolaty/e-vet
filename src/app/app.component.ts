import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <a routerLink="/auth">Auth</a>
    <a routerLink="/auth/login">Login</a>
    <a routerLink="/auth/register-user">Register</a>
    <a routerLink="/dashboard/vet">Dashboard VET</a>
    <a routerLink="/dashboard/user">Dashboard USER</a>

    <router-outlet/>
  `,
})
export class AppComponent {}

