/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { DialogService } from 'src/app/services/dialog.service';
import { ToastrService } from 'ngx-toastr';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { LearningOutcomeService } from '../../service/learning-outcome.service';
import { Service } from 'src/app/enums/service';
import { LearningOutcomeTypes } from 'src/app/enums/learning-outcome';
import { ICommonBody, ILearningOutComeResponse } from 'src/app/Models/common-interfaces';

@Component({
  selector: 'app-learning-outcome-model',
  templateUrl: './learning-outcome-model.component.html',
  styleUrls: ['./learning-outcome-model.component.scss']
})
export class LearningOutcomeModelComponent implements OnInit {
  @Output() confirmStatus = new EventEmitter();
  private unsubscribe$ = new Subject<void>();
  isInitialized! : boolean;
  outcomeForm!: FormGroup;
  type!: string;
  formTitle!: string;
  supportTextLengthMax = 500;
  courseId!:string;
  elementId!:string;
  parentId!:string;
  operation!:string;
  activityBtnDisabled = false;
  contentBtnDisabled = false;
  applicableHoverMessage:string[] = [];
  statusHoverMessage:string[] = [];
  inUse = false;
  originalStatus!: string;
  showInfoIconStatus =false;
  showInfoIconApplicableTo=false;
  statusBtnDisabled = false;
  showApplicableTooltip= false;
  showStatusTooltip=false;
  isValid = false;
  canSubmit = true;

  // eslint-disable-next-line max-params
  constructor(private translate: TranslateService,
    private routeOperation: RouteOperationService,
    private learningOutcomeService: LearningOutcomeService,
    private storageService: StorageService,
    private dialogService: DialogService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.routeOperation.listenParams().pipe(takeUntil(this.unsubscribe$)).subscribe(params=>{
      this.elementId = params.id;
      this.parentId = params.parentId;
      this.courseId = params.courseId;
      this.operation = params.operation;
      if(!this.isInitialized){
        this.initializeForm(params);
      }
      if(this.operation==="edit"){
        this.getFormDetails(this.type,params.id);
      }
      else{
        this.getStatusHoverMessage();
      }
    });
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  initializeForm(params:any):void{
    this.type = params.formType;
    this.initializeFormTitle(this.type);
    this.outcomeForm = this.createFormGroup(this.type);
    this.isInitialized = true;
  }

  initializeFormTitle(type:string) : void{
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
        this.formTitle = 'Learning Outcome';
        break;
      case LearningOutcomeTypes.CATEGORY:
        this.formTitle = 'Category';
        break;
      case LearningOutcomeTypes.OBJECTIVE:
        this.formTitle = 'Learning Objective';
        break;
      default:
        break;
    }
  }

