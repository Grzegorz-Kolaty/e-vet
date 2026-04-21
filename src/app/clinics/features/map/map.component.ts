import {ChangeDetectionStrategy, Component, effect, input, signal,} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {control, geoJSON, latLng, LatLngTuple, Layer, Map as LeafletMap, marker, tileLayer} from 'leaflet';
import {LeafletDirective, LeafletLayersDirective} from "@bluehalo/ngx-leaflet";
import {LocationResult} from "../../../shared/data-access/geo.service";


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule, LeafletDirective, LeafletLayersDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex flex-column h-100">
      <div class="map flex-fill"
           leaflet
           [leafletOptions]="options"
           [leafletLayers]="layers()"
           (leafletMapReady)="onMapReady($event)">
      </div>
    </div>
  `,
  styles: `
    .map {
      filter: hue-rotate(90deg);
    }
  `,
})
export class MapComponent {
  map: LeafletMap | null = null;
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap contributors'
      })
    ],
    zoom: 6,
    center: latLng([52.06, 19.48]), // Środek Polski
    zoomControl: false
  };
  layers = signal<Layer[]>([]);

  voivodeshipSelected = input<LocationResult | null>(null);
  clinicLocationSelected = input<LocationResult | null>(null);

  onMapReady(map: LeafletMap) {
    control.zoom({
      position: 'bottomright'
    }).addTo(map)
    this.map = map;
  }

  constructor() {
    effect(() => {
      const voivodeship = this.voivodeshipSelected()
      if (voivodeship && this.map) {
        this.setLayerMapForVoivodeship(voivodeship)
      }
    })

    effect(() => {
      const clinicLocation = this.clinicLocationSelected()
      if (clinicLocation && this.map) {
        this.setMarkerForClinic(clinicLocation)
      }
    })
  }

  private setLayerMapForVoivodeship(location: LocationResult) {
    if (!this.map) return;

    const coords: LatLngTuple = [Number(location.lat), Number(location.lon)];
    const layers: Layer[] = [];

    // 1. Dodaj marker
    // layers.push(marker(coords));

    // 2. Dodaj granice (GeoJSON) jeśli istnieją
    if (location.geojson) {
      const boundaryLayer = geoJSON(location.geojson, {
        style: {color: '#2c3e50', weight: 2, fillOpacity: 0.1}
      });
      layers.push(boundaryLayer);

      // Dopasuj widok do granic województwa
      this.map.fitBounds(boundaryLayer.getBounds(), {padding: [20, 20]});
    } else {
      this.map.setView(coords, 8);
    }

    // 3. Zaktualizuj sygnał markerów (Leaflet automatycznie je odświeży przez [leafletLayers])
    this.layers.set(layers);
  }

  private setMarkerForClinic(location: LocationResult) {
    if (!this.map) return;

    const coords: LatLngTuple = [Number(location.lat), Number(location.lon)];
    const layers: Layer[] = this.layers();

    // 1. Dodaj marker
    layers.push(marker(coords));

    // 2. Dodaj granice (GeoJSON) jeśli istnieją
    if (location.geojson) {
      const boundaryLayer = geoJSON(location.geojson, {
        style: {color: '#2c3e50', weight: 2, fillOpacity: 0.3}
      });
      layers.push(boundaryLayer);

      // Dopasuj widok do granic województwa
      this.map.fitBounds(boundaryLayer.getBounds(), {padding: [20, 20]});
    } else {
      this.map.setView(coords, 8);
    }

    // 3. Zaktualizuj sygnał markerów (Leaflet automatycznie je odświeży przez [leafletLayers])
    this.layers.set(layers);
  }

}
