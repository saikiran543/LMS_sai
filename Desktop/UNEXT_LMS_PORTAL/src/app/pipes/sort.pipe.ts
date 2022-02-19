/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Pipe, PipeTransform } from '@angular/core';
export type SortOrder = 'asc' | 'desc';

@Injectable()
@Pipe({
  name: 'sort',
})

export class SortPipe implements PipeTransform {
  transform(value: any[], sortOrder: SortOrder | string = 'asc', sortKey?: string): any {
    sortOrder = sortOrder && (sortOrder.toLowerCase() as any);
    if (!value || (sortOrder !== 'asc' && sortOrder !== 'desc')) {return value;}
    let numberArray = [];
    let stringArray = [];
    if (!sortKey) {
      numberArray = value.filter(item => typeof item === 'number').sort();
      stringArray = value.filter(item => typeof item === 'string').sort();
    } else {
      numberArray = value.filter(item => typeof item[sortKey] === 'number').sort((firstValue, secondValue) => firstValue[sortKey] - secondValue[sortKey]);
      stringArray = value
        .filter(item => typeof item[sortKey] === 'string')
        .sort((firstValue, secondValue) => {
          if (firstValue[sortKey] < secondValue[sortKey]) {return -1;}
          else if (firstValue[sortKey] > secondValue[sortKey]) {return 1;}
          // eslint-disable-next-line no-else-return
          else {return 0;}
        });
    }
    const sorted = numberArray.concat(stringArray);
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }
}
