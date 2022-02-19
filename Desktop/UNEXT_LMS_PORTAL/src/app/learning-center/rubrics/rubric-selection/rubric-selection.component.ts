/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RubricOperations } from 'src/app/enums/rubricOperations';
import { RubricsService } from '../service/rubrics.service';
import { RubricListDialogComponent } from './rubric-list-dialog/rubric-list-dialog.component';

@Component({
  selector: 'app-rubric-selection',
  templateUrl: './rubric-selection.component.html',
  styleUrls: ['./rubric-selection.component.scss']
})
export class RubricSelectionComponent implements OnInit {
  courseId: any;
  rubricLevelType: any;
  rows : any = [];
  ContextMenuOperation: any = [];
  totalRecords!: number
  modalRef!:NgbModalRef;
  previousSelectRubric!: any;
  constructor(private activateRoute: ActivatedRoute, private router: Router, private rubricService: RubricsService, private ngbModal: NgbModal, private location: Location) {
    this.previousSelectRubric = this.router?.getCurrentNavigation()?.extras?.state?.previousSelectedRubric;
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.rubricLevelType = params.type;
      this.courseId = params.courseId;
      this.initializeForm(params);
    });
  }
  initializeForm(params: any): void {
    let component: any = null;
    switch (params.rubricOperation) {
      case RubricOperations.SELECTION:
        component = RubricListDialogComponent;
        break;
    }
    this.modalRef = this.openPopup(component);
    this.modalRef.componentInstance.confirmStatus.subscribe(() => {
      this.modalRef.close();
      this.location.back();
    });
  }
  openPopup(component: any): NgbModalRef {
    let modalDialogClass = '';
    modalDialogClass = 'rubric-selection-model';
    const modelRef = this.ngbModal.open(component, { backdrop: 'static', centered: false, modalDialogClass: modalDialogClass, animation: true });
    modelRef.componentInstance.params.activatedRoute = this.activateRoute;
    modelRef.componentInstance.params.previousSelectedRubric = this.previousSelectRubric;
    return modelRef;
  }
  ngOnDestroy(){
    this.modalRef.close();
  }
}
