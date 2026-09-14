import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faBuilding,
  faCircleCheck,
  faCloudArrowDown,
  faClock,
  faLocationDot,
  faMapLocationDot,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import {VetOnboardingShell} from './vet-onboarding-shell';

@Component({
  selector: 'app-vet-create-clinic',
  imports: [ReactiveFormsModule, RouterLink, FontAwesomeModule, VetOnboardingShell],
  template: `
    <app-vet-onboarding-shell>
      <a routerLink="/onboarding/vet/workplace"
         class="d-inline-flex align-items-center gap-2 text-decoration-none mb-4">
        <fa-icon [icon]="faArrowLeft"/>
        Wróć do wyboru ścieżki
      </a>

      <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div>
          <span class="badge rounded-pill bg-primary-subtle text-primary-emphasis mb-3">Nowa placówka</span>
          <h1 class="display-6 fw-bold mb-2">Utwórz profil kliniki weterynaryjnej</h1>
          <p class="lead text-body-secondary mb-0">
            Na tym etapie potrzebujemy tylko danych, które pozwalają jednoznacznie utworzyć placówkę. Grafik skonfigurujesz później.
          </p>
        </div>

        <div class="align-self-lg-start text-lg-end">
          <div class="small text-body-secondary mb-2">Miejsce pracy · krok 2 z 2</div>
          <div class="progress" style="width: 190px; height: 7px">
            <div class="progress-bar w-100"></div>
          </div>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="row g-4 align-items-start">
          <div class="col-xl-7">
            <section class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-body p-4 p-lg-5">
                <div class="d-flex gap-3 align-items-center mb-4">
                  <span class="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary"
                        style="width: 44px; height: 44px">
                    <fa-icon [icon]="faBuilding"/>
                  </span>
                  <div>
                    <h2 class="h4 fw-bold mb-0">1. Dane placówki</h2>
                    <small class="text-body-secondary">Dane identyfikacyjne i kontaktowe</small>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="nip" class="form-label fw-semibold">NIP <span class="text-danger">*</span></label>
                  <div class="row g-2">
                    <div class="col-md">
                      <input id="nip"
                             class="form-control form-control-lg"
                             [class.is-invalid]="invalid('nip')"
                             formControlName="nip"
                             inputmode="numeric"
                             maxlength="10"
                             placeholder="10 cyfr NIP">
                      <div class="invalid-feedback">Podaj prawidłowy, 10-cyfrowy NIP.</div>
                    </div>
                    <div class="col-md-auto">
                      <button type="button" class="btn btn-outline-primary btn-lg w-100" (click)="fetchFromGus()">
                        <fa-icon [icon]="faCloudArrowDown" class="me-2"/>
                        Pobierz dane z GUS
                      </button>
                    </div>
                  </div>

                  @if (gusLoaded()) {
                    <div class="form-text text-success mt-2">
                      <fa-icon [icon]="faCircleCheck" class="me-1"/>
                      Dane przykładowe zostały uzupełnione. Docelowo tutaj podepniesz usługę GUS/REGON.
                    </div>
                  }
                </div>

                <div class="mb-3">
                  <label for="name" class="form-label fw-semibold">Nazwa kliniki / gabinetu <span class="text-danger">*</span></label>
                  <input id="name" class="form-control form-control-lg" [class.is-invalid]="invalid('name')" formControlName="name">
                  <div class="invalid-feedback">Podaj nazwę placówki.</div>
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="phone" class="form-label fw-semibold">Telefon <span class="text-danger">*</span></label>
                    <input id="phone" type="tel" class="form-control form-control-lg" [class.is-invalid]="invalid('phone')" formControlName="phone">
                    <div class="invalid-feedback">Podaj numer telefonu.</div>
                  </div>
                  <div class="col-md-6">
                    <label for="email" class="form-label fw-semibold">E-mail placówki <span class="text-danger">*</span></label>
                    <input id="email" type="email" class="form-control form-control-lg" [class.is-invalid]="invalid('email')" formControlName="email">
                    <div class="invalid-feedback">Podaj prawidłowy adres e-mail.</div>
                  </div>
                </div>
              </div>
            </section>

            <section class="card border-0 shadow-sm rounded-4">
              <div class="card-body p-4 p-lg-5">
                <div class="d-flex gap-3 align-items-center mb-4">
                  <span class="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary"
                        style="width: 44px; height: 44px">
                    <fa-icon [icon]="faLocationDot"/>
                  </span>
                  <div>
                    <h2 class="h4 fw-bold mb-0">2. Adres placówki</h2>
                    <small class="text-body-secondary">Adres widoczny później dla właścicieli zwierząt</small>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="street" class="form-label fw-semibold">Ulica i numer <span class="text-danger">*</span></label>
                  <input id="street" class="form-control form-control-lg" [class.is-invalid]="invalid('street')" formControlName="street">
                  <div class="invalid-feedback">Podaj ulicę i numer.</div>
                </div>

                <div class="row g-3">
                  <div class="col-md-4">
                    <label for="postalCode" class="form-label fw-semibold">Kod pocztowy <span class="text-danger">*</span></label>
                    <input id="postalCode" class="form-control form-control-lg" [class.is-invalid]="invalid('postalCode')" formControlName="postalCode" placeholder="00-000">
                    <div class="invalid-feedback">Format: 00-000.</div>
                  </div>
                  <div class="col-md-8">
                    <label for="city" class="form-label fw-semibold">Miejscowość <span class="text-danger">*</span></label>
                    <input id="city" class="form-control form-control-lg" [class.is-invalid]="invalid('city')" formControlName="city">
                    <div class="invalid-feedback">Podaj miejscowość.</div>
                  </div>
                  <div class="col-md-6">
                    <label for="district" class="form-label fw-semibold">Dzielnica</label>
                    <input id="district" class="form-control form-control-lg" formControlName="district">
                  </div>
                  <div class="col-md-6">
                    <label for="voivodeship" class="form-label fw-semibold">Województwo <span class="text-danger">*</span></label>
                    <select id="voivodeship" class="form-select form-select-lg" [class.is-invalid]="invalid('voivodeship')" formControlName="voivodeship">
                      <option value="">Wybierz</option>
                      <option value="zachodniopomorskie">zachodniopomorskie</option>
                      <option value="mazowieckie">mazowieckie</option>
                      <option value="wielkopolskie">wielkopolskie</option>
                      <option value="pomorskie">pomorskie</option>
                    </select>
                    <div class="invalid-feedback">Wybierz województwo.</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div class="col-xl-5">
            <section class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-body p-4">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <span class="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary"
                        style="width: 44px; height: 44px">
                    <fa-icon [icon]="faMapLocationDot"/>
                  </span>
                  <h2 class="h5 fw-bold mb-0">Lokalizacja na mapie</h2>
                </div>

                <div class="ratio ratio-16x9 rounded-4 overflow-hidden bg-body-secondary">
                  <div class="d-flex flex-column align-items-center justify-content-center text-body-secondary p-4 text-center">
                    <fa-icon [icon]="faMapLocationDot" class="display-5 mb-3"/>
                    <strong>Mapa nie jest wymagana do utworzenia profilu</strong>
                    <span class="small mt-1">Pinezkę i dokładne wejście ustawisz później w ustawieniach kliniki.</span>
                  </div>
                </div>
              </div>
            </section>

            <section class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-body p-4">
                <div class="d-flex gap-3 align-items-start">
                  <fa-icon [icon]="faClock" class="text-primary fs-4 mt-1"/>
                  <div>
                    <h2 class="h5 fw-bold">Grafik konfigurujesz po utworzeniu kliniki</h2>
                    <p class="text-body-secondary mb-3">
                      Nie pytamy teraz o długość slotów, godziny otwarcia, dyżury ani dostępność lekarzy. Te dane należą do konfiguracji działającej placówki.
                    </p>
                    <ul class="small text-body-secondary mb-0">
                      <li>godziny otwarcia,</li>
                      <li>domyślne długości wizyt,</li>
                      <li>gabinety i usługi,</li>
                      <li>grafiki poszczególnych lekarzy.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <div class="alert alert-warning border-0 rounded-4 d-flex gap-3">
              <fa-icon [icon]="faTriangleExclamation" class="mt-1"/>
              <div>
                <strong>Duplikaty placówek:</strong> po wpisaniu NIP backend powinien sprawdzić, czy taki profil już istnieje. Jeśli tak, zamiast tworzenia należy zaproponować wysłanie prośby o dołączenie.
              </div>
            </div>
          </div>
        </div>

        <section class="card border-0 shadow-sm rounded-4 mt-4">
          <div class="card-body p-4">
            <div class="form-check mb-4">
              <input id="representationConfirmed"
                     type="checkbox"
                     class="form-check-input"
                     [class.is-invalid]="invalid('representationConfirmed')"
                     formControlName="representationConfirmed">
              <label for="representationConfirmed" class="form-check-label">
                Oświadczam, że jestem uprawniony do utworzenia i zarządzania profilem tej placówki w e-vet.
              </label>
              <div class="invalid-feedback">Potwierdź uprawnienie do utworzenia profilu placówki.</div>
            </div>

            <div class="d-flex flex-column flex-sm-row justify-content-end gap-2">
              <a routerLink="/onboarding/vet/workplace" class="btn btn-outline-secondary btn-lg">Anuluj</a>
              <button type="submit" class="btn btn-primary btn-lg">Utwórz klinikę i przejdź do panelu</button>
            </div>
          </div>
        </section>
      </form>
    </app-vet-onboarding-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VetCreateClinic {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly submitted = signal(false);
  readonly gusLoaded = signal(false);

  readonly form = this.fb.nonNullable.group({
    nip: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    street: ['', Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
    city: ['', Validators.required],
    district: [''],
    voivodeship: ['', Validators.required],
    representationConfirmed: [false, Validators.requiredTrue],
  });

  invalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }

  fetchFromGus(): void {
    if (this.form.controls.nip.invalid) {
      this.form.controls.nip.markAsTouched();
      return;
    }

    // TODO: zastąp wywołaniem API backendu do GUS/REGON.
    this.form.patchValue({
      name: 'Klinika Weterynaryjna Przykład',
      street: 'ul. Przykładowa 12',
      postalCode: '70-001',
      city: 'Szczecin',
      district: 'Śródmieście',
      voivodeship: 'zachodniopomorskie',
    });
    this.gusLoaded.set(true);
  }

  submit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO:
    // 1. backend sprawdza duplikat po NIP,
    // 2. POST /clinics,
    // 3. w tej samej transakcji tworzy membership OWNER/ACTIVE,
    // 4. odpowiedź zwraca clinicId i aktywne członkostwo.
    void this.router.navigate(['/dashboard']);
  }

  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faBuilding = faBuilding;
  protected readonly faCircleCheck = faCircleCheck;
  protected readonly faCloudArrowDown = faCloudArrowDown;
  protected readonly faClock = faClock;
  protected readonly faLocationDot = faLocationDot;
  protected readonly faMapLocationDot = faMapLocationDot;
  protected readonly faTriangleExclamation = faTriangleExclamation;
}
