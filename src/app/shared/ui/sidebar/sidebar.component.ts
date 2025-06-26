import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, FaIconComponent],
  template: `
    <aside class="nav nav-pills flex-column flex-nowrap align-items-stretch gap-3 py-3 px-1 h-auto">
      <button
        class="text-sm-center nav-link"
        routerLinkActive="active"
        routerLink="/dashboard">
        <fa-icon [icon]="['fas', 'store']"></fa-icon>
        <br>
        <span class="d-none d-xl-inline">Dashboard</span>
      </button>

      <button
        class="text-sm-center nav-link"
        routerLinkActive="active"
        routerLink="/appointments/create">
        <fa-icon [icon]="['fas', 'notes-medical']"></fa-icon>
        <br>
        <span class="d-none d-xl-inline">Rezerwacje</span>
      </button>

      <button
        class="text-sm-center nav-link"
        routerLinkActive="active"
        routerLink="/appointments/browse">
        <fa-icon [icon]="['fas', 'calendar-days']"></fa-icon>
        <br>
        <span class="d-none d-xl-inline">Przegladaj</span>
      </button>

      <button
        class="text-sm-center nav-link"
        routerLinkActive="active"
        routerLink="/auth/profile">
        <fa-icon [icon]="['fas', 'user']"></fa-icon>
        <br>
        <span class="d-none d-xl-inline">Profile</span>
      </button>
    </aside>
  `,
})
export class SidebarComponent {

}
