import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PetCreateComponent} from "../pet-create/pet-create.component";


@Component({
  selector: 'app-pet-list',
  imports: [
    CommonModule,
    FormsModule,
    FaIconComponent,
  ],
  template: `
    <div class="container py-5">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3">
          <div class="bg-white border rounded-4 px-4 py-4">
            <h4 class="mb-3 fw-semibold">Filtruj</h4>

            <div class="mb-3">
              <label>Gatunek</label>
              <select class="form-select">
                <option selected>Wszystkie</option>
                <option>Pies</option>
                <option>Kot</option>
              </select>
            </div>

            <div class="mb-3">
              <label>Rasa</label>
              <input type="text" class="form-control" placeholder="np. Owczarek Niemiecki"/>
            </div>

            <div class="mb-3">
              <label>Klinika</label>
              <input type="text" class="form-control" placeholder="np. Zdrowy Pupil"/>
            </div>

            <div class="mb-3">
              <label>Weterynarz</label>
              <input type="text" class="form-control" placeholder="np. Dr. Jan Kowalski"/>
            </div>

            <div class="mb-3">
              <label>Data ostatniej wizyty</label>
              <input type="date" class="form-control"/>
            </div>

            <div class="mb-3">
              <label>Wiek</label>
              <input type="number" class="form-control" placeholder="np. 5"/>
            </div>

            <div class="mb-4">
              <label>Płeć</label>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="sex" id="all" checked/>
                <label class="form-check-label" for="all">Wszystkie</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="sex" id="male"/>
                <label class="form-check-label" for="male">Samiec</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="sex" id="female"/>
                <label class="form-check-label" for="female">Samica</label>
              </div>
            </div>

            <div class="d-flex h-50 gap-2">
              <button class="btn btn-outline-secondary w-50">Wyczyść filtry</button>
              <button class="btn btn-primary w-50">Zastosuj</button>
            </div>
          </div>
        </div>

        <!-- Main content -->
        <div class="col-md-9">
          <!-- Search input -->
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-stretch gap-5 mb-4">
            <div class="flex-fill">
              <div class="input-group h-100">
                <input
                  #searchPetInput
                  type="text"
                  class="form-control rounded-start-4 border-0 px-4 shadow-lg"
                  placeholder="Szukaj po imieniu"
                  (input)="query.set(searchPetInput.value)"
                />
                <span class="input-group-text rounded-end-4 border-0 px-3 shadow-lg bg-white">
                  <fa-icon [icon]="['fas', 'magnifying-glass']"></fa-icon>
                </span>
              </div>
            </div>
            <div>
              <button class="btn btn-lg btn-outline-primary w-100 w-md-auto shadow-lg rounded-4" (click)="addNewPet()"
                      type="button">
                Dodaj zwierzaka
                <fa-icon class="ms-2" [icon]="['fas', 'book-medical']"></fa-icon>
              </button>
            </div>
          </div>


          <!-- Pet Cards -->
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 text-break mb-4">
            @for (pet of filteredPets(); track pet.id) {
              <div class="col">
                <button type="button"
                        class="card text-start w-100 h-100 p-4 shadow-lg"
                        (click)="selectPet(pet)"
                        [ngClass]="{ 'active': selectedPet()?.id === pet.id }">
                  <div class="d-flex flex-row align-items-center mb-3">
                    <div class="image-wrapper me-2">
                      <img [src]="'assets/placeholder.svg'" alt="animal_image"/>
                    </div>
                    <div>
                      <h6 class="card-title mb-1">{{ pet.name }}</h6>
                      <h6 class="text-muted mb-0">ID: {{ pet.id }}</h6>
                    </div>
                  </div>
                  <p class="mb-0"><b>Rasa:</b> {{ pet.breed }}</p>
                  <p class="mb-0"><b>Wiek:</b> {{ pet.age }} lat</p>
                  <p class="mb-0"><b>Płeć:</b> {{ pet.sex }}</p>
                  <p class="mb-0"><b>Ostatnia wizyta:</b> {{ pet.lastVisit }}</p>
                  <p class="mb-0"><b>Klinika:</b> {{ pet.clinic }}</p>
                </button>
              </div>
            }
          </div>

          <!-- Details panel -->
          @if (selectedPet(); as pet) {
            <div class="bg-white border rounded-4 p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4>{{ pet.name }}</h4>
                  <p class="mb-0 text-muted">{{ pet.breed }}</p>
                </div>
                <button class="btn btn-outline-secondary btn-sm" (click)="clearSelection()">× Zamknij</button>
              </div>

              <h5>Historia leczenia</h5>

              <!--              @if (pet.treatmentsHistory?.length > 0) {-->
              @for (h of pet.treatmentsHistory; track h.id) {
                <div class="border rounded-3 p-3 mb-3 bg-light">
                  <div class="d-flex justify-content-between">
                    <strong>{{ h.type }}</strong>
                    <span class="text-muted">#{{ h.id }}</span>
                  </div>
                  <p class="mb-1 text-muted">{{ h.date }} – {{ h.vet }}, {{ h.clinic }}</p>

                  @if (h.diagnosis) {
                    <p><b>Diagnoza:</b> {{ h.diagnosis }}</p>
                  }

                  @if (h.description) {
                    <p><b>Opis:</b> {{ h.description }}</p>
                  }

                  @if (h.recommendation) {
                    <p><b>Zalecenia:</b> {{ h.recommendation }}</p>
                  }

                  @if (h.prescription) {
                    <p><b>Recepta:</b> {{ h.prescription }}</p>
                  }

                  @if (h.attachments?.length > 0) {
                    <div>
                      <b>Załączniki:</b>
                      <ul class="mb-0">
                        @for (file of h.attachments; track file) {
                          <li><a href="#">{{ file }}</a></li>
                        }
                      </ul>
                    </div>
                  }
                </div>
              }

            </div>
          }


        </div>
      </div>
    </div>
  `,
  styles: `
    .image-wrapper {
      width: 68px;
      aspect-ratio: 1;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .card.active {
      box-shadow: -5px 0 0 -2px blue;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetListComponent {
  private modalService = inject(NgbModal);

  query = signal('');
  selectedPet = signal<any | undefined>(undefined);

  pets = signal([
    {
      id: 'abc123',
      name: 'Burekmufasagitant',
      breed: 'Owczarek Niemiecki',
      species: 'Pies',
      sex: 'Samiec',
      age: 5,
      lastVisit: '01/07/2024',
      clinic: 'Zdrowy Pupil',
      image: 'https://i.pravatar.cc/100?u=1',
      treatmentsHistory: [
        {
          type: 'Wizyta kontrolna',
          date: '01/07/2024',
          vet: 'Dr. Jan Kowalski',
          clinic: 'Klinika "Zdrowy Pupil"',
          diagnosis: 'Alergia skórna',
          description:
            'Pacjent prezentuje zaczerwienienie i świąd w okolicy brzucha. Zalecono zmianę diety.',
          recommendation: 'Karma hipoalergiczna, unikanie kurczaka.',
          prescription: 'Apoquel 5.4mg, 1 tabletka dziennie.',
          attachments: ['Wyniki_krwi.pdf', 'zdjecie_skory.jpg'],
          id: 12345
        },
        {
          type: 'Szczepienie',
          date: '15/02/2024',
          vet: 'Dr. Anna Nowak',
          clinic: 'Klinika "Zdrowy Pupil"',
          description:
            'Podano coroczne szczepienie przeciwko wściekliźnie i chorobom zakaźnym.',
          id: 12201
        }
      ]
    },
    {
      id: 'def456',
      name: 'Bella',
      breed: 'Golden Retriever',
      species: 'Pies',
      sex: 'Samica',
      age: 2,
      lastVisit: '18/06/2024',
      clinic: 'Cztery Łapy',
      image: '',
      history: []
    },
    {
      id: 'abc123',
      name: 'Burek',
      breed: 'Owczarek Niemiecki',
      species: 'Pies',
      sex: 'Samiec',
      age: 5,
      lastVisit: '01/07/2024',
      clinic: 'Zdrowy Pupil',
      image: 'https://i.pravatar.cc/100?u=1',
      treatmentsHistory: [
        {
          type: 'Wizyta kontrolna',
          date: '01/07/2024',
          vet: 'Dr. Jan Kowalski',
          clinic: 'Klinika "Zdrowy Pupil"',
          diagnosis: 'Alergia skórna',
          description:
            'Pacjent prezentuje zaczerwienienie i świąd w okolicy brzucha. Zalecono zmianę diety.',
          recommendation: 'Karma hipoalergiczna, unikanie kurczaka.',
          prescription: 'Apoquel 5.4mg, 1 tabletka dziennie.',
          attachments: ['Wyniki_krwi.pdf', 'zdjecie_skory.jpg'],
          id: 12345
        },
        {
          type: 'Szczepienie',
          date: '15/02/2024',
          vet: 'Dr. Anna Nowak',
          clinic: 'Klinika "Zdrowy Pupil"',
          description:
            'Podano coroczne szczepienie przeciwko wściekliźnie i chorobom zakaźnym.',
          id: 12201
        }
      ]
    },
    {
      id: 'abc123',
      name: 'Burek',
      breed: 'Owczarek Niemiecki',
      species: 'Pies',
      sex: 'Samiec',
      age: 5,
      lastVisit: '01/07/2024',
      clinic: 'Zdrowy Pupil',
      image: 'https://i.pravatar.cc/100?u=1',
      treatmentsHistory: [
        {
          type: 'Wizyta kontrolna',
          date: '01/07/2024',
          vet: 'Dr. Jan Kowalski',
          clinic: 'Klinika "Zdrowy Pupil"',
          diagnosis: 'Alergia skórna',
          description:
            'Pacjent prezentuje zaczerwienienie i świąd w okolicy brzucha. Zalecono zmianę diety.',
          recommendation: 'Karma hipoalergiczna, unikanie kurczaka.',
          prescription: 'Apoquel 5.4mg, 1 tabletka dziennie.',
          attachments: ['Wyniki_krwi.pdf', 'zdjecie_skory.jpg'],
          id: 12345
        },
        {
          type: 'Szczepienie',
          date: '15/02/2024',
          vet: 'Dr. Anna Nowak',
          clinic: 'Klinika "Zdrowy Pupil"',
          description:
            'Podano coroczne szczepienie przeciwko wściekliźnie i chorobom zakaźnym.',
          id: 12201
        }
      ]
    },
  ]);

  filteredPets = computed(() => {
    const q = this.query().toLowerCase();
    return this.pets().filter(p => p.name.toLowerCase().includes(q));
  });

  addNewPet() {
    const modalRef = this.modalService.open(PetCreateComponent, {size: 'xl'});
    modalRef.componentInstance.name = 'world'
  }

  selectPet(pet: any) {
    this.selectedPet.set(pet);
  }

  clearSelection() {
    this.selectedPet.set(null);
  }
}
