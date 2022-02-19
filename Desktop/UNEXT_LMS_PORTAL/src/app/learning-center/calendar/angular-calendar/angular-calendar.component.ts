/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types*/
/* eslint-disable max-lines-per-function */
import { Component, OnInit, ViewChild, TemplateRef,ChangeDetectorRef, ViewEncapsulation, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CalendarDateFormatter, CalendarDayViewBeforeRenderEvent, CalendarEvent, CalendarEventTimesChangedEvent, CalendarMonthViewBeforeRenderEvent, CalendarView, CalendarWeekViewBeforeRenderEvent, } from 'angular-calendar';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarMode } from 'ng2-date-picker/common/types/calendar-mode';
import { DatePickerComponent } from 'ng2-date-picker';
import moment from 'moment-timezone';
import { ViewPeriod } from 'calendar-utils';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import RRule from 'rrule';
import { PopupGotoComponent } from '../popup-goto/popup-goto.component';
import { differenceInMinutes, startOfDay, startOfHour } from 'date-fns';
import { CalendarEvents } from 'src/app/Models/common-interfaces';
import { DialogService } from 'src/app/services/dialog.service';
import { CalendarService } from '../service/calendar.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { StorageService } from 'src/app/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ScreenSizeKey } from 'src/app/enums/screenSizeKey';
import { PopupEventListComponent } from '../popup-event-list/popup-event-list.component';
const oneDayTimeStamp = 86399059;

