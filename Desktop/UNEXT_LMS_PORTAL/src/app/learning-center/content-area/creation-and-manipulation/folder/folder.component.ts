/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { DialogService } from 'src/app/services/dialog.service';
import { DialogTypes } from 'src/app/enums/Dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LearningOutcomeService } from 'src/app/learning-center/learning-outcome/service/learning-outcome.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent {
  private unsubscribe$ = new Subject<void>();
  message = '';
  confirmBtn = '';
  cancelBtn = '';
  submitted = false;
  folderNameLengthText = '';
  folderNameLengthMax = 500;
  modelConfig = {
    message: 'confirmModal.text',
    confirmBtn: 'confirmModal.confirmButton',
    cancelBtn: 'confirmModal.cancelButton'
  };
  params: any = {}
  @Output() confirmStatus = new EventEmitter();
  folderForm = new FormGroup({
    title: new FormControl('', [Validators.required, CustomValidator.blankSpace, CustomValidator.alphaNumeric]),
    description: new FormControl(),
    visibilityCriteria: new FormControl(),
    status: new FormControl(),
    courseId: new FormControl(),
    parentElementId: new FormControl(),
    learningObjectives: new FormControl(null),
  });
  courseId = "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedLearningObjectives: any = [];
  isObjectiveAttached!: boolean;
  // eslint-disable-next-line max-params
  constructor(private translate: TranslateService,
    private contentService: ContentService,
    private dialogService: DialogService,
    private router: Router,
    private storageService: StorageService,
    private learningOutcomeService: LearningOutcomeService,
    private toastService: ToastrService,) {
  }

  ngOnInit(): void {
    this.showCharacterLeft();
    this.initLengthTextChange();
    this.listenToStorageService();
    this.courseId = this.params.courseId;
    this.folderForm.controls['courseId'].setValue(this.courseId);
    if (this.params.operation === "edit") {
      this.getObjectiveDetails(this.params.id);
      this.getFolderDetail(this.courseId, this.params.id);
    }
  }

  async getFolderDetail(courseId: any, elementId: any) {
    const res = await this.contentService.getElementDetail(courseId, elementId);
    this.folderForm.patchValue(res.body);
    this.folderForm.controls['courseId'].setValue(courseId);

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
    this.folderForm.controls.learningObjectives.setValue(learningObjectives);
  }

  private setSelectedLearningObjectives(learningObjectives: any) {
    this.selectedLearningObjectives = Object.keys(learningObjectives).map((objectiveId) => ({
      objectiveId,
      evaluationCriteria: learningObjectives[objectiveId].evaluationCriteria,
      completionCriteria: learningObjectives[objectiveId].completionCriteria
    }));
  }

  sendConfirmStatus(value = true): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.storageService.set('localAttachedObjectives', []);
    this.confirmStatus.emit(value);
  }

  get folderFormControls() {
    return this.folderForm.controls;
  }

  isFolderFormValidate(): void {
    if(this.folderForm.valid) {
      this.submitted = true;
      if (!this.folderForm.controls['visibilityCriteria'].value) {
        this.folderForm.controls['visibilityCriteria'].setValue(false);
        if (this.params.operation === "edit") {
          this.updateFolder();
        } else {
          this.createFolder();
        }
  
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.params.operation === "edit") {
          this.updateFolder();
        } else {
          this.createFolder();
        }
      }
    } else {
      this.translate.get('contentBuilder.folder.completeMandatoryFields').subscribe((res) => {
        this.showErrorToast(res);
      }).unsubscribe();
    }
  }

  async createFolder() {
    this.params.parentElementId = this.params.parentElementId ? this.params.parentElementId : this.params.courseId;
    try {
      const res = await this.contentService.saveFolder(this.params.parentElementId, this.folderForm.value);
      await this.attachLearningObjective(res.body.elementId);
      if (res.status === 200) {
        this.sendConfirmStatus(true);
        this.contentService.showSuccessToast(this.contentService.messagesTranslations.folderSuccessMessage);
      }
    } catch (error: any) {
      if (error.status === 401) {
        this.dialogService.showAlertDialog({ title: { translationKey: error.error }, type: DialogTypes.ERROR });
      } else if (error.status === 404) {
        this.sendConfirmStatus(true);
        this.dialogService.showAlertDialog({title: { translationKey: error.error}, type: DialogTypes.ERROR});
      }else{
        this.sendConfirmStatus(true);
        this.dialogService.showAlertDialog({title: { translationKey: error.error}, type: DialogTypes.ERROR});
      }
    }
  }

  async updateFolder() {
    try {
      const res = await this.contentService.updateFolder(this.params.id, this.folderForm.value);
      await this.attachLearningObjective(this.params.id);
      if (res.status === 200) {
        this.contentService.showSuccessToast(this.contentService.messagesTranslations.folderUpdateMessage);
      }
    } catch (error: any) {
      if (error.status === 401 || error.status === 404) {
        this.dialogService.showAlertDialog({ title: { translationKey: error.error }, type: DialogTypes.ERROR });
      }
    }
    this.sendConfirmStatus(true);
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

  private async attachLearningObjective(elementId: string) {
    if (this.selectedLearningObjectives.length) {
      if (elementId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const learningObjectivePayload = {
          elementId: elementId,
          objectives: this.selectedLearningObjectives,
          type: 'folder'
        };
        // TODO: attach forum to learning outcome
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await this.learningOutcomeService.attach(this.params.courseId!, learningObjectivePayload);
        this.storageService.broadcastValue("updateCourseElement", { elementId: elementId, payload: { isLearningObjectiveLinked: true } });
      }
    }
  }

  private setCharacterLeftText(text = '', maxLength: number, type: string): void {
    if (text === '' || text === null) {
      this.setDefaultCharLength(type);
      return;
    }
    const textLength = text.length;
    const charLeft = maxLength - textLength;
    let translationKey = 'contentBuilder.folder.charactersLeft';
    if (charLeft <= 1) {
      translationKey = 'contentBuilder.folder.characterLeft';
    }
    this.translate.get(translationKey, { length: charLeft }).subscribe((res: string) => {
      this.folderNameLengthText = res;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private setDefaultCharLength(type: string): void {
    this.translate.get('contentBuilder.folder.maxOfCharacter', { length: this.folderNameLengthMax }).subscribe((res: string) => {
      this.folderNameLengthText = res;
    });
  }

  private async initLengthTextChange(): Promise<void> {
    const formVals = this.folderForm.value;
    this.setCharacterLeftText(formVals.title, this.folderNameLengthMax, 'title');
  }

  private showCharacterLeft(): void {
    const title = this.folderForm.get('title');
    if (title) {
      title.valueChanges.subscribe(val => {
        this.setCharacterLeftText(val, this.folderNameLengthMax, 'title');
      });
    }
  }

  public attachLearningObjectives(type: string): void {
    this.router.navigate([`./learning-objective/${type}`], {
      relativeTo: this.params.currentActivtedRoute, state: {
        preventReinitilizing: true,
      }
    });
  }
}
