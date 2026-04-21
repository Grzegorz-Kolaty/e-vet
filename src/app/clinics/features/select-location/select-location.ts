import {ChangeDetectionStrategy, Component, computed, inject, input, output, signal} from '@angular/core';
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


        @if (resultsOpen() && groupedStreets().length > 0) {
          <div class="border position-absolute w-100 bg-white shadow-lg overflow-auto">
            @for (street of groupedStreets(); track street.place_id) {
              <button type="button"
                      class="btn btn-sm btn-light w-100 text-start border-bottom py-2"
                      (click)="selectAddress(street)"
                      [class.active]="selected() === street">
                <div class="d-flex flex-column">
                  <span>{{ street.address.road }} {{ street.address.house_number || '' }}</span>
                  <small class="text-muted">
                    {{ street.address.city || street.address.town || street.address.village }},
                    {{ street.address.state }}
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
  // Input od rodzica - wybrane województwo
  voivodeship = input<Voivodeship | null>(null);
  selected = signal<LocationResult | null>(null)

  // Output do rodzica - pełny wynik dla mapy i formularza
  addressSelected = output<LocationResult>();

  query = signal("");
  resultsOpen = signal(false);

  private readonly API_URL = `https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&addressdetails=1&q=`;

  private debouncedQuery = toSignal(
    toObservable(this.query).pipe(debounceTime(400), distinctUntilChanged()),
    {initialValue: ''}
  );

  // Reaktywne pobieranie danych z uwzględnieniem inputu voivodeship
  streetResults = httpResource<LocationResult[]>(() => {
    const q = this.debouncedQuery(); // np. "Ostrowska 3"
    const v = this.voivodeship();

    if (q.length < 3 || !v) return undefined;

    const fullQuery = `${q}, ${v}, Poland`;
    return `${this.API_URL}${encodeURIComponent(fullQuery)}`;
  }, { defaultValue: [] });

  groupedStreets = computed(() => {
    const raw = this.streetResults.value() ?? [];
    // Filtrujemy, żeby pokazywać tylko drogi lub budynki
    return raw.filter(item =>
      item.address.road &&
      (item.category === "place" || item.category === "building" || item.addresstype === "road")
    );
  });

  selectAddress(location: LocationResult) {
    const displayValue = `${location.address.road} ${location.address.house_number ?? ''}`.trim();
    this.query.set(displayValue);
    this.selected.set(location);
    this.resultsOpen.set(false);
    this.addressSelected.emit(location);
  }
}
