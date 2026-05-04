import {ChangeDetectionStrategy, Component, effect, input, output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {LeafletDirective, LeafletLayersDirective} from "@bluehalo/ngx-leaflet";
import {LocationResult} from "../../../shared/data-access/geo.service";
import {control, geoJSON, latLng, LatLngTuple, Layer, Map as LeafletMap, marker, tileLayer} from "leaflet";
import { ClinicLocation} from "../../../shared/interfaces/clinics.interface";


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
  mapReady = output()
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
  clinicLocationSelected = input<ClinicLocation | null>(null)
  voivodeshipSelected = input<LocationResult | null>(null)


  constructor() {
    effect(() => {
      const map = this.map;
      const location = this.clinicLocationSelected();
      console.log(map, location)

      if (!map || !location) return;
      console.log("sent target")

      this.targetLocation(location);
    });

    effect(() => {
      const map = this.map
      const voivodeship = this.voivodeshipSelected()

      if (!map || !voivodeship) return;
      console.log("sent target")
      this.targetVoivodeship(voivodeship)

    })
  }

  onMapReady(map: LeafletMap) {
    control.zoom({
      position: 'bottomleft'
    }).addTo(map);

    this.map = map;
    this.mapReady.emit()
  }

  targetLocation(location: ClinicLocation) {
    const map = this.map;
    if (!map) return;

    console.log(location);

    const coords: LatLngTuple = [
      Number(location.latitude),
      Number(location.longitude)
    ];

    const newMarker = marker(coords);

    // 🔥 reset zamiast push (ważne!)
    this.markers = [newMarker];

    map.setView(coords, 13);
  }


  private targetVoivodeship(voivodeshipLocation: LocationResult) {
    const map = this.map;
    if (!map) return;
    const localLayers: Layer[] = []

    const geojson = voivodeshipLocation.geojson

    console.log("location geojson detected", geojson)
    const boundaryLayer = geoJSON(geojson, {
      style: {color: '#ff7800', weight: 5, opacity: 0.65}
    });

    localLayers.push(boundaryLayer);
    map.fitBounds(boundaryLayer.getBounds());

    this.markers = localLayers;

  }
}
