import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {IAttachment} from "../../../shared/interfaces/animals.interface";


@Component({
  selector: 'app-treatment-documents',
  imports: [],
  template: `
    <div class="d-flex flex-column gap-3 align-items-start">
      @for (file of attachments(); track file.url || $index) {
        <div class="btn-group btn-group-sm shadow-lg w-100 d-flex" role="group">

          <a [href]="file.url"
             target="_blank"
             type="button"
             class="btn btn-outline-light flex-fill d-flex align-items-center gap-1 w-100 overflow-hidden">
            <span>📄</span>
            <span class="text-black text-truncate text-start flex-grow-1">{{ file.name }}</span>
          </a>

          <button type="button"
                  class="btn btn-outline-danger z-2 flex-shrink-0"
                  style="min-width: 42px;"
                  title="Usuń dokument"
                  (click)="onDelete(file)"
                  [disabled]="isDisabledForUser()">
            🗑️
          </button>
        </div>
      }

      @if (attachments() && attachments().length < 3) {
        <label class="btn btn-sm d-inline-flex align-items-center gap-1 px-2"
               [class.disabled]="isDisabledForUser()"
               [class.btn-success]="isActive() && !isDisabledForUser()"
               [class.btn-outline-success]="!isActive() && !isDisabledForUser()"
               [class.btn-outline-secondary]="isDisabledForUser()"
               [style.pointer-events]="isDisabledForUser() ? 'none' : 'auto'">
          ➕ Dodaj plik

          <input type="file"
                 class="d-none"
                 (change)="onFileSelected($event)"
                 [disabled]="isDisabledForUser()"
                 accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"/>
        </label>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreatmentAttachments {
  attachments = input<IAttachment[]>([]);
  isDisabledForUser = input<boolean>(true);
  isActive = input<boolean>(false);

  deleteDocument = output<IAttachment>();
  addDocument = output<File>();

  onDelete(file: IAttachment) {
    if (confirm(`Czy na pewno chcesz usunąć dokument "${file.name}"?`)) {
      this.deleteDocument.emit(file);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.addDocument.emit(file);
      input.value = '';
    }
  }
}
