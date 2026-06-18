import {ChangeDetectionStrategy, Component, computed, effect, inject, resource, signal} from '@angular/core';
import {AuthService} from "../../shared/data-access/auth.service";
import {AppointmentsService} from "../../shared/data-access/appointments.service";
import {DatePipe, NgClass} from "@angular/common";
import {Appointment} from "../../shared/interfaces/appointments.interface";
import {Role} from "../../shared/interfaces/user.interface";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TreatmentCreateComponent} from "../../pets/feature/treatment-create/treatment-create";


@Component({
  selector: 'app-history',
  imports: [DatePipe, NgClass],
  template: `
    <section class="container-fluid h-100 text-white bg-dark p-5">
      <div class="container">

        <div class="row mb-4">
          <div class="col">
            <h1 class="fw-bold h2">
              {{ userRole() === 'vet' ? 'Mój Kalendarz Wizyt' : 'My Appointments' }}
            </h1>
          </div>
        </div>

        <div class="d-flex gap-4 mb-4">
          <button type="button" class="btn text-light" data-bs-toggle="button" aria-pressed="true"
                  [ngClass]="{'active': activeTab() === 'upcoming'}"
                  (click)="selectTab('upcoming')">
            {{ userRole() === 'vet' ? 'Nadchodzące i Dzisiejsze' : 'Upcoming' }}
          </button>

          <button type="button" class="btn text-light" data-bs-toggle="button" aria-pressed="true"
                  [ngClass]="{'active': activeTab() === 'past'}"
                  (click)="selectTab('past')">
            {{ userRole() === 'vet' ? 'Zrealizowane / Historia' : 'Past' }}
          </button>
        </div>

        <div class="card bg-dark bg-opacity-50 border-0 shadow-lg rounded-4 p-3 mb-5 table-container">
          @if (onGetAppointments.status() === 'loading') {
            <div class="text-center py-5">
              <div class="spinner-border text-success mb-2" role="status"></div>
              <div>Loading appointments...</div>
            </div>

          } @else {
            <div class="table-responsive">
              <table class="table table-dark table-hover align-middle mb-0 text-start">
                <thead>
                <tr class="border-bottom border-secondary border-opacity-25">
                  <th scope="col" class="py-3 px-4 fw-semibold fs-6">Date & Time</th>
                  <th scope="col" class="py-3 fw-semibold fs-6">Clinic</th>
                  <th scope="col" class="py-3 fw-semibold fs-6">
                    {{ userRole() === Role.Vet ? 'Patient (Pet)' : 'Veterinarian' }}
                  </th>
                  <th scope="col" class="py-3 fw-semibold fs-6">Status</th>
                  <th scope="col" class="py-3 text-end px-4 fw-semibold fs-6">Akcje</th>
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
                            <div class="fw-bold text-white fs-6">{{ app.clinicName }}</div>
                            <div class="text-secondary small">{{ app.city }}</div>
                          </div>
                        </div>
                      </td>

                      <td class="py-3 text-white-50">
                        {{
                          userRole() === Role.Vet
                            ? (app.petName)
                            : (app.vetDisplayName)
                        }}
                      </td>

                      <td class="py-3">
                        @if (app.realised) {
                          <span
                            class="badge rounded-1 px-2 py-1 text-uppercase fw-bold text-xs bg-success bg-opacity-25 text-success">
                            Zrealizowana
                          </span>
                        } @else {
                          <span class="badge rounded-1 px-2 py-1 text-uppercase fw-bold text-xs"
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
                            <button class="btn btn-sm btn-success fw-bold px-3 rounded-3 shadow"
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
                        No appointments found in this category.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

          }
        </div>

        @if (appointmentDetails(); as app) {
          <!--          @if (app.petId && app.id) {-->
            <!--            <app-pet-history-->
            <!--              [petId]="app.petId"-->
            <!--              [activeAppointmentId]="app.id"-->
            <!--            />-->
            <!--          }-->
        }

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

    /* Poprawiony styl dla aktywnego przycisku */
    .btn.active {
      border-color: transparent; /* Resetuje domyślne ramki Bootstrapa */
      border-bottom: 2px solid white; /* Dodaje tylko dolną ramkę (2px wygląda wyraźniej) */
      border-radius: 0; /* Usuwa zaokrąglenie na dole, by linia była prosta */
      font-weight: bold; /* Opcjonalnie: wzmacnia efekt aktywnej zakładki */
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HistoryComponent {
  protected readonly Role = Role;
  public authService = inject(AuthService);
  public appointmentsService = inject(AppointmentsService);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  activeTab = signal<'upcoming' | 'past'>('upcoming');
  appointmentDetails = signal<Appointment | null>(null)

  userRole = computed<Role.User | Role.Vet>(() => {
    const user = this.authService.user();
    return user?.role === Role.Vet ? Role.Vet : Role.User;
  });

  onGetAppointments = resource({
    params: () => {
      const user = this.authService.user();
      return user ? {uid: user.id, role: this.userRole()} : null;
    },
    loader: async ({params}) => {
      if (!params) return [];
      return this.appointmentsService.getAppointmentsByUserOrVet(params.uid, params.role);
    }
  });

  filteredAppointments = computed<Appointment[]>(() => {
    const appointments = this.onGetAppointments.value() ?? [];
    const tab = this.activeTab();
    const isVet = this.userRole() === Role.Vet;
    const now = new Date();

    return appointments.filter(app => {
      if (isVet && !app.reserved && !app.realised) {
        return false;
      }

      const appDate = app.dateTimeFrom;

      if (app.realised) {
        return tab === 'past';
      }

      if (tab === 'upcoming') {
        if (isVet) {
          return appDate >= now || !app.realised;
        }
        return appDate >= now;
      } else {
        return appDate < now;
      }
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

  // Nowa metoda obsługująca zmianę zakładki oraz czyszczenie wyników szczegółowych
  selectTab(tab: 'upcoming' | 'past'): void {
    if (this.activeTab() !== tab) {
      this.activeTab.set(tab);
      this.appointmentDetails.set(null); // Resetuje otwarty komponent szczegółów wizyty/zwierzaka
    }
  }

  viewDetails(appointment: Appointment) {
    this.appointmentDetails.set(appointment);
  }

  handleVetCheckIn(appointment: Appointment) {
    const petId = appointment.petId;
    const appointmentId = appointment.id;

    if (!petId || !appointmentId || !appointment.dateTimeFrom) {
      alert('Błąd: Ta wizyta nie posiada pełnych danych (brak ID zwierzaka lub wizyty).');
      return;
    }

    const dateObj = appointment.dateTimeFrom;


    const preparedTreatment = {
      appointmentId: appointmentId,
      vetId: appointment.vetId,
      clinicId: appointment.clinicId,
      type: '',
      date: dateObj,
      vet: appointment.vetDisplayName,
      clinic: appointment.clinicName,
      diagnosis: '',
      description: '',
      recommendation: '',
      prescription: '',
      attachments: []
    };

    const modalRef = this.modalService.open(TreatmentCreateComponent, {size: 'lg'});

    modalRef.componentInstance.treatmentData = preparedTreatment;
    modalRef.componentInstance.petId = petId;

    modalRef.result.then((wasSaved) => {
      if (wasSaved) {
        this.onGetAppointments.reload();
      }
    }).catch(() => {
    });
  }
}
