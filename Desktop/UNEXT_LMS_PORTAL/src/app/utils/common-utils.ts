import { v4 as uuid } from 'uuid';

export interface timeOutput {
  hour: number,
  minute: number
}

export class CommonUtils {
  getUuid(): string {
    return uuid();
  }

  getTimeInMinutes(hour = 0, minute = 0): number {
    let minutes = 0;
    if (hour > 0) {
      minutes = hour * 60;
    }

    return +minutes + +minute;
  }

  getTimeInHourAndMinute(time: number): timeOutput {
    const hours = (time / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return {
      hour: rhours,
      minute: rminutes
    };
  }

  removeHTML(str: string): string {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
  }

  timestampToDate(timestamp: string): string {
    const newDate = new Date(timestamp);
    const stringNewDate = newDate.toString();
    const year = stringNewDate.slice(11, 15);
    const month = stringNewDate.slice(4, 7);
    const date = stringNewDate.slice(8, 10);
    return `${date} ${month} ${year}`;
  }
}