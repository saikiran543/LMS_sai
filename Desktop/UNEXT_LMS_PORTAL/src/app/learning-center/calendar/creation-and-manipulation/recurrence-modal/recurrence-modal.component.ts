/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import moment from 'moment';
import { DatePickerComponent } from 'ng2-date-picker';
import { CalendarMode } from 'ng2-date-picker/common/types/calendar-mode';
import { ToastrService } from 'ngx-toastr';
import { Frequency } from 'rrule';
import { Subscription } from 'rxjs';

interface Params {
  recurrenceForm: FormGroup
}
@Component({
  selector: 'app-recurrence-modal',
  templateUrl: './recurrence-modal.component.html',
  styleUrls: ['./recurrence-modal.component.scss']
})
export class RecurrenceModalComponent implements OnInit {
  constructor(private toastService: ToastrService, private fb: FormBuilder, private cdr: ChangeDetectorRef) { }
  @Output() confirmStatus = new EventEmitter();
  params: Params = {} as Params;
  @ViewChild('datePicker') datePicker!: DatePickerComponent;
  time: any;
  mode: CalendarMode = 'day';
  showRecurrenceForm = false;
  submittedValue: any;
  subscription!: Subscription;
  weekDays = ['Mo','Tu','We','Th','Fr','Sa','Su'];

  async ngOnInit(): Promise<void> {
    this.showRecurrenceForm = true;
    await this.createFormControl();
    this.initializeValueChanges();
  }

  ngAfterViewInit(){
    this.cdr.detectChanges();
  }

  byWeekDayRecurrence($event: any,day: string){
    const selectedDays = this.params.recurrenceForm.controls['byweekday'];
    const options = selectedDays.value as [];
    if($event.target.checked){
      selectedDays.setValue([...options, day.toUpperCase()]);
    } else {
      selectedDays.setValue(options.filter(option => option !== day.toUpperCase()));
    }

  }

  isSelected(day: string): boolean{
    const selectedDays = this.params.recurrenceForm.controls['byweekday'].value;
    return selectedDays.includes(day.toUpperCase());
  }

  createFormControl() :void{
    const { recurrenceForm } = this.params;
    recurrenceForm.addControl( 'interval', new FormControl(1, [Validators.required]));
    if(recurrenceForm.value.freq === Frequency.WEEKLY){
      this.params.recurrenceForm.addControl( 'byweekday', new FormControl([]));
    }
    else if(recurrenceForm.value.freq === Frequency.MONTHLY){
      this.params.recurrenceForm.addControl( 'bymonthday', new FormControl(recurrenceForm.value.dtstart.date()));
    }
  }

  initializeValueChanges(){
    const { recurrenceForm } = this.params;
    Object.keys(recurrenceForm.controls).forEach(controlName => {
      recurrenceForm.controls[controlName].valueChanges.subscribe((value: any)=>{
        switch (controlName) {
          case 'freq':
          case 'interval':
            recurrenceForm.controls[controlName].setValue(+value,{emitEvent: false});
            break;
        
          default:
            break;
        }
      });
    });
  }

  deleteAndCreateControlForMonthView(event: string){
    const { recurrenceForm } = this.params;
    if (event === 'day') {
      recurrenceForm.removeControl('bymonthday');
      recurrenceForm.addControl( 'bysetpos', new FormControl(this.getWeekNoOfTheMonth(recurrenceForm.value.dtstart)));
      recurrenceForm.addControl( 'byweekday', new FormControl(recurrenceForm.value.dtstart.weekday()-1));
    }
    else{
      recurrenceForm.removeControl('byday');
      recurrenceForm.removeControl('bysetpos');
      recurrenceForm.addControl( 'bymonthday', new FormControl(recurrenceForm.value.dtstart.date()));

    }
  }

  textForWeekDays(): string{
    const { recurrenceForm } = this.params;
    return`On the ${this.convertNumberIntoText(this.getWeekNoOfTheMonth(recurrenceForm.value.dtstart))} ${recurrenceForm.value.dtstart.format('dddd')}`;

  }

  getWeekNoOfTheMonth(date:any): number{
    return Math.ceil(date.date() / 7);
  }

  convertNumberIntoText(num: number): string{
    switch (num) {
      case 1:
        return 'First';
      case 2:
        return 'Second';
      case 3:
        return 'Third';
      case 4:
        return 'Forth';
      case 5:
        return 'Fifth';
      case 6:
        return 'Sixth';
      default:
        return '';
    }
  }
  startEndDateValidation() {
    return (formControl: AbstractControl): ValidationErrors | null => {
      const { recurrenceForm } = this.params;
      const startDate = recurrenceForm.get('startDate');
      const endDate = recurrenceForm.get('endDate');
      if (!startDate?.value || !endDate?.value) {
        return null;
      }
      if (startDate.value < endDate.value) {
        formControl.setErrors(null);
        return null;
      }
      formControl.setErrors({ invalid: true });
      this.showErrorToast("Please enter a Different End Time");
      return { invalid: true };
    };
  }

  showErrorToast(message: string): void {
    this.toastService.error(message, '', {
      positionClass: 'toast-top-center',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }

  public async dateTimeEmitter(event: string, type: string): Promise<void> {
    if(type === 'dtstart'){
      this.params.recurrenceForm.controls.dtstart.setValue(moment(event));
    }else{
      this.params.recurrenceForm.controls.until.setValue(moment(event));
    }
  }

  changeFreq(){
    const { recurrenceForm } = this.params;
    Object.keys(recurrenceForm.controls).forEach(key => {
      if (!['dtstart','until','freq'].includes(key)) {
        recurrenceForm.removeControl(key);
      }
    });
    this.createFormControl();
    this.initializeValueChanges();
  }

  changeRecurrenceEndDate(): void{
    this.datePicker.api.open();
  }

  async saveRecurrence(type: boolean): Promise<void>{
    this.closeRecurrence(type);
  }
 
  closeRecurrence(type: boolean): void {
    this.confirmStatus.emit(type);
  }

  removeRecurrenceEndDate(): void{
    this.params.recurrenceForm.controls["until"].setValue(null);
  }
}
