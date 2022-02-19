/* eslint-disable max-lines-per-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import { DpDatePickerModule } from 'ng2-date-picker';
import { CommonUtils } from 'src/app/utils/common-utils';
import { DateTimePickerComponent } from './date-time-picker.component';

describe('DatePickerComponent', () => {
  let component: DateTimePickerComponent;
  let fixture: ComponentFixture<DateTimePickerComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DateTimePickerComponent
      ],
      providers: [CommonUtils],
      imports: [DpDatePickerModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DateTimePickerComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should set the default state for the date-time-picker', () => {
    const now = moment();
    component.ngAfterViewInit();
    expect(component.mounted).toBeTruthy();
    expect(component.timePicker.hours).toEqual(Number(now.format('hh')));
    expect(component.timePicker.minutes).toEqual(Number(now.format('mm')));
    expect(component.timePicker.meridiem).toEqual(now.format('a'));
  });

  it('should set the default state for the date-time-picker', () => {
    const now = moment();
    component.ngAfterViewInit();
    expect(component.mounted).toBeTruthy();
    expect(component.timePicker.hours).toEqual(Number(now.format('hh')));
    expect(component.timePicker.minutes).toEqual(Number(now.format('mm')));
    expect(component.timePicker.meridiem).toEqual(now.format('a'));
  });

  it('should change the date, when date is set', () => {
    const selectedDate = component.getSelectedDate();
    component.timePicker.hours = 12;
    component.timePicker.minutes = 50;
    component.changeDate();
    expect(selectedDate.hours()).toBe(12);
    expect(selectedDate.minutes()).toBe(50);
  });

  it('should change the meridiem, when the meridiem is set', () => {
    component.changeMeridiem('pm');
    expect(component.timePicker.meridiem).toBe('pm');
    component.changeMeridiem('am');
    expect(component.timePicker.meridiem).toBe('am');

    const selectedDate = component.getSelectedDate();
    selectedDate.set('hours', 14);
    component.changeMeridiem('am');
    expect(selectedDate.hours()).toBe(2);
    expect(component.timePicker.meridiem).toBe('am');

    selectedDate.set('hours', 2);
    component.changeMeridiem('pm');
    expect(selectedDate.hours()).toBe(14);
    expect(component.timePicker.meridiem).toBe('pm');
  });

  it('should should save the date', () => {
    component.ngAfterViewInit();
    const datePickerApiCloseSpy = spyOn(component.dateDirectivePicker.api, 'close');
    const dateTimeEmitter = spyOn(component.dateTimeEmitter, 'emit');
    component.saveDate();
    const selectedDate = component.getSelectedDate();
    expect(component.displayDate).toBe(selectedDate);
    expect(component.displayDate).toBe(selectedDate);
    expect(datePickerApiCloseSpy).toHaveBeenCalledOnceWith();
    expect(dateTimeEmitter).toHaveBeenCalledOnceWith(selectedDate.toISOString());
  });
});
