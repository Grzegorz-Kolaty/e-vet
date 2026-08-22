import {ChangeDetectionStrategy, Component, output} from '@angular/core';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-pet-nav',
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavContent,
    NgbNavOutlet,
    NgbNavLinkButton
  ],
  template: `
    <ul ngbNav #nav="ngbNav"
        [(activeId)]="activeTab"
        (activeIdChange)="tabChanged.emit($event)"
        class="nav-underline">

      <li [ngbNavItem]="1">
        <button ngbNavLink class="fw-semibold px-2">Nadchodzące wizyty</button>
        <ng-template ngbNavContent>
          <ng-content select="[appointments]"></ng-content>
        </ng-template>
      </li>

      <li [ngbNavItem]="2">
        <button ngbNavLink class="fw-semibold px-2">Historia leczenia</button>
        <ng-template ngbNavContent>
          <ng-content select="[history]"></ng-content>
        </ng-template>
      </li>
    </ul>

    <div [ngbNavOutlet]="nav" class="mt-4"></div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetNav {
  activeTab = 1;

  tabChanged = output<number>();
}
