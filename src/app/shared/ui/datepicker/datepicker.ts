import { ChangeDetectionStrategy, Component, inject, Input, output, viewChild, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  imports: [
    NgbInputDatepicker,
    FaIconComponent,
    FormsModule
  ],
  template: `
    <div class="d-flex flex-column gap-2 w-100">

      @if (isSelectMode) {
        <div class="d-flex flex-row flex-wrap gap-2 align-items-center">

          <div class="form-floating" style="min-width: 140px;">
            <select class="form-select border rounded-3" id="yearSelect" [(ngModel)]="selectedYear" (change)="emitSelectRange()">
              @for (y of years; track y) {
                <option [value]="y">{{ y }}</option>
              }
            </select>
            <label for="yearSelect">Rok</label>
          </div>

          <div class="form-floating" style="min-width: 160px;">
            <select class="form-select border rounded-3" id="monthSelect" [(ngModel)]="selectedMonth" (change)="emitSelectRange()">
              <option value="all">Wszystkie</option>
              <option value="0">Styczeń</option>
              <option value="1">Luty</option>
              <option value="2">Marzec</option>
              <option value="3">Kwiecień</option>
              <option value="4">Maj</option>
              <option value="5">Czerwiec</option>
              <option value="6">Lipiec</option>
              <option value="7">Sierpień</option>
              <option value="8">Wrzesień</option>
              <option value="9">Październik</option>
              <option value="10">Listopad</option>
              <option value="11">Grudzień</option>
            </select>
            <label for="monthSelect">Miesiąc</label>
          </div>

        </div>
      }

      @else {
        <div class="d-flex flex-row gap-2 mb-1">
          <button
            type="button"
            class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 rounded-3"
            (click)="selectToday()">
            📅 Dzisiejszy dzień
          </button>

          @if (isRangeMode) {
            <button
              type="button"
              class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 rounded-3"
              (click)="selectCurrentMonth()">
              📅 Ostatni miesiąc
            </button>
          }
        </div>

        <form class="d-flex flex-row flex-wrap gap-2 align-items-center">
          <div class="dp-hidden position-absolute">
            <div class="input-group">
              <input
                name="datepicker"
                class="form-control"
                ngbDatepicker
                #datepicker="ngbDatepicker"
                [autoClose]="'outside'"
                (dateSelect)="onDateSelection($event)"
                [displayMonths]="2"
                [dayTemplate]="t"
                outsideDays="hidden"
                [startDate]="fromDate!"
                tabindex="-1"
              />
              <ng-template #t let-date let-focused="focused">
                <span
                  class="custom-day"
                  [class.focused]="focused"
                  [class.range]="isRange(date)"
                  [class.faded]="isHovered(date) || isInside(date)"
                  (mouseenter)="hoveredDate = date"
                  (mouseleave)="hoveredDate = null">
                  {{ date.day }}
                </span>
              </ng-template>
            </div>
          </div>

          <div class="input-group" style="max-width: 220px;">
            <div class="form-floating">
              <input
                id="dateFrom"
                readonly
                class="form-control cursor-pointer"
                [class.is-valid]="fromDate && (!isRangeMode || toDate)"
                placeholder="yyyy-mm-dd"
                name="dpFromDate"
                [value]="fromDate ? formatter.format(fromDate) : ''"
                (click)="datepicker.toggle()"
              />
              <label for="dateFrom">Data od</label>
            </div>
            <button
              class="btn btn-outline-secondary d-flex align-items-center px-3"
              (click)="datepicker.toggle()"
              type="button">
              <fa-icon [icon]="['fas', 'calendar-day']" size="lg"/>
            </button>
          </div>

          @if (isRangeMode) {
            <div class="input-group" style="max-width: 220px;">
              <div class="form-floating">
                <input
                  id="dateTo"
                  readonly
                  class="form-control cursor-pointer"
                  [class.is-valid]="fromDate && toDate"
                  placeholder="yyyy-mm-dd"
                  name="dpToDate"
                  [value]="toDate ? formatter.format(toDate) : ''"
                  (click)="datepicker.toggle()"
                />
                <label for="dateTo">Data do</label>
              </div>
              <button
                class="btn btn-outline-secondary d-flex align-items-center px-3"
                (click)="datepicker.toggle()"
                type="button">
                <fa-icon [icon]="['fas', 'calendar-day']" size="lg"/>
              </button>
            </div>
          }
        </form>
      }
    </div>
  `,
  styles: `
    .dp-hidden { width: 0; margin: 0; border: none; padding: 0; }
    .custom-day { text-align: center; padding: 0.185rem 0.25rem; display: inline-block; height: 2rem; width: 2rem; line-height: 1.65rem; }
    .custom-day.focused { background-color: #e6e6e6; }
    .custom-day.range, .custom-day:hover { background-color: rgb(2, 117, 216); color: white; }
    .custom-day.faded { background-color: rgba(2, 117, 216, 0.5); }
    .cursor-pointer { cursor: pointer; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Datepicker implements OnInit {
  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  datepickerDirective = viewChild<NgbInputDatepicker>('datepicker');

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;

  @Input() isRangeMode = true;

  // --- NOWE INPUTY DLA STEROWANIA WIDOKIEM SELECTÓW ---
  @Input() isSelectMode = false;

  onRangeDateChange = output<{ start: Date; end: Date } | null>();
  onSingleDateChange = output<Date | null>();

  // Stan dla list rozwijanych
  years: number[] = [];
  selectedYear = new Date().getFullYear();
  selectedMonth = 'all';

  ngOnInit() {
    console.log('datepicker init')
    const currentYear = new Date().getFullYear();
    // Generujemy dynamicznie listę lat (np. 3 lata wstecz i 1 w przód)
    for (let i = currentYear - 3; i <= currentYear + 1; i++) {
      this.years.push(i);
    }

    // Jeśli startujemy od razu w trybie selectów, wyślijmy domyślny zakres dla całego roku
    if (this.isSelectMode) {
      this.emitSelectRange();
    }
  }

  // Obliczanie zakresu dat na podstawie wybranych selectów
  public emitSelectRange() {
    let start: Date;
    let end: Date;

    if (this.selectedMonth === 'all') {
      // Cały rok: od 1 stycznia do 31 grudnia
      start = new Date(Number(this.selectedYear), 0, 1, 0, 0, 0, 0);
      end = new Date(Number(this.selectedYear), 11, 31, 23, 59, 59, 999);
    } else {
      // Konkretny miesiąc
      const monthNum = Number(this.selectedMonth);
      start = new Date(Number(this.selectedYear), monthNum, 1, 0, 0, 0, 0);

      // Ostatni dzień wybranego miesiąca
      const lastDay = new Date(Number(this.selectedYear), monthNum + 1, 0).getDate();
      end = new Date(Number(this.selectedYear), monthNum, lastDay, 23, 59, 59, 999);
    }

    console.log(start, end)
    this.onRangeDateChange.emit({ start, end });
  }

  public selectToday() {
    const today = this.calendar.getToday();
    this.fromDate = today;
    if (this.isRangeMode) {
      this.toDate = today;
      const start = this.convertToDate(today);
      const end = this.convertToDate(today);
      end.setHours(23, 59, 59, 999);
      this.onRangeDateChange.emit({start, end});
    } else {
      this.toDate = null;
      this.onSingleDateChange.emit(this.convertToDate(today));
    }
    this.datepickerDirective()?.navigateTo({year: today.year, month: today.month});
  }

  public selectCurrentMonth() {
    const today = this.calendar.getToday();
    this.fromDate = new NgbDate(today.year, today.month, 1);
    const lastDayNumberOfMonth = new Date(today.year, today.month, 0).getDate();
    this.toDate = new NgbDate(today.year, today.month, lastDayNumberOfMonth);
    const start = this.convertToDate(this.fromDate);
    const end = this.convertToDate(this.toDate);
    end.setHours(23, 59, 59, 999);
    this.onRangeDateChange.emit({start, end});
    this.datepickerDirective()?.navigateTo({year: today.year, month: today.month});
  }

  onDateSelection(date: NgbDate) {
    if (!this.isRangeMode) {
      this.fromDate = date;
      this.toDate = null;
      this.onSingleDateChange.emit(this.convertToDate(date));
      return;
    }
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.onRangeDateChange.emit(null);
    } else if (this.fromDate && !this.toDate && date && (date.after(this.fromDate) || date.equals(this.fromDate))) {
      this.toDate = date;
      const startDate = this.convertToDate(this.fromDate);
      const endDate = this.convertToDate(this.toDate);
      endDate.setHours(23, 59, 59, 999);
      this.onRangeDateChange.emit({ start: startDate, end: endDate });
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.onRangeDateChange.emit(null);
    }
  }

  private convertToDate(ngbDate: NgbDate): Date {
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
  }

  isHovered(date: NgbDate) { return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate); }
  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }
  isRange(date: NgbDate) { return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date); }
}
