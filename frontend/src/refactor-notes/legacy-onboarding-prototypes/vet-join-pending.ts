import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faArrowLeft, faClock, faEnvelope, faHospital, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import {VetOnboardingShell} from './vet-onboarding-shell';

@Component({
  selector: 'app-vet-join-clinic-pending',
  imports: [RouterLink, FontAwesomeModule, VetOnboardingShell],
  template: `
    <app-vet-onboarding-shell>
      <div class="mx-auto" style="max-width: 760px">
        <a routerLink="/onboarding/vet/workplace"
           class="d-inline-flex align-items-center gap-2 text-decoration-none mb-4">
          <fa-icon [icon]="faArrowLeft"/>
          Wróć do wyboru miejsca pracy
        </a>

        <section class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4 p-lg-5 text-center">
            <span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-warning-subtle text-warning-emphasis fs-2 mb-4"
                  style="width: 76px; height: 76px">
              <fa-icon [icon]="faClock"/>
            </span>

            <span class="badge rounded-pill text-bg-warning mb-3">Oczekuje na akceptację</span>
            <h1 class="h2 fw-bold">Prośba została wysłana</h1>
            <p class="lead text-body-secondary">
              Administrator placówki musi zaakceptować Twoje zgłoszenie, zanim otrzymasz do niej dostęp.
            </p>

            <div class="card bg-body-tertiary border-0 rounded-4 text-start my-4">
              <div class="card-body p-4 d-flex gap-3">
                <span class="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3 flex-shrink-0"
                      style="width: 48px; height: 48px">
                  <fa-icon [icon]="faHospital"/>
                </span>
                <div>
                  <div class="small text-body-secondary">Zgłoszenie do placówki</div>
                  <strong>{{ clinicName }}</strong>
                  <div class="small text-body-secondary mt-1">Status: PENDING</div>
                </div>
              </div>
            </div>

            <div class="alert alert-light border rounded-3 text-start d-flex gap-3">
              <fa-icon [icon]="faEnvelope" class="text-primary mt-1"/>
              <div>O zmianie statusu poinformujemy Cię w aplikacji. Powiadomienie e-mail może być dodatkowym kanałem.</div>
            </div>

            <div class="alert alert-warning border-0 rounded-3 text-start d-flex gap-3">
              <fa-icon [icon]="faTriangleExclamation" class="mt-1"/>
              <div><strong>Nie masz jeszcze dostępu do tej kliniki.</strong> Nie pokazujemy jej grafiku ani danych pacjentów, dopóki administrator nie zaakceptuje zgłoszenia.</div>
            </div>

            <div class="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
              <a routerLink="/onboarding/vet/join-clinic" class="btn btn-primary">Wyślij zgłoszenie do innej kliniki</a>
              <a routerLink="/onboarding/vet/workplace" class="btn btn-outline-secondary">Wybierz inną ścieżkę</a>
            </div>
          </div>
        </section>
      </div>
    </app-vet-onboarding-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VetJoinPending {
  private readonly route = inject(ActivatedRoute);

  private readonly clinicNames: Record<number, string> = {
    1: 'Centrum Weterynaryjne Zdrowy Pupil',
    2: 'Klinika Małych Zwierząt VitaVet',
    3: 'Przychodnia Weterynaryjna AnimalCare',
  };

  readonly clinicName = this.clinicNames[Number(this.route.snapshot.queryParamMap.get('clinicId'))] ?? 'Wybrana placówka';

  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faClock = faClock;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faHospital = faHospital;
  protected readonly faTriangleExclamation = faTriangleExclamation;
}
