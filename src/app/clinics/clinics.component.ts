import {ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {Role} from "../shared/interfaces/user.interface";
import {Router} from "@angular/router";
import {AuthService} from "../shared/data-access/auth.service";
import {LocationResult, MapComponent} from "./features/map/map.component";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import {DragDropFile} from "../shared/directives/drag-drop-file";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

interface UploadedImage {
  file: File;
  url: string;
}

@Component({
  selector: 'app-clinics',
  imports: [
    MapComponent,
    FormsModule,
    FaIconComponent,
    NgxMaskDirective,
    DragDropFile,
    ReactiveFormsModule,
  ],
  providers: [provideNgxMask()],
  template: `
    <main class="container-lg py-4">
      <h2 class="text-center mb-3">Utwórz nową klinikę</h2>
      <p class="text-center text-muted mb-5">Wypełnij poniższe pola, aby zarejestrować swoją klinikę
        weterynaryjną.</p>

      <form class="row justify-content-center" [formGroup]="clinicForm">
        <div class="col-md-4">

          <div class="mb-3">
            <label class="form-label fw-bold" for="clinic-name">Nazwa kliniki</label>
            <textarea rows="2"
                      class="form-control"
                      placeholder="np. Zdrowa Łapka"
                      name="clinicName"
                      required
                      id="clinicName"
                      formControlName="clinicName">
            </textarea>

<!--            @if (clinicForm.?.invalid) {-->
<!--              <div class="invalid-feedback">Nazwa kliniki jest wymagana.</div>-->
<!--            }-->
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Numer telefonu</label>
            <input type="tel"
                   class="form-control"
                   placeholder="np. 532 175 660"
                   mask="000 000 000"
                   prefix="+48 "
                   [dropSpecialCharacters]="false"
                   name="phoneNumber"
                   required
                   minlength="13"
                   formControlName="phoneNumber">
<!--            @if (phoneNumber?.dirty) {-->
<!--              <div class="invalid-feedback">Wymagany pełny numer (+48 xxx xxx xxx).</div>-->
<!--            }-->
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Godziny otwarcia &nbsp;</label>
            <div class="d-flex flex-column align-items-center gap-2">
              <label class="form-label mb-0">Pon-Pt:</label>
              <input type="time" class="form-control" name="openTime" required>
              <input type="time" class="form-control" name="closeTime" required>
            </div>
          </div>
        </div>

        <div class="col-8 map-column">
          <app-map (streetAddressSelected)="handleSelection($event)"></app-map>
        </div>


        <div class="col-12 mt-4">
          <label class="form-label fw-bold">Opis</label>
          <textarea class="form-control"
                    rows="4"
                    placeholder="Opowiedz nam o swojej klinice..."
                    name="description"
                    required
                    formControlName="description">
<!--                    [class.is-valid]="description.valid && description.dirty"-->
<!--                    [class.is-invalid]="description.invalid && description.dirty"-->
          </textarea>
        </div>

        <input class="invisible"
               type="file"
               #fileInput
               multiple
               accept="image/png, image/jpeg, image/gif"
               (change)="onFileInputChange($event)">

        <div class="col-12 my-4 p-4 text-center file-drop-area"
             #dragDropFile="appDragDropFile"
             [class.drag-over]="dragDropFile.isDragging()"
             appDragDropFile
             (fileDropped)="onFilesDropped($event)"
             (click)="openFileDialog()">

          <div class="d-flex flex-wrap justify-content-center gap-3">
            @for (image of uploadedFiles(); track image.url) {
              <div class="thumbnail-container">
                <img [src]="image.url" alt="Miniatura zdjęcia" class="img-thumbnail">
                <button type="button"
                        class="btn-remove"
                        (click)="$event.stopPropagation(); removeFile(image.url)">
                  &times;
                </button>
              </div>
            }

            @if (!uploadedFiles().length) {
              <fa-icon [icon]="['fas', 'image']" size="2x"></fa-icon>
              <p class="mt-2">
                <span class="text-success">Prześlij plik</span> lub przeciągnij i upuść
              </p>
            }
          </div>

          <small class="text-muted mt-3">PNG, JPG, GIF do 10MB</small>

        </div>

        <div class="col-12 d-grid">
          <button type="submit" class="btn btn-lg btn-success">Utwórz klinikę</button>
        </div>
      </form>
    </main>
  `,
  styles: `
    .map-column {
      //min-height: 50vh;
      transition: transform 0.3s ease-in-out;
    }
    .map-column:hover {
      transform: scale(1.05);
    }
    /* Styl dla walidacji mapy */
    .is-invalid-border {
      border: 2px solid var(--bs-form-invalid-color);
      padding: 0;
      border-radius: 0.375rem; /* Zaokrąglenie Bootstrapa */
    }
    .file-drop-area {
      border: 2px dashed #ccc;
      transition: border-color 0.2s ease, background-color 0.2s ease;
      cursor: pointer;
    }
    .file-drop-area.drag-over {
      border-color: var(--bs-success);
      background-color: #e9f7ed;
    }
    .thumbnail-container {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .img-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .btn-remove {
      position: absolute;
      top: -10px;
      right: -10px;
      background: red;
      color: white;
      border: none;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      line-height: 1;
      text-align: center;
      padding: 0;
      cursor: pointer;
      z-index: 10;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ClinicsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
   clinicForm = this.fb.group({
  clinicName : ['', Validators.required, Validators.minLength(13)],
    phoneNumber: ['', Validators.required, Validators.minLength(13)],
    description: ['', Validators.required, Validators.minLength(10)],
  });

  // get clinicName() {
  //   return this.clinicForm.get('clinicName')
  // }

  // get phoneNumber() {
  //   return this.clinicForm.get('phoneNumber')
  // }
  // ViewChild dla ukrytego inputu
  @ViewChild('fileInput') fileInputElement!: ElementRef<HTMLInputElement>;

  user = this.authService.user
  selectedAddress = signal<LocationResult | null>(null);
  uploadedFiles = signal<UploadedImage[]>([]);

  // Obsługa wyboru adresu na mapie
  handleSelection(address: LocationResult | null) {
    this.selectedAddress.set(address);
  }

  // Symuluje kliknięcie na ukryty input
  openFileDialog() {
    this.fileInputElement.nativeElement.click();
  }

  // Logika Drag and Drop (pliki upuszczone)
  onFilesDropped(files: File[]) {
    this.processFiles(files);
  }

  // Logika wyboru pliku (pliki wybrane przez okno dialogowe)
  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(Array.from(input.files));
      // Opcjonalnie: reset inputu, by można było dodać ten sam plik ponownie
      input.value = '';
    }
  }

  private processFiles(files: File[]) {
    files.forEach(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
      if (!isValidType) {
        console.warn(`Plik ${file.name} nie jest obsługiwanym formatem obrazu.`);
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        this.uploadedFiles.update(currentFiles => [
          ...currentFiles,
          {
            file: file,
            url: reader.result as string
          }
        ]);
      };

      reader.onerror = (error) => {
        console.error('Błąd odczytu pliku:', error);
      };

      reader.readAsDataURL(file);
    });
  }

  removeFile(urlToRemove: string) {
    this.uploadedFiles.update(currentFiles =>
      currentFiles.filter(image => image.url !== urlToRemove)
    );
  }

  constructor() {
    effect(() => {
      const user = this.user()
      if (!user) {
        this.router.navigate(['auth'])
      }
      if (user && user.role === Role.Vet && !user.clinicId) {
        console.log('Weterynarz bez kliniki: Pokaż formularz tworzenia/dołączania.');
      }
    })
  }

  submitClinic() {
    this.clinicForm.markAllAsTouched();

    if (this.clinicForm.invalid || !this.selectedAddress()) return;

    console.log('✅ Wysłano formularz:', this.clinicForm.value);
  }

}
