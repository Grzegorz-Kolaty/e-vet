import {ChangeDetectionStrategy, Component, output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";


@Component({
  selector: 'app-pet-search',
  imports: [
    FaIconComponent
  ],
  template: `
    <div class="input-group rounded-4 shadow-lg">

      <span class="input-group-text border-0 text-muted"
            id="inputField">
        <fa-icon [icon]="['fas', 'magnifying-glass']" size="lg"></fa-icon>
      </span>

      <input
        #searchPetInput
        type="text"
        class="form-control form-control-lg border-0"
        placeholder="Szukaj po imieniu"
        aria-describedby="inputField"
        (input)="searchChanged.emit(searchPetInput.value)"
      />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetSearch {
  searchChanged = output<string>();
}
