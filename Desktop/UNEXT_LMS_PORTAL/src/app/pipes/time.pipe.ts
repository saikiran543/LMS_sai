import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(value : number) : string{
    if(value > 59){
      const hours = Math.floor(value/60);
      const mins = Math.floor(value%60);
      return hours + ' Hr ' + mins + ' Min';
    }else if(value > 0){
      return value > 9 ? value + ' Min': '0' + value + ' Min';
    }
    return '00 Min';
      
  }
}
