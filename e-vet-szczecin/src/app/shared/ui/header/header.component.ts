import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../data-access/auth.service';
import {Role} from '../../interfaces/user.interface';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    FaIconComponent,
    NgbPopover,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    @let user = userProfile();
    @let role = userRole();

    <nav class="navbar navbar-expand-sm shadow-lg bg-dark py-3 text-light">
      <div class="container-fluid justify-content-center justify-content-sm-between">

        <a class="navbar-brand"
           [routerLink]="user ? 'dashboard' : 'home'">
          <fa-icon [icon]="['fas', 'paw']" size="2xl"/>

          <span class="fw-bolder mx-3">{{ appTitle }}</span>

          @if (user && !!role) {
            <span class="text-light lead">
                Panel {{ role === Role.User ? 'użytkownika' : 'weterynarza' }}
              </span>
          }
        </a>

        @if (!user) {
          <div class="d-inline-flex gap-3">
            <button
              class="btn btn-outline-light border-0"
              routerLinkActive="active"
              routerLink="/home">
              Home
            </button>
            <button
              class="btn btn-outline-light border-0"
              routerLinkActive="active"
              routerLink="/auth/register">
              Register
            </button>
            <button
              class="btn btn-outline-light border-0"
              routerLinkActive="active"
              routerLink="/auth/login">
              Login
            </button>
          </div>
        } @else {
          <div class="d-inline-flex align-items-center gap-3 px-3"
               [ngbPopover]="popoverContent"
               placement="bottom"
               triggers="click"
               container="body"
               popoverClass="custom-popover">

            @if (user.photoURL) {
              <img
                [src]="user.photoURL"
                class="rounded-3"
                width="48"
                height="48"
                alt="profilePic"/>
            } @else {
              <fa-icon [icon]="['fas', 'user']" size="xl"></fa-icon>
            }

            <div class="d-inline-flex flex-column flex-nowrap text-start">
            <span class="fw-semibold">
              {{ user.displayName }}
            </span>
              <span>{{ user.email }}</span>
            </div>

            <ng-template #popoverContent>
              <button
                class="btn btn-outline-dark border-0"
                routerLinkActive="active"
                routerLink="/auth/profile">
                Profile
              </button>

              <button
                type="button"
                class="btn btn-outline-dark border-0"
                (click)="authService.logout()">
                Wyloguj
              </button>
            </ng-template>

          </div>
        }
      </div>

    </nav>
  `,
  styles: `
    .custom-popover {
      width: 100% !important;
    };

    .popover-body {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      text-align: center;
      font-size: 16px;
      gap: 1rem;
    }
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
  appTitle = 'PetCare';
  protected readonly Role = Role;

  userProfile = this.authService.user;
  userRole = this.authService.userRole;
}
