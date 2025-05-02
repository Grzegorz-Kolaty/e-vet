import {
  Component,
  inject,
  input, output,
  ViewEncapsulation
} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Role} from '../../interfaces/user.interface';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {User} from 'firebase/auth';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    FaIconComponent,
    NgbPopover],
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav class="navbar navbar-expand-sm shadow-lg bg-dark py-3 text-light">
      <div class="container-md justify-content-center justify-content-sm-between">
        <a class="navbar-brand"
           [routerLink]="userinfo() ? 'dashboard' : 'home'">
          <fa-icon [icon]="['fas', 'paw']" size="2xl"/>

          <span class="fw-bolder mx-3">{{ appTitle }}</span>
        </a>

        @if (!userinfo()) {
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
              [routerLink]="['auth', 'register', Role.User]">
              Rejestracja
            </button>

            <button
              class="btn btn-outline-light border-0"
              routerLinkActive="active"
              [routerLink]="['auth', 'register', Role.Vet]">
              Rejestracja weterynarzy
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

            @if (userinfo()?.photoURL) {
              <img
                [src]="userinfo()?.photoURL"
                class="rounded-3"
                width="48"
                height="48"
                alt="profilePic"/>
            } @else {
              <fa-icon [icon]="['fas', 'user']" size="xl"></fa-icon>
            }

            <div class="d-inline-flex flex-column flex-nowrap text-start">

              <span class="fw-semibold">
                {{ userinfo()?.displayName ?? 'uzupełnij profil' }}
              </span>

              <span>{{ userinfo()?.email }}</span>
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
                (click)="logoutUser.emit()">
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
    }

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
  appTitle = 'PetCare';

  userinfo = input<User | null>(null);


  logoutUser = output<void>()
  router = inject(Router);

  protected readonly Role = Role;

}
