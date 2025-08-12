import {ChangeDetectionStrategy, Component, inject, signal} from "@angular/core";
import {httpResource} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectComponent} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";


interface INaturalistResult {
  id: number;
  iconic_taxon_id: number;
  iconic_taxon_name: string;
  is_active: boolean;
  name: string;
  preferred_common_name?: string;
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
  imports: [NgSelectComponent, FormsModule],
  template: `
    <div class="container p-5">
      <div class="modal-header">
        <button type="button" class="btn-close" aria-label="Close"
                (click)="activeModal.dismiss('Cross click')">

        </button>
      </div>

      <div class="modal-body">
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Wpisz nazwę gatunku np. Wróbel, Pies Domowy, Kot"
          #searchTerm
          (input)="query.set(searchTerm.value)">

        <!--        <select class="form-select mb-3" [value]="iconicTaxa()" #animalType-->
        <!--                (change)="iconicTaxa.set(+animalType.value)">-->
        <!--          @for (option of taxaOptions; track option.label) {-->
        <!--            <option [value]="option.value">-->
        <!--              {{ option.label }}-->
        <!--            </option>-->
        <!--          }-->
        <!--        </select>-->

        <ng-select
          [items]="taxaOptions"
          bindLabel="label"
          bindValue="value"
          [clearable]="false"
          [searchable]="true"
          [ngModel]="iconicTaxa()"
          (ngModelChange)="iconicTaxa.set($event)">
        </ng-select>


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
          <div class="d-flex flex-column flex-nowrap p-2">
            @for (animal of searchResults.value()?.results; track animal.id) {
              <div class="d-flex flex-row flex-nowrap">
                @if (animal.default_photo && animal.default_photo.medium_url) {
                  <img [src]="animal.default_photo.medium_url" alt="photo" width="128" height="128"
                       class="me-2 rounded"/>
                }
                <strong>{{ animal.preferred_common_name || '(brak polskiej nazwy)' }}</strong>
                <br>
                <small class="text-muted">({{ animal.name }})</small>
              </div>
            }
          </div>
        } @else {
          <p class="text-muted">Brak wyników.</p>
        }

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary"
                (click)="activeModal.close('Close click')">
          Zamknij
        </button>
      </div>
    </div>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetCreateComponent {
  private iNaturalistAPI = 'https://api.inaturalist.org/v1/taxa';
  protected activeModal = inject(NgbActiveModal);

  query = signal('');
  iconicTaxa = signal<number>(1);

  readonly taxaOptions = [
    {label: 'Zwierzęta', value: 1},         // Animalia
    {label: 'Ssaki', value: 40151},         // Mammalia
    {label: 'Ptaki', value: 3},             // Aves
    {label: 'Gady', value: 26036},          // Reptilia
    {label: 'Płazy', value: 20978},         // Amphibia
    {label: 'Ryby kostnoszkieletowe', value: 47178}, // Actinopterygii
    {label: 'Owady', value: 47158},         // Insecta
    {label: 'Pajęczaki', value: 47119},     // Arachnida
  ];


  searchResults = httpResource<INaturalistResponse>(() => ({
    url: this.iNaturalistAPI,
    params: {
      q: this.query(),
      locale: 'pl',
      taxon_id: this.iconicTaxa(),
      is_active: true,
      rank: 'species',
      per_page: '10',
      order_by: 'observations_count',
    }
  }));

}
