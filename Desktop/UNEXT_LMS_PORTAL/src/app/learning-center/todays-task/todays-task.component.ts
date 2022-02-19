/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StorageKey } from 'src/app/enums/storageKey';
import { StorageService } from 'src/app/services/storage.service';
import { PopupSelfTaskComponent } from '../calendar/popup-self-task/popup-self-task.component';
import { TodaysTaskService } from './service/todays-task.service';

@Component({
  selector: 'app-todays-task',
  templateUrl: './todays-task.component.html',
  styleUrls: ['./todays-task.component.scss']
})
export class TodaysTaskComponent implements OnInit {

  todaysPendingTasks: any;
  todaysCompletedTasks: any;
  today = new Date().toJSON();
  courseId: any;
  view: any;
  idQueryParams: any;
  modalRef!: NgbModalRef;

  constructor(private modal: NgbModal,private activateRoute: ActivatedRoute, private todaysTaskService: TodaysTaskService, private router: Router , private storageService: StorageService) { }

  async ngOnInit() {
    this.view = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    this.activateRoute.params.subscribe(params => {
      this.courseId = params.courseId;
    });
    const startDateTime = new Date();
    startDateTime.setHours(0);
    startDateTime.setMinutes(0);
    startDateTime.setSeconds(0);
    startDateTime.setMilliseconds(0);
    const endDateTime = new Date();
    endDateTime.setHours(23);
    endDateTime.setMinutes(59);
    endDateTime.setSeconds(59);
    endDateTime.setMilliseconds(59);
    const start = startDateTime.toJSON();
    const end = endDateTime.toJSON();
    this.getTodaysPendingTasks(start,end);
    this.getTodaysCompletedTasks(start,end);
    this.idQueryParams = await this.activateRoute.snapshot.queryParams.id;
  }

  async getTodaysPendingTasks(start:string,end:string){
    this.todaysPendingTasks = await this.todaysTaskService.getTodaysTasks(this.courseId,start,end, "pending");
  }

  async getTodaysCompletedTasks(start:string,end:string){
    this.todaysCompletedTasks = await this.todaysTaskService.getTodaysTasks(this.courseId,start,end, "completed");
  }

  goToContent(task:any){
    let eventName: any;
    switch(task.eventType) {
      case "discussion-forum":
        eventName = 'discussion-forums';
        this.router.navigate([`../../../learning-center/${this.courseId}/${eventName}/forum-detail/${task.eventId}`], { relativeTo: this.activateRoute, queryParams: { leftMenu: true, id: this.idQueryParams, courseDropDown: true, toc: false }, queryParamsHandling: '' });
        break;
      case "self-task":
        this.modalRef = this.modal.open(PopupSelfTaskComponent, { backdrop: 'static', centered: true, modalDialogClass: 'self-task-popup', animation: true });
        this.modalRef.componentInstance.params = task;
        this.modalRef.componentInstance.cancelStatus.subscribe((response: boolean) => {
          if (response) {
            this.modalRef.close();
          }
        });
    }
  }

  ngOnDestroy(){
    if(this.modalRef){
      this.modalRef.close();
    }
  }

}
