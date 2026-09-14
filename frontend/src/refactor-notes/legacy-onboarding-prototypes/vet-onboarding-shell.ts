import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faCircleCheck, faPaw} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vet-onboarding-shell',
  imports: [RouterLink, FontAwesomeModule],
  template: `
    <header class="bg-body border-bottom sticky-top">
      <div class="container-xl py-3 d-flex align-items-center justify-content-between gap-3">
        <a routerLink="/home"
           class="d-flex align-items-center gap-2 text-decoration-none text-body">
          <span class="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3"
                style="width: 42px; height: 42px">
            <fa-icon [icon]="faPaw"/>
          </span>

          <span class="d-none d-sm-flex flex-column lh-sm">
            <strong class="fs-5">e-vet</strong>
            <small class="text-body-secondary">Panel lekarza weterynarii</small>
          </span>
        </a>

        <div class="d-flex align-items-center gap-3">
          <div class="d-none d-md-block text-end lh-sm">
            <strong>{{ vetName() }}</strong>
            <div>
              <span class="badge rounded-pill bg-success-subtle text-success-emphasis mt-1">
                <fa-icon [icon]="faCircleCheck" class="me-1"/>
                PWZ zweryfikowane
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="bg-body-tertiary min-vh-100">
      <div class="container-xl py-4 py-lg-5">
        <ng-content/>
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VetOnboardingShell {
  readonly vetName = input('Jan Kowalski');

  protected readonly faPaw = faPaw;
  protected readonly faCircleCheck = faCircleCheck;
}
