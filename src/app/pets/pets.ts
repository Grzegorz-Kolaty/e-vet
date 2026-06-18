import {ChangeDetectionStrategy, Component, computed, inject, signal, resource, effect} from '@angular/core';
import PetListComponent from "./pet-list/pet-list.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TreatmentCreateComponent} from "./feature/treatment-create/treatment-create";
import {PetsService} from "../shared/data-access/pets.service";
import {AuthService} from "../shared/data-access/auth.service";
import {IAttachment, ITreatment} from "../shared/interfaces/animals.interface";
import {TreatmentCreateRecord} from "./feature/treatment-create-record/treatment-create-record";
import {PetUpcomingAppointments} from "./feature/pet-upcoming-appointments/pet-upcoming-appointments";
import {PetTreatmentHistory} from "./feature/pet-treatment-history/pet-treatment-history";
import {PetCreateComponent} from "./feature/pet-create/pet-create.component";
import PetSearch from "./feature/pet-search/pet-search";
import PetNav from "./feature/pet-nav/pet-nav";
import Datepicker from "../shared/ui/datepicker/datepicker";
import {Router} from "@angular/router";


@Component({
  selector: 'app-pets',
  imports: [PetListComponent, FaIconComponent, TreatmentCreateRecord, PetUpcomingAppointments, PetTreatmentHistory, PetSearch, PetNav, Datepicker],
  template: `
    @let user = authService.user();
    <section class="container-fluid h-100 bg-light-blue">
      <div class="container-xxl py-5 h-100">

        <div class="row">

          <div class="col-4 d-flex flex-column gap-3">
            <div class="mb-4">
              <h1 class="fw-semibold">Moje Zwierzaki</h1>
              <p class="text-muted mb-0">Zarządzaj profilami swoich podopiecznych</p>
            </div>

            <app-pet-search (searchChanged)="query.set($event)"/>

            <button #modalButton
                    class="btn btn-lg btn-primary w-100 shadow-lg rounded-4 mb-4"
                    (click)="addNewPet(modalButton)">
              Dodaj zwierzaka
              <fa-icon class="ms-2" [icon]="['fas', 'book-medical']"></fa-icon>
            </button>

            <app-pet-list
              [pets]="filteredPets()"
              [isLoading]="petsResource.isLoading()"
              [(selectedPetId)]="activePetId"
            />
          </div>

          @if (activePetId(); as id) {
            <div class="col">
              <div class="d-inline-flex align-items-start justify-content-between mb-3 w-100">

                <h2 class="mb-0 me-auto">
                  Szczegóły: {{ selectedPetDetails()?.name || 'Brak wybranego zwierzaka' }}
                </h2>

                <button #modalButton
                        class="btn btn-lg text-primary-emphasis"
                        (click)="editPet(modalButton)">
                  <fa-icon [icon]="['fas', 'pen']"></fa-icon>
                  Edytuj profil
                </button>
              </div>

              <div class="d-flex flex-column p-4 shadow-lg rounded-4 gap-3">
                <h4 class="fw-semibold mb-3">
                  <fa-icon [icon]="['fas', 'calendar-days']"
                           class="text-primary d-inline-flex align-items-center justify-content-center rounded-3"
                           style="width: 40px; height: 40px; background-color: #e6f0ff;"/>
                  Karta Pacjenta
                </h4>

                <!-- Tab change ensures it wont generate underneath datepicker and history download-->
                <app-pet-nav (tabChanged)="activeTabId.set($event)">
                  <ng-container appointments>
                    <app-pet-upcoming-appointments
                      [upcomingAppointments]="petAppointmentsResource.value() || []"
                    />
                  </ng-container>

                  <ng-container history>
                    @if (activeTabId() === 2) {

                      <div class="d-inline-flex align-items-center justify-content-between h-100 w-100 mb-3">
                        <h6 class="fw-semibold text-muted font-monospace text-uppercase mb-0">
                          Rejestr zabiegów i leczenia
                        </h6>

                        <app-treatment-create-record
                          [petDetails]="selectedPetDetails()"
                          [hasUser]="!!user"
                          (addTreatment)="openAddTreatmentModal({ petId: id, role: user?.role || '' })"
                        />
                      </div>

                      <div class="d-inline-flex align-items-center justify-content-between h-100 w-100 mb-3">
                        <app-datepicker
                          [isSelectMode]="true"
                          (onRangeDateChange)="dateRange.set($event ?? null)"
                        />
                      </div>

                      @if (petHistoryResource.isLoading()) {
                        <div class="text-center py-3">Ładowanie historii...</div>
                      } @else {
                        <app-pet-treatment-history
                          [historyList]="petHistoryResource.value() || []"
                          [activeAppointmentId]="activeAppointmentId()"
                          (editTreatment)="openEditTreatmentModal($event)"
                          (addDocument)="handleAddDocument(id, $event.treatmentId, $event.file)"
                          (deleteDocument)="handleDeleteDocument($event.treatmentId, $event.attachment)"
                        />
                      }

                    }
                  </ng-container>

                </app-pet-nav>

              </div>
            </div>
          }

        </div>
      </div>
    </section>
  `,
  styles: `.bg-light-blue {
    background-color: #f8f9ff;
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PetsComponent {
  private petsService = inject(PetsService);
  private modalService = inject(NgbModal);
  protected authService = inject(AuthService);
  private router = inject(Router);

  activePetId = signal<string | null>(null);

  activeTabId = signal<number>(1);

  activeAppointmentId = signal<string | null>(null);
  query = signal('');

  dateRange = signal<{ start: Date; end: Date } | null>(null);


  constructor() {
    effect(() => {
      if (!this.authService.initialized()) {
        return;
      }

      if (!this.authService.user()) {
        this.router.navigate(['auth', 'login']);
      }
    });

    effect(() => {
      this.activePetId();
      this.dateRange.set(null);
    });
  }

  filteredPets = computed(() => {
    const q = this.query().toLowerCase().trim();
    const list = this.petsResource.value() || [];
    if (!q) return list;
    return list.filter(p => p.name.toLowerCase().includes(q));
  });

  selectedPetDetails = computed(() => {
    const id = this.activePetId();
    const pets = this.petsResource.value() || [];
    if (!id) return null;
    return pets.find(p => p.id === id) || null;
  });

  petsResource = resource({
    loader: async () => await this.petsService.getPets()
  });

  petHistoryResource = resource({
    params: () => {
      const id = this.activePetId();
      const range = this.dateRange();

      if (!id || !range) return null;
      console.log('pets component have id and range date pick:', id, range)

      return { id, range };
    },
    loader: async ({ params }) => {
      if (!params) return [];
      return await this.petsService.getPetTreatmentsHistory(params.id, params.range);
    }
  });

  petAppointmentsResource = resource({
    params: () => this.activePetId(),
    loader: async ({params: id}) => {
      if (!id) return [];
      return await this.petsService.getPetUpcomingAppointments(id);
    }
  });

  addNewPet(el: HTMLButtonElement) {
    el.blur();
    const modalRef = this.modalService.open(PetCreateComponent, {size: 'xl'});

    modalRef.result.then((wasCreated) => {
      if (wasCreated) {
        this.petsResource.reload();
      }
    }).catch(() => {
    });
  }

  openAddTreatmentModal(event: { petId: string, role: string }) {
    const modalRef = this.modalService.open(TreatmentCreateComponent, {size: 'lg'});
    modalRef.componentInstance.petId = event.petId;
    modalRef.componentInstance.role = event.role;

    const appointmentId = this.activeAppointmentId();
    if (appointmentId) {
      modalRef.componentInstance.appointmentId = appointmentId;
    }

    modalRef.result.then((wasSaved) => {
      if (wasSaved) {
        this.petHistoryResource.reload();
        this.petAppointmentsResource.reload();
      }
    }).catch(() => {
    });
  }

  openEditTreatmentModal(treatment: ITreatment) {
    const modalRef = this.modalService.open(TreatmentCreateComponent, {size: 'lg'});
    modalRef.componentInstance.petId = this.activePetId();
    modalRef.componentInstance.treatmentData = {...treatment};
    modalRef.result.then((wasSaved) => {
      if (wasSaved) this.petHistoryResource.reload();
    }).catch(() => {
    });
  }

  async handleAddDocument(petId: string, treatmentId: string, file: File) {
    try {
      await this.petsService.addTreatmentDocument(petId, treatmentId, file);
      this.petHistoryResource.reload();
    } catch (error) {
      alert('Nie udało się zapisać pliku.');
    }
  }

  async handleDeleteDocument(treatmentId: string, attachment: IAttachment) {
    try {
      await this.petsService.deleteTreatmentDocument(treatmentId, attachment);
      this.petHistoryResource.reload();
    } catch (error) {
      alert('Nie udało się usunąć pliku.');
    }
  }

  protected editPet(el: HTMLButtonElement) {
    el.blur();
    const currentPet = this.selectedPetDetails();
    if (!currentPet) return;

    const modalRef = this.modalService.open(PetCreateComponent, {size: 'xl'});
    modalRef.componentInstance.petData = {...currentPet};

    modalRef.result.then((wasUpdated) => {
      if (wasUpdated) {
        this.petsResource.reload();
      }
    }).catch(() => {
    });
  }
}

