import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy',
})
export class GroupByPipe implements PipeTransform {
  transform(group: Array<any>, by: string): Array<any> {
    const groupedObj = group.reduce((previous, current) => {
      if (!previous[current[by]]) {
        previous[current[by]] = [current];
      } else {
        previous[current[by]].push(current);
      }
      return previous;
    }, {});
    return Object.keys(groupedObj).map(key => ({
      key,
      value: groupedObj[key],
    }));
  }
}
