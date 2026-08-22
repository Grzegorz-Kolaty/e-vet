import {
  ChangeDetectionStrategy,
  Component,
  computed, effect,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import {
  NgbDate,
  NgbDatepicker,
  NgbDatepickerMonth,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { CalendarService } from '../../data-access/calendar.service';

@Component({
  selector: 'app-datepicker-range',
  imports: [NgbDatepicker, NgbDatepickerMonth],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #c let-dp>
      @for (month of dp.state.months; track $index) {
        <ngb-datepicker-month [month]="month">
        </ngb-datepicker-month>
      }
    </ng-template>

    @if (availableDays().length > 0 && !!selectSingleDay()) {
      <ngb-datepicker
        [firstDayOfWeek]="7"
        (dateSelect)="onSingleDaySelection($event)"
        [displayMonths]="1"
        [contentTemplate]="c"
        outsideDays="collapsed"
        navigation="arrows"
        [markDisabled]="markDisabled">

        <ng-template ngbDatepickerDay let-date>
          <span class="custom-day">
            {{ date.day }}
          </span>
        </ng-template>
      </ngb-datepicker>
    } @else if (!selectSingleDay()) {
      <ngb-datepicker
        [firstDayOfWeek]="7"
        (dateSelect)="onWeekSelection($event)"
        [displayMonths]="1"
        [contentTemplate]="c"
        outsideDays="collapsed"
        navigation="arrows"
        [markDisabled]="markDisabled">

        <ng-template ngbDatepickerDay let-date>
          <span class="custom-day">
            {{ date.day }}
          </span>
        </ng-template>
      </ngb-datepicker>
    }
  `,
  styles: `
    ngb-datepicker {
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      display: block !important;
    }
    ngb-datepicker .ngb-dp-week,
    .ngb-dp-weekdays {
      display: grid;
      grid-template-columns: repeat(7, auto);
      background-color: transparent;
      border-bottom: none;
      border-radius: 0;
      justify-items: center;
    }
    ngb-datepicker .ngb-dp-week > div:first-child,
    ngb-datepicker .ngb-dp-weekdays > div:first-child {
      color: #b5b5b5;
    }
    ngb-datepicker .ngb-dp-week > div:last-child,
    ngb-datepicker .ngb-dp-weekdays > div:last-child {
      color: #b5b5b5;
    }
    ngb-datepicker .ngb-dp-weekday, .ngb-dp-week-number {
      font-style: normal;
    }
    ngb-datepicker .ngb-dp-header {
      border-bottom: 0;
      border-radius: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
    ngb-datepicker .ngb-dp-header,
    .ngb-dp-month-name {
      background-color: transparent;
    }
    ngb-datepicker .ngb-dp-month-name {
      background-color: transparent;
    }
  `,
})
export class DatepickerRangeComponent {
  private calendarService = inject(CalendarService);

  daySelection = output<Date>();
  weekSelection = output<{ start: Date; end: Date }>();

  private weekStart: Date | null = null;
  private weekEnd: Date | null = null;

  availableDays = input<string[]>([]);
  selectSingleDay = input(false);

  availableDaysSet = computed(() => {
    if (!this.selectSingleDay()) {
      return new Set<string>();
    }
    return new Set<string>(this.availableDays());
  });

  constructor() {
    effect(() => {
      console.log(this.availableDays())
      console.log(this.availableDaysSet())
    });
  }

  markDisabled = (date: NgbDateStruct): boolean => {
    if (!this.selectSingleDay()) {
      return false;
    }

    const key = [
      date.year,
      String(date.month).padStart(2, '0'),
      String(date.day).padStart(2, '0')
    ].join('-');

    return !this.availableDaysSet().has(key);
  };

  onWeekSelection(date: NgbDate) {
    const selected = this.toDate(date);
    const week = this.calendarService.getWeekDayRange(selected);

    this.weekStart = week[0];
    this.weekEnd = week[week.length - 1];

    this.weekSelection.emit({
      start: this.weekStart,
      end: this.weekEnd,
    });
  }

  onSingleDaySelection(date: NgbDate) {
    const selected = this.toDate(date);
    this.daySelection.emit(selected);
  }

  private toDate(date: NgbDate): Date {
    return new Date(date.year, date.month - 1, date.day);
  }
}
