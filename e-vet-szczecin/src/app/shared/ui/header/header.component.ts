import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../data-access/auth.service';
import {Role} from '../../interfaces/user.interface';
import {UserPopoverComponent} from './user-popover/user-popover.component';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    UserPopoverComponent,
    FaIconComponent,
  ],
  template: `
    <nav class="navbar navbar-expand-sm shadow-lg bg-dark text-light h-100">
      <div class="container-fluid flex-column flex-md-row gap-2">
        @let user = userProfile();
        @let role = userRole();

        <button
          class="btn btn-lg text-secondary border-0"
          [routerLink]="user ? 'dashboard' : 'home'">
          <div class="d-inline-flex align-items-center gap-3">
            <fa-icon [icon]="['fas', 'paw']" size="2xl"></fa-icon>


            <h3 class="m-0 fw-bolder">{{ appTitle }}</h3>

            @if (user && !!role) {
              <span class="text-light lead">
                Panel {{ role === Role.User ? 'użytkownika' : 'weterynarza' }}
              </span>
            }
          </div>
        </button>

        @if (!user) {
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div
            class="collapse navbar-collapse justify-content-end btn-group-lg"
            id="navbarSupportedContent">
            <button
              class="btn btn-outline-light border-0 mx-1"
              routerLinkActive="active"
              routerLink="/home">
              Home
            </button>
            <button
              class="btn btn-outline-light border-0 mx-1"
              routerLinkActive="active"
              routerLink="/auth/register">
              Register
            </button>
            <button
              class="btn btn-outline-light border-0 mx-1"
              routerLinkActive="active"
              routerLink="/auth/login">
              Login
            </button>
          </div>
        } @else {
          <app-user-popover [user]="user" (logout)="authService.logout()"/>
        }
      </div>
    </nav>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
  appTitle = 'PetCare';
  protected readonly Role = Role;

  userProfile = this.authService.user;
  userRole = this.authService.userRole;
}
