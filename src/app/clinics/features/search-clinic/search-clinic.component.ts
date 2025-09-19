import {ChangeDetectionStrategy, Component, computed, effect, signal} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {httpResource} from "@angular/common/http";
import {LocationResult} from "../map/map.component";
import {NgOptionTemplateDirective, NgSelectComponent} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-search-clinic',
  imports: [FaIconComponent, NgSelectComponent, FormsModule, NgOptionTemplateDirective, JsonPipe],
  template: `

    <fieldset class="p-3 w-100">
      <ng-select
        [items]="filteredResultsStream()"
        bindLabel="display_name"
        placeholder="Wpisz adres (np. Maciejewicza 23 Szczecin)"
        [loading]="!addressResultsStream.hasValue()"
        [typeahead]="query$"
        [(ngModel)]="selectedLocationValue"
        dropdownPosition="bottom"
        class="custom">

        <ng-template ng-option-tmp let-item="item">
          <div class="d-flex align-items-center">
            <fa-icon [icon]="['fas', 'location-dot']" class="me-2"></fa-icon>
            <span class="text-truncate">
              {{ item.display_name }}
            </span>
          </div>
        </ng-template>

      </ng-select>
    </fieldset>
    <pre> {{ selectedLocationValue | json }}</pre>

  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchClinicComponent {

  API_BASE_URL = `https://nominatim.openstreetmap.org/search?polygon_geojson=1&format=jsonv2&q=`;

  query = signal<string>('');

  query$ = new Subject<string>();

  debouncedQuery = toSignal(toObservable(this.query)
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    ), {initialValue: ''})

  debouncedQuery$ = toSignal(
    this.query$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  addressResults = httpResource<LocationResult[]>(() =>
      `${this.API_BASE_URL}${encodeURIComponent(this.debouncedQuery())}`
    , {defaultValue: []}
  )

  addressResultsStream = httpResource<LocationResult[]>(
    () => `${this.API_BASE_URL}${encodeURIComponent(this.debouncedQuery$())}`,
    { defaultValue: [] }
  );

  filteredResultsStream = computed(() =>
    this.addressResultsStream.value().filter((item) => !!item.display_name)
  );

  filteredResults = computed(() =>
    (this.addressResults.value().filter((item: LocationResult) =>
      !!item.display_name) ?? [])
  );

  selectedLocation = signal<LocationResult | undefined>(undefined)

  selectedLocationValue?: LocationResult;


  constructor() {
    effect(() => {
      console.log(this.filteredResults())
    })

    effect(() => {
      console.log('selected:', this.selectedLocationValue);
    });
  }

}
