import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbCarousel,
    NgbSlide
  ],
  template: `
    <section class="container mt-4">

      <!-- Karuzela -->
      @if (images.length > 0) {
        <ngb-carousel class="mb-5">
          @for (img of images; track $index) {
            <ng-template ngbSlide>
              <div class="picsum-img-wrapper">
                <img [src]="img" class="d-block w-100" alt="Zdjęcie {{ $index + 1 }}" />
              </div>
              <div class="carousel-caption d-none d-md-block">
                <h5>Zdjęcie {{ $index + 1 }}</h5>
                <p>Opis zdjęcia numer {{ $index + 1 }}</p>
              </div>
            </ng-template>
          }
        </ngb-carousel>
      }

      <!-- Formularz dodawania zwierzaka -->
      <div class="card mb-4">
        <div class="card-body">
          <form (ngSubmit)="addPet()" class="row g-3">
            <div class="col-md-6">
              <input [(ngModel)]="newPetName" name="name" required class="form-control" placeholder="Imię zwierzaka" />
            </div>
            <div class="col-md-6">
              <button class="btn btn-success w-100" type="submit" [disabled]="!newPetName.trim()">Dodaj zwierzaka</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista petów -->
      <ul class="list-group">
        @for (pet of pets(); track pet.id) {
          <li class="list-group-item d-flex justify-content-between align-items-center">
            {{ pet.name }}
            <button class="btn btn-sm btn-outline-danger" (click)="removePet(pet.id)">Usuń</button>
          </li>
        }

        @if (pets().length === 0) {
          <li class="list-group-item text-muted text-center">Brak dodanych zwierząt</li>
        }
      </ul>
    </section>
  `,
  styleUrl: './pet-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetListComponent {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  pets = signal<{ id: string; name: string }[]>([
    { id: 'abc123', name: 'Burek' },
    { id: 'xyz456', name: 'Mruczek' },
  ]);

  newPetName = '';

  addPet() {
    const name = this.newPetName.trim();
    if (!name) return;

    const id = crypto.randomUUID();
    this.pets.update((list) => [...list, { id, name }]);
    this.newPetName = '';
  }

  removePet(id: string) {
    this.pets.update((list) => list.filter(p => p.id !== id));
  }
}
