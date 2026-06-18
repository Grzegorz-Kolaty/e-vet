import {ChangeDetectionStrategy, Component, inject, input, model, output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {PetCard} from "../feature/pet-card/pet-card";
import {AuthService} from "../../shared/data-access/auth.service";
import {Router} from "@angular/router";
import {effect} from "@angular/core";
import {IPet} from "../../shared/interfaces/animals.interface";


@Component({
  selector: 'app-pet-list',
  imports: [CommonModule, FormsModule, PetCard],
  template: `
    <div class="d-flex flex-column gap-3">
      @if (isLoading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="text-muted mt-2">Pobieranie listy zwierzaków...</p>
        </div>
      }

      <div class="row g-4">
        @for (pet of pets(); track pet.id) {
          <div class="col-xl-6">
            <app-pet-card
              [pet]="pet"
              [isSelected]="selectedPetId() === pet.id"
              (petSelected)="selectedPetId.set($event.id)"/>
          </div>
        } @empty {
          @if (!isLoading()) {
            <div class="text-center py-4 text-muted">
              Nie znaleziono żadnych zwierzaków.
            </div>
          }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetListComponent {
  protected authService = inject(AuthService);

  pets = input<IPet[]>([]);
  isLoading = input<boolean>(false);
  selectedPetId = model<string | null>(null);
}
