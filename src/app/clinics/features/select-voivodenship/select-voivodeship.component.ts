import {ChangeDetectionStrategy, Component, effect, inject, output, resource, signal} from '@angular/core';
import {GeoService, LocationResult, Voivodeship} from "../../../shared/data-access/geo.service";


@Component({
  selector: 'app-select-voivodeship',
  imports: [],
  template: `
    <fieldset class="search-box">

      <label class="form-label fw-bold small">Wybierz województwo</label>
      <div class="input-group">
        <input
          class="form-control form-control-sm"
          readonly
          [value]="voivodeshipSelected() || 'Wybierz z listy...'"
          (click)="open.set(!open())"
        />

        <button
          class="btn btn-sm btn-outline-secondary"
          (click)="open.set(!open())">
          {{ open() ? '▲' : '▼' }}
        </button>
      </div>

      @if (open()) {
        <div class="list-open bg-white shadow-lg">
          @for (v of voivodeships; track v) {
            <button
              type="button"
              class="btn btn-sm btn-light w-100 text-start border-bottom py-2"
              [class.active]="voivodeshipSelected() === v"
              (click)="onSelect(v)">
              {{ v }}
            </button>
          }
        </div>
      }

    </fieldset>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectVoivodeship {
  private readonly geoService = inject(GeoService);

  voivodeships = Object.values(Voivodeship);

  open = signal(false);
  voivodeshipSelected = signal<Voivodeship | null>(null);
  voivodeshipLocationChange = output<LocationResult | null>();
  voivodeship = output<Voivodeship | null>();

  locationResource = resource({
    params: () => this.voivodeshipSelected(),
    loader: async ({ params }) => {
      if (!params) return null;
      return await this.geoService.loadVoivodeshipGeo(params);
    }
  });

  constructor() {
    effect(() => {
      const value = this.locationResource.value();
      if (!value) return;

      const name = this.voivodeshipSelected();
      if (!name) return;

      this.voivodeship.emit(name)
      this.voivodeshipLocationChange.emit(value);
    });
  }

  onSelect(v: Voivodeship) {
    this.voivodeshipSelected.set(v);
    this.open.set(false);
  }
}
