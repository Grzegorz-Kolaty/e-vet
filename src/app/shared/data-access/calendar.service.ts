import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  getHoursOfDay() {
    const hours: Date[] = [];
    for (let i = 1; i < 24; i++) {
      const date = new Date();
      date.setHours(i, 0, 0, 0);
      hours.push(date);
    }
    return hours.map(hour => hour.getHours());
  }


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
