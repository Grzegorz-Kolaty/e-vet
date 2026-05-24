import {ChangeDetectionStrategy, Component, computed, effect, input, output, signal} from '@angular/core';
import {LocationResult, Voivodeship} from "../../../shared/data-access/geo.service";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {httpResource} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ClinicLocation} from "../../../shared/interfaces/clinics.interface";

interface LocationOption {
  raw: LocationResult;
  main: string;
  subtitle: string;
}

@Component({
  selector: 'app-select-location',
  imports: [FormsModule, ReactiveFormsModule],
  template: `
    <fieldset class="search-box">

      <label class="form-label fw-bold small">Wprowadź adres</label>
      <div class="input-group">
        <input class="form-control form-control-sm"
               type="text"
               id="adress-input"
               [ngModel]="query()"
               (ngModelChange)="query.set($event); resultsOpen.set(true)"
               (click)="resultsOpen.set(!resultsOpen())"/>

        <button class="btn btn-sm btn-outline-secondary"
                (click)="resultsOpen.set(true)">
          {{ resultsOpen() ? '▲' : '▼' }}
        </button>
      </div>

      <div>
        @if (resultsOpen() && groupedLocations().length > 0 && voivodeship()) {
          <div class="border bg-white shadow-lg">
            @for (location of groupedLocations(); track location.raw.place_id) {
              <button type="button"
                      [class.active]="location.raw.place_id === selectedPlace()?.place_id"
                      class="btn btn-sm btn-light w-100 text-start border-bottom py-2"
                      (click)="selectAddress(location.raw, voivodeship()!)">

                <div class="d-flex flex-column">
                  <span>{{ location.main }}</span>
                  <small class="text-muted">{{ location.subtitle }}</small>
                </div>

              </button>
            }
          </div>
        }

      </div>
    </fieldset>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectLocation {
  voivodeshipLocation = input<LocationResult | null>(null);
  voivodeship = input<Voivodeship | null>(null);

  clinicLocationSelection = output<ClinicLocation | null>()

  selectedPlace = signal<LocationResult | null>(null);
  query = signal("");
  resultsOpen = signal(false);

  private readonly API_URL = `https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&addressdetails=1&q=`;

  private debouncedQuery = toSignal(
    toObservable(this.query).pipe(debounceTime(400),
      distinctUntilChanged()),
    {initialValue: ''}
  );

  locationsResults = httpResource<LocationResult[]>(() => {
    const q = this.debouncedQuery();
    const voivodeship = this.voivodeshipLocation();

    if (q.length < 3 || !voivodeship) return undefined;

    const state =
      voivodeship.address.state ||
      voivodeship.display_name;

    const fullQuery = `${q}, ${state}, Poland`;

    return `${this.API_URL}${encodeURIComponent(fullQuery)}`;
  }, {defaultValue: []});

  groupedLocations = computed<LocationOption[]>(() => {
    const raw = this.locationsResults.value() ?? [];

    const seenCities = new Set<string>();


    return raw
      .filter((item) => {

        if (item.addresstype === 'county') {
          return false;
        }

        const addr = item.address;

        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.municipality ||
          'unknown';

        if (seenCities.has(city)) return false;

        seenCities.add(city);
        return true;
      })
      .map(item => {
        const addr = item.address;

        const main = [
          addr.village || addr.town || addr.city || addr.municipality,
          addr.road,
          addr.house_number,
        ]
          .filter(Boolean)
          .join(', ');

        const subtitle = [
          addr.city || addr.town || addr.village,
          addr.municipality || addr.county,
          addr.state
        ]
          .filter(Boolean)
          .join(', ');

        return {
          raw: item,
          main,
          subtitle
        };
      });
  });

  constructor() {
    effect(() => {
      if (this.voivodeshipLocation()) {
        this.query.set('')
      }
    });
  }


  selectAddress(location: LocationResult, voivo: Voivodeship) {
    const clinic: ClinicLocation = {
      geojson: location.geojson,
      city: location.address.city || "",
      town: location.address.town || "",
      village: location.address.village || "",
      municipality: location.address.municipality || "",
      searchCity: location.address.city || location.address.town || location.address.village || "",
      voivodeship: voivo,

      street: location.address.road || "",
      house_number: location.address.house_number || "",
      postal_code: location.address.postcode || "",
      apartment_number: "",
      latitude: location.lat,
      longitude: location.lon
    }

    const streetOrTown = `${!!clinic.street.length
      ? clinic.street
      : clinic.city || clinic.town || clinic.village}`


    const streetNum = ` ${clinic.house_number}`

    this.query.set(streetOrTown + `${streetNum}`);
    this.selectedPlace.set(location);
    this.resultsOpen.set(false);

    console.log(clinic)

    this.clinicLocationSelection.emit(clinic);
  }
}
