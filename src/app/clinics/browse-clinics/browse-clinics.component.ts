import {ChangeDetectionStrategy, Component, computed, effect, inject, resource, signal} from "@angular/core";
import { MapComponent } from "../features/map/map.component";
import {SearchClinicComponent} from "../features/search-clinic/search-clinic.component";
import ClinicService from "../../shared/data-access/clinic.service";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../shared/data-access/auth.service";

@Component({
  selector: 'app-browse-clinics',
  imports: [
    MapComponent,
    SearchClinicComponent,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="container-fluid browse-section-height g-0 bg-dark-transparent overflow-hidden">
      <div class="row g-0 h-100 flex-nowrap">

        <aside class="col-auto text-light p-4 d-flex flex-column gap-4 bg-sidebar-background h-100">
          <header class="search-card p-4 rounded-4">
            <h4 class="fw-bold mb-3">Wyszukaj klinikę</h4>

            <div class="mt-3">
              <app-search-clinic (citySelected)="onCitySelected($event)"/>
            </div>
          </header>

          <section class="d-flex flex-column gap-3 flex-grow-1 overflow-y-auto pe-1">
            <h6 class="text-secondary fw-semibold mb-0">
              {{ filteredClinics().length }} znalezione kliniki
            </h6>

            @for (clinic of filteredClinics(); track clinic.id) {
              <a [routerLink]="['/clinics', 'vet-clinic', clinic.id]"
                 class="d-flex gap-3 p-3 rounded-4 align-items-start text-decoration-none text-light clinic-card">
                <img [src]="clinic.coverImage.url || 'assets/placeholder.svg'"
                     width="80px"
                     height="80px"
                     class="rounded-3 shadow-lg bg-transparent"
                     alt="clinicCover">

                <div class="d-flex flex-column justify-content-center">
                  <h6 class="fw-bold mb-1 text-white lh-base">{{ clinic.clinicName }}</h6>
                  <p class="small mb-1">
                    ul. {{ clinic.address.street }} {{ clinic.address.house_number }},
                    {{ clinic.address.city || clinic.address.town || clinic.address.village }}
                    <br>
                    {{ clinic.address.postal_code }}
                    <br>
                    {{ clinic.address.municipality }}
                  </p>
                </div>
              </a>
            }
          </section>
        </aside>

        <main class="col map-wrapper">
          <app-map
            [clinicsList]="extractedLocations()"/>
        </main>

      </div>
    </section>
  `,
  styles: `
    .browse-section-height {
      height: calc(100vh - 74px);
    }

    .bg-dark-transparent {
      background-color: #0f1115;
    }

    .bg-sidebar-background {
      background-color: #12161a;
      border-right: 1px solid #1e242b;
      width: 420px !important;
    }

    .search-card {
      background-color: #1a2026;
      border: 1px solid #232a32;
    }

    .clinic-card {
      background-color: transparent;
      border: 1px solid transparent;
      transition: all 0.2s ease-in-out;
    }

    .clinic-card:hover {
      background-color: #1a2026;
      border-color: #232a32;
    }

    .map-wrapper {
      position: relative;
      height: 100%;
      background-color: #e5e3df;
    }
  `,
})
export default class BrowseClinicsComponent {
  private authService = inject(AuthService);
  private clinicService = inject(ClinicService);
  private router = inject(Router);

  selectedCity = signal<string | null>(null);

  clinicsResource = resource({
    params: () => this.selectedCity(),
    loader: async ({ params: city }) => {
      if (!city) return []; // Jeśli użytkownik nic nie wybrał, nie pobieramy nic (albo pobieramy np. top 10 najbliższych)
      return await this.clinicService.getClinicsByCity(city);
    }
  });

  filteredClinics = computed(() => this.clinicsResource.value() ?? []);

  extractedLocations = computed(() => {
    return this.filteredClinics().map(clinic => clinic.address);
  });

  constructor() {
    effect(() => {
      if (!this.authService.initialized()) {
        return;
      }

      if (!this.authService.user()) {
        this.router.navigate(['auth', 'login']);
      }
    });
  }

  onCitySelected(city: string | null) {
    this.selectedCity.set(city);
  }
}

