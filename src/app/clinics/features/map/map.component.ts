// import {
//   ChangeDetectionStrategy,
//   Component,
//   inject,
//   signal,
//   ViewContainerRef,
//   computed,
//   input,
// } from '@angular/core';
// import {toObservable, toSignal} from "@angular/core/rxjs-interop";
// import {FormsModule} from "@angular/forms";
// import {httpResource} from "@angular/common/http";
// import {debounceTime, distinctUntilChanged} from "rxjs";
// import {marker, tileLayer, latLng, Map} from 'leaflet';
// import {GeoPoint} from "firebase/firestore";
// import CreateClinicComponent from "../create-clinic/create-clinic.component";
// import {FaIconComponent} from "@fortawesome/angular-fontawesome";
// import {LeafletDirective, LeafletLayersDirective} from "@bluehalo/ngx-leaflet";
//
// export interface LocationResult {
//   display_name: string;
//   lat: number;
//   lon: number;
//   address: {
//     road?: string;
//     city?: string;
//     town?: string;
//     village?: string;
//     house_number?: string;
//   };
// }
//
// @Component({
//   selector: 'app-map',
//   imports: [FormsModule, LeafletDirective, LeafletLayersDirective, FaIconComponent],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   template: `
//     <section class="d-flex h-100">
//       <div class="flex-fill map"
//            leaflet
//            [leafletOptions]="options"
//            [leafletLayers]="layers"
//            (leafletMapReady)="onMapReady($event)">
//       </div>
//
//       <fieldset class="search-box m-3 shadow-lg position-absolute z-2"
//                 [class.list-open]="filteredResults().length">
//
//         <div class="d-inline-flex align-items-center px-4 py-3 gap-3">
//           <fa-icon [icon]="['fas', 'map']" size="lg"></fa-icon>
//
//           <input class="flex-fill border-0 outline-none"
//                  #cityInput
//                  type="text"
//                  placeholder="Wpisz adres (np. Maciejewicza 23 Szczecin)"
//                  (input)="query.set(cityInput.value)"/>
//
//           <fa-icon [icon]="['fas', 'magnifying-glass']" size="lg"></fa-icon>
//         </div>
//
//         @if (filteredResults().length) {
//           <div class="border-top">
//             @for (item of filteredResults(); track item.display_name) {
//               <button class="d-inline-flex gap-3 btn btn-sm btn-light px-4 py-2 w-100"
//                       type="button"
//                       (click)="targetLocation(item)">
//
//                   <span class="align-self-center">
//                     <fa-icon [icon]="['fas', 'location-dot']" size="xl"></fa-icon>
//                   </span>
//
//                 <span class="text-start">
//                     <b>
//                       {{ item.address.road }}, {{ item.address.house_number }}
//                     </b>
//                     <br>
//                     <span class="fw-light">
//                       {{ item.address.city || item.address.town || item.address.village }}
//                     </span>
//                   </span>
//               </button>
//             }
//           </div>
//         }
//       </fieldset>
//     </section>
//   `,
//   styles: `
//     .map {
//       filter: hue-rotate(90deg);
//     }
//
//     .search-box {
//       display: flex;
//       flex-flow: column nowrap;
//       background: white;
//       border: transparent;
//       width: 375px;
//     }
//
//     .search-input {
//       padding: 11px 106px 11px 64px;
//     }
//
//     .search-box.list-open {
//       border-bottom: 1px solid #e3e3e3;
//       box-shadow: 0 0 2px rgb(0 0 0 / 20%), 0 -1px 0 rgb(0 0 0 / 2%);
//     }
//   `,
// })
// export class MapComponent {
//   clinicGeoPoint = input<GeoPoint | undefined>(undefined)
//
//   map: Map | null = null
//   options = {
//     layers: [
//       tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: 'OpenStreetMap contributors'
//       })
//     ],
//     zoom: 14,
//     center: latLng([53.4046675, 14.4991249])
//   };
//
//   layers = [
//     marker([53.4046675, 14.4991249])
//   ];
//
//   private vcr = inject(ViewContainerRef);
//
//   API_BASE_URL = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=pl&q=`;
//
//   query = signal<string>('');
//   debouncedQuery = toSignal(toObservable(this.query).pipe(
//     debounceTime(300),
//     distinctUntilChanged()
//   ), {initialValue: ''});
//
//   addressResults = httpResource<LocationResult[]>(
//     () => `${this.API_BASE_URL}${encodeURIComponent(this.debouncedQuery())}`,
//     {defaultValue: []}
//   );
//
//   filteredResults = computed(() =>
//     (this.addressResults.value().filter((item: LocationResult) =>
//       !!item.address?.house_number) ?? [])
//   );
//
//   onMapReady(map: Map) {
//     this.map = map;
//   }
//
//   targetLocation(location: LocationResult) {
//     if (!this.map) return;
//
//     const lat = parseFloat(location.lat as any);
//     const lon = parseFloat(location.lon as any);
//
//     // marker
//     const newMarker = marker([lat, lon]).addTo(this.map);
//
//     // dynamicznie tworzony komponent
//     const componentRef = this.vcr.createComponent(CreateClinicComponent);
//     componentRef.instance.setLocation(location);
//
//     newMarker.bindPopup(componentRef.location.nativeElement, {
//       minWidth: 600,
//       autoPan: true,
//       // autoPanPaddingTopLeft: [600, 16],
//       keepInView: true,
//     }).openPopup();
//
//     this.map.setView([lat, lon], 18);
//   }
// }


import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {marker, tileLayer, latLng, Map} from 'leaflet';
import {GeoPoint} from "firebase/firestore";
import {LeafletDirective, LeafletLayersDirective} from "@bluehalo/ngx-leaflet";

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
  imports: [FormsModule, LeafletDirective, LeafletLayersDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="d-flex h-100">
      <div class="flex-fill map"
           leaflet
           [leafletOptions]="options"
           [leafletLayers]="layers"
           (leafletMapReady)="onMapReady($event)">
      </div>
    </section>
  `,
  styles: ``,
})
export class MapComponent {
  clinicGeoPoint = input<GeoPoint | undefined>(undefined)

  map: Map | null = null
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap contributors'
      })
    ],
    zoom: 14,
    center: latLng([53.4046675, 14.4991249])
  };

  layers = [
    marker([53.4046675, 14.4991249])
  ];

  onMapReady(map: Map) {
    this.map = map;
  }
}