@Component({
  selector: 'app-angular-calendar',
  templateUrl: './angular-calendar.component.html',
  styleUrls: ['./angular-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class AngularCalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('datePicker') datePicker!: DatePickerComponent;
  view: CalendarView = CalendarView.Week;
  viewPeriod!: ViewPeriod
  // eslint-disable-next-line max-params
  constructor(private modal: NgbModal, private router: Router, private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef,private elRef:ElementRef, private dialogService: DialogService, private calendarService: CalendarService, private storageService: StorageService, private translateService: TranslateService, private toastService: ToastrService) { }
  CalendarView = CalendarView;
  @Output() emitCalendarEvents = new EventEmitter();
  @Input() $calendarEvents!: Subject<CalendarEvents[]>;
  modalRef!: NgbModalRef;
  popover!:any;
  allDayEventsLabelTemplate!:TemplateRef<any>;

  viewDate: Date = new Date();
  time = moment();
  events!: CalendarEvent[]
  mode: CalendarMode = 'day';
  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  refresh = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
  }

  dayClicked($event:any): void {
    const todayDate = new Date();
    todayDate.setHours(0,0,0,0);
    if ($event.day.date>=todayDate) {
      this.createSelfTask();
    }
  }

  showMore(event: any ){
    this.displayEventList({date: event.date, events: event.events });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  ontimeChange(time: any): void {
    if (time) {
      this.viewDate = time.toDate();
    }
  }

  hourSegmentClicked($event:any){
    const todayDate = new Date();
    if ($event.date>=todayDate) {
      this.createSelfTask($event.date.toJSON());
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  goToPresentDay() {
    const today = new Date();
    this.viewDate = today;
  }

  triggerPicker(){
    this.datePicker.api.open();
  }

  setView(view: CalendarView): void {
    this.view = view;
    switch (view) {
      case 'month':
        this.mode = 'month';
        break;
      case 'day':
      case 'week':
        this.mode = 'day';
        break;
      default:
        break;
    }
  }

  createSelfTask(startDate?:string): void {
    const queryParams =startDate? {startDate} :{};
    this.router.navigate([`./manipulate/create/self-task`], { relativeTo: this.activatedRoute, queryParams });
  }

  // eslint-disable-next-line max-lines-per-function
  updateCalendarEvents(
    viewRender:
      | CalendarMonthViewBeforeRenderEvent
      | CalendarWeekViewBeforeRenderEvent
      | CalendarDayViewBeforeRenderEvent
  ): void {
    if (
      !this.viewPeriod ||
      !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
      !moment(this.viewPeriod.end).isSame(viewRender.period.end)
    ) {
      this.viewPeriod = viewRender.period;

      this.$calendarEvents.subscribe((events)=>{
        this.events = [];
        const viewEvents:any= [];
        events.forEach((event:CalendarEvents) => {
          const { eventName, eventDescription,eventId, eventType , reminder } = event;
          let { allDay } = event;
          if ((moment(event.endDate).valueOf()-moment(event.startDate).valueOf())>=oneDayTimeStamp) {
            allDay =true;
          }
          if (!event.recurrance || Object.keys(event.recurrance).length===0) {
            viewEvents.push({
              title: eventName,
              id: eventId,
              allDay,
              meta: { eventDescription, type: eventType , reminder },
              start: new Date(event.startDate),
              end: new Date(event.endDate),
            });
          }
          else {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);
            const ruleObject:any = {
              freq: event.recurrance.freq,
              dtstart: new Date(event.recurrance.dtstart),
              until: event.recurrance.until ? new Date(event.recurrance.until) : undefined,
              interval: event.recurrance.interval,
              // byhour: new Date(event.recurrance.dtstart).getHours(),
              // byminute: new Date(event.recurrance.dtstart).getMinutes()
            };
            if(event.recurrance.byweekday){
              ruleObject['byweekday']= event.recurrance.byweekday;
            }
            const rule: RRule = new RRule(ruleObject);
            rule.between(this.viewPeriod.start,this.viewPeriod.end).forEach((date) => {
              const newStartDate = new Date(date);
              newStartDate.setHours(startDate.getHours());
              newStartDate.setMinutes(startDate.getMinutes());
              const newEndDate = new Date(date);
              newEndDate.setHours(endDate.getHours());
              newEndDate.setMinutes(endDate.getMinutes());
              viewEvents.push({
                title: eventName,
                id: eventId,
                allDay,
                meta: { eventDescription, type: eventType,reminder },
                start: newStartDate,
                end: newEndDate,
              });
            });
          }
        });
        this.events = viewEvents;
        this.cdr.detectChanges();
        setTimeout(() => {
          const currentDevice =this.storageService.get(StorageKey.CURRENT_DEVICE);
          const isWeb = currentDevice === ScreenSizeKey.XL_MONITOR ||currentDevice === ScreenSizeKey.WEB_APP;
          if (isWeb) {
            this.eventsListForWeekAndDay(this.viewDate,this.events);
          }
          this.scrollToCurrentView();
        }, 10);
      });
      this.emitEventForParent({startDate: this.viewPeriod.start , endDate: this.viewPeriod.end},'dateChange');
    }
  }

  togglePopover(popover:any , event:any,eventType: string,$event:any) {
    const currentDevice =this.storageService.get(StorageKey.CURRENT_DEVICE);
    const isWeb = currentDevice === ScreenSizeKey.XL_MONITOR ||currentDevice === ScreenSizeKey.WEB_APP;
    switch (true) {
      case eventType ==='over' && isWeb:
        this.openPopover(popover,event);
        (document.querySelector('.caledar-popover') as HTMLElement).style.marginTop = $event.clientY-120+'px';
        (document.querySelector('.caledar-popover') as HTMLElement).style.marginLeft = $event.clientX+'px';
        break;
      case eventType ==='click':
        this.openPopover(popover,event);
        break;
    }
  }

  openPopover(popover:any , event:any){
    if (this.popover&&this.popover.isOpen()) {
      this.popover.close();
    }
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({event});
      this.popover = popover;
    }
  }
  switchDate(type:string) {
    const operationType = type === 'next'? 'add' :'subtract';
    switch (this.view) {
      case 'month':
        this.viewDate= new Date(this.datePicker.selected[0][operationType](1,'M').toISOString());
        break;
      case 'week':
        this.viewDate= new Date(this.datePicker.selected[0][operationType](1,'w').toISOString());
        break;
      case 'day':
        this.viewDate= new Date(this.datePicker.selected[0][operationType](1,'d').toISOString());
        break;
      default:
        break;
    }
  }

  goToPopup(event:any){
    if(event.meta.type !== "self-task"){
      this.modalRef = this.modal.open(PopupGotoComponent, { backdrop: 'static', centered: true, modalDialogClass: 'goto-popup', animation: true });
      this.modalRef.componentInstance.params = event;
      this.modalRef.componentInstance.cancelStatus.subscribe((response: boolean) => {
        if(response){
          this.modalRef.close();
        }
      });
    }
  }

  openEventList(eventData:any){
    this.modalRef = this.modal.open(PopupEventListComponent, { backdrop: 'static', centered: true, modalDialogClass: 'goto-popup', animation: true });
    this.modalRef.componentInstance.params.eventData = eventData;
    this.modalRef.componentInstance.params.activatedRoute = this.activatedRoute;
    this.modalRef.componentInstance.cancelStatus.subscribe((response: boolean) => {
      if(response){
        this.modalRef.close();
      }
    });
  }

  displayEventList(eventData: any){
    const currentDevice =this.storageService.get(StorageKey.CURRENT_DEVICE);
    const isWeb = currentDevice === ScreenSizeKey.XL_MONITOR ||currentDevice === ScreenSizeKey.WEB_APP;
    if (isWeb) {
      this.emitEventForParent(eventData, 'display');
    }
    else{
      this.openEventList(eventData);
    }

  }

  private scrollToCurrentView() {
    if (this.view === CalendarView.Week || this.view ===CalendarView.Day) {
      // each hour is 60px high, so to get the pixels to scroll it's just the amount of minutes since midnight
      const minutesSinceStartOfDay = differenceInMinutes(
        startOfHour(new Date()),
        startOfDay(new Date())
      );
      const headerHeight = 21.400;
      this.elRef.nativeElement.querySelector('.cal-week-view').scrollTop = minutesSinceStartOfDay-headerHeight -20.400;
    }
  }

  emitEventForParent( payload:any , operationType:string){
    const eventData = {payload , operationType: operationType};
    this.emitCalendarEvents.emit(eventData);
  }

  eventsListForWeekAndDay(date:Date , allEvents: any){
    const weekEvents = allEvents.filter((days:any) => `${date.getDate()/date.getMonth()/date.getFullYear()}` >= `${days.start.getDate()/days.start.getMonth()/days.start.getFullYear()}` && `${date.getDate()/date.getMonth()/date.getFullYear()}` <= `${days.end.getDate()/days.end.getMonth()/days.end.getFullYear()}`);
    this.displayEventList({date: date, events: weekEvents });
  }

  editSelfTask(selfTaskId: string): void{
    this.router.navigate([`./manipulate/edit/self-task/${selfTaskId}`], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
  }

  async deleteSelfTask(selfTaskId: string): Promise<void>{
    const confirmation = await this.dialogService.showConfirmDialog({title: {translationKey: 'selfTask.deleteAlert'}});
    if (confirmation) {
      try {
        await this.calendarService.deleteSelfTask(selfTaskId);
        this.storageService.broadcastValue(StorageKey.SELF_TASK_OPERATION,{operationType: 'delete',eventId: selfTaskId});
        this.translateService.get("selfTask.creationAndManipulation.deleteSuccess").subscribe((res: string) => {
          this.showSuccessToast(res);
        });
      } catch (error:any) {
        this.showErrorToast(error.error);
      }
    }
  }

  charactersRemaining(time: number): any{
    return {
      remainder: time
    };
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
}