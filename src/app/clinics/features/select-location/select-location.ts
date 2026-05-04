import {ChangeDetectionStrategy, Component, computed, effect, input, output, signal} from '@angular/core';
import {LocationResult, Voivodeship} from "../../../shared/data-access/geo.service";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {httpResource} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ClinicLocation} from "../../../shared/interfaces/clinics.interface";


@Component({
  selector: 'app-select-location',
  imports: [FormsModule, ReactiveFormsModule],
  template: `
    <fieldset class="search-box">
      <div class="position-relative z-2">

        <div class="input-group">
          <input class="form-control form-control-sm"
                 type="text"
                 [disabled]="!voivodeship()"
                 [placeholder]="voivodeship() ? 'Np. Ostrowska 3' : 'Wybierz województwo powyżej'"
                 [ngModel]="query()"
                 (ngModelChange)="query.set($event); resultsOpen.set(true)"
                 (click)="resultsOpen.set(true)"/>
          <button class="btn btn-sm btn-outline-secondary" (click)="resultsOpen.set(true)">
            {{ resultsOpen() ? '▲' : '▼' }}
          </button>
        </div>


        @if (resultsOpen() && groupedLocations().length > 0) {
          <div class="border position-absolute w-100 bg-white shadow-lg overflow-auto">
            @for (location of groupedLocations(); track location) {
              <button type="button"
                      class="btn btn-sm btn-light w-100 text-start border-bottom py-2"
                      (click)="selectAddress(location)">

                <div class="d-flex flex-column">
                  <span>
                    {{ formatAddress(location.address) }}
                  </span>
                  <small class="text-muted">
                    {{ formatSubtitle(location.address) }}
                  </small>
                </div>
              </button>
            }
          </div>
        }
      </div>
    </fieldset>
  `,
  styles: `
    .search-box {
      display: flex;
      flex-flow: column nowrap;
      background: white;
      border: transparent;
    }

    .search-input {
      padding: 11px 106px 11px 64px;
    }

    .search-box.list-open {
      border-bottom: 1px solid #e3e3e3;
      box-shadow: 0 0 2px rgb(0 0 0 / 20%), 0 -1px 0 rgb(0 0 0 / 2%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectLocation {
  voivodeship = input<Voivodeship | null>(null);
  clinicLocationSelection = output<ClinicLocation | null>()

  query = signal("");
  city = signal("");
  resultsOpen = signal(false);

  private readonly API_URL = `https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&addressdetails=1&q=`;

  private debouncedQuery = toSignal(
    toObservable(this.query).pipe(debounceTime(400), distinctUntilChanged()),
    {initialValue: ''}
  );

  locationsResults = httpResource<LocationResult[]>(() => {
    const q = this.debouncedQuery(); // np. "Ostrowska 3"
    const v = this.voivodeship();

    if (q.length < 3 || !v) return undefined;

    const fullQuery = `${q}, ${v}, Poland`;
    return `${this.API_URL}${encodeURIComponent(fullQuery)}`;
  }, {defaultValue: []});

  groupedLocations = computed(() => {
    const raw = this.locationsResults.value() ?? [];

    return raw.filter(item => {
      const addr = item.address;

      const hasCityLike =
        !!(addr.city || addr.town || addr.village || addr.municipality);

      const hasAnySpatialInfo =
        !!(addr.road || addr.house_number || addr.county || addr.state);

      console.log(addr, hasCityLike, hasAnySpatialInfo);

      return hasCityLike && hasAnySpatialInfo;
    });
  });

  constructor() {
    effect(() => {
      const voivo = this.voivodeship();

      if (voivo) {
        this.query.set('');
        this.resultsOpen.set(false);
        this.clinicLocationSelection.emit(null);
      }
    });
  }

  selectAddress(location: LocationResult) {
    const addr = location.address;

    const clinic: ClinicLocation = {
      longitude: Number(location.lon),
      latitude: Number(location.lat),
      geojson: location.geojson,
      city: addr.city || addr.town || addr.village || "",
      street: addr.road || "",
      houseNumber: addr.house_number || "",
      postcode: addr.postcode || "",
    }

    const displayValue = `${clinic.street} ${clinic.houseNumber}`.trim()

    this.city.set(clinic.city)
    this.query.set(displayValue);
    this.resultsOpen.set(false);

    this.clinicLocationSelection.emit(clinic);
  }

  formatAddress(addr: any): string {
    return [
      addr.road,
      addr.house_number,
      addr.village || addr.town || addr.city
    ]
      .filter(Boolean)
      .join(', ');
  }

  formatSubtitle(addr: any): string {
    return [
      addr.city || addr.town || addr.village,
      addr.municipality || addr.county,
      addr.state
    ]
      .filter(Boolean)
      .join(', ');
  }
}
