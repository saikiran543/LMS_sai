/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import moment, {Moment} from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { DialogTypes } from 'src/app/enums/Dialog';
import { StorageKey } from 'src/app/enums/storageKey';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { ContentBuilderService } from 'src/app/learning-center/course-services/content-builder.service';
import { ActivityContent, ContentService } from 'src/app/learning-center/course-services/content.service';
import { CreateDiscussionForumPayload, EditDiscussionForumPayload } from 'src/app/learning-center/course-services/discussion-forum.service';
import { LearningOutcomeService } from 'src/app/learning-center/learning-outcome/service/learning-outcome.service';
import { RubricsService } from 'src/app/learning-center/rubrics/service/rubrics.service';
import { Dialog } from 'src/app/Models/Dialog';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DialogService } from 'src/app/services/dialog.service';
import { StorageService } from 'src/app/services/storage.service';
import { ForumType } from 'src/app/enums/forumType';
import { ForumInfoPopupComponent } from './forum-info-popup/forum-info-popup.component';
import { ElementStatuses } from 'src/app/enums/ElementStatuses';

interface Params {
  courseId?: string,
  operation?: string,
  parentElementId?: string,
  forumType?: string,
  id?: string
  currentActivtedRoute?: ActivatedRoute
}

enum SubmitActionTypes {
  SAVE = 'save',
  DRAFT = 'draft',
  CANCEL = 'cancel',
}

