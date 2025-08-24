import {ChangeDetectionStrategy, Component, inject, signal} from "@angular/core";
import {httpResource} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectComponent} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {TitleCasePipe} from "@angular/common";


interface INaturalistResult {
  id: number;
  iconic_taxon_id: number;
  iconic_taxon_name: string;
  is_active: boolean;
  name: string;
  preferred_common_name?: string;
  english_common_name?: string;
  rank: string;
  rank_level: number;
  ancestor_ids: number[];
  observations_count: number;
  default_photo?: {
    medium_url: string;
    url: string;
  };
}

interface INaturalistResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: INaturalistResult[];
}

@Component({
  selector: 'app-pet-create',
  imports: [NgSelectComponent, FormsModule, TitleCasePipe],
  template: `
    <div class="container p-3">
      <div class="modal-header">
        <input
          type="text"
          class="form-control"
          placeholder="Wpisz nazwę gatunku np. Wróbel, Pies Domowy, Kot"
          #searchTerm
          (input)="query.set(searchTerm.value)">
      </div>

      <div class="modal-body">
        <!--        <select class="form-select mb-3" [value]="iconicTaxa()" #animalType-->
        <!--                (change)="iconicTaxa.set(+animalType.value)">-->
        <!--          @for (option of taxaOptions; track option.label) {-->
        <!--            <option [value]="option.value">-->
        <!--              {{ option.label }}-->
        <!--            </option>-->
        <!--          }-->
        <!--        </select>-->

<!--        <ng-select-->
<!--          [items]="taxaOptions"-->
<!--          bindLabel="label"-->
<!--          bindValue="value"-->
<!--          [clearable]="false"-->
<!--          [searchable]="true"-->
<!--          [ngModel]="iconicTaxa()"-->
<!--          (ngModelChange)="iconicTaxa.set($event)">-->
<!--        </ng-select>-->


        <!-- Ładowanie -->
        @if (searchResults.isLoading()) {
          <div>Ładowanie wyników...</div>
        }

        <!-- Błąd -->
        @if (searchResults.error()) {
          <div class="text-danger">
            Wystąpił błąd: {{ searchResults.error() }}
          </div>
        }

        @if (searchResults.value()) {
          <div class="d-flex flex-column gap-2">
            @for (animal of searchResults.value()?.results; track animal.id) {
              <div class="card shadow-sm border-0 rounded-3">
                <div class="card-body d-flex align-items-center">
                  @if (animal.default_photo && animal.default_photo.medium_url) {
                    <img
                      [src]="animal.default_photo.medium_url"
                      alt="photo"
                      class="me-3 rounded"
                      width="128"
                      height="128"
                    />
                  }
                  <div>
                    <h6 class="mb-1">
                      {{ animal.preferred_common_name || animal.english_common_name | titlecase }}
                    </h6>
                    <small class="text-muted">({{ animal.name }})</small>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="text-muted">Brak wyników.</p>
        }

      </div>
      <div class="modal-footer">
<!--        <button type="button"  class="btn btn-outline-secondary"-->
<!--                (click)="activeModal.close('Close click')">-->
<!--          Zamknij-->
<!--        </button>-->
      </div>

    </div>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetCreateComponent {
  private iNaturalistAPI = 'https://api.inaturalist.org/v1/taxa';
  protected activeModal = inject(NgbActiveModal);

  query = signal('');
  selectedSpecies = signal<INaturalistResult | undefined>(undefined)

  // readonly taxaOptions = [
  //   {label: 'Zwierzęta', value: 1},         // Animalia
  //   {label: 'Ssaki', value: 40151},         // Mammalia
  //   {label: 'Ptaki', value: 3},             // Aves
  //   {label: 'Gady', value: 26036},          // Reptilia
  //   {label: 'Płazy', value: 20978},         // Amphibia
  //   {label: 'Ryby kostnoszkieletowe', value: 47178}, // Actinopterygii
  //   {label: 'Owady', value: 47158},         // Insecta
  //   {label: 'Pajęczaki', value: 47119},     // Arachnida
  // ];


  searchResults = httpResource<INaturalistResponse>(() => ({
    url: this.iNaturalistAPI,
    params: {
      q: this.query(),
      locale: 'pl',
      taxon_id: 1,
      is_active: true,
      rank: 'species',
      per_page: '10',
      order_by: 'observations_count',
    }
  }));

}
