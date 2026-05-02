import {ChangeDetectionStrategy, Component, effect, input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {LeafletDirective, LeafletLayersDirective} from "@bluehalo/ngx-leaflet";
import {LocationResult} from "../../../shared/data-access/geo.service";
import {control, geoJSON, latLng, LatLngTuple, Layer, Map as LeafletMap, marker, tileLayer} from "leaflet";


@Component({
  selector: 'app-map',
  imports: [FormsModule, LeafletDirective, LeafletLayersDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div class="map h-100"
           leaflet
           [leafletOptions]="options"
           [leafletLayers]="markers"
           (leafletMapReady)="onMapReady($event)">
      </div>
  `,
  styles: `
    .map {
      filter: hue-rotate(90deg);
    }
  `,
})
export class MapComponent {
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

  clinicLocationSelected = input<LocationResult | null>(null)
  voivodeshipSelected = input<LocationResult | null>(null)


  constructor() {
    effect(() => {
      const clinicLocationSelected = this.clinicLocationSelected()
      const map = this.map
      if (clinicLocationSelected && map) {
        this.targetLocation(clinicLocationSelected)
      }
    })

    effect(() => {
      const voivodeshipSelected = this.voivodeshipSelected()
      const map = this.map
      if (voivodeshipSelected && map) {
        this.targetLocation(voivodeshipSelected)
      }
    })
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
      const boundaryLayer = geoJSON(location.geojson,
        {
          style:
            {color: '#ff7800', weight: 5, opacity: 0.65}
        });
      layers.push(boundaryLayer);
      this.map.fitBounds(boundaryLayer.getBounds());
    } else {
      layers.push(newMarker);
      this.map.setView(coords, 13);
    }

    this.markers = layers;
    console.log("markery zdane")

  }
}
