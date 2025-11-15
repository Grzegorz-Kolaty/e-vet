import {ChangeDetectionStrategy, Component, computed, effect, output, signal,} from '@angular/core';
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {FormsModule} from "@angular/forms";
import {httpResource} from "@angular/common/http";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {control, geoJSON, latLng, LatLngTuple, Layer, Map as LeafletMap, marker, polygon, tileLayer} from 'leaflet';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {LeafletDirective, LeafletLayersDirective} from "@bluehalo/ngx-leaflet";

export interface LocationResult {
  display_name: string;
  place_id: string;
  lat: string;
  lon: string;
  geojson?: any;
  boundingbox?: [string, string, string, string];
  name: string;
  address: {
    state: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    house_number?: string;
    hamlet?: string;
    municipality?: string;
    county?: string;
    suburb?: string;
  };
  place_rank: number;
  addresstype?: string;
  category?: string;
}


@Component({
  selector: 'app-map',
  imports: [FormsModule, LeafletDirective, LeafletLayersDirective, FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex flex-column h-100">

      <fieldset class="search-box shadow-lg ">
        <div class="d-inline-flex align-items-center px-4 py-3 gap-3">
          <fa-icon [icon]="['fas', 'map']" size="lg"></fa-icon>

          <input class="flex-fill border-0 outline-none"
                 #streetInput
                 type="text"
                 placeholder="Wpisz ulicę "
                 (input)="onInput(streetInput.value)"
                 (focus)="onFocus()"/>

          <fa-icon [icon]="['fas', 'magnifying-glass']" size="lg"></fa-icon>
        </div>

        @if (showResults() && groupedStreets().length) {
          <div class="border-top overflow-auto">

            @for (item of groupedStreets(); track item.place_id) {
              <button class="d-inline-flex gap-3 btn btn-sm btn-light px-4 py-2 w-100 text-start"
                      type="button"
                      [class.active]="item.place_id === selectedStreetSignal()?.place_id"
                      (click)="onSelectStreet(item, streetInput)">
            <span class="align-self-center">
              <fa-icon [icon]="['fas', 'location-dot']" size="xl"></fa-icon>
            </span>
                <span>
                  <b>
                    {{ item.address.village || item.address.city || item.address.town || item.address.municipality }}
                  </b>
                  <br>

                  @if (item.address.road || item.address.house_number) {
                    <small class="text-muted">
                      {{ item.address.road }} {{ item.address.house_number }}
                    </small>
                    <br>
                  }

                  <small class="text-muted">
                    {{ item.address.state || item.address.suburb }}
                  </small>
                </span>
              </button>
            }
          </div>
        }
      </fieldset>

      <div class="map  flex-fill"
           leaflet
           [leafletOptions]="options"
           [leafletLayers]="markers"
           (leafletMapReady)="onMapReady($event)">
      </div>

    </div>
  `,
  styles: `
    .map {
      filter: hue-rotate(90deg);
    }

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
})
export class MapComponent {
  showResults = signal(false);
  selectedStreetSignal = signal<LocationResult | null>(null); // Zmieniono nazwę na unikalną

  streetAddressSelected = output<LocationResult>();

  markers: Layer[] = []
  map: LeafletMap | null = null
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap contributors'
      })
    ],
    zoom: 6,
    center: latLng([53.4046675, 14.4991249]),
    zoomControl: false
  };

  API_BASE_URL = `https://nominatim.openstreetmap.org/search?q=`;
  API_BASE_URL_2 = `&format=jsonv2&polygon_geojson=1&addressdetails=1`

  query = signal<string | null>(null);

  debouncedQuery = toSignal(toObservable(this.query).pipe(
    debounceTime(300),
    distinctUntilChanged()
  ), {initialValue: ''});

  streetResults = httpResource<LocationResult[]>(
    () => {
      const q = this.debouncedQuery()?.trim();
      if (!q) return undefined;
      return `${this.API_BASE_URL}${encodeURIComponent(q)}${this.API_BASE_URL_2}`;
    },
    {defaultValue: []}
  );


  groupedStreets = computed(() => {
    const results = this.streetResults.value()
    const filtered = results.filter((item) =>
    item.category === "place" || item.category === "building");
    const grouped: Record<string, LocationResult[]> = {};

    for (const item of filtered) {
      const road = item.address.road || '';
      const number = item.address.house_number || '';
      const city = item.address.city || item.address.town || item.address.village || '';

      const key = `${road}|${number}|${city}`;

      if (!key.trim()) continue;

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    }

    const uniqueStreets: LocationResult[] = [];

    for (const key in grouped) {
      if (grouped.hasOwnProperty(key)) {
        grouped[key].sort((a, b) => a.place_rank - b.place_rank);
        uniqueStreets.push(grouped[key][0]);
      }
    }

    return uniqueStreets;
  });

  constructor() {
    effect(() => {
      console.log(this.streetResults.value())
    });
    effect(() => {
      console.log(this.groupedStreets())
    })
  }

  onInput(value: string) {
    this.query.set(value);
    this.showResults.set(true);
  }

  onFocus() {
    if (this.groupedStreets().length > 0) {
      this.showResults.set(true);
    }
  }

  onSelectStreet(location: LocationResult, input: HTMLInputElement) {
    input.value = `${location.address.city || location.address.town || location.address.village}, ${location.address.road}, ${location.address.house_number ?? ''}`

    this.showResults.set(false);
    this.targetLocation(location);
    this.selectedStreetSignal.set(location);
    this.streetAddressSelected.emit(location)
  }

  onMapReady(map: LeafletMap) {
    control.zoom({
      position: 'bottomleft'
    }).addTo(map)

    this.map = map;
  }

  targetLocation(location: LocationResult) {
    if (!this.map) {
      console.log('target location has no map, return');
      return;
    }

    const coords: LatLngTuple = [Number(location.lat), Number(location.lon)];
    const newMarker = marker(coords);
    const layers: Layer[] = [newMarker];

    if (location.geojson) {
      const boundaryLayer = geoJSON(location.geojson);
      layers.push(boundaryLayer);
      this.map.fitBounds(boundaryLayer.getBounds());
    } else {
      layers.push(newMarker);
      this.map.setView(coords, 13);
    }

    this.markers = layers;
  }
}
