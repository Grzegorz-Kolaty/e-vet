import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  effect, resource
} from '@angular/core';
import {AppointmentsService} from '../../shared/data-access/appointments.service';
import {DatepickerRangeComponent} from '../../shared/ui/datepicker-range/datepicker-range.component';
import {doc, Timestamp, writeBatch} from 'firebase/firestore';
import AppointmentsTableComponent from "./appointments-table/appointments-table.component";
import {Router} from "@angular/router";
import {AuthService} from "../../shared/data-access/auth.service";
import {Appointment} from "../../shared/interfaces/appointments.interface";

// Dodajemy stan do głównego komponentu zarządzającego
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
            <div class="alert alert-primary d-flex align-items-center" role="alert">
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
                [selectSingleDay]="false"
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
  private authService = inject(AuthService);
  private appointmentsService = inject(AppointmentsService);
  private router = inject(Router);

  user = this.authService.user;
  onSelectWeekSig = signal<{ start: Date; end: Date } | null>(null);

  draftAppointments = signal<Appointment[]>([]);
  appointmentsToDelete = signal<Set<number>>(new Set());

  appointmentsResource = resource({
    params: () => this.onSelectWeekSig(),
    loader: async ({params}) => {
      if (!params) return [];
      return await this.appointmentsService.getAppointmentsForVet(params) ?? [];
    }
  });

  weekDays = computed(() => {
    const w = this.onSelectWeekSig();
    if (!w) return [];

    const days: Date[] = [];
    const d = new Date(w.start);
    while (d <= w.end) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  });

  slotState = computed(() => {
    const map = new Map<string, SlotState>();
    const now = new Date();
    const existing = this.appointmentsResource.value() ?? [];
    const toDelete = this.appointmentsToDelete();

    // 1. Mapowanie terminów z bazy danych
    for (const a of existing) {
      const d = a.dateTimeFrom.toDate();
      const millis = a.dateTimeFrom.toMillis();
      const key = `${this.toDayKey(d)}-${d.getHours()}`;

      if (toDelete.has(millis)) {
        // ZAMIANA: zamiast 'empty', ustawiamy dedykowany stan 'toDelete'
        map.set(key, 'toDelete');
      } else {
        map.set(key, now > d ? 'outdated' : (a.reserved ? 'reserved' : 'existing'));
      }
    }

    // 2. Mapowanie nowo dodawanych terminów (Draft)
    for (const a of this.draftAppointments()) {
      const d = a.dateTimeFrom.toDate();
      const key = `${this.toDayKey(d)}-${d.getHours()}`;
      map.set(key, now > d ? 'outdated' : 'draft');
    }

    return map;
  });

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['auth', 'login']);
      }
    });
  }

  private toDayKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  addToDraft(date: Date) {
    const millis = date.getTime();

    // Jeśli ten termin był na liście do USUNIĘCIA (czyli był czerwony),
    // ponowne kliknięcie ("Dodaj") oznacza po prostu rezygnację z kasowania!
    if (this.appointmentsToDelete().has(millis)) {
      this.appointmentsToDelete.update(set => {
        set.delete(millis);
        return new Set(set);
      });
      return;
    }

    const ap = this.build(date);
    this.draftAppointments.update(list => {
      const exists = list.some(a => a.dateTimeFrom.toMillis() === millis);
      return exists ? list : [...list, ap];
    });
  }

  handleRemove(date: Date) {
    const millis = date.getTime();
    const isInDraft = this.draftAppointments().some(a => a.dateTimeFrom.toMillis() === millis);

    if (isInDraft) {
      this.draftAppointments.update(list => list.filter(a => a.dateTimeFrom.toMillis() !== millis));
    } else {
      this.appointmentsToDelete.update(set => {
        set.add(millis);
        return new Set(set);
      });
    }
  }

  async commitChanges() {
    const batch = writeBatch(this.appointmentsService.firestore);
    const user = this.user();
    if (!user?.user_id) return;

    for (const ap of this.draftAppointments()) {
      const id = `${ap.vetId}_${ap.dateTimeFrom.toMillis()}`;
      const ref = doc(this.appointmentsService.firestore, 'appointments', id);
      batch.set(ref, ap);
    }

    for (const millis of this.appointmentsToDelete()) {
      const id = `${user.user_id}_${millis}`;
      const ref = doc(this.appointmentsService.firestore, 'appointments', id);
      batch.delete(ref);
    }

    await batch.commit();

    this.draftAppointments.set([]);
    this.appointmentsToDelete.set(new Set());
    this.appointmentsResource.reload();
  }

  private build(date: Date): Appointment {
    const user = this.user();
    if (!user?.user_id || !user?.clinicId) throw new Error('No user or vet or clinic');

    return {
      vetId: user.user_id,
      clinicId: user.clinicId,
      vetDisplayName: user.name,
      reserved: false,
      realised: false,
      city: 'Szczecin',
      dateTimeFrom: Timestamp.fromDate(date),
      dateTimeTo: Timestamp.fromDate(date),
    };
  }
}
