import { Component, ElementRef, Output, ViewChild, EventEmitter, ViewEncapsulation, ChangeDetectorRef, Input } from '@angular/core';
import moment from 'moment';
import { Moment } from 'moment';
import { DatePickerDirective, IDatePickerDirectiveConfig } from 'ng2-date-picker';

type MeridiemType = 'am' | 'pm';
type TimeFormats = 'hours'|'minutes';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DateTimePickerComponent {
  
  config: IDatePickerDirectiveConfig = {
    format: 'DD MMM YYYY, hh.mm A',
    hours12Format: 'hh',
  };

  @Input()
  disabled = false;

  @Input() set maxStartDate(date: Moment) {
    if(date) {
      this.config = {
        ...this.config,
        min: date,
        max: undefined
      };
    }
  }

  @Input() set maxEndDate(date: Moment) {
    if(date) {
      this.config = {
        ...this.config,
        max: date,
        min: undefined
      };
    }
  }

  @Input()
  set defaultDisplayValue(date: Moment) {
    this.displayDate = date;
    if(date && this.dateDirectivePicker) {
      this.dateDirectivePicker.datePicker.selected[0] = date;
    }
  }

  @Input()
  className= 'date-time-widget'

  @ViewChild('dateDirectivePicker')
  dateDirectivePicker!: DatePickerDirective;

  @ViewChild('dateTimeDisplay')
  dateTimeDisplay!:ElementRef;

  @ViewChild('timeSelector')
  timeSelector!:ElementRef;

  @Output()
  dateTimeEmitter = new EventEmitter();

  displayDate: null | Moment = null;

  timePicker: {
    hours: number,
    minutes: number,
    meridiem: string,
  } = {
    hours: 0,
    minutes: 0,
    meridiem: 'am',
  }

  mounted = false;

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() : void{
    this.config.appendTo = `.${this.className}`;
  }
  ngAfterViewInit(): void {
    const now = moment();
    this.dateDirectivePicker.datePicker.selected = [now];
    this.dateDirectivePicker.datePicker.popupElem.appendChild(this.timeSelector.nativeElement);
    this.dateDirectivePicker.datePicker.popupElem.appendChild(this.dateTimeDisplay.nativeElement);
    this.timePicker.hours = Number(now.format('hh'));
    this.timePicker.minutes = Number(now.format('mm'));
    this.timePicker.meridiem = now.format('a');
    this.mounted = true;
    if(this.displayDate){
      this.dateDirectivePicker.datePicker.selected[0] = this.displayDate;
    }
    this.cdr.detectChanges();
  }

  getSelectedDate(): Moment {
    return this.dateDirectivePicker?.datePicker?.selected?.[0];
  }

  get formattedDate(): string {
    const selectedDate = this.getSelectedDate();
    if(moment.isMoment(selectedDate)){
      return selectedDate?.format(this.config.format);
    }
    return '';
  }

  changeDate(): void {
    const selectedDate = this.getSelectedDate();
    if(this.mounted) {
      selectedDate.set('hours', this.timePicker.hours);
      selectedDate.set('minutes', this.timePicker.minutes);
      this.timePicker.meridiem = selectedDate.format('a') === 'am' ? 'am': 'pm';
    }
  }

  changeTime(event: Event, min: number, max: number): void {
    event.stopPropagation();
    const eventTarget = <HTMLInputElement>event.target;
    const targetName: TimeFormats = eventTarget.name as TimeFormats;
    const selectedDate = this.getSelectedDate();
    if(+(eventTarget)?.value > max) {
      eventTarget.value = String(max);
    }
    if(+(eventTarget)?.value < min) {
      eventTarget.value = String(max);
    }
    this.timePicker[<TimeFormats>eventTarget.name] = +eventTarget.value;
    if(eventTarget.name === 'hours') {
      if(selectedDate.format('a') === 'am') {
        if(Number(eventTarget.value) !== 12) {
          selectedDate.set(targetName, +eventTarget.value);
        } else {
          selectedDate.set(targetName, 0);
        }
      } else if(Number(eventTarget.value) !== 12) {
        selectedDate.set(targetName, +eventTarget.value + 12);
      } else {
        selectedDate.set(targetName, 12);
      }
    } else {
      selectedDate.set(targetName, +eventTarget.value);
    }
  }

  changeMeridiem(meridiem: MeridiemType): void {
    const selectedDate = this.getSelectedDate();
    const units = 'hours';
    if(meridiem === 'am') {
      if(selectedDate.hours() >= 12) {
        selectedDate.subtract(12, units);
      }
      this.timePicker.meridiem = meridiem;
    } else if(selectedDate.hours() < 12) {
      selectedDate.add(12, units);
      this.timePicker.meridiem = meridiem;
    }
  }

  saveDate(): void {
    const selectedDate = this.getSelectedDate();
    this.displayDate = selectedDate;
    this.dateDirectivePicker.api.close();
    this.dateTimeEmitter.emit(selectedDate.toISOString());
  }
}
