import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faArrowLeft, faMapLocationDot} from '@fortawesome/free-solid-svg-icons';

import {LocationResult, Voivodeship} from '../../shared/data-access/geo.service';
import {AuthService} from '../../shared/data-access/auth.service';
import {LoaderComponent} from '../../shared/ui/loader/loader.component';
import {OnboardingStepHeaderComponent} from '../../onboarding/ui/onboarding-step-header/onboarding-step-header.component';

import {Clinic, ClinicLocation} from '../models/clinic.model';
import ClinicService from '../data-access/clinic.service';
import {ClinicMapComponent} from '../ui/clinic-map/clinic-map.component';
import {VoivodeshipSelectComponent} from './ui/voivodeship-select/voivodeship-select.component';
import {LocationSelectComponent} from './ui/location-select/location-select.component';
import {CreateClinicFormComponent} from './ui/create-clinic-form/create-clinic-form.component';

@Component({
  selector: 'app-create-clinic',
  imports: [
    RouterLink,
    FontAwesomeModule,
    ClinicMapComponent,
    VoivodeshipSelectComponent,
    LocationSelectComponent,
    CreateClinicFormComponent,
    LoaderComponent,
    OnboardingStepHeaderComponent,
  ],
  template: `
    @let user = this.user();

    @if (!user) {
      <app-loader/>
    } @else {
      @if (isOnboarding) {
        <a
          routerLink="/onboarding/vet/workplace"
          class="d-inline-flex align-items-center gap-2 text-decoration-none mb-4">
          <fa-icon [icon]="faArrowLeft"/>
          Wróć do wyboru ścieżki
        </a>

        <app-onboarding-step-header
          eyebrow="Nowa placówka"
          title="Utwórz profil kliniki weterynaryjnej"
          description="Zachowujemy pełny proces wyboru województwa, wyszukania dokładnego adresu, mapę oraz dane organizacyjne kliniki."
          processLabel="Miejsce pracy"
          [step]="2"
          [steps]="2"/>
      } @else {
        <div class="mb-4">
          <h1 class="h2 fw-bold mb-2">Utwórz klinikę</h1>
          <p class="text-body-secondary mb-0">
            Wybierz lokalizację placówki, sprawdź ją na mapie i uzupełnij dane kliniki.
          </p>
        </div>
      }

      <section class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="row g-0" style="min-height: 680px">
          <div class="col-12 col-xl-5 p-4 p-lg-5 bg-body">
            <div class="d-flex align-items-center gap-3 mb-4">
              <span
                class="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-subtle text-primary"
                style="width: 44px; height: 44px">
                <fa-icon [icon]="faMapLocationDot"/>
              </span>
              <div>
                <h2 class="h4 fw-bold mb-0">Lokalizacja i dane placówki</h2>
                <small class="text-body-secondary">Najpierw wybierz województwo i dokładny adres.</small>
              </div>
            </div>

            <app-select-voivodeship
              (voivodeshipLocationChange)="setVoivodeship($event)"
              (voivodeship)="setVoivodeshipName($event)"/>

            <app-clinic-location-select
              [voivodeshipLocation]="selection().voivodeshipLocation"
              [voivodeship]="selection().voivodeship"
              (clinicLocationSelection)="setClinicLocation($event)"/>

            <hr class="my-4">

            <app-create-clinic-form
              [createClinicStatus]="onCreateClinicResource.status()"
              [vetId]="user.id"
              [clinicAddress]="selection().clinic"
              (createClinic)="onCreateClinicSubmit.set($event)"/>
          </div>

          <div class="col-12 col-xl-7 position-relative" style="min-height: 520px">
            <app-clinic-map
              [clinicLocation]="selection().clinic"
              [voivodeshipLocation]="selection().voivodeshipLocation"/>
          </div>
        </div>
      </section>

      @if (isOnboarding) {
        <div class="alert alert-light border rounded-4 mt-4 mb-0">
          <strong>Co dzieje się później?</strong>
          Obecny backend nadal korzysta z <code>clinic_id</code>/<code>vetIds</code>. Ten refaktor celowo tego nie zmienia;
          migrację do <code>ClinicMembership</code> wykonamy jako osobny etap.
        </div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateClinicComponent {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly clinicService = inject(ClinicService);

  readonly isOnboarding = this.route.snapshot.data['onboarding'] === true;
  readonly user = computed(() => this.authService.user());

  readonly onCreateClinicSubmit = signal<Clinic | null>(null);

  readonly selection = signal<{
    voivodeshipLocation: LocationResult | null;
    voivodeship: Voivodeship | null;
    clinic: ClinicLocation | null;
  }>({
    voivodeshipLocation: null,
    voivodeship: null,
    clinic: null,
  });

  readonly onCreateClinicResource = resource({
    params: this.onCreateClinicSubmit,
    loader: async ({params}) => {
      if (!params) {
        throw new Error('no clinic creation submitted');
      }

      return this.clinicService.createClinic(params);
    },
  });

  constructor() {
    effect(() => {
      if (!this.authService.initialized()) return;

      if (!this.authService.user()) {
        void this.router.navigate(['/auth/login']);
      }
    });

    effect(() => {
      if (!this.onCreateClinicSubmit()) return;

      const clinicId = this.onCreateClinicResource.value();
      if (!clinicId) return;

      void this.authService.refreshCurrentUser();
      void this.router.navigate(['/clinics', clinicId]);
    });
  }

  setVoivodeship(value: LocationResult | null): void {
    this.selection.update(state => ({
      ...state,
      voivodeshipLocation: value,
      clinic: null,
    }));
  }

  setVoivodeshipName(value: Voivodeship | null): void {
    this.selection.update(state => ({
      ...state,
      voivodeship: value,
    }));
  }

  setClinicLocation(location: ClinicLocation | null): void {
    this.selection.update(state => ({
      ...state,
      clinic: location,
    }));
  }

  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faMapLocationDot = faMapLocationDot;
}
