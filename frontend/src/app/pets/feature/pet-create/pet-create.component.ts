import {ChangeDetectionStrategy, Component, effect, inject, Input, OnInit, resource, signal} from "@angular/core";
import {httpResource} from "@angular/common/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {NgSelectComponent} from "@ng-select/ng-select";
import {PetsService} from "../../../shared/data-access/pets.service";
import {INewPetData} from "../../../shared/interfaces/animals.interface";

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
  imports: [FormsModule, NgSelectComponent],
  template: `
    <div class="container p-3">

      @if (!selectedSpecies()) {
        <div class="modal-header d-flex flex-column gap-2 w-100 px-0 pt-0">
          <h5 class="modal-title">Krok 1: Wybierz gatunek zwierzaka</h5>
          <input
            type="text"
            class="form-control"
            placeholder="Wpisz nazwę gatunku np. Wróbel, Pies Domowy, Kot"
            #searchTerm
            (input)="query.set(searchTerm.value)">
        </div>

        <div class="modal-body px-0">
          <label class="form-label text-muted small fw-bold">Filtruj po gromadzie:</label>
          <ng-select
            class="mb-4"
            [items]="taxaOptions"
            bindLabel="label"
            bindValue="value"
            [clearable]="false"
            [searchable]="true"
            [ngModel]="iconicTaxa()"
            (ngModelChange)="iconicTaxa.set($event)">
          </ng-select>

          @if (searchResults.isLoading()) {
            <div class="text-center py-3">
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              Ładowanie danych z iNaturalist...
            </div>
          }

          @if (searchResults.error()) {
            <div class="alert alert-danger">Wystąpił błąd podczas pobierania danych.</div>
          }

          @if (searchResults.value(); as response) {
            @if (response.results.length > 0) {
              <div class="d-flex flex-column gap-2" style="max-height: 350px; overflow-y: auto;">
                @for (animal of response.results; track animal.id) {
                  <div class="card shadow-sm border-0 rounded-3 card-btn" (click)="selectedSpecies.set(animal)">
                    <div class="card-body d-flex align-items-center p-2">
                      @if (animal.default_photo?.medium_url) {
                        <img [src]="animal.default_photo!.medium_url" alt="photo" class="me-3 rounded object-fit-cover"
                             width="54" height="54"/>
                      } @else {
                        <div
                          class="me-3 rounded bg-secondary-subtle d-flex align-items-center justify-content-center text-muted"
                          style="width: 54px; height: 54px;">🐾
                        </div>
                      }
                      <div>
                        <h6
                          class="mb-0 text-capitalize">{{ animal.preferred_common_name || animal.english_common_name || animal.name }}</h6>
                        <small class="text-muted italic">({{ animal.name }})</small>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else if (query().trim().length >= 2) {
              <p class="text-muted text-center py-3">Brak wyników dla podanej frazy.</p>
            }
          }
        </div>

        <div class="modal-footer px-0 pb-0">
          <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">Zamknij</button>
        </div>
      } @else {

        <div class="modal-header d-flex align-items-center justify-content-between w-100 px-0 pt-0">
          <h5 class="modal-title">
            {{ isEditMode() ? 'Edycja profilu pupila' : 'Krok 2: Uzupełnij profil pupila' }}
          </h5>
          @if (!isEditMode()) {
            <button type="button" class="btn btn-sm btn-link text-decoration-none"
                    (click)="selectedSpecies.set(undefined)">
              ⬅ Zmień gatunek
            </button>
          }
        </div>

        <div class="modal-body px-0">
          <div class="alert alert-info d-flex align-items-center p-2 mb-4">
            @if (petModel.photoUrl) {
              <img [src]="petModel.photoUrl" class="rounded me-2 object-fit-cover" width="40"
                   height="40" alt="mini"/>
            }
            <div>
              <span class="fw-bold d-block text-capitalize">{{ petModel.breed || 'Nieokreślony' }}</span>
              <small class="text-muted italic">{{ petModel.species }}</small>
            </div>
          </div>

          <form #petForm="ngForm" (ngSubmit)="onSubmit(petForm.valid)">
            <div class="mb-3">
              <label class="form-label fw-bold small">Imię pupila *</label>
              <input type="text" class="form-control" name="petName" [(ngModel)]="petModel.name" required
                     placeholder="np. Pimpek, Luna">
            </div>

            <div class="row mb-3">
              <div class="col">
                <label class="form-label fw-bold small">Data urodzenia</label>
                <input type="date" class="form-control" name="petBirthDate" [(ngModel)]="petModel.birthDate">
              </div>
              <div class="col">
                <label class="form-label fw-bold small">Waga (kg)</label>
                <input type="number" step="0.1" min="0" class="form-control" name="petWeight"
                       [(ngModel)]="petModel.weight" placeholder="0.0">
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold small d-block">Płeć *</label>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="petSex" id="sexMale" value="Samiec"
                       [(ngModel)]="petModel.sex">
                <label class="form-check-label" for="sexMale">Samiec</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="petSex" id="sexFemale" value="Samica"
                       [(ngModel)]="petModel.sex">
                <label class="form-check-label" for="sexFemale">Samica</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="petSex" id="sexUnknown" value="Nieokreślona"
                       [(ngModel)]="petModel.sex">
                <label class="form-check-label" for="sexUnknown">Nieokreślona</label>
              </div>
            </div>

            <div class="modal-footer px-0 pb-0 mt-4">
              <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">Anuluj</button>
              <button type="submit" class="btn btn-primary" [disabled]="petForm.invalid">
                {{ isEditMode() ? 'Zapisz zmiany' : 'Dodaj zwierzaka' }}
              </button>
            </div>
          </form>
        </div>
      }

    </div>
  `,
  styles: `
    .card-btn { cursor: pointer; transition: background-color 0.2s; }
    .card-btn:hover { background-color: var(--bs-light-bg-subtle); }
    .italic { font-style: italic; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PetCreateComponent implements OnInit {
  private petService = inject(PetsService);
  private iNaturalistAPI = 'https://api.inaturalist.org/v1/taxa';
  protected activeModal = inject(NgbActiveModal);

  // Wejście dla danych edytowanego zwierzaka (wersja pełna, z ID)
  @Input() petData?: INewPetData & { id?: string };

  isEditMode = signal(false);
  query = signal('');
  iconicTaxa = signal<number>(1);

  // Pozwalamy, by selectedSpecies było sztucznym obiektem w trybie edycji, aby pominąć krok 1
  selectedSpecies = signal<INaturalistResult | Record<string, any> | undefined>(undefined);

  petModel: INewPetData = {
    name: '',
    birthDate: '',
    weight: null,
    species: '',
    breed: '',
    sex: 'Nieokreślona',
    photoUrl: '',
    clinic: '',
    lastVisit: ''
  };

  readonly taxaOptions = [
    {label: 'Wszystkie zwierzęta', value: 1},
    {label: 'Ssaki', value: 40151},
    {label: 'Ptaki', value: 3},
    {label: 'Gady', value: 26036},
    {label: 'Płazy', value: 20978},
    {label: 'Ryby kostnoszkieletowe', value: 47178},
    {label: 'Owady', value: 47158},
    {label: 'Pajęczaki', value: 47119},
  ];

  searchResults = httpResource<INaturalistResponse>(() => {
    const currentQuery = this.query();
    const currentTaxon = this.iconicTaxa();
    if (currentQuery.trim().length < 2) return undefined;

    return {
      url: this.iNaturalistAPI,
      params: {
        q: currentQuery,
        locale: 'pl',
        taxon_id: currentTaxon.toString(),
        is_active: 'true',
        rank: 'species',
        per_page: '10',
        order_by: 'observations_count',
      }
    };
  });

  ngOnInit() {
    if (this.petData) {
      this.isEditMode.set(true);
      // Klonujemy dane do modelu formularza
      this.petModel = { ...this.petData };

      // Sztucznie ustawiamy wybrany gatunek (mock-up), by ominąć Krok 1 wyszukiwania i przejść do Kroku 2
      this.selectedSpecies.set({
        name: this.petData.species,
        preferred_common_name: this.petData.breed,
        default_photo: { medium_url: this.petData.photoUrl, url: this.petData.photoUrl }
      });
    }
  }

  onSubmit(isValid: boolean | null) {
    if (!isValid) return;
    this.onSubmitPetAction.set({ ...this.petModel });
  }

  // Zmieniona nazwa sygnału na bardziej generyczną
  onSubmitPetAction = signal<(INewPetData & { id?: string }) | null>(null);

  // Wspólny zasób obsługujący zapis lub aktualizację
  onSavePetResource = resource({
    params: this.onSubmitPetAction,
    loader: async ({ params }) => {
      if (!params) return null;

      if (this.isEditMode() && this.petData?.id) {
        // Zakładam, że Twój PetsService posiada metodę updatePet(id, data) zwracającą Promise/Observable eksplorowany asynchronicznie
        return await this.petService.updatePet(this.petData.id, params);
      } else {
        return await this.petService.createPet(params);
      }
    }
  });

  constructor() {
    // Efekt przepisujący dane z iNaturalist (uruchamia się TYLKO podczas tworzenia nowego pupila)
    effect(() => {
      const speciesData = this.selectedSpecies() as INaturalistResult;
      // Pilnujemy, aby efekt nie nadpisywał formularza, jeśli jesteśmy w trybie edycji i iNaturalist API nie dało pełnego obiektu
      if (speciesData && !this.isEditMode() && 'iconic_taxon_name' in speciesData) {
        this.petModel.species = speciesData.iconic_taxon_name || 'Nieokreślony';
        this.petModel.breed = speciesData.preferred_common_name || speciesData.name;
        this.petModel.photoUrl = speciesData.default_photo?.medium_url || '';
      }
    });

    // Reakcja na pomyślny koniec operacji (zarówno dodania jak i edycji)
    effect(() => {
      if (this.onSavePetResource.status() === 'resolved') {
        const result = this.onSavePetResource.value();
        if (result !== null) {
          // Zwracamy true, aby komponent nadrzędny PetsComponent wiedział, że trzeba wywołać reload()
          this.activeModal.close(true);
        }
      }
    });
  }
}
