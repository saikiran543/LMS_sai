/* eslint-disable @typescript-eslint/no-explicit-any */
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { LearningOutcomeListViewComponent } from '../learning-outcome-list-view/learning-outcome-list-view.component';
@Component({
  selector: 'app-add-learning-objective',
  templateUrl: './add-learning-objective.component.html',
  styleUrls: ['./add-learning-objective.component.scss']
})
export class AddLearningObjectiveComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  private isInitialized!: boolean;
  modalRef!: NgbModalRef;
  constructor(private location: Location, private activatedRoute: ActivatedRoute, private ngbModal: NgbModal, private routeOperation: RouteOperationService) { }
  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.routeOperation.listenParams().pipe(takeUntil(this.unsubscribe$)).subscribe((res:any) => {
      if(!this.isInitialized){
        this.initializeForm(res.viewType);
        this.isInitialized = true;
      }
    });
  }
  private initializeForm(viewType:string): void {
    const modalDialogClass = 'add-learning-objective-modal';
    this.modalRef = this.ngbModal.open(LearningOutcomeListViewComponent, { backdrop: false, centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
    this.modalRef.componentInstance.params.activatedRoute = this.activatedRoute;
    this.modalRef.componentInstance.params.viewType = viewType;
    this.modalRef.componentInstance.confirmStatus.subscribe(async (res: any) => {
      this.modalRef.close();
      if(res.type === 'addLearningObjective'){
        this.modalRef = this.ngbModal.open(LearningOutcomeListViewComponent, { backdrop: false, centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
        this.modalRef.componentInstance.params.activatedRoute = this.activatedRoute;
        this.modalRef.componentInstance.params.viewType = res.type;
        this.modalRef.componentInstance.confirmStatus.subscribe(async () => {
          this.modalRef.close();
          this.location.back();
        });
      }else{
        this.location.back();
      }
    });
  }

  ngOnDestroy():void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.modalRef.close();
  }
}