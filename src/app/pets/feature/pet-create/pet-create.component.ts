import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';


import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {httpResource} from "@angular/common/http";
import {AnimalTaxonometry} from "../../../shared/interfaces/animals.interface";

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
  imports: [],
  template: `
    <div class="container p-5">
      <div class="modal-header">
        <h4 class="modal-title">Wyszukaj zwierzę</h4>
        <button type="button" class="btn-close" aria-label="Close"
                (click)="activeModal.dismiss('Cross click')"></button>
      </div>

      <div class="modal-body">
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Wpisz nazwę gatunku"
          #searchTerm
          (input)="query.set(searchTerm.value)">

        <select class="form-select mb-3" [value]="iconicTaxa()" #animalType (change)="onTaxaChange(animalType.value)">
          @for (option of taxaOptions; track option.label) {
            <option [value]="option.value">
              {{ option.label }}
            </option>
          }
        </select>

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
          <ul>
            @for (animal of searchResults.value()?.results; track animal.id) {
              <li>
                @if (animal.default_photo && animal.default_photo.medium_url) {
                  <img [src]="animal.default_photo.medium_url" alt="photo" width="40" height="40" class="me-2 rounded"/>
                }
                <strong>{{ animal.preferred_common_name || '(brak polskiej nazwy)' }}</strong>
                <small class="text-muted">({{ animal.name }})</small>
              </li>
            }
          </ul>
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
  private iNaturalistAPI = 'https://api.inaturalist.org/v1/taxa/autocomplete';
  protected activeModal = inject(NgbActiveModal);

  query = signal('');
  iconicTaxa = signal<AnimalTaxonometry>(AnimalTaxonometry.animals);

  readonly taxaOptions = [
    {label: 'Zwierzęta', value: AnimalTaxonometry.animals},
    {label: 'Ssaki', value: AnimalTaxonometry.mammals},
    {label: 'Ptaki', value: AnimalTaxonometry.birds},
    {label: 'Gady', value: AnimalTaxonometry.reptiles},
    {label: 'Płazy', value: AnimalTaxonometry.amphibians},
    {label: 'Ryby kostnoszkieletowe', value: AnimalTaxonometry.fishes},
    {label: 'Owady', value: AnimalTaxonometry.insects},
    {label: 'Pajęczaki', value: AnimalTaxonometry.arachnids},
  ];


  searchResults = httpResource<INaturalistResponse>(() => ({
    url: this.iNaturalistAPI,
    params: {
      q: this.query(),
      locale: 'pl',
      iconic_taxa: this.iconicTaxa(),
      rank: 'species',
      photos: 'true',
      per_page: '10',
      quality_grade: 'research'
    }
  }));

  onTaxaChange(value: string) {
    this.iconicTaxa.set(value as AnimalTaxonometry);
  }

}
