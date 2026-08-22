import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { LeafletDirective, LeafletLayersDirective } from "@bluehalo/ngx-leaflet";
import { LocationResult } from "../../../shared/data-access/geo.service";
import { control, geoJSON, latLng, LatLngTuple, Layer, Map as LeafletMap, marker, tileLayer, featureGroup } from "leaflet";
import { ClinicLocation } from "../../../shared/interfaces/clinics.interface";

@Component({
  selector: 'app-map',
  imports: [FormsModule, LeafletDirective, LeafletLayersDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map h-100"
         leaflet
         [leafletOptions]="options"
         [leafletLayers]="layers()"
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
  map = signal<LeafletMap | null>(null);
  mapReady = signal(false);

  markers = signal<Layer[]>([]);
  voivodeshipLayer = signal<Layer | null>(null);

  layers = computed(() => {
    const result: Layer[] = [];
    const marker = this.markers();
    const voivodeship = this.voivodeshipLayer();

    result.push(...marker);

    if (voivodeship) {
      result.push(voivodeship);
    }

    return result;
  });

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

  clinicLocation = input<ClinicLocation | null>(null)
  voivodeshipLocation = input<LocationResult | null>(null)

  clinicsList = input<ClinicLocation[] | null>(null)

  constructor() {
    effect(() => {
      const map = this.map();
      const ready = this.mapReady();
      const location = this.clinicLocation();

      if (!ready || !map || !location) return;

      this.targetLocation(location);
    });

    effect(() => {
      const map = this.map();
      const ready = this.mapReady();
      const voivodeship = this.voivodeshipLocation();

      if (!ready || !map || !voivodeship) return;

      this.targetVoivodeship(voivodeship);
    });

    effect(() => {
      const map = this.map();
      const ready = this.mapReady();
      const clinics = this.clinicsList();

      if (!ready || !map || !clinics || clinics.length === 0) return;

      this.targetMultipleClinics(clinics);
    });
  }

  onMapReady(map: LeafletMap) {
    control.zoom({position: 'bottomleft'}).addTo(map);
    this.map.set(map);
    this.mapReady.set(true);
  }

  targetLocation(location: ClinicLocation) {
    const map = this.map();
    if (!map) return;

    const coords: LatLngTuple = [
      location.latitude,
      location.longitude
    ];

    const newMarker = marker(coords);
    this.markers.set([newMarker]);
    map.setView(coords, 13);
  }

  private targetVoivodeship(voivodeshipLocation: LocationResult) {
    const map = this.map();
    if (!map) return;

    const geojson = voivodeshipLocation.geojson;

    const boundaryLayer = geoJSON(geojson, {
      style: { color: '#ff7800', weight: 5, opacity: 0.65 }
    });

    this.voivodeshipLayer.set(boundaryLayer);
    map.fitBounds(boundaryLayer.getBounds());
  }

  private targetMultipleClinics(locations: ClinicLocation[]) {
    const map = this.map();
    if (!map) return;

    const newMarkers = locations.map(loc => {
      return marker([loc.latitude, loc.longitude]);
    });

    this.markers.set(newMarkers);

    if (newMarkers.length > 0) {
      const group = featureGroup(newMarkers);
      map.fitBounds(group.getBounds().pad(0.1)); // pad(0.1) dodaje estetyczny margines wokół pinezek
    }
  }
}
