import {ChangeDetectionStrategy, Component, computed, inject, signal, effect, resource} from '@angular/core';
import {AppointmentsService} from '../../shared/data-access/appointments.service';
import {DatepickerRangeComponent} from '../../shared/ui/datepicker-range/datepicker-range.component';
import AppointmentsTableComponent from "./appointments-table/appointments-table.component";
import {Router} from "@angular/router";
import {AuthService} from "../../shared/data-access/auth.service";
import {Appointment} from "../../shared/interfaces/appointments.interface";
import ClinicService from "../../shared/data-access/clinic.service";

export type SlotState = 'existing' | 'draft' | 'reserved' | 'empty' | 'outdated' | 'weekend' | 'toDelete';


@Component({
  selector: 'app-create',
  imports: [DatepickerRangeComponent, AppointmentsTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let userProfile = user();

    <section class="container-fluid h-100">
      @if (userProfile) {
        <div class="row m-0 mb-2">
          <h4 class="text-center bg-dark-subtle p-3">Wskaż tydzień</h4>
        </div>

        <div class="row p-5 g-4">
          <div class="col-3">
            <div class="alert alert-primary d-flex align-items-cent" role="alert">
              <div>
                Znajdujesz się w panelu zarządzania rezerwacjami.
                <br/>
                <span class="text-muted">
                  <strong class="text-success">Zielone</strong> to aktywne terminy (kliknij, by usunąć).
                  <strong class="text-danger">Czerwone</strong> zostaną skasowane po zatwierdzeniu.
                </span>
              </div>
            </div>


            <div class="text-center d-flex flex-column gap-3">
              <app-datepicker-range
                [selectSingleDay]=false
                (weekSelection)="onSelectWeekSig.set($event)"/>

              <button
                (click)="commitChanges()"
                [disabled]="draftAppointments().length === 0 && appointmentsToDelete().size === 0"
                class="btn btn-warning w-100 py-2 shadow-sm fw-bold">
                Zapisz zmiany (Commit)
              </button>
            </div>
          </div>

          <div class="col">
            <app-appointments-table
              [weekData]="weekDays()"
              [existingAppointments]="appointmentsResource.value() ?? []"
              [slotState]="slotState()"
              (add)="addToDraft($event)"
              (remove)="handleRemove($event)"
            />
          </div>
        </div>
      }
    </section>
  `
})
export default class CreateComponent {
  private readonly authService = inject(AuthService);
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly clinicService = inject(ClinicService);
  private readonly router = inject(Router);
  readonly user = this.authService.user;
  readonly onSelectWeekSig = signal<{ start: Date; end: Date } | null>(null);
  readonly draftAppointments = signal<Appointment[]>([]);
  readonly appointmentsToDelete = signal<Set<number>>(new Set());
  readonly clinicResource = resource({
    params: () => this.user()?.id, loader: async ({params: vetId}) => {
      if (!vetId) return null;
      return this.clinicService.getClinicByVetId(vetId);
    },
  });
  readonly appointmentsResource = resource({
    params: () => this.onSelectWeekSig(), loader: async ({params}) => {
      if (!params) return [];
      return this.appointmentsService.getAppointmentsForVet(params);
    },
  });
  readonly weekDays = computed(() => {
    const selectedWeek = this.onSelectWeekSig();
    if (!selectedWeek) return [];
    const days: Date[] = [];
    const currentDate = new Date(selectedWeek.start);
    while (currentDate <= selectedWeek.end) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  });
  readonly slotState = computed(() => {
    const map = new Map<number, SlotState>();
    const now = new Date();
    const existingAppointments = this.appointmentsResource.value() ?? [];
    const appointmentsToDelete = this.appointmentsToDelete();
    for (const appointment of existingAppointments) {
      const date = appointment.dateTimeFrom;
      const millis = date.getTime();
      if (appointmentsToDelete.has(millis)) {
        map.set(millis, 'toDelete');
        continue;
      }
      if (now > date) {
        map.set(millis, 'outdated');
        continue;
      }
      map.set(millis, appointment.reserved ? 'reserved' : 'existing');
    }
    for (const appointment of this.draftAppointments()) {
      const date = appointment.dateTimeFrom;
      const millis = date.getTime();
      map.set(millis, now > date ? 'outdated' : 'draft');
    }
    return map;
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

  addToDraft(date: Date): void {
    const millis = date.getTime();
    if (this.appointmentsToDelete().has(millis)) {
      this.appointmentsToDelete.update((set) => {
        set.delete(millis);
        return new Set(set);
      });
      return;
    }
    const appointment = this.build(date);
    this.draftAppointments.update((list) => {
      const exists = list.some((item) => item.dateTimeFrom.getTime() === millis,);
      return exists ? list : [...list, appointment];
    });
  }

  handleRemove(date: Date): void {
    const millis = date.getTime();
    const isInDraft = this.draftAppointments().some((appointment) => appointment.dateTimeFrom.getTime() === millis,);
    if (isInDraft) {
      this.draftAppointments.update((list) => list.filter((appointment) => appointment.dateTimeFrom.getTime() !== millis),);
      return;
    }
    this.appointmentsToDelete.update((set) => {
      set.add(millis);
      return new Set(set);
    });
  }

  async commitChanges(): Promise<void> {
    const user = this.user();
    if (!user?.id) return;
    const existingAppointments = this.appointmentsResource.value() ?? [];
    const appointmentsToDelete = existingAppointments.filter((appointment) => this.appointmentsToDelete().has(appointment.dateTimeFrom.getTime()),);
    await Promise.all([...this.draftAppointments().map(
      (appointment) =>
        this.appointmentsService.createAppointment(appointment),), ...appointmentsToDelete.filter((appointment) => appointment.id).map((appointment) => this.appointmentsService.deleteAppointment(appointment.id!),),]);
    this.draftAppointments.set([]);
    this.appointmentsToDelete.set(new Set());
    this.appointmentsResource.reload();
  }

  private build(date: Date): Appointment {
    const user = this.user();
    if (!user?.id) {
      throw new Error('No user id');
    }
    const currentClinic = this.clinicResource.value();
    if (!currentClinic?.id || !currentClinic.clinicName) {
      throw new Error('No clinic id');
    }
    const resolvedCity = currentClinic.address?.city || currentClinic.address?.town || currentClinic.address?.village || 'Nieokreślone miasto';
    const dateTimeFrom = new Date(date);
    const dateTimeTo = new Date(date);
    dateTimeTo.setMinutes(dateTimeTo.getMinutes() + 30);
    return {
      vetId: user.id,
      clinicId: currentClinic.id,
      clinicName: currentClinic.clinicName,
      vetDisplayName: user.name,
      reserved: false,
      realised: false,
      city: resolvedCity,
      dateTimeFrom,
      dateTimeTo,
    };
  }
}
