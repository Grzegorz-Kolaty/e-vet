import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewContainerRef,
  computed, input,
} from '@angular/core';
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {FormsModule} from "@angular/forms";
import {httpResource} from "@angular/common/http";
import {LeafletModule} from "@bluehalo/ngx-leaflet";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {map, marker, tileLayer, latLng, Map} from 'leaflet';
import {GeoPoint} from "firebase/firestore";
import CreateClinicComponent from "../create-clinic/create-clinic.component";

export interface LocationResult {
  display_name: string;
  lat: number;
  lon: number;
  address: {
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    house_number?: string;
  };
}

@Component({
  selector: 'app-map',
  imports: [FormsModule, LeafletModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!--    <fieldset class="search-box z-2 position-absolute top-0 start-0 m-3 shadow-lg z-3"-->
    <!--              [class.list-open]="filteredResults().length">-->

    <!--      <div class="d-inline-flex align-items-center px-4 py-3 gap-3">-->
    <!--        <fa-icon [icon]="['fas', 'map']" size="lg"></fa-icon>-->

    <!--        <input class="flex-fill border-0 outline-none"-->
    <!--               #cityInput-->
    <!--               type="text"-->
    <!--               placeholder="Wpisz adres (np. Maciejewicza 23 Szczecin)"-->
    <!--               (input)="query.set(cityInput.value)"/>-->

    <!--        <fa-icon [icon]="['fas', 'magnifying-glass']" size="lg"></fa-icon>-->
    <!--      </div>-->

    <!--      @if (filteredResults().length) {-->
    <!--        <div class="border-top">-->
    <!--          @for (item of filteredResults(); track item.display_name) {-->
    <!--            <button class="d-inline-flex gap-3 btn btn-sm btn-light px-4 py-2 w-100"-->
    <!--                    type="button"-->
    <!--                    (click)="targetLocation(item)">-->

    <!--                <span class="align-self-center">-->
    <!--                  <fa-icon [icon]="['fas', 'location-dot']" size="xl"></fa-icon>-->
    <!--                </span>-->

    <!--              <span class="text-start">-->
    <!--                  <b>-->
    <!--                    {{ item.address.road }},-->
    <!--                    {{ item.address.house_number }}-->
    <!--                  </b>-->

    <!--                  <br>-->

    <!--                  <span class="fw-light">-->
    <!--                    {{ item.address.city || item.address.town || item.address.village }}-->
    <!--                  </span>-->
    <!--                </span>-->
    <!--            </button>-->
    <!--          }-->
    <!--        </div>-->
    <!--      }-->
    <!--    </fieldset>-->

    <map name="leafletMap" class="d-block map"
         leaflet
         [leafletOptions]="options"
         (leafletMapReady)="onMapReady($event)">
    </map>
  `,
  styles: `
    .map {
      height: 800px;
    }

    .search-box {
      display: flex;
      flex-flow: column nowrap;
      background: white;
      border: transparent;
      //overflow: hidden;
      //transition: border-radius 0.3s ease;
      width: 375px;
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

  clinicGeoPoint = input<GeoPoint | undefined>(undefined)

  map: Map | null = null
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMap contributors'
        }
      )
    ],
    zoom: 20,
    center: latLng([53.4046675, 14.4991249])
  };

  private vcr = inject(ViewContainerRef);

  API_BASE_URL = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=pl&q=`;

  query = signal<string>('');

  debouncedQuery = toSignal(toObservable(this.query).pipe(
    debounceTime(150),
    distinctUntilChanged()
  ), {initialValue: ''});

  addressResults = httpResource<LocationResult[]>(
    () => `${this.API_BASE_URL}${encodeURIComponent(this.debouncedQuery())}`,
    {defaultValue: []}
  );


  filteredResults = computed(() =>
    (this.addressResults.value().filter((item: LocationResult) =>
      !!item.address?.house_number) ?? [])
  );

  // selectedLocation = signal<LocationResult | undefined>(undefined);
  // clinicAtLocation = signal<Clinic | null | undefined>(undefined);

  // constructor() {
  //   effect(() => {
  //     const location = this.selectedLocation();
  //     // if (location) {
  //     //   // const lat = parseFloat(location.lat);
  //     //   // const lon = parseFloat(location.lon);
  //     //
  //     //   if (Number.isFinite(lat) && Number.isFinite(lon)) {
  //     //     const clinic = await this.clinicService.findClinicByCoordinates(lat, lon);
  //     //     this.clinicAtLocation.set(clinic);
  //     //     console.log('Znaleziono klinikę:', clinic);
  //     //   }
  //     // } else {
  //     //   this.clinicAtLocation.set(null);
  //     // }
  //   });
  // }

  // ngAfterViewInit() {
  //   this.initMap();
  // }

  private initMap() {
    // map('map', {
    //   center: [52.237049, 21.017532],
    //   zoom: 20,
    //   // zoomControl: false
    // });

    // tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; OpenStreetMap contributors'
    // }).addTo(this.map);

    // control.zoom({position: 'bottomright'}).addTo(map);

    // const CustomButton = Control.extend({
    //   onAdd: (map) => {
    //     const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
    //     btn.innerHTML = '⨁';
    //     btn.title = 'Centruj mapę';
    //     btn.style.backgroundColor = 'white';
    //     btn.style.width = '34px';
    //     btn.style.height = '34px';
    //     btn.style.cursor = 'pointer';
    //
    //     L.DomEvent.on(btn, 'click', (e: Event) => {
    //       L.DomEvent.stopPropagation(e);
    //       L.DomEvent.preventDefault(e);
    //       map.setView([52.237049, 21.017532], 13);
    //     });
    //
    //     return btn;
    //   },
    //   onRemove: () => {}
    // });

    // new CustomButton({position: 'topright'}).addTo(this.map);
  }

  targetLocation(location: LocationResult) {
    // this.mapInstance()?.createPane('asas')
    const componentRef = this.vcr.createComponent(CreateClinicComponent);
    componentRef.instance.setLocation(location);
    // this.popupComponentRef = componentRef;


    const newMarker = marker([location.lat, location.lon])
    // .addTo(this.map);

    newMarker.bindPopup(componentRef.location.nativeElement, {
      minWidth: 600,
      autoPan: true,
      autoPanPaddingTopLeft: [600, 16],
      keepInView: true,
    }).openPopup();

    // this.markerLayer = newMarker;
    // map.setView([lat, lon], 20);
  }

  closePopup(): void {
    // this.map?.closePopup();
    // this.markerLayer?.unbindPopup()
  }

  unbindPopup(): void {
    // this.markerLayer?.unbindPopup()
  }

  onMapReady(map: Map) {
    this.map = map
  }
}
