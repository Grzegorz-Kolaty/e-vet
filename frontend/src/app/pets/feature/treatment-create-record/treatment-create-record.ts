import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {IPet} from "../../../shared/interfaces/animals.interface";

@Component({
  selector: 'app-treatment-create-record',
  imports: [],
  template: `
    @if (petDetails()) {
      @if (hasUser()) {
        <button #treatmentBtn
                class="btn btn-sm btn-outline-primary px-3 rounded-3"
                (click)="treatmentBtn.blur(); addTreatment.emit()">
          ➕ Dodaj wpis medyczny
        </button>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreatmentCreateRecord {
  petDetails = input<IPet | null>(null);
  hasUser = input<boolean>(false);

  addTreatment = output<void>();
}
