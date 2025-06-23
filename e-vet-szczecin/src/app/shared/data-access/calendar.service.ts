import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  /**
   * Builds Array of number with hours - it will be changeable in future (for ex. firebaseUser wants only 6:00 - 14:00, etc.
   */
  getHoursOfDay() {
    const hours: Date[] = [];
    for (let i = 1; i < 24; i++) {
      const date = new Date();
      date.setHours(i, 0, 0, 0);
      hours.push(date);
    }
    return hours.map(hour => hour.getHours());
  }

  /**
   * Build weekdays based on specific day
   * Selection of Tuesday will return whole week (from Monday to Sunday).
   * @param selectedDay
   // * @param hoursOfDay
   * @returns Array of day dates and hours.
   */
  getWeekDayRangeWithTimeSlots(selectedDay: Date | undefined): Date[] {
    const week: Date[] = [];

    if (selectedDay) {
      const currentDay = selectedDay.getDay();
      const startOfWeekOffset = currentDay === 0 ? -6 : 1 - currentDay; // Poniedziałek jako pierwszy dzień tygodnia
      const startOfWeek = new Date(selectedDay);
      startOfWeek.setDate(selectedDay.getDate() + startOfWeekOffset);

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);

        for (let j = 1; j < 24; j++) {
          // Dodanie godzin w przedziale 0-23
          const timeSlot = new Date(day);
          timeSlot.setHours(j, 0, 0, 0); // Ustawianie godziny z zerowaniem minut, sekund i milisekund
          week.push(timeSlot);
        }
      }
    }
    // console.log(week);
    return week;
  }

  /**
   * Build weekdays-range based on specific day
   * Selection of Tuesday will return whole week (from Monday to Sunday).
   * @param selectedDay
   * @returns Array of day dates (without hours).
   */
  getWeekDayRange(selectedDay: Date | undefined): Date[] {
    const week: Date[] = [];
    if (selectedDay) {
      const currentDay = selectedDay.getDay();
      const startOfWeekOffset = currentDay === 0 ? -6 : 1 - currentDay;
      const startOfWeek = new Date(selectedDay);
      startOfWeek.setDate(selectedDay.getDate() + startOfWeekOffset);

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
      }
    }
    return week;
  }
}
