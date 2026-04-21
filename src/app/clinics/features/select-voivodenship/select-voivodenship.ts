import {ChangeDetectionStrategy, Component, inject, output, signal} from '@angular/core';
import {GeoService, LocationResult, Voivodeship} from "../../../shared/data-access/geo.service";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {distinctUntilChanged, filter, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-select-voivodenship',
  imports: [],
  template: `
    <fieldset class="search-box">
      <div class="position-relative z-3">
        <div class="input-group">
          <input class="form-control form-control-sm"
                 readonly
                 [value]="selected() || 'Wybierz z listy...'"
                 (click)="open.set(!open())"
                 placeholder="Wybierz województwo"/>
          <button class="btn btn-sm btn-outline-secondary" (click)="open.set(!open())">
            {{ open() ? '▲' : '▼' }}
          </button>
        </div>

        @if (open()) {
          <div class="list-open border mt-1 position-absolute w-100 bg-white shadow-lg overflow-auto">
            @for (v of voivodeships; track v) {
              <button type="button"
                      class="btn btn-sm btn-light w-100 text-start border-bottom py-2"
                      [class.active]="selected() === v"
                      (click)="select(v)">
                {{ v }}
              </button>
            }
          </div>
        }
      </div>
    </fieldset>
  `,
  styles: `
    .search-box {
      display: flex;
      flex-flow: column nowrap;
      background: white;
      border: transparent;
    }

    .search-input {
      padding: 11px 106px 11px 64px;
    }

    .list-open {
      font-size: 14px;
      border-bottom: 1px solid #e3e3e3;
      box-shadow: 0 0 2px rgb(0 0 0 / 20%), 0 -1px 0 rgb(0 0 0 / 2%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectVoivodenship {
  private readonly geoService = inject(GeoService);

// Stan
voivodeships = Object.values(Voivodeship);
open = signal(false);
selected = signal<Voivodeship | null>(null);

// Event wyjściowy dla rodzica
voivodenshipLocation = output<LocationResult>();
voivodenshipSelected = output<Voivodeship>();


// Reaktywne pobieranie danych po zmianie sygnału 'selected'
private selected$ = toObservable(this.selected);

// Strumień wyników - automatycznie odpala się gdy 'selected' się zmieni
private locationData$ = this.selected$.pipe(
  filter((v): v is Voivodeship => !!v),
  distinctUntilChanged(),
  tap(v => this.voivodenshipSelected.emit(v)),
  switchMap(v => this.geoService.loadVoivodenshipGeo(v)),
  tap(results => {
    if (results) {
      this.voivodenshipLocation.emit(results);
    }
  })
);

// Rejestrujemy subskrypcję strumienia przez toSignal (uruchamia strumień)
results = toSignal(this.locationData$);

select(v: Voivodeship) {
  this.selected.set(v);
  this.open.set(false);
}

}
