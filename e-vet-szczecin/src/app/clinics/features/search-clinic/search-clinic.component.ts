import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {httpResource} from "@angular/common/http";
import {LocationResult} from "../map/map.component";

@Component({
  selector: 'app-search-clinic',
  imports: [FaIconComponent],
  template: `
    <fieldset class="search-box m-3 shadow-lg rounded-5"
              [class.list-open]="filteredResults().length">

      <div class="d-inline-flex align-items-center px-4 py-3 gap-3">
        <fa-icon [icon]="['fas', 'map']" size="lg"></fa-icon>

        <input class="flex-fill border-0 outline-none"
               #cityInput
               type="text"
               placeholder="Wpisz adres (np. Maciejewicza 23 Szczecin)"
               (input)="query.set(cityInput.value)"/>

        <fa-icon [icon]="['fas', 'magnifying-glass']" size="lg"></fa-icon>
      </div>

      @if (filteredResults().length) {
        <div class="border-top">
          @for (item of filteredResults(); track item.display_name) {
            <button class="d-inline-flex gap-3 btn btn-sm btn-light px-4 py-2 w-100"
                    type="button"
                    (click)="selectedLocation.set(item)">

                <span class="align-self-center">
                  <fa-icon [icon]="['fas', 'location-dot']" size="xl"></fa-icon>
                </span>

              <span class="text-start">
                  <b>
                    {{ item.address.road }},
                    {{ item.address.house_number }}
                  </b>
                  <br>
                  <span class="fw-light">
                  {{ item.address.city || item.address.town || item.address.village }}
                    </span>
                </span>
            </button>
          }
        </div>
      }

    </fieldset>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchClinicComponent {

  API_BASE_URL = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=pl&q=`

  query = signal<string>('');

  debouncedQuery = toSignal(toObservable(this.query)
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    ), {initialValue: ''})

  addressResults = httpResource<LocationResult[]>(() =>
      `${this.API_BASE_URL}${encodeURIComponent(this.debouncedQuery())}`
    , {defaultValue: []}
  )

  filteredResults = computed(() =>
    (this.addressResults.value().filter((item: LocationResult) =>
      !!item.address?.house_number) ?? [])
  );

  selectedLocation = signal<LocationResult | undefined>(undefined)


}
