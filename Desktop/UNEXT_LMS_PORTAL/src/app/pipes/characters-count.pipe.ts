/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'charactersCount'
})
export class CharactersCountPipe implements PipeTransform {

  transform(value: any, maxLength: number): number {
    return maxLength - value;
  }

}
