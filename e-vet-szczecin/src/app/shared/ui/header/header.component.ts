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
    <nav class="navbar navbar-expand-sm shadow-lg bg-dark py-2 text-white lead">
      <div class="container-md justify-content-center justify-content-sm-between">

        <button class="btn bg-transparent text-white d-inline-flex"
                type="button"
                [routerLink]="['home']">
          <fa-icon [icon]="['fas', 'paw']" size="xl"/>
          <span class="mx-2">{{ appTitle }}</span>
        </button>

        <div class="d-inline-flex gap-4">
          @if (!user()) {
            <button class="btn btn-outline-light border-3 rounded-4 shadow-lg"
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

            @if (!user()?.email_verified) {
              <button class="btn btn-outline-info border-3 border-dark rounded-4 shadow-lg"
                      (click)="authService.initiateEmail()">
                Ponów email weryfikacyjny
              </button>
            } @else {
              <span [ngbPopover]="!user()?.email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                    triggers="mouseenter:mouseleave"
                    tabindex="0">
              <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                      routerLinkActive="active"
                      [routerLink]="['clinics']"
                      [disabled]="!user()?.email_verified"
                      [attr.aria-disabled]="!user()?.email_verified">
                {{ user()?.role === Role.User ? 'Przeglądaj kliniki' : 'Twoja klinika' }}&nbsp;🏥
              </button>
            </span>

              @if (role === Role.User) {
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
                  <button class="btn btn-outline-light rounded-4 border-0"
                          type="button"
                          (click)="authService.logout()">
                    Wyloguj
                  </button>
                </ng-template>
              </button>
            }
          }
        </div>
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
