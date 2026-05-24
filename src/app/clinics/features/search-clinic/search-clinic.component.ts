import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  resource,
  signal,
  ViewEncapsulation
} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgNotFoundTemplateDirective, NgOptionTemplateDirective, NgSelectComponent} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import ClinicService from "../../../shared/data-access/clinic.service";

export interface CitySearchOption {
  cityName: string;
  displayLabel: string;
}

@Component({
  selector: 'app-search-clinic',
  imports: [FaIconComponent, NgSelectComponent, FormsModule, NgNotFoundTemplateDirective, NgOptionTemplateDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-select
      class="custom"
      [items]="availableCities()"
      bindLabel="cityName"
      placeholder="Wyszukaj miasto lub wioskę..."
      [loading]="clinicsResource.status() === 'loading'"
      [(ngModel)]="selectedCityValue"
      (change)="onCityChange($event)"
      dropdownPosition="bottom"
      [clearable]="true"
      [searchable]="true">


      <ng-template ng-loading-tmp>
        <div class="p-3 small text-center text-white">
          <span class="spinner-border spinner-border-sm me-2 text-primary" role="status"></span>
          Wczytywanie lokalizacji...
        </div>
      </ng-template>

      <ng-template ng-notfound-tmp>
        <div class="p-3 small text-center text-white">
          Brak klinik w tym mieście 🐾
        </div>
      </ng-template>

      <ng-template ng-option-tmp let-item="item">
        <div class="d-flex align-items-center gap-3 py-1 text-white">
          <div>
            <fa-icon [icon]="['fas', 'location-dot']"></fa-icon>
          </div>
          <div class="d-flex flex-column">
              <span class="fw-medium fs-6">
                {{ item.cityName }}
              </span>
          </div>
        </div>
      </ng-template>

    </ng-select>
  `,
  styles: `
    .ng-select.custom {
      border-radius: 8px;
      color: white;
    }

    .ng-select.custom .ng-select-container {
      background: #1a1d20;
      color: white;
      border: 1px solid #2a323c;
      border-radius: 8px;
    }

    .ng-select.custom .ng-select-container .ng-placeholder {
      color: #5a6573;
    }

    .ng-select.custom .ng-select-container .ng-input input,
    .ng-select.custom .ng-select-container .ng-value .ng-value-label {
      color: white;
    }

    .ng-select.custom .ng-select-container .ng-clear-wrapper {
      color: #5a6573;
    }

    .ng-select.custom ng-dropdown-panel {
      color: white;
      background: #1a1d20;
      border: 1px solid #2a323c;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
      margin-top: 4px;
    }

    .ng-select.custom ng-dropdown-panel .ng-dropdown-panel-items .ng-option {
      background-color: transparent;
      border-bottom: 1px solid #12161a;
      padding: 10px 14px;
    }

    .ng-select.custom ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {
      background-color: #2a323c;
    }

    ng-select.ng-invalid.ng-touched .ng-select-container {
      border-color: #dc3545;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px #fde6e8;
    }
  `
})
export class SearchClinicComponent {
  private clinicService = inject(ClinicService);

  readonly citySelected = output<string | null>();

  selectedCityValue: CitySearchOption | null = null;

  clinicsResource = resource({
    loader: async () => {
      return await this.clinicService.getAvailableCities();
    }
  });

  availableCities = computed<CitySearchOption[]>(() => {
    const cities = this.clinicsResource.value() ?? [];

    return cities
      .sort((a, b) => a.localeCompare(b))
      .map(city => ({
        cityName: city,
        displayLabel: city
      }));
  });

  onCityChange(option: CitySearchOption | undefined) {
    const selectedCity = option ? option.cityName : null;
    this.citySelected.emit(selectedCity);
  }
}
