import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {User} from "firebase/auth";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-user-popover',
  imports: [ RouterLink, RouterLinkActive, FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @let userData = user();

<!--    <button-->
<!--      type="button"-->
<!--      class="btn text-light border-0 d-flex gap-3 justify-content-center align-items-center"-->
<!--      [ngbPopover]="popoverContent"-->
<!--      placement="bottom"-->
<!--      triggers="click"-->
<!--      container="body"-->
<!--      popoverClass="custom-popover">-->

      <button
        type="button"
        class="btn text-light border-0 d-flex gap-3 justify-content-center align-items-center">
        @if (userData.photoURL) {
          <img
            [src]="userData.photoURL"
            class="rounded-3 img-fluid"
            width="48px"
            alt="profilePic"/>
        } @else {
          <fa-icon [icon]="['fas', 'user']" size="lg"></fa-icon>
        }

        <div class="d-flex flex-column align-items-start">
            <span class="fw-semibold">
              {{ userData.displayName }}
            </span>
          <span>{{ userData.email }}</span>
        </div>
      </button>

<!--    <ng-template #popoverContent>-->

    <div>
        <button
          class="btn btn-outline-dark border-0"
          routerLinkActive="active"
          routerLink="/auth/profile">
          Profile
        </button>

        <button
          type="button"
          class="btn btn-outline-dark border-0"
          (click)="logout.emit()">
          Wyloguj
        </button>
      </div>
  `,
  styles: `
    .popover-body {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      text-align: center;
      font-size: 16px;
      gap: 1rem;
    }

    .custom-popover {
      width: 100% !important;
    }

    /*.profile__picture--small {*/
    /*  width: 3rem;*/
    /*  height: 3rem;*/
    /*}*/
  `,
})
export class UserPopoverComponent {
  user = input.required<User>();
  logout = output<void>();
}
