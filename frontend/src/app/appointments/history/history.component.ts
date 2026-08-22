import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import {DatePipe, NgClass} from '@angular/common';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AuthService} from '../../shared/data-access/auth.service';
import {AppointmentsService} from '../../shared/data-access/appointments.service';

import {Appointment} from '../../shared/interfaces/appointments.interface';
import {Role} from '../../shared/interfaces/user.interface';

import {TreatmentCreateComponent} from '../../pets/feature/treatment-create/treatment-create';

@Component({
  selector: 'app-history',
  imports: [DatePipe, NgClass],
  template: `
    <section class="container-fluid h-100 text-white bg-dark p-5">
      <div class="container">

        <div class="row mb-4">
          <div class="col">
            <h1 class="fw-bold h2">
              {{ userRole() === Role.Vet ? 'Mój Kalendarz Wizyt' : 'Moje wizyty' }}
            </h1>
          </div>
        </div>

        <div class="d-flex gap-4 mb-4">
          <button
            type="button"
            class="btn text-light"
            data-bs-toggle="button"
            aria-pressed="true"
            [ngClass]="{'active': activeTab() === 'upcoming'}"
            (click)="selectTab('upcoming')">
            {{ userRole() === Role.Vet ? 'Nadchodzące i dzisiejsze' : 'Nadchodzące' }}
          </button>

          <button
            type="button"
            class="btn text-light"
            data-bs-toggle="button"
            aria-pressed="true"
            [ngClass]="{'active': activeTab() === 'past'}"
            (click)="selectTab('past')">
            {{ userRole() === Role.Vet ? 'Zrealizowane / historia' : 'Historia' }}
          </button>
        </div>

        <div class="card bg-dark bg-opacity-50 border-0 shadow-lg rounded-4 p-3 mb-5 table-container">
          @if (onGetAppointments.status() === 'loading') {
            <div class="text-center py-5">
              <div class="spinner-border text-success mb-2" role="status"></div>
              <div>Ładowanie wizyt...</div>
            </div>
          } @else {
            <div class="table-responsive">
              <table class="table table-dark table-hover align-middle mb-0 text-start">
                <thead>
                <tr class="border-bottom border-secondary border-opacity-25">
                  <th scope="col" class="py-3 px-4 fw-semibold fs-6">
                    Data i godzina
                  </th>

                  <th scope="col" class="py-3 fw-semibold fs-6">
                    Klinika
                  </th>

                  <th scope="col" class="py-3 fw-semibold fs-6">
                    {{ userRole() === Role.Vet ? 'Pacjent / zwierzę' : 'Weterynarz' }}
                  </th>

                  <th scope="col" class="py-3 fw-semibold fs-6">
                    Status
                  </th>

                  <th scope="col" class="py-3 text-end px-4 fw-semibold fs-6">
                    Akcje
                  </th>
                </tr>
                </thead>

                <tbody>
                  @for (app of filteredAppointments(); track app.id) {
                    <tr class="border-bottom border-secondary border-opacity-10 py-3">
                      <td class="py-3 px-4 fw-medium">
                        {{ app.dateTimeFrom | date: 'MMMM d, y, h:mm a' }}
                      </td>

                      <td class="py-3">
                        <div class="d-flex align-items-center gap-3">
                          <div class="d-flex align-items-center justify-content-center rounded-circle">
                            🏥
                          </div>

                          <div>
                            <div class="fw-bold text-white fs-6">
                              Klinika #{{ shortId(app.clinicId) }}
                            </div>
                            <div class="text-secondary small">
                              ID: {{ app.clinicId }}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td class="py-3 text-white-50">
                        @if (userRole() === Role.Vet) {
                          @if (app.petId) {
                            Zwierzę #{{ shortId(app.petId) }}
                          } @else {
                            Brak przypisanego zwierzaka
                          }
                        } @else {
                          Weterynarz #{{ shortId(app.vetId) }}
                        }
                      </td>

                      <td class="py-3">
                        @if (app.realised) {
                          <span class="badge rounded-1 px-2 py-1 text-uppercase fw-bold text-xs bg-success bg-opacity-25 text-success">
                            Zrealizowana
                          </span>
                        } @else {
                          <span
                            class="badge rounded-1 px-2 py-1 text-uppercase fw-bold text-xs"
                            [ngClass]="app.reserved ? 'status-confirmed' : 'status-pending'">
                            {{
                              app.reserved
                                ? 'CONFIRMED'
                                : 'PENDING'
                            }}
                          </span>
                        }
                      </td>

                      <td class="py-3 text-end px-4">
                        <div class="d-flex justify-content-end gap-2">
                          @if (userRole() === Role.Vet && !app.realised && activeTab() === 'upcoming') {
                            <button
                              class="btn btn-sm btn-success fw-bold px-3 rounded-3 shadow"
                              (click)="handleVetCheckIn(app)">
                              🩺 Przyjmij pacjenta
                            </button>
                          }

                          <button
                            class="btn btn-link text-secondary p-0 text-decoration-none fw-semibold border-0"
                            (click)="viewDetails(app)">
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="text-center py-5 fs-6 border-0 shadow-lg">
                        Brak wizyt w tej kategorii.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>

      </div>
    </section>
  `,
  styles: `
    .status-confirmed {
      background-color: rgba(25, 135, 84, 0.15) !important;
      color: #20c997 !important;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }

    .status-pending {
      background-color: rgba(255, 193, 7, 0.15) !important;
      color: #ffc107 !important;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }

    .btn.active {
      border-color: transparent;
      border-bottom: 2px solid white;
      border-radius: 0;
      font-weight: bold;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HistoryComponent {
  protected readonly Role = Role;

  private readonly authService = inject(AuthService);
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly router = inject(Router);
  private readonly modalService = inject(NgbModal);

  readonly activeTab = signal<'upcoming' | 'past'>('upcoming');
  readonly appointmentDetails = signal<Appointment | null>(null);

  readonly userRole = computed<Role.User | Role.Vet>(() => {
    const user = this.authService.user();

    return user?.role === Role.Vet ? Role.Vet : Role.User;
  });

  readonly onGetAppointments = resource({
    params: () => this.authService.user(),
    loader: async ({params: user}) => {
      if (!user) {
        return [];
      }

      return this.appointmentsService.getMyAppointments();
    },
  });

  readonly filteredAppointments = computed<Appointment[]>(() => {
    const appointments = this.onGetAppointments.value() ?? [];
    const tab = this.activeTab();
    const isVet = this.userRole() === Role.Vet;
    const now = new Date();

    return appointments.filter((appointment) => {
      if (isVet && !appointment.reserved && !appointment.realised) {
        return false;
      }

      const appointmentDate = appointment.dateTimeFrom;

      if (appointment.realised) {
        return tab === 'past';
      }

      if (tab === 'upcoming') {
        if (isVet) {
          return appointmentDate >= now || !appointment.realised;
        }

        return appointmentDate >= now;
      }

      return appointmentDate < now;
    });
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
  }

  selectTab(tab: 'upcoming' | 'past'): void {
    if (this.activeTab() !== tab) {
      this.activeTab.set(tab);
      this.appointmentDetails.set(null);
    }
  }

  viewDetails(appointment: Appointment): void {
    this.appointmentDetails.set(appointment);
  }

  handleVetCheckIn(appointment: Appointment): void {
    const petId = appointment.petId;
    const appointmentId = appointment.id;

    if (!petId || !appointmentId || !appointment.dateTimeFrom) {
      alert('Błąd: Ta wizyta nie posiada pełnych danych: brak ID zwierzaka lub wizyty.');
      return;
    }

    const preparedTreatment = {
      appointmentId,
      vetId: appointment.vetId,
      clinicId: appointment.clinicId,
      type: '',
      date: appointment.dateTimeFrom,
      diagnosis: '',
      description: '',
      recommendation: '',
      prescription: '',
      attachments: [],
    };

    const modalRef = this.modalService.open(TreatmentCreateComponent, {
      size: 'lg',
    });

    modalRef.componentInstance.treatmentData = preparedTreatment;
    modalRef.componentInstance.petId = petId;

    modalRef.result
      .then((wasSaved) => {
        if (wasSaved) {
          this.onGetAppointments.reload();
        }
      })
      .catch(() => {});
  }

  protected shortId(id?: string | null): string {
    if (!id) {
      return '-';
    }

    return id.slice(0, 8);
  }
}
