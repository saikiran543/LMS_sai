/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-lines-per-function */
import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { ContentBuilderService } from 'src/app/learning-center/course-services/content-builder.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { DialogTypes } from 'src/app/enums/Dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { LearningOutcomeService } from 'src/app/learning-center/learning-outcome/service/learning-outcome.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
})
export class UnitComponent {
  message = '';
  confirmBtn = '';
  cancelBtn = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelConfig = {
    message: 'confirmModal.text',
    confirmBtn: 'confirmModal.confirmButton',
    cancelBtn: 'confirmModal.cancelButton'
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any = {}
  private unsubscribe$ = new Subject<void>();
  @Output() confirmStatus = new EventEmitter();
  // showUnitUpload = true;
  unitImageTitle = '';
  unitFileUploader = true;
  unitImageSrc = '';
  unitOriginalImageSrc = '';
  unitFileType = 'image';
  unitAcceptedFiles = '';
  bannerSavedImage = '';
  bannerCroppedImage = '';
  showWebEditUnit = false;
  unitWebWidth = 360;
  unitWebHeight = 480;
  unitNameLengthText = '';
  imageText = "contentBuilder.unit.bannerNote";
  unitNameLengthMax = 500;
  isObjectiveAttached!: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeNode: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any = {}
  submitted = false;
  unitForm = new FormGroup({
    title: new FormControl('', [Validators.required, CustomValidator.blankSpace, CustomValidator.alphaNumeric]),
    description: new FormControl(),
    banner: new FormControl('', [Validators.required]),
    visibilityCriteria: new FormControl(),
    courseId: new FormControl(''),
    status: new FormControl(''),
    bannerFileName: new FormControl(''),
    learningObjectives: new FormControl(null),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  courseId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elementId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orgId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedLearningObjectives: any = [];

  // eslint-disable-next-line max-params
  constructor(private translate: TranslateService,
    private contentService: ContentService,
    private contentBuilderService: ContentBuilderService,
    private configuration: ConfigurationService,
    private dialogService: DialogService,
    private router: Router,
    private learningOutcomeService: LearningOutcomeService,
    private storageService: StorageService,
    private toastService: ToastrService,
  ) {
  }

  async ngOnInit() {
    this.showCharacterLeft();
    this.listenToStorageService();
    this.courseId = this.params.courseId;
    this.elementId = this.params.id;
    if (this.params.operation === "edit") {
      this.unitFileUploader = false;
      this.showWebEditUnit = true;
      this.getUnitDetail(this.courseId, this.elementId);
      this.getObjectiveDetails(this.elementId);
    } else {
      this.unitForm.reset();
    }
    this.orgId = this.configuration.getAttribute("orgId");
    this.unitAcceptedFiles = await this.contentBuilderService.getAcceptedFileTypes(this.orgId, "content", "unit");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getUnitDetail(courseId: any, elementId: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await this.contentService.getElementDetail(courseId, elementId);
    this.unitForm.patchValue(res.body);
    this.unitOriginalImageSrc = res.body.banner;
    this.unitImageSrc = res.body.banner;
    this.unitImageTitle = res.body.bannerFileName;
    this.unitForm.controls['banner'].setValue(res.body.banner);
    this.unitForm.controls['courseId'].setValue(courseId);

  }

  async getObjectiveDetails(elementId: string) {
    const res = await this.contentService.getLearningObjectives(elementId);
    if (res.body && res.body.length > 0) {
      this.isObjectiveAttached = true;
    }
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
    this.unitForm.controls.learningObjectives.setValue(learningObjectives);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setSelectedLearningObjectives(learningObjectives: any) {
    this.selectedLearningObjectives = Object.keys(learningObjectives).map((objectiveId) => ({
      objectiveId,
      evaluationCriteria: learningObjectives[objectiveId].evaluationCriteria,
      completionCriteria: learningObjectives[objectiveId].completionCriteria
    }));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unitImageSaveHandler(event: any): void {
    if (event.cropped === '' || event.original === '') {
      this.bannerSavedImage = '';
      event.name = this.unitImageTitle;
      return;
    }
    if(!event.name || event.name === ''){
      event.name = this.unitImageTitle;
    }
    this.unitImageSrc = this.bannerCroppedImage = event.cropped;
    this.unitOriginalImageSrc = event.original;
    this.showWebEditUnit = true;
    this.bannerSavedImage = '';
    this.unitForm.controls['banner'].setValue(event.cropped);
    if (this.unitImageSrc) {
      this.unitFileUploader = false;
      this.unitImageTitle = event.name;
      this.unitForm.controls['bannerFileName'].setValue(event.name);
    } else {
      this.unitFileUploader = true;
      this.unitImageTitle = '';
      this.unitForm.controls['bannerFileName'].setValue('');
    }
  }

  isUnitFormValidate(): void {
    if(this.unitForm.valid) {
      this.submitted = true;
      if (!this.unitForm.controls['visibilityCriteria'].value) {
        this.unitForm.controls['visibilityCriteria'].setValue(false);
        if (this.params.operation === "edit") {
          this.updateUnit();
        } else {
          this.createUnit();
        }
      } else {
      // eslint-disable-next-line no-lonely-if
        if (this.params.operation === "edit") {
          this.updateUnit();
        } else {
          this.createUnit();
        }
      }
    } else {
      this.translate.get('contentBuilder.unit.completeMandatoryFields').subscribe((res) => {
        this.showErrorToast(res);
      }).unsubscribe();
    }
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

  async updateUnit() {
    this.sendConfirmStatus(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await this.contentService.updateUnit(this.elementId, this.unitForm.value);
      await this.attachLearningObjective(this.elementId);
      if (res.status === 200) {
        this.contentService.showSuccessToast(this.contentService.messagesTranslations.updatedSuccess);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 401 || error.status === 404) {
        this.dialogService.showAlertDialog({ title: { translationKey: error.error }, type: DialogTypes.ERROR });
      } else {
        this.showErrorToast(error.error);
      }
    }
  }

  async createUnit() {
    this.unitForm.controls['banner'].setValue(this.unitImageSrc);
    this.unitForm.controls['courseId'].setValue(this.courseId);
    try {
      const res = await this.contentService.saveUnit(this.unitForm.value);
      await this.attachLearningObjective(res.body.elementId);
      if (res.status === 200) {
        this.sendConfirmStatus(true);
        this.contentService.showSuccessToast(this.contentService.messagesTranslations.successMessage);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 401) {
        this.dialogService.showAlertDialog({ title: { translationKey: error.error }, type: DialogTypes.ERROR });
      } else if (error.status === 404) {
        this.sendConfirmStatus(true);
        this.dialogService.showAlertDialog({ title: { translationKey: error.error }, type: DialogTypes.ERROR });
      } else {
        this.showErrorToast(error.error);
      }
    }
  }

  private async attachLearningObjective(elementId: string) {
    if (this.selectedLearningObjectives.length) {
      if (elementId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const learningObjectivePayload = {
          elementId: elementId,
          objectives: this.selectedLearningObjectives,
          type: 'unit'
        };
        // TODO: attach forum to learning outcome
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await this.learningOutcomeService.attach(this.params.courseId!, learningObjectivePayload);
        this.storageService.broadcastValue("updateCourseElement", { elementId: elementId, payload: { isLearningObjectiveLinked: true } });
      }
    }
  }

  get unitFormControls() {
    return this.unitForm.controls;
  }

  editWebBannerImage(): void {
    this.bannerSavedImage = this.unitOriginalImageSrc;
  }

  async webBannerDeleteConfirm(): Promise<void> {
    const res = await this.dialogService.showConfirmDialog({ title: { translationKey: "contentBuilder.unit.webBannerDeleteConfirm" } });
    if (res === true) {
      this.unitImageSrc = "";
      this.unitImageTitle = "";
      this.unitForm.controls['bannerFileName'].setValue('');
      this.unitForm.controls['banner'].setValue('');
      this.unitFileUploader = true;
    }
  }

  private setCharacterLeftText(text = '', maxLength: number, type: string): void {
    if (text === '' || text === null) {
      this.setDefaultCharLength(type);
      return;
    }
    const textLength = text.length;
    const charLeft = maxLength - textLength;
    let translationKey = 'contentBuilder.unit.charactersLeft';
    if (charLeft <= 1) {
      translationKey = 'contentBuilder.unit.characterLeft';
    }
    this.translate.get(translationKey, { length: charLeft }).subscribe((res: string) => {
      this.unitNameLengthText = res;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private setDefaultCharLength(type: string): void {
    this.translate.get('contentBuilder.unit.maxOfCharacter', { length: this.unitNameLengthMax }).subscribe((res: string) => {
      this.unitNameLengthText = res;
    });
  }

  private showCharacterLeft(): void {
    const title = this.unitForm.get('title');
    if (title) {
      title.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val, this.unitNameLengthMax, 'title');
      });
    }
  }

  sendConfirmStatus(value: boolean): void {
    const payload = { type: value, node: this.activeNode };
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.storageService.set('localAttachedObjectives', []);
    this.confirmStatus.emit(payload);
  }

  public attachLearningObjectives(type: string): void {
    // this.showDiscussionComponent = false;
    this.router.navigate([`./learning-objective/${type}`], {
      relativeTo: this.params.currentActivtedRoute, state: {
        preventReinitilizing: true,
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedFileName(event: any){
    this.unitImageTitle = event.name;
  }

}
