/* eslint-disable @typescript-eslint/explicit-module-boundary-types*/
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupGotoComponent } from './popup-goto/popup-goto.component';
import { CalendarEvents } from 'src/app/Models/common-interfaces';
import { CalendarService } from './service/calendar.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { ScreenSizeKey } from 'src/app/enums/screenSizeKey';
import { DialogService } from 'src/app/services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  dayEvent: any = {
    payload: {date: new Date()}
  }
 
  eventTypes: any = { 'quiz': true, 'assignment': true, 'survey': true, 'discussion-forum': true, 'self-task': true, 'live-classroom': true };
  // eslint-disable-next-line max-params
  constructor(private modal: NgbModal, private router: Router, private activatedRoute: ActivatedRoute , private calendarService: CalendarService , private routeOperationService : RouteOperationService, private storageService: StorageService,private dialogService : DialogService, private translateService : TranslateService, private toastService : ToastrService) { }
  public isCollapsed = true;
  public isCollapsedone = true;
  isSelectedAll = true;
  courseId!: string;
  periodStart:any;
  periodEnd:any;
  private unsubscribe$ = new Subject<void>();
  modalRef!: NgbModalRef;
  calendarEvent:any = [];
  $calendarEvents = new Subject<CalendarEvents[]>();
  popover!:any;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async ngOnInit(): Promise<void> {
    document.querySelector("body")?.classList.add("calendar-page");
    this.routeOperationService.listenParams().pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.courseId = params.courseId;
    });

    this.storageService.listen(StorageKey.SELF_TASK_OPERATION).subscribe((eventPayload:any)=>{
      this.addOrUpdateEvent(eventPayload);
    });
  }

  addOrUpdateEvent(eventPayload:any){
    const selfTask = eventPayload.payLoad;
    switch (eventPayload.operationType) {
      case 'create':{
        const event:any = {};
        event['eventName'] = selfTask['title'];
        event['eventDescription'] = selfTask['description'];
        event['startDate'] = selfTask['startDate'];
        event['endDate'] = selfTask['endDate'];
        event['allDay'] = selfTask['allDay'];
        event['reminder'] = selfTask['reminderInMinutes'];
        event['recurrance'] = selfTask['rrule'];
        event['eventType'] = 'self-task';
        this.calendarEvent.push(event);
      }
        break;
      case 'edit':{
        const event:any = this.calendarEvent.find((event:any)=>event.eventId === selfTask.eventId);
        if (event) {
          event['eventName'] = selfTask['title'];
          event['eventDescription'] = selfTask['description'];
          event['startDate'] = selfTask['startDate'];
          event['endDate'] = selfTask['endDate'];
          event['allDay'] = selfTask['allDay'];
          event['reminder'] = selfTask['reminderInMinutes'];
          event['recurrance'] = selfTask['rrule'];
        }
      }
        break;
      case 'delete':
        this.calendarEvent = this.calendarEvent.filter((event:any)=> {
          return event.eventId !== eventPayload.eventId;
        });
        break;
      default:
        break;
    }
  
    this.$calendarEvents.next(this.calendarEvent);
  }
  ngOnDestroy(): void{
    document.querySelector("body")?.classList.remove("calendar-page");
  }

  click(): void {
    this.router.navigate([`./manipulate/create/self-task`], { relativeTo: this.activatedRoute });
  }

  async displayEvents(event: any) {
    let payload: any;
    switch (event.operationType) {
      case 'dateChange':
        this.periodStart = new Date(event.payload.startDate).toISOString() ;
        this.periodEnd = new Date(event.payload.endDate).toISOString() ;
        await this.readCalendarEvents(this.periodStart, this.periodEnd);
        // eslint-disable-next-line no-console
        console.log(payload);
        break;
      case 'display':
        this.dayEvent = event;
        // eslint-disable-next-line no-console
        console.log(event);
        break;
      default:
        break;
    }
  }

  goToPopup(event: any) {
    if (event.meta.type !== "self-task") {
      this.modalRef = this.modal.open(PopupGotoComponent, { backdrop: 'static', centered: true, modalDialogClass: 'goto-popup', animation: true });
      this.modalRef.componentInstance.params = event;
      this.modalRef.componentInstance.cancelStatus.subscribe((response: boolean) => {
        if (response) {
          this.modalRef.close();
        }
      });
    }
  }

  editSelfTask(selfTaskId: string): void{
    this.router.navigate([`./manipulate/edit/self-task/${selfTaskId}`], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
  }

  charactersRemaining(time: number): any{
    return {
      remainder: time
    };
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

  togglePopover(popover:any , event:any,eventType: string) {
    const currentDevice =this.storageService.get(StorageKey.CURRENT_DEVICE);
    const isWeb = currentDevice === ScreenSizeKey.XL_MONITOR ||currentDevice === ScreenSizeKey.WEB_APP;
    switch (true) {
      case eventType ==='over' && isWeb:
        this.openPopover(popover,event);
        break;
      case eventType ==='leave' && isWeb:
        if (popover.isOpen()) {
          popover.close();
        }
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
  async filterEvents($event: any, type: any) {
    if (type === "selectAll") {
      this.isSelectedAll = $event.target.checked;
      for (const key in this.eventTypes) {
        this.eventTypes[key] = this.isSelectedAll;
      }
    }
    else{
      this.eventTypes[type] = $event.target.checked;
      let selectedAll = true;
      for (const key in this.eventTypes) {
        if (!this.eventTypes[key]) {
          selectedAll = false;
          break;
        }
      }
      this.isSelectedAll = selectedAll;
    }
    await this.readCalendarEvents(this.periodStart, this.periodEnd);
  }

  async readCalendarEvents(startDate:string, endDate:string){
    let types = '';
    Object.keys(this.eventTypes).forEach(key =>{
      if(this.eventTypes[key]){
        types+= '&eventType='+key;
      }
    });
    if(types){
      const {body} = await this.calendarService.fetchCalendarEvents(this.courseId,startDate, endDate,types);
      this.calendarEvent = body;
    }
    else{
      this.calendarEvent = [];
    }
    this.$calendarEvents.next(this.calendarEvent);
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

