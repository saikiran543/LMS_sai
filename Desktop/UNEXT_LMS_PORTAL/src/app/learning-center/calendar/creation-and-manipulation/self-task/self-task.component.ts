/* eslint-disable eqeqeq */
/* eslint-disable no-invalid-this */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, FormBuilder, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RecurrenceModalComponent } from '../recurrence-modal/recurrence-modal.component';
import moment, {Moment} from 'moment';
import { CalendarService } from '../../service/calendar.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { StorageService } from 'src/app/services/storage.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { Subject, takeUntil } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import { Frequency } from 'rrule';
const oneDayTimeStamp = 86399059;

@Component({
  selector: 'app-self-task',
  templateUrl: './self-task.component.html',
  styleUrls: ['./self-task.component.scss']
})
export class SelfTaskComponent {
  isInitialized!:boolean;
  selfNoteForm!: FormGroup;
  modalRef!: NgbModalRef;
  selfTaskToast = false;
  toastType = 'error'
  params: any = {}
  toastMessage: any = "";
  selfNoteTitleLengthText = '';
  selfNoteTitleMaxLength = 500;
  currentDate = moment();
  previousDatePicker = true;
  recurrenceOptions = false;
  selfTaskData:any = {};
  $unsubscribe = new Subject<void>();
  @Output() confirmStatus = new EventEmitter();
  // eslint-disable-next-line max-params
  constructor(private storageService: StorageService, private ngbModal: NgbModal, private calendarService: CalendarService, private translationService: TranslateService, private toastService: ToastrService, private routeOperation: RouteOperationService) { }

  async ngOnInit(){
    if(this.params.id){
      const {body} = await this.calendarService.getSelfTask(this.params.id);
      this.selfTaskData = body;
    }
    this.createFormControl(this.selfTaskData);
    this.setDefaultCharLength();
    this.showCharacterLeft();
    this.setStartAndEndDateBasedQueryParams();
    this.isInitialized = true;
    document.querySelector("body.modal-open")?.classList.add("self-task-reminder-tooltip");
  }

  public get Frequency() {
    return Frequency;
  }

  createFormControl(selfTaskData: any){
    const freq = selfTaskData['rrule']&&selfTaskData['rrule']['freq']?selfTaskData['rrule']['freq']:'';
    const recurrence = this.getFrequency(freq);
    this.selfNoteForm = new FormGroup({
      title: new FormControl(selfTaskData['title']?selfTaskData['title']:'', [Validators.required, CustomValidator.blankSpace, CustomValidator.alphaNumeric]),
      description: new FormControl(selfTaskData['description']?selfTaskData['description']:''),
      recurrence: new FormControl(recurrence),
      reminderInMinutes: new FormControl(selfTaskData['reminderInMinutes']?selfTaskData['reminderInMinutes']:15, [Validators.required]),
      allDay: new FormControl(selfTaskData['allDay']?selfTaskData['allDay']:false),
    });
    const startDate = moment();
    if(startDate.minutes()<31){
      startDate.set('minutes',30);
    }
    else{
      startDate.set('hours',startDate.get('hours')+1);
      startDate.set('minutes',0);
    }
    startDate.set('seconds',0);
    startDate.set('milliseconds',0);
    const endDate = moment(startDate).add(30,'minutes');
    this.selfNoteForm.addControl( 'startDate', new FormControl(selfTaskData['startDate']?moment(selfTaskData['startDate']):startDate, [Validators.required,this.startEndDateValidation()]));
    this.selfNoteForm.addControl( 'endDate', new FormControl(selfTaskData['endDate']?moment(selfTaskData['endDate']):endDate, [Validators.required,this.startEndDateValidation()]));
  }

  getFrequency(freq:any){
    switch (freq) {
      case Frequency.MONTHLY:
        return 'Monthly';
      case Frequency.DAILY:
        return 'Daily';
      case Frequency.WEEKLY:
        return "Weekly";
      default:
        return "Never";
    }
  }

  setStartAndEndDateBasedQueryParams(){
    this.routeOperation.listen("startDate").pipe(takeUntil(this.$unsubscribe)).subscribe((startDate)=>{
      const parsedStartDate = moment(startDate);
      if (startDate && parsedStartDate.isValid()) {
        this.selfNoteForm.controls['startDate'].clearValidators();
        this.selfNoteForm.controls['endDate'].clearValidators();
        this.selfNoteForm.controls['startDate'].setValue(parsedStartDate,{ emitEvent: false });
        const endDate = moment(startDate).add(30,'minutes');
        this.selfNoteForm.controls['endDate'].setValue(endDate,{ emitEvent: false });
        this.selfNoteForm.controls['startDate'].setValidators([Validators.required,this.startEndDateValidation()]);
        this.selfNoteForm.controls['endDate'].setValidators([Validators.required,this.startEndDateValidation()]);
        this.selfNoteForm.controls['startDate'].updateValueAndValidity();
        this.selfNoteForm.controls['endDate'].updateValueAndValidity();

      }
    });
  }

