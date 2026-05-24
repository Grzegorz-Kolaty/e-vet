import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { CalendarService } from '../../../shared/data-access/calendar.service';
import { FormatHourPipe } from '../../../shared/pipes/format-hour.pipe';
import { Timestamp } from 'firebase/firestore';
import { Appointment } from "../../../shared/interfaces/appointments.interface";
import {SlotState} from "../create.component";


interface SlotUIConfig {
  label: string;
  className: string;
  disabled: boolean;
  action?: 'add' | 'remove';
}

@Component({
  selector: 'app-appointments-table',
  imports: [DatePipe, FormatHourPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="table table-sm table-light table-fixed">
      <thead>
        <tr>
          <th></th>
          @for (day of visibleDays(); track day.getTime()) {
            <th class="text-center">{{ day | date: 'mediumDate' }}</th>
          }
        </tr>
      </thead>

      <tbody class="text-center">
        @for (hour of hoursOfDay(); track hour) {
          <tr>
            <th class="text-center">{{ hour | formatHour }}</th>

            @for (day of visibleDays(); track day.getTime()) {
              @let cell = getCellContext(day, hour);
              @let config = UI_CONFIG[cell.state];

              <td>
                <button
                  class="btn btn-sm w-100 h-100 {{ config.className }}"
                  [disabled]="config.disabled || (cell.state === 'empty' && isLoading())"
                  (click)="config.action === 'add' ? onAddAppointment(cell.date) : config.action === 'remove' ? onRemoveAppointment(cell.date) : null">
                  {{ config.label }}
                </button>
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    table { table-layout: fixed; width: 100%; }
    td, th { height: 3rem; vertical-align: middle; }
    td button { display: flex; align-items: center; justify-content: center; white-space: nowrap; }
  `,
})
export default class AppointmentsTableComponent {
  private readonly calendarService = inject(CalendarService);

  protected readonly UI_CONFIG: Record<SlotState, SlotUIConfig> = {
    outdated: { label: 'Po terminie', className: 'btn-link text-muted text-decoration-none', disabled: true },
    reserved: { label: 'Zarezerwowany', className: 'btn-warning', disabled: true },
    draft:    { label: 'Draft', className: 'btn-info', disabled: false, action: 'remove' },
    existing: { label: 'Utworzony', className: 'btn-success', disabled: false, action: 'remove' },
    // NOWY STAN: Czerwony kafelek informujący o planowanym usunięciu
    toDelete: { label: 'Do usunięcia', className: 'btn-danger', disabled: false, action: 'add' },
    empty:    { label: 'Dodaj', className: 'btn-secondary', disabled: false, action: 'add' },
    weekend:  { label: 'Weekend', className: 'btn-light', disabled: true }
  };

  hoursOfDay = computed(() => this.calendarService.getHoursOfDay());
  weekData = input<Date[]>([]);
  existingAppointments = input<Appointment[]>([]);
  isLoading = input<boolean>(false);
  hideWeekends = signal<boolean>(true);
  slotState = input<Map<string, SlotState> | null>(null);

  visibleDays = computed(() =>
    this.weekData().filter(d => !(this.isWeekend(d) && this.hideWeekends()))
  );

  private appointmentsMap = computed(() => {
    const map = new Map<number, Appointment>();
    this.existingAppointments().forEach(a => {
      const time = a.dateTimeFrom instanceof Timestamp
        ? a.dateTimeFrom.toDate().getTime()
        : new Date(a.dateTimeFrom).getTime();
      map.set(time, a);
    });
    return map;
  });

  readonly add = output<Date>();
  readonly remove = output<Date>();

  getCellContext(day: Date, hour: number): { state: SlotState; date: Date } {
    const date = new Date(day);
    date.setHours(hour, 0, 0, 0);

    const key = `${this.toDayKey(day)}-${hour}`;
    const fromSlotState = this.slotState()?.get(key);
    if (fromSlotState) return { state: fromSlotState, date };

    const targetTime = date.getTime();
    const now = new Date();

    if (now > date) return { state: 'outdated', date };

    const existing = this.appointmentsMap().get(targetTime);
    if (existing) {
      return {
        state: existing.reserved ? 'reserved' : 'existing',
        date
      };
    }

    return { state: 'empty', date };
  }

  private toDayKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  onAddAppointment(date: Date) { this.add.emit(date); }
  onRemoveAppointment(date: Date) {
    console.log(date)
    this.remove.emit(date); }
  private isWeekend(date: Date): boolean { return date.getDay() === 0 || date.getDay() === 6; }
}
