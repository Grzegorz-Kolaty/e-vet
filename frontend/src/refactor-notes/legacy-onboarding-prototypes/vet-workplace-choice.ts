import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faArrowRight,
  faPlus,
  faCircleCheck,
  faHospital,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import {VetOnboardingShell} from "./vet-onboarding-shell";

@Component({
  selector: 'app-vet-workplace-choice',
  imports: [RouterLink, FontAwesomeModule, VetOnboardingShell],
  template: `
    <app-vet-onboarding-shell>
      <div class="mx-auto" style="max-width: 980px">
        <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <span class="badge rounded-pill bg-primary-subtle text-primary-emphasis align-self-start px-3 py-2">
            Miejsce pracy · krok 1 z 2
          </span>

          <div class="d-flex align-items-center gap-3">
            <small class="text-body-secondary">Konfiguracja miejsca pracy</small>
            <div class="progress" style="width: 160px; height: 7px" role="progressbar" aria-label="Postęp" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar" style="width: 50%"></div>
            </div>
          </div>
        </div>

        <div class="alert alert-success border-0 shadow-sm rounded-4 d-flex align-items-center gap-3 mb-5">
          <fa-icon [icon]="faCircleCheck" class="fs-5"/>
          <div>
            <strong>Tożsamość lekarza jest gotowa.</strong>
            <span class="ms-1">Adres e-mail i numer PWZ zostały zweryfikowane.</span>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-primary fw-semibold small text-uppercase mb-2">Onboarding weterynarza</div>
          <h1 class="display-6 fw-bold mb-2">Gdzie będziesz pracować?</h1>
          <p class="lead text-body-secondary mb-0">
            Wybierz pierwszą placówkę. Później możesz należeć do kilku klinik jednocześnie.
          </p>
        </div>

        <div class="row g-4">
          <div class="col-lg-6">
            <section class="card border-0 shadow-sm rounded-4 h-100">
              <div class="card-body p-4 p-xl-5 d-flex flex-column">
                <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
                  <span class="d-inline-flex align-items-center justify-content-center rounded-4 bg-primary-subtle text-primary fs-4"
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

                <a routerLink="/onboarding/vet/join-clinic"
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
                  <span class="d-inline-flex align-items-center justify-content-center rounded-4 bg-primary-subtle text-primary fs-4"
                        style="width: 56px; height: 56px">
                    <fa-icon [icon]="faHospital"/>
                  </span>
                  <span class="badge rounded-pill text-bg-light border">Nowa placówka</span>
                </div>

                <div class="small text-body-secondary fw-semibold mb-2">Dla właściciela lub osoby uprawnionej do prowadzenia profilu placówki</div>
                <h2 class="h3 fw-bold">Utwórz profil nowej kliniki</h2>
                <p class="text-body-secondary">
                  Dodaj podstawowe dane identyfikacyjne i adres. Resztę konfiguracji wykonasz już w panelu kliniki.
                </p>

                <ul class="list-unstyled d-grid gap-3 my-4">
                  <li class="d-flex gap-2">
                    <fa-icon [icon]="faCircleCheck" class="text-success mt-1"/>
                    <span>Po utworzeniu zostaniesz administratorem profilu placówki.</span>
                  </li>
                  <li class="d-flex gap-2">
                    <fa-icon [icon]="faCircleCheck" class="text-success mt-1"/>
                    <span>NIP pozwoli wykryć, czy placówka nie istnieje już w e-vet.</span>
                  </li>
                  <li class="d-flex gap-2">
                    <fa-icon [icon]="faCircleCheck" class="text-success mt-1"/>
                    <span>Godziny, sloty, gabinety i zespół skonfigurujesz później.</span>
                  </li>
                </ul>

                <a routerLink="/onboarding/vet/create-clinic"
                   class="btn btn-outline-primary btn-lg mt-auto d-flex align-items-center justify-content-center gap-2">
                  Utwórz nową klinikę
                  <fa-icon [icon]="faPlus"/>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </app-vet-onboarding-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VetWorkplaceChoice {
  protected readonly faArrowRight = faArrowRight;
  protected readonly faPlus = faPlus;
  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faHospital = faHospital;
  protected readonly faStethoscope = faStethoscope;
}
