import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from "../../data-access/auth.service";
import {Role} from "../../interfaces/user.interface";


@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FaIconComponent, NgbPopover],
  template: `
    @let role = authService.user()?.role;
    <nav
      class="navbar navbar-expand-sm flex-column flex-lg-row align-items-center shadow-lg bg-dark py-2 text-white lead">

      <button class="btn bg-transparent text-white d-inline-flex"
              type="button"
              [routerLink]="['home']">
        <fa-icon [icon]="['fas', 'paw']" size="xl"/>
        <span class="mx-2 title fw-semibold">
            {{ appTitle }}
          </span>
      </button>

      @if (role) {
        <h3 class="lead my-3 my-lg-0 mx-auto">
          {{
            role === Role.User
              ? 'Panel opiekuna zwierzaków 🐕‍🦺'
              : 'Panel weterynarza '
          }}
        </h3>
      }

      <div class="d-flex flex-md-row flex-column gap-4">
        @if (!user()) {
          <button class="btn px-4 btn-outline-light border-3 rounded-4 shadow-lg"
                  routerLinkActive="active"
                  [routerLink]="['auth']">
            Zaczynamy&nbsp;🩺
          </button>
        } @else {
          <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                  routerLinkActive="active"
                  [routerLink]="['dashboard']">
            Dashboard&nbsp;🩺
          </button>



          @if (role === Role.User) {
            <span [ngbPopover]="!user()?.email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                  triggers="mouseenter:mouseleave"
                  tabindex="0">
              <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                      routerLinkActive="active"
                      [routerLink]="['pets']"
                      [disabled]="!user()?.email_verified"
                      [attr.aria-disabled]="!user()?.email_verified">
                Twoje zwierzaki&nbsp;📋
              </button>
            </span>
            <span [ngbPopover]="!user()?.email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                  triggers="mouseenter:mouseleave"
                  tabindex="0">
              <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                      routerLinkActive="active"
                      [routerLink]="['appointments', 'browse']"
                      [disabled]="!user()?.email_verified"
                      [attr.aria-disabled]="!user()?.email_verified">
                Rezerwacja wizyt&nbsp;📅
              </button>
              </span>
          }

          @if (role === Role.Vet) {
            <span [ngbPopover]="!user()?.email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                  triggers="mouseenter:mouseleave"
                  tabindex="0">
              <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                      routerLinkActive="active"
                      [routerLink]="['clinics']"
                      [disabled]="!user()?.email_verified"
                      [attr.aria-disabled]="!user()?.email_verified">
                Twoja klinika&nbsp;🏥
              </button>
            </span>

            <span [ngbPopover]="!user()?.email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                  triggers="mouseenter:mouseleave"
                  tabindex="0">
                <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                        routerLinkActive="active"
                        [routerLink]="['appointments', 'create']"
                        [class.disabled]="!user()?.email_verified"
                        [attr.aria-disabled]="!user()?.email_verified">
                  Planner terminów&nbsp;💌
                </button>
              </span>
          }

          <button class="btn btn-outline-primary text-white border-3 border-dark rounded-4 shadow-lg"
                  [ngbPopover]="popoverContent"
                  placement="bottom"
                  triggers="click"
                  container="body"
                  popoverClass="custom-popover bg-dark"
                  [disabled]="!user()">
            <fa-icon [icon]="['fas', 'bars']" size="lg">
            </fa-icon>

            <ng-template #popoverContent>
              <button class="btn btn-outline-light rounded-4 border-0"
                      type="button"
                      (click)="authService.logout()">
                Wyloguj
              </button>
            </ng-template>
          </button>
        }

      </div>
    </nav>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  public readonly appTitle = "PetCare"
  public readonly authService = inject(AuthService);
  protected readonly Role = Role;

  user = this.authService.user
}
