import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-pet-list',
  imports: [
    CommonModule,
    FormsModule,
    FaIconComponent,
  ],
  template: `
    <div class="container-fluid p-5">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3">
          <div class="bg-white border rounded-3 p-3">
            <h5>Filtruj</h5>

            <div class="mb-2">
              <label>Gatunek</label>
              <select class="form-select">
                <option selected>Wszystkie</option>
                <option>Pies</option>
                <option>Kot</option>
              </select>
            </div>

            <div class="mb-2">
              <label>Rasa</label>
              <input type="text" class="form-control" placeholder="np. Owczarek Niemiecki"/>
            </div>

            <div class="mb-2">
              <label>Klinika</label>
              <input type="text" class="form-control" placeholder="np. Zdrowy Pupil"/>
            </div>

            <div class="mb-2">
              <label>Weterynarz</label>
              <input type="text" class="form-control" placeholder="np. Dr. Jan Kowalski"/>
            </div>

            <div class="mb-2">
              <label>Data ostatniej wizyty</label>
              <input type="date" class="form-control"/>
            </div>

            <div class="mb-2">
              <label>Wiek</label>
              <input type="number" class="form-control" placeholder="np. 5"/>
            </div>

            <div class="mb-2">
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

            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary w-50">Wyczyść filtry</button>
              <button class="btn btn-primary w-50">Zastosuj</button>
            </div>
          </div>
        </div>

        <!-- Main content -->
        <div class="col-md-9">
          <!-- Search input -->
          <div class="input-group mb-3">
            <input
              #searchPetInput
              type="text"
              class="form-control"
              placeholder="Szukaj po imieniu"
              (input)="query.set(searchPetInput.value)"
            />
            <span class="input-group-text">
          <fa-icon [icon]="['fas', 'magnifying-glass']"></fa-icon>
        </span>
          </div>

          <!-- Pet Cards -->
          <div class="row g-3 mb-4">
            @for (pet of filteredPets(); track pet.id) {
              <div class="col-sm-6 col-md-4">
                <div class="card h-100 cursor-pointer" (click)="selectPet(pet)">
                  <div class="card-body">
                    <div class="d-flex gap-3 mb-3">
                      <img width="68" height="68" src="../../../../assets/placeholder.svg"
                           class="rounded-5 img-fluid" alt="animal_image">

                      <div>
                        <h5 class="card-title mb-1">{{ pet.name }}</h5>
                        <h6 class="text-muted mb-0">ID: {{ pet.id }}</h6>
                      </div>
                    </div>

                    <p class="mb-0"><b>Rasa:</b> {{ pet.breed }}</p>
                    <p class="mb-0"><b>Wiek:</b> {{ pet.age }} lat</p>
                    <p class="mb-0"><b>Płeć:</b> {{ pet.sex }}</p>
                    <p class="mb-0"><b>Ostatnia wizyta:</b> {{ pet.lastVisit }}</p>
                    <p class="mb-0"><b>Klinika:</b> {{ pet.clinic }}</p>
                  </div>
                </div>
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
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetListComponent {
  query = signal('');
  selectedPet = signal<any | undefined>(undefined);

  pets = signal([
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
    }
  ]);

  filteredPets = computed(() => {
    const q = this.query().toLowerCase();
    return this.pets().filter(p => p.name.toLowerCase().includes(q));
  });

  selectPet(pet: any) {
    this.selectedPet.set(pet);
  }

  clearSelection() {
    this.selectedPet.set(null);
  }
}
