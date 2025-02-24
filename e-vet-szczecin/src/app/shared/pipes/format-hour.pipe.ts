import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatHour',
})
export class FormatHourPipe implements PipeTransform {
  transform(hour: number): string {
    const hasDecimal = !Number.isInteger(hour);

    if (hasDecimal) {
      const [whole, decimal] = hour.toString().split('.');
      const formattedDecimal = decimal.padEnd(2, '0');
      return `${whole}:${formattedDecimal}`;
    } else {
      const formattedHour = hour < 10 ? `0${hour}` : hour.toString();
      return `${formattedHour}:00`;
    }
  }
}
