import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

import {FaIconComponent} from '@fortawesome/angular-fontawesome';

import {MapComponent} from '../features/map/map.component';
import {GetAppointmentsForVet} from '../features/get-appointments-for-vet/get-appointments-for-vet';

import ClinicService from '../../shared/data-access/clinic.service';
import {AuthService} from '../../shared/data-access/auth.service';
import {AppointmentsService} from '../../shared/data-access/appointments.service';
import {PetsService} from '../../shared/data-access/pets.service';

import {UploadableImagesComponent} from '../../shared/ui/uploadable-images/uploadable-images.component';

import {Clinic} from '../../shared/interfaces/clinics.interface';
import {Appointment} from '../../shared/interfaces/appointments.interface';
import {Role} from '../../shared/interfaces/user.interface';

export interface ClinicPayload {
  file: File;
  clinic: Clinic;
}

export interface BookingPayload {
  appointment: Appointment;
  userId: string;
  userName: string;
  petId: string;
  petName: string;
}

@Component({
  selector: 'app-vet-clinic',
  imports: [
    CommonModule,
    FormsModule,
    MapComponent,
    FaIconComponent,
    UploadableImagesComponent,
    GetAppointmentsForVet,
  ],
  template: `
    <div class="container h-100 pt-4">
      @let clinicData = clinic();
      @let idOfClinic = clinicData?.id;

      @if (clinicData && idOfClinic) {
        <div class="row mb-3">
          <div class="col">
            <h2 class="fw-bold">
              Przychodnia Weterynaryjna {{ clinicData.clinicName }}
            </h2>
          </div>
        </div>

        <div class="row gy-4 justify-content-between">
          <div class="col-lg-9 d-flex flex-column gap-3">
            <app-uploadable-images
              [photoUrl]="clinicData.coverImage.url"
              (photoFile)="onPhotoUpload($event, clinicData)"
              [widerSize]="true"
            />

            @if (currentUserRole() === Role.User) {
              <div class="card p-3 my-2 border border-primary-subtle rounded-4 bg-light bg-opacity-50">
                <h6 class="fw-bold text-primary mb-2">
                  <fa-icon [icon]="['fas', 'paw']" class="me-2"/>
                  Wybierz pacjenta do rezerwacji:
                </h6>

                @if (userPetsResource.isLoading()) {
                  <small class="text-muted">Ładowanie Twoich zwierzaków...</small>
                } @else {
                  <select
                    class="form-select rounded-3 shadow-sm"
                    [ngModel]="selectedPetId()"
                    (ngModelChange)="selectedPetId.set($event)"
                  >
                    <option [ngValue]="null" disabled>-- Wybierz pupila --</option>

                    @for (pet of userPetsResource.value() ?? []; track pet.id) {
                      <option [value]="pet.id">
                        {{ pet.name }} ({{ pet.species }})
                      </option>
                    }
                  </select>

                  @if (!selectedPetId()) {
                    <small class="text-danger mt-1 d-block">
                      Musisz wybrać zwierzaka z listy przed kliknięciem terminu.
                    </small>
                  }
                }
              </div>
            }

            @if (onBookAppointment.status() === 'loading') {
              <div class="alert alert-info py-2">Trwa rezerwacja wizyty...</div>
            }

            <h4 class="my-2">Dostępni weterynarze i terminy</h4>

            @if (currentUserRole(); as userRole) {
              @for (vet of veterinariesOfClinic(); track vet.id) {
                <app-get-appointments-for-vet
                  [loggedUserRole]="userRole"
                  [veterinary]="vet"
                  [clinicId]="idOfClinic"
                  (appointmentSelected)="handleBooking($event)"
                />
              }
            }
          </div>

          <div class="col-lg-3">
            <div class="p-4 shadow-lg rounded-4 bg-opacity-25 bg-light d-flex flex-column gap-4">
              <h5>Informacje o klinice</h5>

              <div class="d-flex gap-3">
                <fa-icon [icon]="['fas', 'location-dot']" size="lg"/>
                <div>
                  <h6 class="fw-semibold mb-1">Adres</h6>
                  <div>
                    {{ clinicData.address.city || clinicData.address.town || clinicData.address.village }},
                    {{ clinicData.address.street }}
                    {{ clinicData.address.house_number }}
                    {{ clinicData.address.apartment_number }}
                    {{ clinicData.address.postal_code }}
                  </div>
                </div>
              </div>

              <div class="d-flex gap-3">
                <fa-icon [icon]="['fas', 'phone']" size="lg"/>
                <div>
                  <h6 class="fw-semibold mb-1">Telefon</h6>
                  <div>{{ clinicData.phoneNumber }}</div>
                </div>
              </div>

              <div class="d-flex gap-3">
                <fa-icon [icon]="['fas', 'clock']" size="lg"/>
                <div>
                  <h6 class="fw-semibold mb-1">Godziny przyjęć</h6>
                  <div>{{ clinicData.timeOpen }} - {{ clinicData.timeClose }}</div>
                </div>
              </div>

              <div class="small-map rounded-3">
                <app-map [clinicLocation]="onSelectClinicLocation()"/>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .small-map {
      height: 350px;
      width: 100%;
    }

    .cursor-pointer {
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class VetClinicComponent {
  private readonly authService = inject(AuthService);
  private readonly clinicService = inject(ClinicService);
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly petsService = inject(PetsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly clinicId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    {
      initialValue: null,
    },
  );

  readonly clinic = signal<Clinic | null | undefined>(undefined);

  readonly currentUser = computed(() => this.authService.user());
  readonly currentUserRole = computed(() => this.currentUser()?.role);

  readonly onSelectClinicLocation = computed(() => this.clinic()?.address ?? null);

  readonly veterinariesOfClinic = computed(() => {
    return this.onGetVeterinariesFromClinic.value() ?? [];
  });

  readonly selectedPetId = signal<string | null>(null);

  readonly onUpdateClinicTrigger = signal<ClinicPayload | null>(null);
  readonly onBookAppointmentTrigger = signal<BookingPayload | null>(null);

  readonly userPetsResource = resource({
    params: () => this.currentUserRole(),
    loader: async ({params: role}) => {
      if (role !== Role.User) return [];

      return this.petsService.getPets();
    },
  });

  readonly onGetClinicInfo = resource({
    params: () => ({
      clinicId: this.clinicId(),
      user: this.currentUser(),
    }),
    loader: async ({params}) => {
      const {clinicId, user} = params;

      if (!user) {
        return null;
      }

      if (user.role === Role.Vet) {
        return this.clinicService.getMyClinic();
      }

      if (!clinicId) {
        throw new Error('no clinic Id assigned');
      }

      return this.clinicService.getClinicByClinicId(clinicId);
    },
  });

  readonly onUpdateClinic = resource({
    params: () => this.onUpdateClinicTrigger(),
    loader: async ({params}) => {
      if (!params) {
        return null;
      }

      return this.clinicService.updateCover(params.file, params.clinic);
    },
  });

  readonly onGetVeterinariesFromClinic = resource({
    params: () => this.clinic()?.id,
    loader: async ({params: clinicId}) => {
      if (!clinicId) {
        return [];
      }

      return this.clinicService.getVeterinariesAssignedToClinic(clinicId);
    },
  });

  readonly onBookAppointment = resource({
    params: () => this.onBookAppointmentTrigger(),
    loader: async ({params}) => {
      if (!params) return null;

      await this.appointmentsService.bookAppointment(
        params.appointment,
        params.userId,
        params.userName,
        params.petId,
        params.petName,
      );

      return true;
    },
  });

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
      if (this.onGetClinicInfo.status() === 'resolved') {
        this.clinic.set(this.onGetClinicInfo.value());
      }
    });

    effect(() => {
      if (this.onUpdateClinic.status() === 'resolved') {
        const updatedClinic = this.onUpdateClinic.value();

        if (updatedClinic) {
          this.clinic.set(updatedClinic);
          this.onUpdateClinicTrigger.set(null);
        }
      }
    });

    effect(() => {
      if (
        this.onBookAppointment.status() === 'resolved' &&
        this.onBookAppointment.value() === true
      ) {
        alert('Wizyta została zarezerwowana pomyślnie!');
        this.onGetVeterinariesFromClinic.reload();
        this.onBookAppointmentTrigger.set(null);
      }
    });
  }

  onPhotoUpload(file: File, clinicData: Clinic) {
    const user = this.currentUser();

    if (!user || user.role !== Role.Vet) {
      return;
    }

    this.onUpdateClinicTrigger.set({
      clinic: clinicData,
      file,
    });
  }

  handleBooking(appointment: Appointment) {
    const user = this.currentUser();

    if (!user || user.role !== Role.User) {
      return;
    }

    const petId = this.selectedPetId();
    const petsList = this.userPetsResource.value() ?? [];
    const selectedPet = petsList.find((pet) => pet.id === petId);

    if (!selectedPet) {
      alert('Przed dokonaniem rezerwacji wybierz zwierzaka z listy powyżej!');
      return;
    }

    const confirmBooking = confirm(
      `Czy na pewno chcesz zarezerwować wizytę dla ${selectedPet.name} na godzinę ${appointment.dateTimeFrom}?`,
    );

    if (!confirmBooking) {
      return;
    }

    this.onBookAppointmentTrigger.set({
      appointment,
      userId: user.id,
      userName: user.name,
      petId: selectedPet.id,
      petName: selectedPet.name,
    });
  }

  protected readonly Role = Role;
}