/**
 *
 *
 * @export
 * @class DiscussionComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {

  params: Params = {} as Params;

  discussionTitleLengthText = '';
  discussionTitleMaxLength = 500;

  submitted = false;

  fileDetails = {
    s3FileName: '',
    originalFileName: '',
    fileExtension: '',
    fileUrl: '',
  }

  selectedFile: File | null = null;
  showFileUpload = true;
  isFileSelected = false;
  isFileUploaded = false;
  saveDisabled = false;
  selectedFileName = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedRubric: any = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedLearningObjectives: any = [];

  fileUploadPercentage = 0;
  acceptedFileTypes = '';
  isObjectiveAttached!:boolean;
  showDiscussionComponent = true;
  showForumInfoPopup = false;
  disableGradedSwitch = false;
  showMandatoryToast = false;
  mandatoryToastTimeoutId!: NodeJS.Timeout;
  editActivityContent: ActivityContent | null = null;

  unsubscribeAttachRubricListener$ = new Subject<void>()
  unsubscribeAttachObjectivesListener$ = new Subject<void>()
  unsubscribeActivityStatusListener$ = new Subject<void>()
  
  discussionForm = new FormGroup({
    type: new FormControl(ForumType.STANDARD_DISCUSSION_FORUM),
    title: new FormControl("", [Validators.required, CustomValidator.blankSpace, CustomValidator.alphaNumeric]),
    description: new FormControl(""),
    graded: new FormControl(false),
    sendEmailNotification: new FormControl(true),
    visibilityCriteria: new FormControl(false),
    learningObjectives: new FormControl(null),
    activityStatus: new FormControl('mandatory'),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  @Output() confirmStatus = new EventEmitter();

  gradedForumFormControls: {
    name: string,
    defaultValue?: string | number | Date | Moment,
    controls: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null | undefined,
  }[] = [{
    name: 'maxMarks',
    defaultValue: 0,
    controls: [Validators.required, Validators.min(1), CustomValidator.minLessThanOrEqualToMax('passMarks', 'maxMarks', {passMarkError: true})],
  }, {
    name: 'passMarks',
    defaultValue: 0,
    controls: [Validators.required, Validators.min(1), CustomValidator.minLessThanOrEqualToMax('passMarks', 'maxMarks', {passMarkError: true})],
  }, {
    name: 'rubricId',
    defaultValue: '',
    controls: [Validators.required],
  }, {
    name: 'startDate',
    // defaultValue: moment(),
    controls: [Validators.required]
  }, {
    name: 'endDate',
    // defaultValue: moment(),
    controls: [Validators.required]
  }];

  /**
   * Creates an instance of DiscussionComponent.
   * @param {TranslateService} translationService
   * @memberof DiscussionComponent
   */
  // eslint-disable-next-line max-params
  constructor(
    private translationService: TranslateService,
    private contentService: ContentService,
    private learingOutcomeService: LearningOutcomeService,
    private dialogService: DialogService,
    private rubricsService: RubricsService,
    private storageService: StorageService,
    private configuration: ConfigurationService,
    private contentBuilderService: ContentBuilderService,
    private ngbModal: NgbModal,
    private router: Router,
    private toastService: ToastrService
  ) {}

  /**
   *
   *
   * @memberof DiscussionComponent
   */
  ngOnInit(): void {
    this.loadDependencies();
    this.listenToStorageService();
  }

  /**
   *
   *
   * @private
   * @memberof DiscussionComponent
   */
  private loadDependencies() {
    const {forumType} = this.params;

    this.setAcceptedFileTypes();
        
    this.setDefaultCharLength();
    this.showCharacterLeft();

    this.handleGradedSwitch();

    if(forumType) {
      const type = forumType === 'doubt-clarification-forum' ? ForumType.DOUBT_CLARIFICATION_FORUM : ForumType.STANDARD_DISCUSSION_FORUM;
      this.discussionForm.controls.type.setValue(type);
    }

    if(this.params.operation === 'edit') {
      if (this.params.id) {
        this.getObjectiveDetails(this.params.id);
      }
      this.loadActivityContent();
    }
  }

  async getObjectiveDetails(elementId:string) : Promise<void>{
    const res = await this.contentService.getLearningObjectives(elementId);
    if(res.body && res.body.length>0){
      this.isObjectiveAttached = true;
    }
  }

  /**
   *
   *
   * @private
   * @memberof DiscussionComponent
   */
  private listenToStorageService() {
    this.storageService.listen(StorageKey.ATTACHED_RUBRIC).pipe(takeUntil(this.unsubscribeAttachRubricListener$)).subscribe((rubric) => {
      this.onRubricAttachment(rubric);
    });
    this.storageService.listen('attachedObjectives').pipe(takeUntil(this.unsubscribeAttachObjectivesListener$)).subscribe((attachedObjectives) => {
      try {
        this.isObjectiveAttached = this.storageService.get('availableObjective');
        this.storageService.delete('availableObjective');
      // eslint-disable-next-line no-empty
      }catch{
      }
      this.onLearningObjectivesAttachement(attachedObjectives);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onRubricAttachment(rubric: any) {
    this.showDiscussionComponent = true;
    this.selectedRubric = rubric;
    this.discussionForm.controls.rubricId?.setValue(rubric.rubricId);
    this.router.navigate(['./'], {relativeTo: this.params.currentActivtedRoute, queryParamsHandling: "merge", replaceUrl: true, state: {
      preventReinitilizing: true
    }});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onLearningObjectivesAttachement(learningObjectives: any) {
    if(Object.keys(learningObjectives).length) {
      this.showDiscussionComponent = true;
      this.setSelectedLearningObjectives(learningObjectives);
      this.discussionForm.controls.learningObjectives.setValue(learningObjectives);
      this.router.navigate(['./'], {relativeTo: this.params.currentActivtedRoute, queryParamsHandling: "merge", replaceUrl: true, state: {
        preventReinitilizing: true,
      }});
    }
  }

  private setSelectedLearningObjectives(learningObjectives: any) {
    this.selectedLearningObjectives = Object.keys(learningObjectives).map((objectiveId) => ({
      objectiveId,
      evaluationCriteria: learningObjectives[objectiveId].evaluationCriteria,
    }));
  }
  
  /**
   *
   *
   * @private
   * @memberof DiscussionComponent
   */
  private async loadActivityContent() {
    const elementId = this.params.id;
    const courseId = this.params.courseId;
    if(courseId && elementId) {
      const activityData = await this.contentService.fetchActivityContent(courseId, elementId);
      this.discussionFormControls.title.setValue(activityData.activitymetadata[0].title);
      this.discussionFormControls.description.setValue(activityData.activitymetadata[0].description || '');
      this.discussionFormControls.sendEmailNotification.setValue(activityData.activitymetadata[0].emailNotification);
      this.discussionFormControls.type.setValue(activityData.subType);
      const graded = activityData.activitymetadata[0].isGradable;
      this.discussionFormControls.graded.setValue(graded);
      this.discussionFormControls.visibilityCriteria.setValue(activityData.activitymetadata[0].visibilityCriteria);
      activityData.activitymetadata[0].activityStatus && this.discussionFormControls.activityStatus.setValue(activityData.activitymetadata[0].activityStatus);
      this.editActivityContent = activityData;
      if(activityData.subType === ForumType.STANDARD_DISCUSSION_FORUM) {
        if(activityData.activitymetadata[0].fileName) {
          this.fileDetails.s3FileName = activityData.activitymetadata[0].fileName;
          this.fileDetails.originalFileName = activityData.activitymetadata[0].originalFileName as string;
          this.isFileUploaded = true;
          this.isFileSelected = true;
          this.selectedFileName = this.fileDetails.originalFileName;
          this.showFileUpload = false;
        }
      }
      if(graded) {
        const rubricId = activityData.activitymetadata[0].rubricId;
        if(rubricId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.rubricsService.fetchRubricById(rubricId).then((rubric: any) => {
            this.selectedRubric = rubric;
          });
          this.discussionFormControls.rubricId.setValue(rubricId);
        }
        this.discussionFormControls.maxMarks.setValue(activityData.activitymetadata[0].maxMarks);
        this.discussionFormControls.passMarks.setValue(activityData.activitymetadata[0].passMarks);
      }
      if(activityData.activitymetadata[0].startDate) {
        this.discussionFormControls.startDate.setValue(moment(activityData.activitymetadata[0].startDate));
      }
      if(activityData.activitymetadata[0].endDate) {
        this.discussionFormControls.endDate.setValue(moment(activityData.activitymetadata[0].endDate));
      }
      this.participatedForumHandler();
      this.handleActivityStatusSwitch();
    }
  }
  /**
   *
   *
   * @private
   * @memberof DiscussionComponent
   */
  private handleActivityStatusSwitch() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const qnaMetadata = this.editActivityContent!.qnAmetaData!;
    const participated = !!(qnaMetadata?.totalAnswers + qnaMetadata?.totalQuestions);
    this.discussionForm.get('activityStatus')?.valueChanges.pipe(takeUntil(this.unsubscribeActivityStatusListener$)).subscribe(async (res) => {
      if(!this.discussionForm.value.visibilityCriteria) {
        if(res === 'optional') {
          const translationKey = 'discussionForums.creationAndManipulation.confirmActivityStatusChangeToOptional';
          const dialog: Dialog = {title: {translationKey}};
          const confirm = await this.dialogService.showConfirmDialog(dialog);
          if(!confirm) {
            this.discussionForm.get('activityStatus')?.setValue('mandatory', {onlySelf: true, emitEvent: false});
          }
        } else {
          const translationKey = participated ? 'discussionForums.creationAndManipulation.confirmParticipateActivityStatusChangeToMandatory' : 'discussionForums.creationAndManipulation.confirmActivityStatusChangeToMandatory';
          const dialog: Dialog = {title: {translationKey}};
          const confirm = await this.dialogService.showConfirmDialog(dialog);
          if(!confirm) {
            this.discussionForm.get('activityStatus')?.setValue('optional', {onlySelf: true, emitEvent: false});
          }
        }
      } else if(res === 'optional') {
        const translationKey = 'discussionForums.creationAndManipulation.errorActivityStatusChangeToOptionalVisibilityAttached';
        this.translationService.get(translationKey, {forumTitle: this.editActivityContent?.title}).subscribe((translation) => {
          this.showAlertMessage(translation, DialogTypes.ERROR);
          setTimeout(() => {
            this.discussionForm.get('activityStatus')?.setValue('mandatory', {onlySelf: true, emitEvent: false});
          }, 0);
        }).unsubscribe();
      } else {
        const translationKey = participated ? 'discussionForums.creationAndManipulation.confirmParticipateActivityStatusChangeToMandatory' : 'discussionForums.creationAndManipulation.confirmActivityStatusChangeToMandatory';
        const dialog: Dialog = {title: {translationKey}};
        const confirm = await this.dialogService.showConfirmDialog(dialog);
        if(!confirm) {
          this.discussionForm.get('activityStatus')?.setValue('optional', {onlySelf: true, emitEvent: false});
        }
      }
    });
  }

  private participatedForumHandler() {
    const qnaMetadata = this.editActivityContent?.qnAmetaData;
    if(this.editActivityContent?.status !== ElementStatuses.DRAFT) {
      if(qnaMetadata?.totalAnswers || qnaMetadata?.totalQuestions) {
        const participated = !!(qnaMetadata?.totalAnswers + qnaMetadata?.totalQuestions);
        if(participated) {
          const editActivityMetadata = this.editActivityContent?.activitymetadata[0];
          if(editActivityMetadata?.isGradable) {
            this.discussionForm.controls['title'].disable();
            this.discussionForm.controls['description'].disable();
            this.discussionForm.controls['startDate'].setValue(moment());
            this.discussionForm.controls['startDate'].disable();
            this.disableGradedSwitch = true;
            this.discussionForm.controls['passMarks'].disable();
            this.discussionForm.controls['maxMarks'].disable();
            this.discussionForm.controls['sendEmailNotification'].disable();
          }
        }
      }
    }
  }

  /**
   *
   *
   * @private
   * @memberof DiscussionComponent
   */
  private async setAcceptedFileTypes() {
    const contentType = 'discussion-forum'; // check this
    const orgId = this.configuration.getAttribute("orgId");
    this.acceptedFileTypes = await this.contentBuilderService.getAcceptedFileTypes(orgId, "activity", contentType);
  }
  /**
   *
   *
   * @readonly
   * @type {{[key: string]: AbstractControl}}
   * @memberof DiscussionComponent
   */
  get discussionFormControls(): {[key: string]: AbstractControl} {
    return this.discussionForm.controls;
  }

  /**
   *
   *
   * @readonly
   * @type {typeof SubmitActionTypes}
   * @memberof DiscussionComponent
   */
  get submitActionTypes(): typeof SubmitActionTypes {
    return SubmitActionTypes;
  }

  /**
   *
   *
   * @private
   * @memberof DiscussionComponent
   */
  private handleGradedSwitch() {
    this.discussionForm.get('graded')?.valueChanges.subscribe((change) => {
      if(change) {
        this.gradedForumFormControls.forEach((ele) => {
          if(this.discussionForm.contains(ele.name)) {
            const value = this.discussionForm.value[ele.name] || ele.defaultValue;
            this.discussionForm.setControl(ele.name, new FormControl(value, ele.controls));
          } else {
            this.discussionForm.addControl(ele.name, new FormControl(ele.defaultValue, ele.controls));
          }
        });
      } else {
        this.gradedForumFormControls.forEach((ele) => {
          const value = this.discussionForm.value[ele.name] || ele.defaultValue;
          this.discussionForm.setControl(ele.name, new FormControl(value));
        });
      }
    });
  }

  /**
   *
   *
   * @private
   * @memberof DiscussionComponent
   */
  private showCharacterLeft(): void {
    const title = this.discussionForm.get('title');
    if (title) {
      title.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val);
      });
    }
  }

  /**
   *
   *
   * @private
   * @param {string} [text='']
   * @return {*}  {void}
   * @memberof DiscussionComponent
   */
  private setCharacterLeftText(text = ''): void {
    const maxLength = this.discussionTitleMaxLength;
    if (text === '' || text === null) {
      this.setDefaultCharLength();
      return;
    }
    const textLength = text.length;
    const charLeft = maxLength - textLength;
    let translationKey = 'discussionForums.creationAndManipulation.charactersLeft';
    if (charLeft <= 1) {
      translationKey = 'discussionForums.creationAndManipulation.characterLeft';
    }
    this.translationService.get(translationKey, { length: charLeft }).subscribe((res: string) => {
      this.discussionTitleLengthText = res;
    });
  }

  /**
   *
   *
   * @private
   * @memberof DiscussionComponent
   */
  private setDefaultCharLength(): void {
    const maxOfCharacterTrasnlationKey = 'discussionForums.creationAndManipulation.maxOfCharacter';
    this.translationService.get(maxOfCharacterTrasnlationKey, { length: this.discussionTitleMaxLength }).subscribe((res: string) => {
      this.discussionTitleLengthText = res;
    });
  }
  
  /**
   *
   *
   * @param {boolean} [value=true]
   * @memberof DiscussionComponent
   */
  public sendConfirmStatus(value = true): void {
    this.storageService.set('localAttachedObjectives', []);
    this.confirmStatus.emit(value);
  }

  /**
   *
   *
   * @param {*} event
   * @memberof DiscussionComponent
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public fileSaveHandler(event: any): void {
    this.selectedFile = null;
    const file = event && event.length >0 ? event[0] : event;
    this.isFileUploaded = false;
    if (file !== undefined) {
      if (file.name) {
        try {
          this.saveDisabled = true;
          this.selectedFile = file;
          this.selectedFileName = file.name;
          this.isFileSelected = true;
          this.showFileUpload = false;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.contentService.uploadFile(this.selectedFile).subscribe((result: any) => {
            this.saveDisabled = false;
            if (result.status === 'uploading') {
              this.fileUploadPercentage = result.progress;
            }
            if (result.status === 'uploaded') {
              this.fileDetails.s3FileName = result.s3FileName;
              this.fileDetails.originalFileName = result.originalFileName;
              this.fileDetails.fileExtension = result.fileExtension;
              this.isFileUploaded = true;
              this.fileUploadPercentage = 0;
            }
          });
        } catch (error) {
          this.showAlertMessage('contentBuilder.content.errorMsg.fileUploadFailed', DialogTypes.ERROR);
        }
      }
    }
  }

  /**
   * Function to show the confirmation while delete file
   */
  public async fileDeleteConfirm(): Promise<void> {
    const dialog: Dialog = {title: {translationKey: "discussionForums.creationAndManipulation.fileDeleteConfirm"}};
    const res = await this.dialogService.showConfirmDialog(dialog);
    if (res === true) {
      this.selectedFile = null;
      this.isFileSelected = false;
      this.selectedFileName = '';
      this.showFileUpload = true;
      this.isFileUploaded = false;
    }
  }

  private isFormValid(): boolean {
    if(this.discussionForm.get('graded')?.value) {
      if(this.discussionForm.controls['maxMarks'].getError('passMarkError') || this.discussionForm.controls['passMarks'].getError('passMarkError')) {
        this.showErrorToast('Pass marks should be lesser than max marks');
        return false;
      }
    }
    if(this.discussionForm.invalid) {
      this.showMandatoryToast = true;
      this.mandatoryToastTimeoutId = setTimeout(() => {
        this.showMandatoryToast = false;
      }, 3000);
      return false;
    }
    return true;
  }

  closeMandatoryToast(): void {
    if(this.mandatoryToastTimeoutId) {
      clearTimeout(this.mandatoryToastTimeoutId);
    }
    this.showMandatoryToast = false;
  }

  public async submitAction(action: SubmitActionTypes): Promise<void> {
    if(action === SubmitActionTypes.SAVE) {
      const valid = this.isFormValid();
      if(!valid) {
        return;
      }
      this.saveContent(action);
    } else if(action === SubmitActionTypes.DRAFT) {
      const draftValid = !!this.discussionForm.getRawValue().title;
      if(!draftValid) {
        this.showMandatoryToast = true;
        setTimeout(() => {
          this.showMandatoryToast = false;
        }, 3000);
        return;
      }
      this.saveContent(action);
    }
  }
  private alterEditPayload(payload: CreateDiscussionForumPayload): EditDiscussionForumPayload {
    const editPayload = {...payload} as EditDiscussionForumPayload;
    const exisistingData = this.editActivityContent;
    if(exisistingData?.activitymetadata[0].description === payload.description) {
      delete editPayload.description;
    }
    if(exisistingData?.activitymetadata[0].visibilityCriteria === payload.visibilityCriteria) {
      delete editPayload.visibilityCriteria;
    }
    if(!payload.isGradable) {
      if(exisistingData?.activitymetadata[0].maxMarks === payload.maxMarks) {
        delete editPayload.maxMarks;
      }
      if(exisistingData?.activitymetadata[0].passMarks === payload.passMarks) {
        delete editPayload.passMarks;
      }
      if(exisistingData?.activitymetadata[0].rubricId === payload.rubricId) {
        delete editPayload.rubricId;
      }
    }
    if((exisistingData?.activitymetadata[0].startDate === payload.startDate && exisistingData?.activitymetadata[0].endDate === payload.endDate) && !payload.isGradable) {
      delete editPayload.startDate;
      delete editPayload.endDate;
    }
    if(this.discussionFormControls['startDate'].disabled) {
      editPayload.startDate = exisistingData?.activitymetadata[0].startDate;
      editPayload.endDate = payload.endDate;
    }
    if(exisistingData?.activitymetadata[0].activityStatus === payload.activityStatus) {
      delete editPayload.activityStatus;
    }
    if(exisistingData?.activitymetadata[0].emailNotification === payload.emailNotification) {
      delete editPayload.emailNotification;
    }
    return editPayload;
  }

  private async saveContent(action: SubmitActionTypes) {
    try {
      const payload = this.preparePayload(action);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let discussionResponse: any = null;
      let successMessage = 'discussionForums.creationAndManipulation.creationSuccess';
      if(this.params.operation === 'create') {
        discussionResponse = await this.contentService.createDiscussionForum(payload);
      } else {
        const editPayload = this.alterEditPayload(payload);
        const elementId = this.params.id;
        if(elementId) {
          delete editPayload.parentElementId;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if(this.editActivityContent!.status === ElementStatuses.PUBLISHED) {
            editPayload.status = ElementStatuses.PUBLISHED;
          }
          discussionResponse = await this.contentService.editDiscussionForum(elementId, editPayload);
        }
        successMessage = 'discussionForums.creationAndManipulation.editSuccess';
      }
      if(this.selectedLearningObjectives.length) {
        if(discussionResponse && (this.params.parentElementId || this.params.courseId)) {
          const elementId = this.params.operation === 'create' ?
            discussionResponse.body?.element?.elementId :
            this.editActivityContent?.activitymetadata[0].activityId;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const learingObjectivePayload = {
            elementId,
            objectives: this.selectedLearningObjectives,
            type: 'activity'
          };
          // TODO: attach forum to learning outcome
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          await this.learingOutcomeService.attach(this.params.courseId!, learingObjectivePayload);
        }
      }
      this.translationService.get(successMessage, {forumTitle: payload.title}).subscribe((res) => {
        this.toastService.success(res, '', {
          closeButton: true,
          timeOut: 3000,
          extendedTimeOut: 3000,
          tapToDismiss: false
        });
      }).unsubscribe();
      this.confirmStatus.emit();
    } catch (error: any) {
      this.showAlertMessage(error.error, DialogTypes.ERROR);
    }
  }

  private preparePayload(status: SubmitActionTypes): CreateDiscussionForumPayload {
    const formValues = this.discussionForm.getRawValue();
    const payload: CreateDiscussionForumPayload = {} as CreateDiscussionForumPayload;
    if(this.params.courseId) {
      payload.courseId = this.params.courseId;
    }
    if(this.params.parentElementId) {
      payload.parentElementId = this.params.parentElementId;
    } else {
      payload.parentElementId = this.params.courseId;
    }
    payload.title = formValues.title;
    if(formValues.description) {
      payload.description = formValues.description;
    }
    payload.isGradable = formValues.graded;

    if(!formValues.type || formValues.type === ForumType.STANDARD_DISCUSSION_FORUM) {
      payload.type = ForumType.STANDARD_DISCUSSION_FORUM;
      if(this.isFileUploaded) {
        payload.originalFileName = this.fileDetails.originalFileName;
        payload.fileName = this.fileDetails.s3FileName;
      }
    } else {
      payload.type = ForumType.DOUBT_CLARIFICATION_FORUM;
    }
    if(formValues.graded) {
      payload.rubricId = formValues.rubricId;
      payload.rubricScope = this.selectedRubric.scope;
      payload.maxMarks = Number(formValues.maxMarks);
      payload.passMarks = Number(formValues.passMarks);
    }
    if(formValues.startDate && formValues.endDate) {
      payload.startDate = formValues.startDate?.toISOString();
      payload.endDate = formValues.endDate?.toISOString();
    }
    payload.visibilityCriteria = formValues.visibilityCriteria;
    payload.emailNotification = formValues.sendEmailNotification;
    payload.activityStatus = formValues.activityStatus;
    switch(status) {
      case SubmitActionTypes.DRAFT:
        payload.status = 'draft';
        break;
      case SubmitActionTypes.SAVE:
        payload.status = 'unpublished';
        break;
      default:
    }
    payload.tags = []; // TOOD
    return payload;
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

  /**
   * Function to show the alert message
   * @param message
   * @param type
   */
  private showAlertMessage(message: string, type: DialogTypes): void {
    const dialog: Dialog = {title: {translationKey: message},type: type};
    this.dialogService.showAlertDialog(dialog);
  }

  /**
   * Function to show the file upload on click of edit
   */
  public editFile(): void {
    this.showFileUpload = true;
  }

  /**
   *
   *
   * @memberof DiscussionComponent
   */
  public triggerForumInfoPopup(): void {
    this.showDiscussionComponent = !this.showDiscussionComponent;
    if(!this.showForumInfoPopup) {
      const modalRef = this.ngbModal.open(ForumInfoPopupComponent, {backdrop: false, centered: true, modalDialogClass: 'forum-info-modal', animation: true});
      const closeEventSubscription = modalRef.componentInstance.closeEvent.subscribe(() => {
        this.showForumInfoPopup = !this.showForumInfoPopup;
        this.showDiscussionComponent = true;
        closeEventSubscription.unsubscribe();
        modalRef.close();
      });
    }
    this.showForumInfoPopup = !this.showForumInfoPopup;
  }
  
  public attachLearningObjectives(type:string): void {
    this.router.navigate([`./learning-objective/${type}`], {
      relativeTo: this.params.currentActivtedRoute, state: {
        preventReinitilizing: true,
      }
    });
  }

  public attachRubric(attach = true): void {
    if(!attach) {
      this.selectedRubric = null;
      this.discussionForm.controls['rubricId'].setValue(null);
      return;
    }
    this.router.navigate(['./rubric/selection/course'], {relativeTo: this.params.currentActivtedRoute, queryParamsHandling: 'merge', state: {
      preventReinitilizing: true,
      previousSelectedRubric: this.selectedRubric,
    }});
  }

  public async dateTimeEmitter(event: string, type: string): Promise<void> {
    if(type === 'endDate') {
      if(this.discussionForm.value.startDate && moment(event).isBefore(this.discussionForm.value.startDate)) {
        this.showAlertMessage('discussionForums.creationAndManipulation.invalidEndDateError', DialogTypes.ERROR);
        this.discussionForm.controls.endDate.setValue(this.discussionForm.value.endDate);
        return;
      }
    } else if(this.discussionForm.value.endDate && moment(event).isAfter(this.discussionForm.value.endDate)) {
      this.showAlertMessage('discussionForums.creationAndManipulation.invalidEndDateError', DialogTypes.ERROR);
      this.discussionForm.controls.startDate.setValue(this.discussionForm.value.startDate);
      return;
    }
    if(this.params.operation === 'edit') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const activityMetadata = this.editActivityContent!.activitymetadata[0]!;
      const participated = this.editActivityContent?.qnAmetaData?.totalAnswers || this.editActivityContent?.qnAmetaData?.totalQuestions;
      if(participated) {
        // preponement
        if(type === 'startDate') {
          if(moment(event).isBefore(moment(activityMetadata.startDate))) {
            const dialog: Dialog = {type: DialogTypes.ERROR, title: {translationKey: "discussionForums.creationAndManipulation.alertMessageChangeValidityStartDate"}};
            await this.dialogService.showAlertDialog(dialog);
            this.discussionForm.get(type)?.setValue(moment(activityMetadata.startDate));
          } else {
            this.dateUpdateConfirmation(type, event);
          }
        } else if(moment(event).isBefore(moment(activityMetadata.endDate))) {
          const dialog: Dialog = {type: DialogTypes.ERROR, title: {translationKey: "discussionForums.creationAndManipulation.alertMessageChangeValidityEndDate"}};
          await this.dialogService.showAlertDialog(dialog);
          this.discussionForm.get(type)?.setValue(moment(activityMetadata.endDate));
        } else {
          this.dateUpdateConfirmation(type, event);
        }
      } else {
        const changeBeforeValidityStart = activityMetadata.startDate && moment().isBefore(activityMetadata.startDate);
        const changeBeforeValidityEnd = activityMetadata.endDate && moment().isAfter(activityMetadata.endDate);
        if(changeBeforeValidityStart || changeBeforeValidityEnd) {
          this.dateUpdateConfirmation(type, event);
        } else {
          this.discussionForm.get(type)?.setValue(moment(event));
        }
      }
    } else {
      this.discussionForm.get(type)?.setValue(moment(event));
    }
  }

  async dateUpdateConfirmation(type: string, date: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const activityMetadata = this.editActivityContent!.activitymetadata[0]!;
    const dialog: Dialog = {title: {translationKey: "discussionForums.creationAndManipulation.editChangeValidity"}};
    const confirm = await this.dialogService.showConfirmDialog(dialog);
    if(confirm) {
      this.discussionForm.get(type)?.setValue(moment(date));
    } else {
      this.discussionForm.get(type)?.setValue(moment((activityMetadata as Record<string, any>)[type]));
    }
  }

  showSaveAsDraftButton(): boolean {
    if (this.editActivityContent) {
      if (this.editActivityContent.status === ElementStatuses.DRAFT) {
        return true;
      }
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.selectedRubric = null;
    this.selectedLearningObjectives = [];
    if(!this.unsubscribeActivityStatusListener$.closed) {
      this.unsubscribeAttachRubricListener$.next();
      this.unsubscribeAttachRubricListener$.complete();
    }
    if(!this.unsubscribeAttachObjectivesListener$.closed) {
      this.unsubscribeAttachObjectivesListener$.next();
      this.unsubscribeAttachObjectivesListener$.complete();
    }
    if(!this.unsubscribeActivityStatusListener$.closed) {
      this.unsubscribeActivityStatusListener$.next();
      this.unsubscribeActivityStatusListener$.complete();
    }
    this.discussionForm.reset();
    this.disableGradedSwitch = false;
  }
}
