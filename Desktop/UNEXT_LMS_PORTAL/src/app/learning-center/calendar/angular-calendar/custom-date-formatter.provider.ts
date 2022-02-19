import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  // you can override any of the methods defined in the parent class

  public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return formatDate(date, 'EEE', locale!);
  }

  //   public monthViewTitle({ date, locale }: DateFormatterParams): string {
  //     return formatDate(date, 'MMM y', locale!);
  //   }

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return `${formatDate(date, 'EEE', locale!)} ${date.getDate()}/${date.getFullYear().toString().substr(-2)}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public weekViewColumnSubHeader({ date, locale }: DateFormatterParams): string {
    return "";
  }

//   public dayViewHour({ date, locale }: DateFormatterParams): string {
//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     return formatDate(date, 'HH:mm', locale!);
//   }
}
