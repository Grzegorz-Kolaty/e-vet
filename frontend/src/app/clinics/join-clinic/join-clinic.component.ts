import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faBuilding,
  faCircleCheck,
  faEnvelope,
  faLocationDot,
  faMagnifyingGlass,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import {OnboardingStepHeaderComponent} from '../../onboarding/ui/onboarding-step-header/onboarding-step-header.component';

interface ClinicSummary {
  readonly id: number;
  readonly name: string;
  readonly city: string;
  readonly district: string;
  readonly address: string;
  readonly nip: string;
  readonly vetsCount: number;
  readonly verified: boolean;
}

@Component({
  selector: 'app-join-clinic-clinic',
  imports: [FormsModule, RouterLink, FontAwesomeModule, OnboardingStepHeaderComponent],
  template: `

    @if (isOnboarding) {
      <a
        routerLink="../workplace"
        class="d-inline-flex align-items-center gap-2 text-decoration-none mb-4">

        <fa-icon [icon]="faArrowLeft"/>

        Wróć do wyboru ścieżki
      </a>
    } @else {
      <a
        routerLink="/clinics"
        class="d-inline-flex align-items-center gap-2 text-decoration-none mb-4">

        <fa-icon [icon]="faArrowLeft"/>

        Wróć do klinik
      </a>
    }

    @if (isOnboarding) {
      <app-onboarding-step-header
        eyebrow="Dołączanie do placówki"
        title="Wyszukaj klinikę i dołącz do zespołu"
        description="Znajdź placówkę po nazwie, mieście lub NIP. Samo zgłoszenie nie daje jeszcze dostępu do jej danych."
        processLabel="Miejsce pracy"
        [step]="2"
        [steps]="2"/>
    } @else {
      <div class="mb-4">
        <h1 class="h2 fw-bold mb-2">Dołącz do kliniki</h1>
        <p class="text-body-secondary mb-0">
          Znajdź kolejną placówkę, w której pracujesz, i wyślij prośbę do jej administratora.
        </p>
      </div>
    }

    <section class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-4 p-lg-5">
        <div class="row g-3">
          <div class="col-lg-8">
            <div class="input-group input-group-lg">
              <span class="input-group-text bg-body border-end-0">
                <fa-icon [icon]="faMagnifyingGlass"/>
              </span>
              <input
                type="search"
                class="form-control border-start-0"
                placeholder="Nazwa kliniki, miasto albo NIP"
                [ngModel]="search()"
                (ngModelChange)="search.set($event)">
            </div>
          </div>

          <div class="col-lg-4">
            <select
              class="form-select form-select-lg"
              [ngModel]="city()"
              (ngModelChange)="city.set($event)">
              <option value="">Wszystkie miasta</option>
              <option value="Szczecin">Szczecin</option>
              <option value="Warszawa">Warszawa</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <div class="row g-4 align-items-start">
      <div class="col-xl-7">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <strong>Znalezione placówki ({{ filteredClinics().length }})</strong>
          <span class="small text-body-secondary">Wybierz jedną placówkę</span>
        </div>

        <div class="d-grid gap-3">
          @for (clinic of filteredClinics(); track clinic.id) {
            <article
              class="card rounded-4 shadow-sm"
              [class.border-primary]="selectedClinicId() === clinic.id"
              [class.border-2]="selectedClinicId() === clinic.id">
              <div class="card-body p-4">
                <div class="d-flex gap-3">
                  <div
                    class="d-none d-sm-flex align-items-center justify-content-center rounded-4 bg-primary-subtle text-primary fs-2 flex-shrink-0"
                    style="width: 96px; min-height: 96px">
                    <fa-icon [icon]="faBuilding"/>
                  </div>

                  <div class="flex-grow-1 min-w-0">
                    <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                      @if (clinic.verified) {
                        <span class="badge rounded-pill bg-success-subtle text-success-emphasis">
                          <fa-icon [icon]="faCircleCheck" class="me-1"/>
                          Zweryfikowana placówka
                        </span>
                      }
                      <span class="badge rounded-pill text-bg-light border">NIP {{ clinic.nip }}</span>
                    </div>

                    <h2 class="h4 fw-bold mb-2">{{ clinic.name }}</h2>
                    <p class="text-body-secondary mb-3">
                      <fa-icon [icon]="faLocationDot" class="me-2"/>
                      {{ clinic.city }}, {{ clinic.district }} · {{ clinic.address }}
                    </p>

                    <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                      <span class="small text-body-secondary">
                        <fa-icon [icon]="faUsers" class="me-2"/>
                        {{ clinic.vetsCount }} lekarzy w zespole
                      </span>

                      <button
                        type="button"
                        class="btn"
                        [class.btn-primary]="selectedClinicId() === clinic.id"
                        [class.btn-outline-primary]="selectedClinicId() !== clinic.id"
                        (click)="selectClinic(clinic.id)">
                        {{ selectedClinicId() === clinic.id ? 'Wybrano' : 'Wybierz placówkę' }}
                        <fa-icon [icon]="faArrowRight" class="ms-2"/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          } @empty {
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-body p-5 text-center">
                <h2 class="h5">Nie znaleziono placówki</h2>
                <p class="text-body-secondary mb-0">Spróbuj innej nazwy, miasta albo numeru NIP.</p>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="col-xl-5">
        <section class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4 p-lg-5">
            <div class="text-primary fw-semibold small text-uppercase mb-2">Prośba o dołączenie</div>

            @if (selectedClinic(); as clinic) {
              <h2 class="h3 fw-bold mb-3">{{ clinic.name }}</h2>

              <div class="alert alert-primary border-0 rounded-3">
                Po wysłaniu prośby administrator kliniki zdecyduje, czy dodać Cię do zespołu.
                Do tego czasu nie uzyskasz dostępu do grafiku ani danych pacjentów.
              </div>

              <div class="mb-4">
                <div class="small text-body-secondary mb-2">Dane przekazywane z Twojego profilu</div>
                <div class="d-flex flex-wrap gap-2">
                  <span class="badge bg-success-subtle text-success-emphasis rounded-pill px-3 py-2">PWZ zweryfikowane</span>
                  <span class="badge text-bg-light border rounded-pill px-3 py-2">Rola: lekarz weterynarii</span>
                </div>
              </div>

              <label for="join-message" class="form-label fw-semibold">
                Wiadomość do administratora
                <span class="text-body-secondary fw-normal">(opcjonalnie)</span>
              </label>
              <textarea
                id="join-message"
                class="form-control"
                rows="5"
                maxlength="500"
                placeholder="Np. Od października rozpoczynam pracę w Państwa placówce..."
                [ngModel]="message()"
                (ngModelChange)="message.set($event)"></textarea>
              <div class="form-text text-end">{{ message().length }}/500</div>

              <button
                type="button"
                class="btn btn-primary btn-lg w-100 mt-4"
                (click)="sendRequest()">
                <fa-icon [icon]="faEnvelope" class="me-2"/>
                Wyślij prośbę o dołączenie
              </button>
            } @else {
              <div class="py-5 text-center text-body-secondary">
                <fa-icon [icon]="faBuilding" class="display-5 d-block mb-3"/>
                <p class="mb-0">Wybierz placówkę z listy, aby zobaczyć formularz zgłoszenia.</p>
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinClinicComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isOnboarding = this.route.snapshot.data['onboarding'] === true;
  readonly search = signal('');
  readonly city = signal('');
  readonly selectedClinicId = signal<number | null>(null);
  readonly message = signal('');

  // TODO: zastąpić danymi z API wyszukiwania klinik.
  readonly clinics = signal<readonly ClinicSummary[]>([
    {
      id: 1,
      name: 'Centrum Weterynaryjne Zdrowy Pupil',
      city: 'Warszawa',
      district: 'Mokotów',
      address: 'ul. Puławska 112',
      nip: '5211234567',
      vetsCount: 6,
      verified: true,
    },
    {
      id: 2,
      name: 'Klinika Małych Zwierząt VitaVet',
      city: 'Warszawa',
      district: 'Ursynów',
      address: 'al. KEN 44',
      nip: '5217654321',
      vetsCount: 4,
      verified: true,
    },
    {
      id: 3,
      name: 'Przychodnia Weterynaryjna AnimalCare',
      city: 'Szczecin',
      district: 'Pogodno',
      address: 'ul. Mickiewicza 18',
      nip: '8511234567',
      vetsCount: 3,
      verified: true,
    },
  ]);

  readonly filteredClinics = computed(() => {
    const search = this.normalize(this.search());
    const city = this.city();

    return this.clinics().filter(clinic => {
      const matchesCity = !city || clinic.city === city;
      const haystack = this.normalize(
        `${clinic.name} ${clinic.city} ${clinic.district} ${clinic.address} ${clinic.nip}`,
      );
      const matchesSearch = !search || haystack.includes(search);

      return matchesCity && matchesSearch;
    });
  });

  readonly selectedClinic = computed(() =>
    this.clinics().find(clinic => clinic.id === this.selectedClinicId()) ?? null,
  );

  selectClinic(id: number): void {
    this.selectedClinicId.set(id);
  }

  sendRequest(): void {
    const clinic = this.selectedClinic();
    if (!clinic) return;

    // TODO: po wdrożeniu backendu wywołać ClinicJoinRequestService.create().
    // Na razie ID kliniki pełni rolę tymczasowego ID requestu dla prototypu ekranu statusu.
    const target = this.isOnboarding
      ? ['/onboarding/vet/join-clinic-requests', clinic.id]
      : ['/clinics/join-clinic-requests', clinic.id];

    void this.router.navigate(target, {
      queryParams: {clinicId: clinic.id},
    });
  }

  private normalize(value: string): string {
    return value.trim().toLocaleLowerCase('pl-PL');
  }

  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faArrowRight = faArrowRight;
  protected readonly faBuilding = faBuilding;
  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faLocationDot = faLocationDot;
  protected readonly faMagnifyingGlass = faMagnifyingGlass;
  protected readonly faUsers = faUsers;
}
