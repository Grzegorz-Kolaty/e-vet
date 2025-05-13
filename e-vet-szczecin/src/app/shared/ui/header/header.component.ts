import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FaIconComponent, FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {
  faBars,
  faCalendarDays,
  faGear,
  faNotesMedical,
  faPaw,
  faStore,
  faUser, faUserGear
} from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../../data-access/auth.service";
import {Role} from "../../interfaces/user.interface";

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FaIconComponent, NgbPopover],
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav class="navbar navbar-expand-sm shadow-lg bg-dark py-2 text-white lead">
      <div class="container-md justify-content-center justify-content-sm-between">

        <button class="btn bg-transparent text-white d-inline-flex"
                type="button"
                [routerLink]="['home']">
          <fa-icon [icon]="['fas', 'paw']" size="xl"/>
          <span class="mx-2">{{ appTitle }}</span>
        </button>

        <div class="d-inline-flex gap-4">

          @if (!authService.user() || !authService.user()?.emailVerified) {
            <button class="btn btn-outline-light border-3 rounded-4 shadow-lg"
                    routerLinkActive="active"
                    [routerLink]="['auth']">
              Zaczynamy&nbsp;🩺
            </button>
          } @else {
            <a class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
               routerLinkActive="active"
               [routerLink]="['dashboard']">
              Dashboard&nbsp;🩺
            </a>

            <a class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
               routerLinkActive="active"
               [routerLink]="['clinics']">
              Kliniki&nbsp;🏥
            </a>


            <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                    routerLinkActive="active"
                    [routerLink]="['appointments', 'browse']">
              Rezerwacja wizyt&nbsp;📅
            </button>

            @if (authService.role() === Role.Vet) {
              <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                      routerLinkActive="active"
                      [routerLink]="['appointments', 'create']">
                Planner terminów&nbsp;💌
              </button>
            }

            <button class="btn btn-outline-primary text-white border-3 border-dark rounded-4 shadow-lg"
                    [ngbPopover]="popoverContent"
                    placement="bottom"
                    triggers="click"
                    container="body"
                    popoverClass="custom-popover bg-dark">
              <fa-icon [icon]="['fas', 'bars']" size="lg"></fa-icon>

              <ng-template #popoverContent>
                <button class="btn text-white border-0"
                        routerLinkActive="active"
                        [routerLink]="['profile']">

                  <fa-icon [icon]="['fas', 'user-gear']" size="xl"></fa-icon>
                  <br>
                  Profile
                </button>

                <hr class="text-white"/>
                <button type="button"
                        class="btn btn-outline-light rounded-4 border-0"
                        (click)="authService.logout()">
                  Wyloguj
                </button>

              </ng-template>
            </button>

          }
        </div>

      </div>
    </nav>
  `,
  styles: `
    .custom-popover {
      width: 15% !important;
    }

    .popover-body {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      text-align: center;
    }
  `
})
export class HeaderComponent {
  public readonly appTitle = "PetCare"
  public readonly authService = inject(AuthService);
  public library = inject(FaIconLibrary);

  constructor() {
    this.library.addIcons(faPaw, faStore, faUser, faNotesMedical, faCalendarDays, faGear, faBars, faUserGear)
  }

  protected readonly Role = Role;
}
