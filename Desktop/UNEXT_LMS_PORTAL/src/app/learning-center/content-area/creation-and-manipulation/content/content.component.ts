/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { ContentBuilderService } from 'src/app/learning-center/course-services/content-builder.service';
import { CommonUtils } from 'src/app/utils/common-utils';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ElementStatuses } from 'src/app/enums/ElementStatuses';
import { DialogService } from 'src/app/services/dialog.service';
import { Dialog } from 'src/app/Models/Dialog';
import { DialogTypes } from 'src/app/enums/Dialog';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LearningOutcomeService } from 'src/app/learning-center/learning-outcome/service/learning-outcome.service';

export interface ContentData {
  title: string,
  description: string,
  contentType: string,
  s3FileName: string,
  originalFileName: string,
  fileExtension: string,
  fileUrl: string,
  contentStatus: string,
  idealTime: number,
  visibilityCriteria: boolean,
  allowDownload: boolean,
  offlineAccess: boolean,
  sendNotification: boolean,
  status: string,
  courseId: string,
  parentElementId: string,
  elementId?: string,
  url?: string
}

export interface Params {
  courseId: string,
  id: string,
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any,
  parentElementId: '',
  operation: string,
  currentActivtedRoute: null
}

export interface ModalConfig {
  message: string,
  confirmBtn: string,
}

