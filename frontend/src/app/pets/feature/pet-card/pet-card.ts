import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {IPet} from "../../../shared/interfaces/animals.interface";

@Component({
  selector: 'app-pet-card',
  imports: [],
  template: `
    <button type="button"
            class="btn btn-light border-0 d-flex flex-column text-start p-0 w-100 h-100 rounded-4 overflow-hidden shadow-lg custom-pet-card"
            (click)="petSelected.emit(pet())"
            [class.active]="isSelected()">

      <div class="position-relative">
        <img [src]="pet().photoUrl || 'assets/placeholder.svg'"
             [alt]="pet().name"
             height="96"
             class="w-100 object-fit-cover"/>

        @if (isSelected()) {
          <span
            class="badge position-absolute top-0 start-0 m-2 text-uppercase fw-bold text-success bg-success-subtle rounded-pill px-2 py-1">
            Aktywny
          </span>
        }
      </div>

      <div class="p-3 d-flex flex-column gap-2">
        <div class="flex-grow-1 d-inline-flex justify-content-start align-items-start">
          <h5 class="fw-bold text-dark text-capitalize mb-0 me-auto">
            {{ pet().name }}
          </h5>

          @if (pet().sex === 'Samica') {
            <span class="text-info-emphasis">♀</span>
          } @else if (pet().sex === 'Samiec') {
            <span class="text-primary">♂</span>
          } @else {
            <span class="text-primary">♂</span>
          }
        </div>

        <div class="flex-grow-1">
          <p class="text-secondary small m-0 text-capitalize">
            {{ pet().breed }}
          </p>
        </div>

      </div>

    </button>
  `,
  styles: `
    .custom-pet-card {
      transition: box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
    }

    .custom-pet-card.active {
      background-color: #ffffff !important;
      box-shadow: 0 0 0 0 #ffffff, 0 0 0 2px #4CAF50, 0 16px 48px 0 rgba(0, 0, 0, 0.176) !important;
    }

    .custom-pet-card:hover:not(.active) {
      box-shadow: 0 0 0 0 #ffffff, 0 0 0 2px #cbd5e1, 0 16px 48px 0 rgba(0, 0, 0, 0.176) !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetCard {
  pet = input.required<IPet>();
  isSelected = input<boolean>(false);

  petSelected = output<IPet>();
}
