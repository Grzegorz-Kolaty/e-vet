import {ChangeDetectionStrategy, Component, effect, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {Role} from "../shared/interfaces/user.interface";
import {Router} from "@angular/router";
import {AuthService} from "../shared/data-access/auth.service";
import {MapComponent} from "./features/map/map.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {LocationResult, Voivodeship} from "../shared/data-access/geo.service";
import {SelectVoivodenship} from "./features/select-voivodenship/select-voivodenship";
import {SelectLocation} from "./features/select-location/select-location";


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
    ReactiveFormsModule,
    SelectVoivodenship,
    SelectLocation,
  ],
  providers: [provideNgxMask()],
  template: `
    <main class="map-container h-100 position-relative">

      <div class="map-wrapper w-100 h-100 position-absolute top-0 start-0 z-1">
        <app-map [clinicLocationSelected]="clinicAddress()"
                 [voivodeshipSelected]="clinicVoivodenshipLocation()"></app-map>
      </div>

      <div class="floating-panel col-11 col-sm-8 col-md-5 col-lg-4 col-xl-3
              position-absolute top-50 start-0 translate-middle-y m-3
              bg-white rounded-3 shadow-lg z-2
              d-flex flex-column">

        <div class="p-4 pb-0">
          <h3 class="mb-1 fw-bold">Nowa Klinika</h3>
          <p class="text-muted small mb-3">Wypełnij dane, aby zarejestrować placówkę.</p>
        </div>

        <form [formGroup]="clinicForm" (ngSubmit)="submitClinic()" class="p-4 pt-2 overflow-y-auto flex-grow-1">

          <div class="mb-2">
            <label class="form-label fw-bold">Wskaż województwo</label>
            <app-select-voivodenship (voivodenshipLocation)="clinicVoivodenshipLocation.set($event)"
                                     (voivodenshipSelected)="clinicVoivodenship.set($event)"/>
          </div>

          @if (clinicVoivodenship() && clinicVoivodenshipLocation()) {
            <div class="mb-2">
              <label class="form-label fw-bold">Wyszukaj adres</label>
              <app-select-location (addressSelected)="clinicAddress.set($event)"
                                   [voivodeship]="clinicVoivodenship()"
              />
            </div>
          }

          @if (clinicAddress(); as loc) {
            <div class="mb-2">
              <label class="form-label fw-bold">Ulica</label>
              <input class="form-control form-control-sm bg-light"
                     [value]="loc.address.road || ''"
                     [disabled]="!!loc.address.road">
            </div>

            <div class="row mb-2">
              <div class="col">
              <label class="form-label fw-bold">Numer budynku</label>
              <input type="text"
                     class="form-control form-control-sm"
                     [class.is-invalid]="!loc.address.house_number"
                     [disabled]="!!loc.address.house_number"
                     [value]="loc.address.house_number || ''"
                     #houseNum
                     (input)="updateHouseNumber(houseNum.value)"
                     placeholder="Wpisz nr">

              @if (!loc.address.house_number) {
                <div class="invalid-feedback d-block">
                  Nie znaleziono numeru. Wpisz go ręcznie.
                </div>
              }
            </div>
              <div class="col">
                <label class="form-label fw-bold">Kod pocztowy</label>
                <input type="text"
                       class="form-control form-control-sm"
                       [class.is-invalid]="!loc.address.house_number"
                       [disabled]="!!loc.address.house_number"
                       [value]="loc.address.house_number || ''"
                       #houseNum
                       (input)="updateHouseNumber(houseNum.value)"
                       placeholder="Wpisz nr">

                @if (!loc.address.house_number) {
                  <div class="invalid-feedback d-block">
                    Nie znaleziono numeru. Wpisz go ręcznie.
                  </div>
                }
              </div>
            </div>
          }

          <div class="mb-2">
            <label class="form-label fw-bold">Nazwa kliniki</label>
            <textarea rows="1" class="form-control form-control-sm" formControlName="clinicName"
                      placeholder="np. Zdrowa Łapka"></textarea>
          </div>

          <div class="mb-2">
            <label class="form-label fw-bold">Numer telefonu</label>
            <input type="tel" class="form-control form-control-sm" mask="000 000 000" prefix="+48 "
                   formControlName="phoneNumber">
          </div>

          <div class="mb-2">
            <label class="form-label fw-bold">Godziny (Pon-Pt)</label>
            <div class="d-flex gap-2">
              <input type="time" class="form-control form-control-sm" formControlName="openTime">
              <input type="time" class="form-control form-control-sm" formControlName="closeTime">
            </div>
          </div>

          <div class="mb-2">
            <label class="form-label fw-bold">Opis</label>
            <textarea class="form-control form-control-sm" rows="1" formControlName="description"></textarea>
          </div>

          <div class="">
            <label class="form-label fw-bold">Zdjęcia</label>
            <div class="file-drop-area p-3 text-center rounded" (click)="openFileDialog()">
              <fa-icon [icon]="['fas', 'image']" class="text-muted me-2"></fa-icon>
              <span>Dodaj zdjęcia ({{ uploadedFiles().length }})</span>
            </div>
          </div>

          <div class="d-grid mt-4  bg-white pt-2 z-1">
            <button type="submit" class="btn btn-success w-100">Utwórz klinikę</button>
          </div>
        </form>
      </div>

    </main>
  `,
  styles: `
    /* Kontener główny */
    .map-container {
      height: calc(100vh - 98px);
    }

    /* Pływający panel (formularz) */
    .floating-panel {
      /* Maksymalna wysokość, żeby panel nie wyszedł poza ekran na laptopach */
      max-height: calc(100vh - 98px); /* 2rem na marginesy m-md-4 */

      /* Płynne pojawianie się na mobile */
      transition: all 0.3s ease-out;
    }

    /* Mobile-first: na bardzo małych ekranach panel na dole */
    @media (max-width: 575.98px) {
      .floating-panel {
        margin: 0 !important;
        top: auto !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 1rem 1rem 0 0 !important; /* Zaokrąglone tylko górne rogi */
        max-height: 70vh; /* Zajmuje max 70% wysokości ekranu */
      }
    }

    /* Estetyczny scrollbar dla formularza wewnątrz panelu */
    .overflow-y-auto::-webkit-scrollbar {
      width: 5px;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb {
      background: #e0e0e0;
      border-radius: 10px;
    }

    .overflow-y-auto::-webkit-scrollbar-track {
      background: transparent;
    }

    /* Twój stary styl dla drop-area, lekko pomniejszony */
    .file-drop-area {
      border: 1px dashed #ccc;
      cursor: pointer;
      background-color: #f8f9fa;
    }

    .file-drop-area:hover {
      border-color: var(--bs-success);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ClinicsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  clinicForm = this.fb.group({
    voivodeship: ['', Validators.required],
    address: ['', Validators.required],
    openTime: ['', Validators.required],
    closeTime: ['', Validators.required],
    clinicName: ['', Validators.required, Validators.minLength(13)],
    phoneNumber: ['', Validators.required, Validators.minLength(13)],
    description: ['', Validators.required, Validators.minLength(10)],
  });

  @ViewChild('fileInput') fileInputElement!: ElementRef<HTMLInputElement>;

  user = this.authService.user

  clinicVoivodenship = signal<Voivodeship | null>(null);
  clinicVoivodenshipLocation = signal<LocationResult | null>(null)
  clinicAddress = signal<LocationResult | null>(null);
  uploadedFiles = signal<UploadedImage[]>([]);

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

    if (this.clinicForm.invalid || !this.clinicAddress()) return;

    console.log('✅ Wysłano formularz:', this.clinicForm.value);
  }

  protected updateHouseNumber(value: string) {

  }
}
