import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDatepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CalendarService } from '../../data-access/calendar.service';

@Component({
  selector: 'app-datepicker-range',
  imports: [FormsModule, NgbDatepicker, NgClass],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ngb-datepicker
      [(ngModel)]="model"
      #dp
      (dateSelect)="onDateSelection($event)"
      [displayMonths]="1"
      [dayTemplate]="t"
      outsideDays="hidden"
      class="border-0" />

    <ng-template #t let-date>
      <span
        class="custom-day"
        [ngClass]="{ 'custom-focus': model && model.equals(date) }"
        [class.range]="isRange(date)"
        (mouseenter)="hoveredDate = date"
        (mouseleave)="hoveredDate = null">
        {{ date.day }}
      </span>
    </ng-template>
  `,
  styles: `
    .ngb-dp-week {
      justify-content: space-between;
    }

    .ngb-dp-day {
      height: 2.5rem !important;
      width: 2.5rem !important;
    }

    .ngb-dp-weekday {
      color: black !important;
    }

    .ngb-dp-arrow {
      flex: 1 !important;
    }

    .form-select {
      border: none;
    }

    .custom-day {
      padding: 0.185rem 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }

    .custom-focus {
      background-color: rgba(2, 117, 216) !important;
    }

    .custom-day:hover {
      background-color: rgba(2, 117, 216);
      color: white;
    }

    .custom-day:active {
      background-color: rgb(98, 53, 228);
      color: white;
    }

    .custom-day.range {
      background-color: rgba(2, 117, 216, 0.7);
      color: white;
    }
  `,
})
export class DatepickerRangeComponent implements OnInit {
  calendarService = inject(CalendarService);

  today = inject(NgbCalendar).getToday();
  model: NgbDate | null = null;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;

  daySelectionEvent = output<Date>();
  weekSelection = output<Date[]>();

  onSelectToday() {
    this.onDateSelection(this.today);
  }

  ngOnInit() {
    if (this.model === null) this.onSelectToday();
  }

  onDateSelection(date: NgbDate) {
    const dateFormatted = this.convertFromNgbDateToDate(date);
    this.model = date;
    const week = this.calendarService.getWeekDayRange(dateFormatted);
    this.fromDate = this.convertFromDateToNgbDate(week[0]);
    this.toDate = this.convertFromDateToNgbDate(week[week.length - 1]);

    this.daySelectionEvent.emit(dateFormatted);
    this.weekSelection.emit(week);
  }

  convertFromDateToNgbDate(date: Date): NgbDate {
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  convertFromNgbDateToDate(date: NgbDate): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
}