export interface formData {
  title: string,
  description: string,
  status: string,
  idealHour: string | number,
  idealMinute: string | number,
  visibilityCriteria: boolean,
  sendEmailNotification: boolean,
  allowDownload: boolean,
  offlineAccess: boolean,
  url?: string
}

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
  private unsubscribe$ = new Subject<void>();
  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl(''),
    idealHour: new FormControl(''),
    idealMinute: new FormControl(''),
    allowDownload: new FormControl(''),
    enableOfflineAccess: new FormControl(''),
    sendEmailNotification: new FormControl(''),
    visibilityCriteria: new FormControl(''),
    learningObjectives: new FormControl(null),
  });
  titleTextLength = '';
  titleMaxLength = 500;
  headerText = '';
  uploadTitle = '';
  uploadDragDrop = '';
  uploadButton = '';
  noteText = '';
  isObjectiveAttached!: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedLearningObjectives: any = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  acceptedFiles: any = {
    document: 'application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    video: 'video/mp4, video/mpeg',
    epub: 'application/epub+zip',
    scorm: 'application/zip',
    audio: 'audio/mpeg, audio/wav',
    image: 'image/png, image/jpeg, image/gif',
    html: 'application/zip',
    otherattachments: '*',
  };
  acceptedFileTypes = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Params = {
    courseId: '',
    id: '',
    type: '',
    node: null,
    parentElementId: '',
    operation: '',
    currentActivtedRoute: null
  };

  fileDetails = {
    s3FileName: '',
    originalFileName: '',
    fileExtension: '',
    fileUrl: '',
  }

  selectedFile: File | null = null;
  validationErrorToast = false;
  isFileSelected = false;
  saveClicked = false;
  draftClicked = false;
  showFileUpload = true;
  showVideoUpload=true;
  sameNameError = false;
  sameNameErrorMsg = '';
  elementData!: ContentData;
  selectedFileName = '';
  saveDisabled = false;
  isFileUploaded = false;
  CaptureExpress= false;
  fileUploadPercentage = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orgId: any;
  titleNames: Array<string> = [];
  @Output() confirmStatus = new EventEmitter();

  // eslint-disable-next-line max-params
  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private contentService: ContentService,
    private contentBuilderService: ContentBuilderService,
    private commonUtils: CommonUtils,
    private configuration: ConfigurationService,
    private storageService: StorageService,
    private router: Router,
    private learningOutcomeService: LearningOutcomeService
  ) {

  }

  ngOnInit(): void {
    this.initBasics();
    this.listenToStorageService();
    this.setDefaultCharLength();
    this.initForm(this.params.id);
  }

  private listenToStorageService() {
    this.storageService.listen('attachedObjectives').pipe(takeUntil(this.unsubscribe$)).subscribe((attachedObjectives) => {
      try {
        this.isObjectiveAttached = this.storageService.get('availableObjective');
        this.storageService.delete('availableObjective');
      // eslint-disable-next-line no-empty
      }catch{
      }
      this.onLearningObjectivesAttachment(attachedObjectives);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onLearningObjectivesAttachment(learningObjectives: any) {
    this.setSelectedLearningObjectives(learningObjectives);
    this.form.controls.learningObjectives.setValue(learningObjectives);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setSelectedLearningObjectives(learningObjectives: any) {
    this.selectedLearningObjectives = Object.keys(learningObjectives).map((objectiveId) => ({
      objectiveId,
      completionCriteria: learningObjectives[objectiveId].completionCriteria,
    }));
  }

  async getObjectiveDetails(elementId: string): Promise<void> {
    const res = await this.contentService.getLearningObjectives(elementId);
    if (res.body && res.body.length > 0) {
      this.isObjectiveAttached = true;
    }
  }

  /**
   * Initialize the form
   * @param elementId
   */
  // eslint-disable-next-line max-lines-per-function
  private async initForm(elementId = '') {
    const formData: formData = {
      title: '',
      description: '',
      status: 'mandatory',
      idealHour: '',
      idealMinute: '',
      visibilityCriteria: false,
      sendEmailNotification: true,
      allowDownload: false,
      offlineAccess: false
    };
    // If element Id is present, then fill the form with data
    if (elementId) {
      this.getObjectiveDetails(this.params.id);
      this.elementData = await this.contentService.getContentElement(this.params.courseId, elementId);
      if (this.elementData) {
        formData.title = this.elementData.title;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formData.description = this.elementData.description;
        formData.status = this.elementData.contentStatus;
        const time = this.commonUtils.getTimeInHourAndMinute(this.elementData.idealTime);
        formData.idealHour = time.hour;
        formData.idealMinute = time.minute;
        formData.visibilityCriteria = this.elementData.visibilityCriteria;
        formData.sendEmailNotification = this.elementData.sendNotification;
        formData.allowDownload = this.elementData.allowDownload;
        formData.offlineAccess = this.elementData.offlineAccess;
        if (this.params.type === 'weblink') {
          formData.url = (this.elementData.url === undefined) ? '' : this.elementData.url;
        }
      }
      this.isFileSelected = true;
      this.showFileUpload = false;
      this.selectedFileName = this.elementData.originalFileName;
      this.fileDetails.s3FileName = this.elementData.s3FileName;
      this.fileDetails.originalFileName = this.elementData.originalFileName;
      this.fileDetails.fileExtension = this.elementData.fileExtension;
      this.isFileUploaded = true;
    }
    await this.storageService.listen(StorageKey.COURSE_JSON).subscribe(res => {
      this.titleNames = res.map((element: any) => element.name);
    });
    this.form = this.formBuilder.group(
      {
        title: [
          formData.title,
          [
            Validators.required,
            Validators.maxLength(this.titleMaxLength),
            CustomValidator.blankSpace,
            CustomValidator.alphaNumeric
          ]
        ],
        description: [
          formData.description
        ],
        status: [
          formData.status,
          Validators.required
        ],
        idealHour: [
          formData.idealHour,
          [
            Validators.required,
            CustomValidator.numeric
          ]
        ],
        idealMinute: [
          formData.idealMinute,
          [
            Validators.required,
            CustomValidator.numeric
          ]
        ],
        visibilityCriteria: [
          formData.visibilityCriteria
        ],
        sendEmailNotification: [
          formData.sendEmailNotification
        ],
        learningObjectives: [null],
      }
    );
    this.checkVideo()
    // These controls will not be available for weblink
    if (this.params.type !== 'weblink') {
      this.form.addControl('allowDownload', new FormControl(formData.allowDownload));
      this.form.addControl('enableOfflineAccess', new FormControl(formData.offlineAccess));
    } else {
      this.form.addControl('url', new FormControl(formData.url, [
        Validators.required,
        CustomValidator.url,
        CustomValidator.blankSpace
      ]));
    }
    this.showCharacterLeft();
  }

  /**
   * Function to set the basic values/design based on the content type
   */
  private async initBasics(): Promise<void> {
    const type = this.params.type;
    if (this.params.operation === 'edit') {
      this.translate.get('contentBuilder.' + type + '.header').subscribe((res: string) => {
        this.headerText = res;
      });
    } else {
      this.translate.get('contentBuilder.' + type + '.create').subscribe((res: string) => {
        this.headerText = res;
      });
    }

    this.uploadTitle = 'contentBuilder.' + type + '.uploadTitle';
    this.uploadDragDrop = 'contentBuilder.' + type + '.uploadDragDrop';
    this.uploadButton = 'contentBuilder.' + type + '.uploadButton';
    this.noteText = 'contentBuilder.' + type + '.uploadNote';
    this.orgId = this.configuration.getAttribute("orgId");
    this.acceptedFileTypes = await this.contentBuilderService.getAcceptedFileTypes(this.orgId, "content", type);
  }

  /**
   * Function to send the status
   * @param value
   */
  sendConfirmStatus(value = true): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.storageService.set('localAttachedObjectives', []);
    this.confirmStatus.emit(value);
  }
  express(){
    this.CaptureExpress=true;
  }
  /**
   *Function to set the character left text
    * @param text string
    * @param maxLength number
    * @param type string
    * @returns void
    */
  private setCharacterLeftText(text: string, maxLength: number, field: string): void {
    const type = this.params.type;
    if (text === '' || text === null) {
      this.setDefaultCharLength();
      return;
    }
    const textLength = text.length;
    const charLeft = maxLength - textLength;
    const translationKey = 'contentBuilder.' + type + '.' + field;
    let translationKeySuffix = 'CharactersLeft';
    if (charLeft <= 1) {
      translationKeySuffix = 'CharacterLeft';
    }
    this.translate.get(translationKey + translationKeySuffix, { length: charLeft }).subscribe((res: string) => {
      this.titleTextLength = res;
    });
  }

  /**
   * Function to show the default character left messages
   * @param type string
   */
  private setDefaultCharLength(): void {
    const type = this.params.type;
    this.translate.get('contentBuilder.' + type + '.titleMaxOfCharacter', { length: this.titleMaxLength }).subscribe((res: string) => {
      this.titleTextLength = res;
    });
  }

  /**
   * Function will trigger when file selected
   * @param event
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  fileSaveHandler(event: any): void {
    this.selectedFile = null;
    const file = event && event.length > 0 ? event[0] : event;
    this.isFileUploaded = false;
    if (file !== undefined) {
      if (file.name) {
        try {
          this.saveDisabled = true;
          this.selectedFile = file;
          this.selectedFileName = file.name;
          this.isFileSelected = true;
          this.showFileUpload = false;
          this.showVideoUpload = false;
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
   * Function to show the characters left
   */
  private showCharacterLeft(): void {
    const title = this.form.get('title');
    /* istanbul ignore else*/
    if (title) {
      title.valueChanges.subscribe((val: string) => {
        this.setCharacterLeftText(val, this.titleMaxLength, 'title');
      });
    }
  }

  /**
   * Function to handle the content save
   * @param action
   * @returns
   */
  // eslint-disable-next-line max-lines-per-function
  async saveContent(action: string): Promise<void> {
    try {
      if (!this.isFormValid()) {
        this.validationErrorToast = true;
        return;
      }
      if (this.params.id) {
        if (action !== 'draft') {
          if (this.elementData.status === 'published') {
            action = 'published';
          } else {
            action = 'unpublished';
          }
        }
      } else if (action === 'save') {
        action = ElementStatuses.UNPUBLISHED;
        this.params.id = '';
        this.saveClicked = true;
      } else if (action === 'draft') {
        action = 'draft';
        this.params.id = '';
      }
      const formValue = this.form.value;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const formObject = this.createSaveObject(formValue, action, this.params.id);
      if (this.params.id) {
        const updateContent = await this.contentService.saveContentItem(formObject, this.params.id);
        await this.attachLearningObjective(this.params.id);
        if (updateContent) {
          this.sendConfirmStatus(true);
          if(action !== 'draft'){
            this.showAlertMessage("contentBuilder." + this.params.type + ".updateSuccessMessage", DialogTypes.SUCCESS);
          }
        } else {
          this.saveClicked = false;
          this.showAlertMessage("contentBuilder." + this.params.type + ".updateFailedMessage", DialogTypes.ERROR);
        }
      } else {
        const saveContent = await this.contentService.saveContentItem(formObject);
        await this.attachLearningObjective(saveContent.body.elementId);
        if(action === 'draft'){
          this.sendConfirmStatus(true);
        }
        else if (saveContent) {
          this.sendConfirmStatus(true);
          this.showAlertMessage("contentBuilder." + this.params.type + ".saveSuccessMessage", DialogTypes.SUCCESS);
        } else {
          this.saveClicked = false;
          this.showAlertMessage("contentBuilder." + this.params.type + ".saveFailedMessage", DialogTypes.ERROR);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.saveClicked = false;
      this.showAlertMessage(error.error, DialogTypes.ERROR);
    }
  }

  private async attachLearningObjective(elementId: string) {
    if (this.selectedLearningObjectives.length) {
      if (elementId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const learningObjectivePayload = {
          elementId: elementId,
          objectives: this.selectedLearningObjectives,
          type: 'content'
        };
        // TODO: attach forum to learning outcome
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await this.learningOutcomeService.attach(this.params.courseId!, learningObjectivePayload);
        this.storageService.broadcastValue("updateCourseElement", { elementId: elementId, payload: { isLearningObjectiveLinked: true } });
      }
    }
  }
  /**
   * Function to check form is valid
   * @returns
   */
  isFormValid(): boolean {
    if (this.form.invalid === true || (!this.isFileUploaded && this.params.type !== 'weblink')) {
      return false;
    }
    this.saveDisabled = false;
    return true;
  }

  /**
   * Function to show the alert message
   * @param message
   * @param type
   */
  showAlertMessage(message: string, type: DialogTypes): void {
    const dialog: Dialog = { title: { translationKey: message }, type: type };
    this.dialogService.showAlertDialog(dialog);
  }

  /**
   * Function to create the object to save
   * @param formValue
   * @param action
   * @param id
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  private createSaveObject(formValue: any, action: string, id = ''): ContentData {
    formValue.idealHour = formValue.idealHour ? formValue.idealHour : 0;
    formValue.idealMinute = formValue.idealMinute ? formValue.idealMinute : 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formObject: ContentData = {
      title: formValue.title,
      description: formValue.description,
      contentType: this.params.type,
      s3FileName: this.fileDetails.s3FileName,
      originalFileName: this.fileDetails.originalFileName,
      fileExtension: this.fileDetails.fileExtension,
      fileUrl: '',
      contentStatus: formValue.status,
      allowDownload: (formValue.allowDownload) === undefined ? false : formValue.allowDownload,
      offlineAccess: (formValue.enableOfflineAccess === undefined) ? false : formValue.enableOfflineAccess,
      sendNotification: formValue.sendEmailNotification,
      idealTime: this.commonUtils.getTimeInMinutes(formValue.idealHour, formValue.idealMinute),
      visibilityCriteria: formValue.visibilityCriteria,
      status: action,
      parentElementId: (this.params.parentElementId === undefined) ? this.params.courseId : this.params.parentElementId,
      courseId: this.params.courseId,
      url: (formValue.url === undefined) ? '' : formValue.url
    };
    if (id) {
      formObject.elementId = id;
    }
    return formObject;
  }

  /**
   * Function to show the confirmation while delete file
   */
  async fileDeleteConfirm(): Promise<void> {
    const dialog: Dialog = { title: { translationKey: "contentBuilder." + this.params.type + ".fileDeleteConfirm" } };
    const res = await this.dialogService.showConfirmDialog(dialog);
    if (res === true) {
      this.selectedFile = null;
      this.isFileSelected = false;
      this.selectedFileName = '';
      this.showFileUpload = true;
      this.isFileUploaded = false;
      this.checkVideo()
    }
  }
  /**
   * Function to change the fileupload component to videoupload component
   */

  checkVideo(): void {
    if(this.params.type==='video'){ 
      this.showVideoUpload = true ;
      this.showFileUpload = false;
       }else{
          this.showFileUpload = true;
          this.showVideoUpload = false;
            }
   }

  /**
   * Function to close the toast
   */
  closeToast(): void {
    this.validationErrorToast = false;
    this.sameNameError = false;
  }

  /**
   * Function to show the file upload on click of edit
   */
  editFile(): void {
    this.showFileUpload = true;
    this.checkVideo();
  }
  showSaveAsDraftButton(): boolean {

    if (this.elementData) {
      if (this.elementData.status === "draft") {
        return true;
      }
      return false;
    }
    return true;

  }
  public attachLearningObjectives(type: string): void {
    this.router.navigate([`./learning-objective/${type}`], {
      relativeTo: this.params.currentActivtedRoute, state: {
        preventReinitilizing: true,
      }
    });
  }
}