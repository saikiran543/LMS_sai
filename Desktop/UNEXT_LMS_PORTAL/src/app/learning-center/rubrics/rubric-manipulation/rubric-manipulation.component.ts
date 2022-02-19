/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DialogTypes } from 'src/app/enums/Dialog';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { RubricOperations } from 'src/app/enums/rubricOperations';
import { Service } from 'src/app/enums/service';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { IResponse } from 'src/app/Models/common-interfaces';
import { DialogService } from 'src/app/services/dialog.service';
import { RubricsService } from '../service/rubrics.service';
import { DialogComponent } from './dialog/dialog.component';
import { RubricInformationComponent } from './rubric-information/rubric-information.component';

@Component({
  selector: 'app-rubric-manipulation',
  templateUrl: './rubric-manipulation.component.html',
  styleUrls: ['./rubric-manipulation.component.scss']
})
export class RubricManipulationComponent implements OnInit {
  modelRef!: NgbModalRef;
  firstArr = Array;
  num = 6;
  second = Array;
  no = 10;
  selectedRow: any;
  selectedColumn: any;
  initializeStructure!: boolean
  rubricDetails: any = [];
  rubricLevelsData: any = [];
  rubricTitle!: string;
  courseId!: string;
  operation!: string;
  rubricId!: string;
  rubricOperation!: string;
  status!: string;
  myForm: FormGroup;
  isValid = false;
  isSubmit = true;
  constructor(private activateRoute: ActivatedRoute, private router: Router, private ngbModal: NgbModal, private rubricService: RubricsService, private formBuilder: FormBuilder, private dialogService: DialogService) {
    this.myForm = formBuilder.group({});
  }
  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.courseId = params.courseId;
      this.operation = params.operation;
      this.rubricId = params?.rubricId;
    });
    this.createFormControls();
    this.initializeMethods();
  }
  async initializeMethods() {
    if (this.operation === RubricOperations.CREATE) {
      this.rubricOperation = RubricOperations.CREATE_RUBRIC;
      this.initializeForm();
    } else {
      this.rubricOperation = RubricOperations.EDIT_RUBRIC;
      await this.readRubricDataToEdit();

    }
  }
  createFormControls() {
    this.myForm = new FormGroup({
      rubricTitle: new FormControl('', [Validators.required, CustomValidator.blankSpace, CustomValidator.alphaNumeric])
    });
  }
  initializeForm() {
    const component = DialogComponent;
    this.modelRef = this.openPopup(component,'selection');
    this.modelRef.componentInstance.confirmStatus.subscribe(async (res: any) => {
      if (res.type) {
        this.modelRef.close();
        this.createRubricStructure();
      } else {
        this.modelRef.close();
      }
    });
    this.modelRef.componentInstance.onSelectStructure.subscribe((res: any) => {
      switch (res.type) {
        case RubricOperations.CRITERIA:
          this.selectedRow = Number(res.value);
          this.selectedColumn = Number(res.value1);
          break;
        case RubricOperations.LEVELS:
          this.selectedColumn = Number(res.value);
          this.selectedRow = Number(res.value1);
          break;
        default:
          break;
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  openPopup(component: any,type?:string, params?: any): NgbModalRef {
    let modalDialogClass = '';
    let modelRef;
    if (type === 'selection') {
      modalDialogClass = 'content-builder-modal location-modal rubric-manipulation-modal';
      modelRef = this.ngbModal.open(component, { backdrop: false, size: 'xl', centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
    } else {
      modalDialogClass = 'rubric-information-modal';
      modelRef = this.ngbModal.open(component, { backdrop: true, size: 'xl', centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
    }
    if (params) {
      modelRef.componentInstance.params = params;
    }
    return modelRef;
  }
  openInfo(): void {
    const component = RubricInformationComponent;
    this.modelRef = this.openPopup(component);
    this.modelRef.componentInstance.closeInfoDialog.subscribe(async (res: any) => {
      if (res.type) {
        this.modelRef.close();
      }
    });
  }
  createRubricStructure(): void {
    this.selectedRow;
    this.selectedColumn;
    for (let index = 1; index <= this.selectedColumn; index++) {
      this.rubricLevelsData.push({['L'+ index]: index < 10 ? `level 0${index}` : `level ${index}`});
    }
    for (let index = 1; index <= this.selectedRow; index++) {
      const level: any = [];
      const element = {
        criteriaName: index < 10 ? `Untitled 0${index}` : `Untitled ${index}`,
        weightage: 0,
        levels: {}
      };
      const obj: any = {};
      for (let levelIndex = 1; levelIndex <= this.selectedColumn; levelIndex++) {
        obj['L' + levelIndex] = {description: '', percentage: 0 };
      }
      element["levels"] = obj;
      this.rubricDetails.push(element);
    }
    this.initializeStructure = true;
  }
  async readRubricDataToEdit() {
    const response: IResponse = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, `rubrics/${this.rubricId}`, HttpMethod.GET, '{}');
    if(response.status === 200){
      this.rubricTitle = response.body.title;
      this.status = response.body.status;
      this.rubricDetails = [...response.body.criterias];
      this.rubricLevelsData = [...response.body.levelNames];
      this.initializeStructure = true;
      this.myForm.controls["rubricTitle"].setValue(this.rubricTitle, { emitEvent: false });
    }
  }
  clickEvent(event: any) {
    switch (this.operation) {
      case RubricOperations.CREATE:
        this.createRubric(event);
        break;
      case RubricOperations.EDIT:
        this.updateRubric(event);
        break;
      default:
        break;
    }

  }
  async createRubric(data: any) {
    let message;
    if (this.myForm.invalid) {
      this.isValid = true;
      this.rubricService.showErrorToast(this.rubricService.messagesTranslations.mandatoryFields, 'toast-bottom-right');
    } else if(this.isSubmit){
      this.isSubmit = false;
      try {
        this.isValid = false;
        const payload = { parentId: this.courseId, scope: "course",status: this.status ? this.status : data.status, title: this.rubricTitle, criterias: data.criterias, levelNames: data.levelNames };
        const apiPath = `rubrics/`;
        const response: IResponse = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, apiPath, HttpMethod.POST, payload);
        if(response.status === 200){
          //message = data.status === RubricOperations.ACTIVE ? this.rubricService.messagesTranslations.rubricCreated : this.rubricService.messagesTranslations.rubricDraft;
          if(data.status !== RubricOperations.DRAFT){
            this.rubricService.showSuccessToast(this.rubricService.messagesTranslations.rubricCreated);
          }
          this.routeBackToRubricListPage('../../');
        }
      } catch (error: any) {
        if(error.error === RubricOperations.RUBRIC_DUPLICATE_TITLE_ERROR_MESSAGE){
          message = `${this.rubricTitle} ${this.rubricService.messagesTranslations.rubricDuplicateTitleMessage}`;
        }else{
          message = error.error;
        }
        this.rubricService.showErrorToast(message, 'toast-top-center');
      }
    }
  }
  async updateRubric(data: any) {
    let message;
    if (this.myForm.invalid) {
      this.rubricService.showErrorToast(this.rubricService.messagesTranslations.mandatoryFields, 'toast-bottom-right');
    } else {
      try {
        const payload = { status: data.status, title: this.rubricTitle, criterias: data.criterias, levelNames: data.levelNames };
        const response: IResponse = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, `rubrics/${this.rubricId}`, HttpMethod.PUT, payload);
        if(response.status === 200){
          message = `${this.rubricTitle} ${this.rubricService.messagesTranslations.rubricUpdate}`;
          this.rubricService.showSuccessToast(message);
          this.routeBackToRubricListPage('../../../');
        }
      } catch (error: any) {
        if(error.error === RubricOperations.RUBRIC_DUPLICATE_TITLE_ERROR_MESSAGE){
          message = `${this.rubricTitle} ${this.rubricService.messagesTranslations.rubricDuplicateTitleMessage}`;
        }else{
          message = error.error;
        }
        this.rubricService.showErrorToast(message, 'toast-top-center');
      }
    }
  }
  routeBackToRubricListPage(params: string) {
    //const params = this.operation === 'edit'? '../../../': '../../';
    this.router.navigate([params], { relativeTo: this.activateRoute, queryParams: { leftMenu: "true", id: "learning-center", courseDropDown: "true", toc: "false" } });
  }
  ngOnDestroy(){
    this.modelRef?.close();
  }
  validateTitle(event: any): void {
    if(this.myForm.invalid && event.invalid){
      this.isValid = true;
    }
  }
}
