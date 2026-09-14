import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faArrowRight,
  faCircleCheck,
  faHospital,
  faPlus,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import {OnboardingStepHeaderComponent} from '../../ui/onboarding-step-header/onboarding-step-header.component';

@Component({
  selector: 'app-vet-workplace',
  imports: [RouterLink, FontAwesomeModule, OnboardingStepHeaderComponent],
  template: `
    <div class="mx-auto" style="max-width: 980px">
      <app-onboarding-step-header
        eyebrow="Onboarding weterynarza"
        title="Gdzie będziesz pracować?"
        description="Wybierz pierwszą placówkę. Docelowo jeden weterynarz może należeć do kilku klinik jednocześnie."
        processLabel="Miejsce pracy"
        [step]="1"
        [steps]="2"/>

      <div class="alert alert-success border-0 shadow-sm rounded-4 d-flex align-items-center gap-3 mb-5">
        <fa-icon [icon]="faCircleCheck" class="fs-5"/>
        <div>
          <strong>Tożsamość lekarza jest gotowa.</strong>
          <span class="ms-1">Adres e-mail jest zweryfikowany; ten etap docelowo wymaga również zweryfikowanego PWZ.</span>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-6">
          <section class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body p-4 p-xl-5 d-flex flex-column">
              <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
                <span
                  class="d-inline-flex align-items-center justify-content-center rounded-4 bg-primary-subtle text-primary fs-4"
                  style="width: 56px; height: 56px">
                  <fa-icon [icon]="faStethoscope"/>
                </span>
                <span class="badge rounded-pill bg-primary-subtle text-primary-emphasis">Najczęstszy wybór</span>
              </div>

              <div class="small text-primary fw-semibold mb-2">Dla lekarzy pracujących w istniejącej placówce</div>
              <h2 class="h3 fw-bold">Dołącz do istniejącej kliniki</h2>
              <p class="text-body-secondary">
                Wyszukaj klinikę po nazwie, mieście lub NIP i wyślij prośbę do administratora placówki.
              </p>

              <ul class="list-unstyled d-grid gap-3 my-4">
                <li class="d-flex gap-2">
                  <fa-icon [icon]="faCircleCheck" class="text-success mt-1"/>
                  <span>Dostęp do grafiku otrzymasz dopiero po zaakceptowaniu zgłoszenia.</span>
                </li>
                <li class="d-flex gap-2">
                  <fa-icon [icon]="faCircleCheck" class="text-success mt-1"/>
                  <span>Uprawnienia w placówce nadaje jej administrator.</span>
                </li>
                <li class="d-flex gap-2">
                  <fa-icon [icon]="faCircleCheck" class="text-success mt-1"/>
                  <span>W przyszłości możesz dołączyć także do kolejnych klinik.</span>
                </li>
              </ul>

              <a
                routerLink="../join"
                class="btn btn-primary btn-lg mt-auto d-flex align-items-center justify-content-center gap-2">
                Szukaj kliniki i dołącz
                <fa-icon [icon]="faArrowRight"/>
              </a>
            </div>
          </section>
        </div>

        <div class="col-lg-6">
          <section class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body p-4 p-xl-5 d-flex flex-column">
              <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
                <span
                  class="d-inline-flex align-items-center justify-content-center rounded-4 bg-primary-subtle text-primary fs-4"
                  style="width: 56px; height: 56px">
                  <fa-icon [icon]="faHospital"/>
                </span>
                <span class="badge rounded-pill text-bg-light border">Nowa placówka</span>
              </div>

              <div class="small text-body-secondary fw-semibold mb-2">
                Dla właściciela lub osoby uprawnionej do prowadzenia profilu placówki
              </div>
              <h2 class="h3 fw-bold">Utwórz profil nowej kliniki</h2>
              <p class="text-body-secondary">
                Przejdź przez istniejący proces wyboru lokalizacji i danych kliniki. Mapa, adres i obecne parametry pracy pozostają zachowane.
              </p>

              <ul class="list-unstyled d-grid gap-3 my-4">
                <li class="d-flex gap-2">
                  <fa-icon [icon]="faCircleCheck" class="text-success mt-1"/>
                  <span>Tworzenie kliniki następuje dopiero po ukończeniu rejestracji i weryfikacji konta.</span>
                </li>
                <li class="d-flex gap-2">
                  <fa-icon [icon]="faCircleCheck" class="text-success mt-1"/>
                  <span>Zachowujemy wybór województwa, wyszukiwanie adresu, mapę i formularz kliniki.</span>
                </li>
                <li class="d-flex gap-2">
                  <fa-icon [icon]="faCircleCheck" class="text-success mt-1"/>
                  <span>Docelowo utworzenie placówki będzie tworzyło membership OWNER/ACTIVE.</span>
                </li>
              </ul>

              <a
                routerLink="../create"
                class="btn btn-outline-primary btn-lg mt-auto d-flex align-items-center justify-content-center gap-2">
                Utwórz nową klinikę
                <fa-icon [icon]="faPlus"/>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VetWorkplaceComponent {
  protected readonly faArrowRight = faArrowRight;
  protected readonly faPlus = faPlus;
  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faHospital = faHospital;
  protected readonly faStethoscope = faStethoscope;
}
