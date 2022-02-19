/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { RubricOperations } from 'src/app/enums/rubricOperations';
import { Service } from 'src/app/enums/service';
import { StorageKey } from 'src/app/enums/storageKey';
import { IResponse } from 'src/app/Models/common-interfaces';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { RubricPreviewComponent } from '../../rubric-preview/rubric-preview.component';
import { RubricsService } from '../../service/rubrics.service';

@Component({
  selector: 'app-rubric-list-dialog',
  templateUrl: './rubric-list-dialog.component.html',
  styleUrls: ['./rubric-list-dialog.component.scss']
})
export class RubricListDialogComponent implements OnInit {
  rubricLevelType!: string;
  courseId!: string;
  selectedRubric!: any;
  rows: any = [];
  totalRecords!: number;
  operation!: string;
  params: any = {};
  modalRef!:NgbModalRef;
  @Output() confirmStatus = new EventEmitter()
  constructor(private rubricService: RubricsService, private routeOperationService: RouteOperationService, private activateRoute: ActivatedRoute, private router: Router, private ngbModal: NgbModal, private storageService: StorageService) { }

  ngOnInit(): void {
    this.routeOperationService.listenParams().subscribe(params => {
      this.operation = params.operation;
      this.rubricLevelType = params.type;
      this.courseId = params.courseId;
    });
    this.readRubrics();
  }
  ClickEvent(event:any): void{
    switch (event) {
      case RubricOperations.COURSE_LEVEL:
        this.rubricLevelType = "course";
        this.onRouteAndReadData();
        break;
      case RubricOperations.PROGRAM_LEVEL:
        this.rubricLevelType = RubricOperations.PROGRAM;
        this.onRouteAndReadData();
        break;
      case RubricOperations.CLOSE:
        this.closeDialog();
        break;
      case RubricOperations.ATTACH_RUBRIC:
        this.openAttachRubricDialog();
        break;
      default:
        break;
    }
  }
  onRouteAndReadData(): void{
    this.rows = [];
    this.readRubrics();
  }
  async readRubrics(): Promise<void>{
    const response: IResponse = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, `rubrics?scope=${this.rubricLevelType}&parentId=${this.courseId}&page=1&size=20`, HttpMethod.GET, '{}');
    if(response.status === 200){
      this.rows.push(...this.removeDraftStatusRubrics(response.body.rubrics));
      this.totalRecords = response.body.total;
    }
  }
  removeDraftStatusRubrics(rubrics: any): any{
    const filteredRubrics: any = [];
    rubrics.forEach((rubric: any) => {
      if(rubric.status !== 'draft'){
        filteredRubrics.push(rubric);
      }
    });
    return filteredRubrics;
  }
  closeDialog(){
    this.confirmStatus.emit();
  }
  onClickView(event: any){
    this.initializeForm(event);
  }

  onSelectRubric(rubric: any) {
    this.selectedRubric = rubric;
  }
  openAttachRubricDialog(){
    const {selectedRubric} = this;
    if(selectedRubric) {
      this.storageService.broadcastValue(StorageKey.ATTACHED_RUBRIC, selectedRubric);
      this.confirmStatus.emit();
    }
  }
  initializeForm(params: any): void {
    const component = RubricPreviewComponent;
    this.modalRef = this.openPopup(component, params);
    this.modalRef.componentInstance.confirmStatus.subscribe(() => {
      this.modalRef.close();
    });
  }
  openPopup(component: any, params?: any): NgbModalRef {
    let modalDialogClass = '';
    switch (component) {
      case RubricPreviewComponent:
        modalDialogClass = 'rubric-preview-model';
        break;
      default:
        break;
    }
    const modelRef = this.ngbModal.open(component, { backdrop: 'static', centered: false, modalDialogClass: modalDialogClass, animation: true });
    if(params){
      modelRef.componentInstance.params = params;
      modelRef.componentInstance.params.activatedRoute = this.activateRoute;
      modelRef.componentInstance.params.isSelection = true;
    }
    return modelRef;
  }
  ngOnDestroy(){
    this.modalRef?.close();
  }
}
