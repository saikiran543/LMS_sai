/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import { DialogService } from 'src/app/services/dialog.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { PopupGotoComponent } from '../popup-goto/popup-goto.component';
import { ToastrService } from 'ngx-toastr';
import { CalendarService } from '../service/calendar.service';

@Component({
  selector: 'app-popup-event-list',
  templateUrl: './popup-event-list.component.html',
  styleUrls: ['./popup-event-list.component.scss']
})
export class PopupEventListComponent {
  $unsubscribe = new Subject<void>();
  courseId!: string;
  constructor(private calendarService: CalendarService ,private modal: NgbModal, private routeOperation: RouteOperationService,private router: Router, private activatedRoute: ActivatedRoute ,private storageService: StorageService,private dialogService : DialogService, private translateService : TranslateService, private toastService : ToastrService) { }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any = {};
  modalRef!: NgbModalRef;
  popover!:any;
  @Output() cancelStatus = new EventEmitter()

  ngOnInit(): void {
    this.routeOperation.listen('courseId').pipe(takeUntil(this.$unsubscribe)).subscribe(courseId=>{
      this.courseId = courseId;
    });
  }

  goToPopup(event: any) {
    if (event.meta.type !== "self-task") {
      this.modalRef = this.modal.open(PopupGotoComponent, { backdrop: 'static', centered: true, modalDialogClass: 'goto-popup', animation: true });
      this.modalRef.componentInstance.params = event;
      this.modalRef.componentInstance.cancelStatus.subscribe((response: boolean) => {
        if (response) {
          this.modalRef.close();
          this.closePopup();
        }
      });
    }
  }

  closePopup(){
    this.cancelStatus.emit(true);
  }

  editSelfTask(selfTaskId: string): void{
    this.router.navigate([`./manipulate/edit/self-task/${selfTaskId}`], { relativeTo: this.params.activatedRoute, queryParamsHandling: 'preserve' });
    this.closePopup();
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