  createFormGroup(type:string): FormGroup{
    const formGroup = new FormGroup({
      title: new FormControl('', [Validators.required, CustomValidator.blankSpace, CustomValidator.alphaNumeric]),
      description: new FormControl()
    });
    if (type === 'learning-objective') {
      formGroup.addControl('status',new FormControl('inactive'));
      formGroup.addControl('applicableTo',new FormControl('both'));
    }
    return formGroup;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  public sendConfirmStatus(value:any): void {
    this.confirmStatus.emit(value);
  }

  async onSave():Promise<void>{
    if(this.canSubmit){
      this.canSubmit = false;
      if(this.outcomeForm.valid){
        this.isValid = false;
        if(this.operation==="create"){
          await this.createLearningOutcome();
          return;
        }
        await this.editLearningOutcome();
      }else{
        this.isValid = true;
        this.showErrorToast(this.learningOutcomeService.messagesTranslations.completeMandatoryFields);
      }
    }
   
  }

  showSucessToast(message:string):void{
    this.toastrService.success(message, '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }

  showErrorToast(message:string):void{
    this.toastrService.error(message, '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }
  
  getToastMessageForCreate():string{
    let message = "";
    switch (this.type) {
      case LearningOutcomeTypes.OUTCOME:
        message = this.learningOutcomeService.messagesTranslations.outcomeCreatedToast;
        break;
      case LearningOutcomeTypes.CATEGORY:
        message = this.learningOutcomeService.messagesTranslations.categoryCreatedToast;
        break;
      case LearningOutcomeTypes.OBJECTIVE:
        message = this.learningOutcomeService.messagesTranslations.objectiveCreatedToast;
        break;
      default:
        break;
    }
    return message;
  }

  getToastMessageForEdit():string{
    let message = "";
    switch (this.type) {
      case LearningOutcomeTypes.OUTCOME:
        message = this.learningOutcomeService.messagesTranslations.outcomeEditedToast;
        break;
      case LearningOutcomeTypes.CATEGORY:
        message = this.learningOutcomeService.messagesTranslations.categoryEditedToast;
        break;
      case LearningOutcomeTypes.OBJECTIVE:
        message = this.learningOutcomeService.messagesTranslations.objectiveEditedToast;
        break;
      default:
        break;
    }
    return message;
  }

  async createLearningOutcome():Promise<void>{
    let payload ={
      parentId: this.parentId,
      scope: "course",
    };
    this.outcomeForm.value.description = this.outcomeForm.value.description ? this.outcomeForm.value.description :'';
    payload = {...payload,...this.outcomeForm.value};
    try {
      const responce: ILearningOutComeResponse = await this.learningOutcomeService.create(this.type,this.parentId, payload);
      if (responce.status === 200) {
        const body: ICommonBody = responce.body;
        this.sendConfirmStatus(true);
        const message = this.getToastMessageForCreate();
        this.showSucessToast(message);
        this.storageService.broadcastValue('createdElement',{element: body, type: this.type});
      }
    // eslint-disable-next-line no-empty
    } catch (err:any) {
      this.showErrorToast(err.error);
      this.canSubmit = true;
    }
  }

  async getFormDetails(type:string,id:string):Promise<void>{
    const res = await this.learningOutcomeService.get(Service.COURSE_SERVICE,type,id,this.courseId);
    this.outcomeForm.patchValue(res);
    this.inUse = res.elements.length>0;
    if (type === 'learning-objective') {
      this.outcomeForm.controls['applicableTo'].setValue(res.canBeLinkedTo);
      this.inUse && this.getApplicableToHoverMessage(res.elements,res.canBeLinkedTo);
      this.inUse && this.showStatusMessageForInUse();
      !this.inUse && this.getStatusHoverMessage();
    }
  }

  async editLearningOutcome():Promise<void>{
    let payload ={
      parentId: this.parentId,
      elementId: this.elementId,
      scope: "course"
    };
    this.inUse && this.setStatusToDefault();
    payload = {...payload,...this.outcomeForm.value};
    try{
      const responce: ILearningOutComeResponse = await this.learningOutcomeService.edit(this.elementId,this.parentId,this.type, payload,this.courseId);
      if (responce.status === 200) {
        const body: ICommonBody = responce.body;
        this.sendConfirmStatus(true);
        const message = this.getToastMessageForEdit();
        this.showSucessToast(message);
        this.storageService.broadcastValue('updatedElement',{element: body, type: this.type});
      }
    }
    catch (err:any) {
      this.showErrorToast(err.error);
      this.canSubmit = true;
    }
   
  }

  setStatusToDefault():void{
    this.outcomeForm.controls['status'].setValue(this.originalStatus);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getApplicableToHoverMessage(elements: any,applicableTo: string):void{
    this.showInfoIconApplicableTo=true;
    switch(applicableTo){
      case "content":
        this.activityBtnDisabled = true;
        this.contentBtnDisabled = false;
        this.applicableHoverMessage[0] = this.learningOutcomeService.hoverMessageTranslations.applicableToContentMessage1;
        this.applicableHoverMessage[1] = this.learningOutcomeService.hoverMessageTranslations.applicableToContentMessage2;
        break;
    
      case "activity":
        this.contentBtnDisabled = true;
        this.activityBtnDisabled=false;
        this.applicableHoverMessage[0] = this.learningOutcomeService.hoverMessageTranslations.applicableToActivityMessage1;
        this.applicableHoverMessage[1] = this.learningOutcomeService.hoverMessageTranslations.applicableToActivityMessage2;
        break;
      
      case "both":
      {
        this.activityBtnDisabled = this.isContentLinked(elements);
        this.contentBtnDisabled = this.isActivityLinked(elements);
        this.applicableHoverMessage[0]= this.learningOutcomeService.hoverMessageTranslations.applicableToBothMessage;
        break;
      }
      default:
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  isContentLinked(elements: any):boolean{
    const contents = this.filterContentOrActivity(elements,"content");
    return contents.length>0;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  isActivityLinked(elements: any):boolean{
    const activities = this.filterContentOrActivity(elements,"activity");
    return activities.length>0;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  filterContentOrActivity(elements: any,applicableTo: string):any{
    return elements.filter((element: any) => element.type === applicableTo);
  }

  showStatusMessageForInUse():void{
    this.showInfoIconStatus = true;
    this.statusBtnDisabled = true;
    this.statusHoverMessage[0]= this.learningOutcomeService.hoverMessageTranslations.statusMessageForInUse;
    this.originalStatus = this.outcomeForm.value.status;
    this.outcomeForm.controls['status'].setValue("");
  }

  getStatusHoverMessage():void{
    this.showInfoIconStatus=true;
    this.statusHoverMessage[0]=this.learningOutcomeService.hoverMessageTranslations.statusMessage1;
    this.statusHoverMessage[1]=this.learningOutcomeService.hoverMessageTranslations.statusMessage2;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  charactersRemaining(){
    return {
      length: this.supportTextLengthMax - this.outcomeForm.value.title.length
    };
  }

  ngOnDestroy(): void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