  startEndDateValidation() {
    return (formControl: AbstractControl): ValidationErrors | null => {
      const startDate = this.selfNoteForm.get('startDate');
      const endDate = this.selfNoteForm.get('endDate');
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

  async saveSelfTask(): Promise<void>{
    const payLoad = this.selfNoteForm.value;
    if(!payLoad.rrule){
      payLoad.rrule = this.selfTaskData.rrule?this.selfTaskData.rrule:{};
    }
    if ((payLoad.endDate.valueOf()-payLoad.startDate.valueOf())>=oneDayTimeStamp) {
      payLoad.allDay =true;
    }
    try {
      if (this.params.id) {
        await this.calendarService.updateSelfTask(this.params.id,payLoad);
        payLoad.eventId = this.params.id;
        this.storageService.broadcastValue(StorageKey.SELF_TASK_OPERATION,{operationType: 'edit',payLoad});
      }
      else{
        await this.calendarService.saveSelfTask(payLoad);
        this.storageService.broadcastValue(StorageKey.SELF_TASK_OPERATION,{operationType: 'create',payLoad});
      }
      this.translationService.get(this.params.id?"selfTask.creationAndManipulation.updateSuccess":"selfTask.creationAndManipulation.createSuccess").subscribe((res: string) => {
        this.toastMessage = res;
        this.showSuccessToast(res);
        this.cancelSelfTask(true);
      });
    } catch (error:any) {
      this.toastMessage = error.error;
      this.showErrorToast(error.error);
    }
  }

  recurrenceDropdown() {
    this.recurrenceOptions = ! this.recurrenceOptions;
  }

  recurrencePopup(recurrenceType: string):void{
    const prevRecurrenceType = this.selfNoteForm.controls['recurrence'].value;
    this.selfNoteForm.controls['recurrence'].setValue(recurrenceType);
    this.recurrenceOptions = false;
    if (recurrenceType === 'Never') {
      this.selfNoteForm.addControl('rrule',new FormGroup({}));
      return;
    }
    let freq;
    if(recurrenceType ==="Daily"){
      freq = Frequency.DAILY;
    }
    else if(recurrenceType ==="Monthly"){
      freq = Frequency.MONTHLY;
    }
    else{
      freq = Frequency.WEEKLY;
    }
    const formGroup = new FormGroup({
      dtstart: new FormControl(this.selfNoteForm.value.startDate, [Validators.required]),
      until: new FormControl(this.selfNoteForm.value.endDate, []),
      freq: new FormControl(freq, [Validators.required])
    });
    this.selfNoteForm.addControl('rrule',formGroup);
    this.modalRef = this.ngbModal.open(RecurrenceModalComponent, { backdrop: 'static', centered: true, modalDialogClass: 'recurrence-popup', animation: true });
    this.modalRef.componentInstance.params.recurrenceForm = formGroup;
    this.modalRef.componentInstance.confirmStatus.subscribe((res: boolean) => {
      if(!res){
        this.selfNoteForm.controls['recurrence'].setValue(prevRecurrenceType);
      }
      this.modalRef.close();
    });
  }

  public dateTimeEmitter(event: string, type: string) {
    this.selfNoteForm.controls[type].setValue(moment(event));
  }

  allDaysToggle(event: any){
    if(event.target.checked && this.selfNoteForm.get('startDate')?.value){
      const startDateMemorize = this.selfNoteForm.get('startDate')?.value;
      this.storageService.set("selfTaskStartDate", startDateMemorize);
      const endDateMemorize = this.selfNoteForm.get('endDate')?.value;
      this.storageService.set("selfTaskEndDate", endDateMemorize);
      const startDate = this.selfNoteForm.get('startDate')?.value;
      const startDateTime = startDate.toDate();
      startDateTime.setHours(0);
      startDateTime.setMinutes(0);
      startDateTime.setSeconds(0);
      startDateTime.setMilliseconds(0);
      this.selfNoteForm.controls['startDate'].setValue(moment(startDateTime));
      const endDateTime = startDate.toDate();
      endDateTime.setHours(23);
      endDateTime.setMinutes(59);
      endDateTime.setSeconds(59);
      endDateTime.setMilliseconds(59);
      this.selfNoteForm.controls['endDate'].setValue(moment(endDateTime));
    }else{
      try {
        this.selfNoteForm.controls['startDate'].setValue(this.storageService.get("selfTaskStartDate"));
        this.selfNoteForm.controls['endDate'].setValue(this.storageService.get("selfTaskEndDate"));
      } catch (error) {
        // eslint-disable-next-line no-useless-return
        return;
      }
     
    }
  }

  showSuccessToast(message: string): void {
    this.toastService.success(message, '', {
      positionClass: 'toast-top-center',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
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

  cancelSelfTask(value: any){
    document.querySelector("body.modal-open")?.classList.remove("self-task-reminder-tooltip");
    this.confirmStatus.emit(value);
  }

  closeToast(): void {
    this.selfTaskToast = false;
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  private showCharacterLeft(): void {
    const title = this.selfNoteForm.get('title');
    if (title) {
      title.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val);
      });
    }
  }

  private setCharacterLeftText(text = ''): void {
    const maxLength = this.selfNoteTitleMaxLength;
    if (text === '' || text === null) {
      this.setDefaultCharLength();
      return;
    }
    const textLength = text.length;
    const charLeft = maxLength - textLength;
    let translationKey = 'selfTask.creationAndManipulation.charactersLeft';
    if (charLeft <= 1) {
      translationKey = 'selfTask.creationAndManipulation.characterLeft';
    }
    this.translationService.get(translationKey, { length: charLeft }).subscribe((res: string) => {
      this.selfNoteTitleLengthText = res;
    });
  }

  private setDefaultCharLength(): void {
    const maxOfCharacterTranslationKey = 'selfTask.creationAndManipulation.maxOfCharacter';
    this.translationService.get(maxOfCharacterTranslationKey, { length: this.selfNoteTitleMaxLength }).subscribe((res: string) => {
      this.selfNoteTitleLengthText = res;
    });
  }

  ngOnDestroy(): void{
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
