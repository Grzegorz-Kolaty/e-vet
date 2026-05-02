import {ChangeDetectionStrategy, Component, computed, input, output, signal} from '@angular/core';
import {LocationResult, Voivodeship} from "../../../shared/data-access/geo.service";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {httpResource} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@Component({
  selector: 'app-select-location',
  standalone: true,
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
                    {{ location.address.road }}, {{ location.address.house_number }}
                    , {{ location.address.village || location.address.town || location.address.city }}

                  </span>
                  <small class="text-muted">
                    {{ location.address.road ? (location.address.city || location.address.town || location.address.village) : (location.address.municipality || location.address.county) }}
                    ,
                    {{ location.address.state }}
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
  clinicLocationSelection = output<LocationResult | null>()

  query = signal("");
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
      const hasStreetOrHouse = !!(addr.road || addr.house_number);
      const hasCity = !!(addr.city || addr.town || addr.village);

      return hasStreetOrHouse && hasCity;
    });
  });

  selectAddress(location: LocationResult) {
    const addr = location.address;
    const streetPart = addr.road || addr.village || addr.town || addr.city;
    const housePart = addr.house_number ? ` ${addr.house_number}` : '';

    const displayValue = `${streetPart}${housePart}`.trim();

    this.query.set(displayValue);
    this.clinicLocationSelection.emit(location);
    this.resultsOpen.set(false);
  }
}
