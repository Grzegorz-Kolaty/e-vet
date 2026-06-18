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
    @let user = this.authService.user();

    <nav class="row g-0 flex-column flex-md-row align-items-center shadow-lg bg-dark text-white p-3">
      <div class="col text-center text-md-start ">

        <button class="btn bg-transparent text-white d-inline-flex px-0"
                type="button"
                [routerLink]="['home']">
          <fa-icon [icon]="['fas', 'paw']" size="xl"/>
          <span class="mx-2 title fw-semibold">
            {{ appTitle }}
          </span>
        </button>
      </div>

      <div class="col text-start">
        @if (user && user.role) {
          <h3 class="lead my-3 my-lg-0 mx-auto">
            {{
              user.role === Role.User
                ? 'Panel&nbsp;opiekuna&nbsp;zwierzaków&nbsp;🐕‍🦺'
                : 'Panel&nbsp;weterynarza '
            }}
          </h3>
        } @else {
          <h5 class="mb-0 fw-light d-none d-lg-block">Prosta platforma wspierająca leczenie zwierzątek</h5>
        }
      </div>

      <div class="col">
        <div class="d-flex flex-md-row align-items-center justify-content-end flex-column">
          @if (!user) {
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

            @if (user.role === Role.User) {
              <span [ngbPopover]="!user?.is_email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                    triggers="mouseenter:mouseleave"
                    tabindex="0">
              <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                      routerLinkActive="active"
                      [routerLink]="['pets']"
                      [disabled]="!user?.is_email_verified"
                      [attr.aria-disabled]="!user?.is_email_verified">
                Twoje&nbsp;zwierzaki&nbsp;📋
              </button>
              </span>

              <span [ngbPopover]="!user?.is_email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                    triggers="mouseenter:mouseleave"
                    tabindex="0">
                <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                        routerLinkActive="active"
                        [routerLink]="['clinics', 'browse-clinics']"
                        [class.disabled]="!user?.is_email_verified"
                        [attr.aria-disabled]="!user?.is_email_verified">
                  Wyszukaj&nbsp;klinikę&nbsp;💌
                </button>
              </span>

              <span [ngbPopover]="!user?.is_email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                    triggers="mouseenter:mouseleave"
                    tabindex="0">
                <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                        routerLinkActive="active"
                        [routerLink]="['appointments', 'history']"
                        [class.disabled]="!user?.is_email_verified"
                        [attr.aria-disabled]="!user?.is_email_verified">
                  Twoje&nbsp;rezerwacje&nbsp;💌
                </button>
              </span>
            }

            @if (user.role === Role.Vet) {
              <span [ngbPopover]="!user?.is_email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                    triggers="mouseenter:mouseleave"
                    tabindex="0">
                  <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                          routerLinkActive="active"
                          [routerLink]="['clinics', 'vet-clinic', user.clinic_id]"
                          [disabled]="!user?.is_email_verified"
                          [attr.aria-disabled]="!user?.is_email_verified">
                    Twoja&nbsp;klinika&nbsp;🏥
                  </button>
                </span>

              <span [ngbPopover]="!user?.is_email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                    triggers="mouseenter:mouseleave"
                    tabindex="0">
                <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                        routerLinkActive="active"
                        [routerLink]="['appointments', 'history']"
                        [class.disabled]="!user?.is_email_verified"
                        [attr.aria-disabled]="!user?.is_email_verified">
                  Twoje&nbsp;rezerwacje&nbsp;💌
                </button>
              </span>

              <span [ngbPopover]="!user?.is_email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                    triggers="mouseenter:mouseleave"
                    tabindex="0">
                <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                        routerLinkActive="active"
                        [routerLink]="['appointments', 'create']"
                        [class.disabled]="!user?.is_email_verified"
                        [attr.aria-disabled]="!user?.is_email_verified">
                  Planner&nbsp;terminów&nbsp;💌
                </button>
              </span>
              <span [ngbPopover]="!user?.is_email_verified ? 'Zweryfikuj mail, aby uzyskać dostęp' : null"
                    triggers="mouseenter:mouseleave"
                    tabindex="0">
                  <button class="btn btn-outline-light border-3 border-dark rounded-4 shadow-lg"
                          routerLinkActive="active"
                          [routerLink]="['clinics', 'create-clinic']"
                          [disabled]="!user?.is_email_verified"
                          [attr.aria-disabled]="!user?.is_email_verified">
                    Tworzenie&nbsp;kliniki&nbsp;🏥
                  </button>
                </span>

            }

            <button class="btn btn-outline-primary text-white border-3 border-dark rounded-4 shadow-lg"
                    [ngbPopover]="popoverContent"
                    placement="bottom"
                    triggers="click"
                    container="body"
                    popoverClass="custom-popover bg-dark"
                    [disabled]="!user">
              <fa-icon [icon]="['fas', 'bars']" size="lg">
              </fa-icon>

              <ng-template #popoverContent>
                <button class="btn btn-outline-light rounded-4 border-0"
                        type="button"
                        (click)="logout()">
                  Wyloguj
                </button>
              </ng-template>
            </button>
          }
        </div>

      </div>
    </nav>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  protected authService = inject(AuthService);
  public readonly appTitle = "PetCare"

  async logout() {
     await this.authService.logout();
  }


  protected readonly Role = Role;
}
