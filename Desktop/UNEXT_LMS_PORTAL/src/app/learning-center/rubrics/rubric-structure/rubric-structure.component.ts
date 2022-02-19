/* eslint-disable max-lines-per-function */
/* eslint-disable max-params */
/* eslint-disable eqeqeq */
/* eslint-disable no-useless-return */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DialogTypes } from 'src/app/enums/Dialog';
import { RubricOperations } from 'src/app/enums/rubricOperations';
import { CustomValidator } from 'src/app/form-validation/CustomValidator';
import { DialogService } from 'src/app/services/dialog.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { RubricPreviewComponent } from '../rubric-preview/rubric-preview.component';
import { RubricsService } from '../service/rubrics.service';

@Component({
  selector: 'app-rubric-structure',
  templateUrl: './rubric-structure.component.html',
  styleUrls: ['./rubric-structure.component.scss']
})
export class RubricStructureComponent implements OnInit {

  criteriaNumber = 0;
  levelNumber = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any = []
  @Input() canEdit!: boolean;
  @Input() rubricData: any = [];
  @Input() rubricTitle!: string;
  @Input() operation!: string;
  @Input() isSelection!: boolean;
  @Input() rubricLevelsData: any = [];
  @Input() status!: string;
  @Output() titleValid = new EventEmitter()
  levelNames: any;
  rubricId = "";
  private unsubscribe$ = new Subject<void>();
  levelKeys: any = [];
  myForm: FormGroup = new FormGroup({});
  rubricSubArray: any;
  @Output() onSaveRubric = new EventEmitter();
  validationPopUpShow = false;
  innerWidth: any
  showLeftArrow = false;
  showRightArrow = false;
  startIndex!: number;
  endIndex!: number;
  constructor(private rubricService: RubricsService, private dialogService: DialogService, public formBuilder: FormBuilder, private cdr: ChangeDetectorRef, private activateRoute: ActivatedRoute, private router: Router, private routeOperation: RouteOperationService) {
  }

  ngOnInit(): void {
    this.routeOperation.listenParams().pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.rubricId = params.rubricId;

    });
    this.innerWidth = window.innerWidth >= 1920 ? 5 : 3;
    this.startIndex = 0;
    this.endIndex = this.innerWidth;
    this.createFormControls();
    this.getLevelNameControls();
    this.showRightArrow = this.levelNames.length > this.innerWidth ? true : false;
  }
  createFormControls() {
    this.rubricSubArray = [...this.rubricData];
    // eslint-disable-next-line prefer-const
    let criterias = this.formBuilder.array([]);
    this.levelNames = this.formBuilder.array([]);
    this.myForm = this.formBuilder.group({ criterias: criterias, levelNames: this.levelNames });
    this.rubricLevelsData.forEach((element: any, index: number) => {
      const key = Object.keys(element);
      if (this.levelKeys.indexOf(key[0]) == -1) {
        this.levelKeys.push(key[0]);
      }
      const levelsData = this.formBuilder.group({
        [key[0]]: new FormControl(element[key[0]], [Validators.required, CustomValidator.alphaNumeric])
      });
      this.levelNames.push(levelsData);
      this.valueChanges(levelsData, index);
    });
    this.rubricData.forEach((element: any, _i: any) => {
      const myForm = this.formBuilder.group({
        criteriaName: new FormControl(element.criteriaName, [ this.duplicateValidationError(_i), CustomValidator.alphaNumeric]),
        weightage: [element.weightage, { validators: this.weightageValidationError(), updateOn: 'blur'}],
        levels: this.createLevelsControl(element.levels, _i)
      });
      criterias.push(myForm);
      this.criteriaWeightageValueChanges(myForm, _i);
    });
  }
  getLevelNameControls() {
    this.levelNames = ((this.myForm?.get('levelNames') as FormArray)?.controls) as FormGroup[];
    return this.levelNames;
  }
  duplicateValidationError(index: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const criteriaIndex = this.getCriteriaControls().filter(fg => fg.controls.criteriaName.value === control.value);
      if (criteriaIndex.length > 1) {
        this.rubricService.showErrorToast(`${control.value} ${this.rubricService.messagesTranslations.alreadyExist}`, 'toast-top-center');
        control.setValue("", { emitEvent: false });
      }
      return criteriaIndex.length > 1 || control.value === "" ? { Validators: Validators.required } : null;
    };
  }
  weightageValidationError(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const criteriaControls = this.getCriteriaControls();
      let weightagesSum = 0;
      criteriaControls.forEach(fg => {
        weightagesSum += Number(fg.controls.weightage.value);
      });
      if (weightagesSum == 100) {
        criteriaControls.forEach(fg => {
          if (fg.controls.weightage.value == 0) {
            fg.controls.weightage.setErrors({ Validators: Validators.required });
          } else {
            fg.controls.weightage.setErrors(null);
          }
        });
      }
      return weightagesSum < 100 || weightagesSum == 0 || control.value === 0|| weightagesSum > 100 ? { Validators: Validators.required } : null;
    };
  }
  getWeightageControls(): FormGroup[] {
    return ((this.myForm?.get('weightage') as FormArray)?.controls) as FormGroup[];
  }
  getCriteriaControls(): FormGroup[] {
    return ((this.myForm?.get('criterias') as FormArray)?.controls) as FormGroup[];
  }
  valueChanges(levelControl:any, index: number){
    levelControl.controls[this.levelKeys[index]].valueChanges.subscribe((value: any) => {
      let isExist = 0;
      const controlValue = this.getValue(levelControl);
      this.myForm.getRawValue().levelNames.forEach((fv: any, index: number) => {
        if (fv[this.levelKeys[index]] === controlValue) {
          isExist += 1;
        }
      });
      if (isExist > 1) {
        levelControl.controls[this.getFormControl(levelControl)].setValue('', { emitEvent: false });
        this.rubricService.showErrorToast(`${controlValue} ${this.rubricService.messagesTranslations.alreadyExistLevel}`, 'toast-top-center');
      }

    });
  }
  getValue(levelControl:any){
    this.startIndex;
    const key = Object.keys(levelControl.controls)[0];
    const value = levelControl.get(key)?.value;
    return value;
  }
  getFormControl(levelControl:any){
    return Object.keys(levelControl.controls)[0];
  }
  getFormGroupName(levelControl:any): number{
    const _key = Object.keys(levelControl.controls)[0];
    return this.levelKeys.findIndex((key: string)=> key === _key);
  }
  getFormStatus(levelControl: any){
    return levelControl.controls[this.getFormControl(levelControl)].invalid;
  }
  getLevelsControls(index: number, level?: any): any {
    let controls;
    if (level) {
      controls = ((this?.myForm?.get('criterias') as FormArray)?.controls[index]?.get('levels') as FormGroup)?.controls[level];
    } else {
      controls = ((this?.myForm?.get('criterias') as FormArray)?.controls[index]?.get('levels') as FormGroup)?.controls;
    }
    return controls;
  }
  getLastLevelKey(): number{
    const keys = Object.keys(this.levelNames[this.levelNames.length - 1].controls);
    const lastKey = keys.pop();
    return Number(lastKey?.split('L')[1]);
  }
  getBiggerKey(): number{
    let biggerKey!: number;
    this.levelNames.forEach((fg: any, index: number) => {
      const value = Number(this.getFormControl(fg).split('L')[1]);
      if(index === 0){
        biggerKey = value;
      }else if(biggerKey < value){
        biggerKey = value;
      }
    });
    return biggerKey;
  }
  createLevelsControl(levels: any, criteriaIndex: number) {
    const dt = new FormGroup({});
    const keys: string[] = Object.keys(levels);
    keys.forEach((key: string, index: number) => {
      this.getDescription(criteriaIndex, key);
      dt.addControl(key, this.formBuilder.group({ percentage: [levels[key].percentage, { validators: this.progressionValidator(criteriaIndex), updateOn: 'blur' }], description: [levels[key].description] }));
      this.percentageValueChanges(dt, key, index, criteriaIndex);
    });
    return dt;
  }
  percentageValueChanges(percentageFormControl: any, key: string, index: number, criteriaIndex: number) {
    percentageFormControl.controls[key].controls.percentage.valueChanges.subscribe((value:any) => {
      let levelsCount = 0;
      const controls: any = ((this?.myForm?.get('criterias') as FormArray)?.controls[criteriaIndex]?.get('levels') as FormGroup)?.controls;
      const levelControls: any = ((this?.myForm?.get('criterias') as FormArray)?.controls[criteriaIndex]?.get('levels') as FormGroup);
      this.levelKeys.forEach((key: string) => {
        if(controls[key].dirty === true) {
          levelsCount += 1;
        }
      });
      if((Number(value) < 100 && value !== "") && ((levelControls.invalid && levelsCount === Object.entries(controls).length) || (percentageFormControl.controls[key].controls.percentage.invalid && this.operation === RubricOperations.EDIT))){
        this.rubricService.showErrorToast(this.rubricService.messagesTranslations.percentageValidation, 'toast-top-right');
      }
    });
  }
  criteriaWeightageValueChanges(myForm: any, _i: number){
    myForm.controls.weightage.valueChanges.subscribe((value:any) =>{
      const criteriaControls: any = (this?.myForm?.get('criterias') as FormArray).controls;
      const dirtyControlsLength = criteriaControls.filter((control: any) => control.dirty === true).length;
      let weightagesSum = 0;
      criteriaControls.forEach((fg: any) => {
        weightagesSum += Number(fg.controls.weightage.value);
      });
      if(weightagesSum > 100){
        const isFormValid = ((this.myForm.get('criterias') as FormArray).controls[_i] as FormGroup).controls.weightage.valid;
        if(!isFormValid){
          this.rubricService.showErrorToast(this.rubricService.messagesTranslations.weightagesValidation, 'toast-top-right');
        }
      } else if((dirtyControlsLength === criteriaControls.length && this.operation === RubricOperations.CREATE && weightagesSum < 100) || (this.operation === RubricOperations.EDIT && weightagesSum < 100)){
        this.rubricService.showErrorToast(this.rubricService.messagesTranslations.weightagesValidation, 'toast-top-right');
      }
    });
  }
  onKeyPress(event: any, type: string){
    let regex!: RegExp;
    let value;
    switch (type) {
      case RubricOperations.WEIGHTAGE:
      case RubricOperations.PERCENTAGE:
        regex = new RegExp(/^\d*\.?\d{0,1}$/g);
        value = event.target.value + event.key;
        break;
      default:
        break;
    }
    if(!(value && String(value).match(regex))){
      event.preventDefault();
    }
  }
  progressionValidator(criteriaIndex: number,): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const levels = this.getLevelsControls(criteriaIndex);
      let isAscending: boolean;
      let previousPercentage = 0;
      let message: any = null;
      if(Number(control.value) > 100 || Number(control.value) < 0){
        message = { Validators: Validators.required };
        control.setValue('', {emitEvent: false});
        this.rubricService.showErrorToast(this.rubricService.messagesTranslations.percentageValueValidation, 'toast-top-right');
      }else if (levels) {
        const keys = Object.keys(levels);
        this.levelKeys.forEach((element: any, index: number) => {
          if (levels) {
            if (index === 1 && previousPercentage > Number(levels[element].controls.percentage.value)) {
              isAscending = false;
            } else if (index === 1 && previousPercentage < Number(levels[element].controls.percentage.value)) {
              isAscending = true;
            }
            if (index > 1 && (isAscending !== (previousPercentage < Number(levels[element].controls.percentage.value))) || previousPercentage === Number(levels[element].controls.percentage.value)) {
              message = { Validators: Validators.required };
            }
            if (Number(levels[element].controls.percentage.value) < 0) {
              message = { Validators: Validators.required };
            }
            previousPercentage = Number(levels[element].controls.percentage.value);
          }
        });
        if (message === null) {
          keys.forEach((element: any) => {
            levels[element].controls.percentage.setErrors(null);
          });
        }
      }
      return message;
    };
  }
  scrollRight() {
    this.showLeftArrow = true;
    this.startIndex += 1;
    this.endIndex += 1;
    this.showRightArrow = this.endIndex === this.levelNames.length ?false: true;
  }
  scrollLeft() {
    this.startIndex -= 1;
    this.endIndex -= 1;
    this.showLeftArrow = this.startIndex === 0? false : true;
    this.showRightArrow = this.endIndex < this.levelNames.length ?true: false;
  }
  levelKeysToDisplay() {
    let keysToDisplay: any = [];
    if(this.levelKeys.length > this.innerWidth) {
      for (let i = this.startIndex; i < this.endIndex; i++ ){
        keysToDisplay.push(this.levelKeys[i]);
      }
    }else{
      keysToDisplay = [...this.levelKeys];
    }
    return keysToDisplay;
  }
  addLevel(): void {
    this.rubricData = [...this.myForm.getRawValue().criterias];
    this.rubricLevelsData = [...this.myForm.getRawValue().levelNames];
    this.canEdit = false;
    this.rubricData.forEach((criteria: any) => {
      criteria.levels['L' + (this.getBiggerKey() + 1)] = this.createNewLevel(criteria);
    });
    this.rubricLevelsData.push({ ['L' + (this.getBiggerKey() + 1)]: this.levelKeys.length < 9 ? 'New level 0' + (this.levelNumber += 1) : 'New level ' + (this.levelNumber += 1) });
    this.levelKeys.push('L' + (this.getBiggerKey() + 1));
    this.createFormControls();
    this.getLevelNameControls();
    this.showRightArrow = this.levelNames.length > this.innerWidth ? true : false;
  }
  addLevelBeforeOrAfter(value: any, type: string) {
    this.rubricData = [...this.myForm.getRawValue().criterias];
    this.rubricLevelsData = [...this.myForm.getRawValue().levelNames];
    const indexOfCurrentIndex = type === RubricOperations.ADD_LEVEL_LEFT? this.getFormGroupName(value): this.getFormGroupName(value) + 1;
    this.rubricData.forEach((criteria: any) => {
      criteria.levels['L' + (this.getBiggerKey() + 1)] = this.createNewLevel(criteria);
    });
    this.rubricLevelsData.splice(indexOfCurrentIndex, 0, { ['L' + (this.getBiggerKey() + 1)]: this.levelKeys.length < 9 ? 'New level 0' + (this.levelNumber += 1) : 'New level ' + (this.levelNumber += 1) });
    this.rubricLevelsData.join();
    this.levelKeys.splice(indexOfCurrentIndex, 0, 'L' + (this.getBiggerKey() + 1));
    this.levelKeys.join();
    this.createFormControls();
    this.getLevelNameControls();
    this.showRightArrow = this.endIndex < this.levelNames.length? true: false;
  }
  getDescription(index: number, level: any) {
    this.rubricSubArray;
    this.rubricSubArray[index].levels[level]["counter"] = (this.rubricSubArray[index].levels[level].description.substring(0, 100)).lastIndexOf(' ');
    this.rubricSubArray[index].levels[level]["showText"] = "more";
  }
  onClickMoreOrLess(criteriaIndex: number, level: string, status: string, description: string) {
    if (this.rubricSubArray[criteriaIndex].levels[level].counter < 101) {
      this.rubricSubArray[criteriaIndex].levels[level].counter = description.length;
      this.rubricSubArray[criteriaIndex].levels[level]["showText"] = "less";
    } else {
      this.rubricSubArray[criteriaIndex].levels[level].counter = (this.rubricSubArray[criteriaIndex].levels[level].description.substring(0, 100)).lastIndexOf(' ');
      this.rubricSubArray[criteriaIndex].levels[level]["showText"] = "more";
    }
  }
  removeLevel(keyToDelete: any, index: number){
    (this.myForm.get('criterias') as FormArray).controls.forEach((fg: any) => {
      delete fg.controls.levels.controls[keyToDelete];
      delete fg.controls.levels.value[keyToDelete];
    });
    this.rubricData.forEach((element: any) => {
      delete element.levels[keyToDelete];
    });
    this.levelNames.splice(index, 1);
    this.levelKeys.splice(index, 1);
    this.rubricLevelsData.splice(index, 1);
    if(this.startIndex > 0){
      this.startIndex -= 1;
      this.endIndex -= 1;
    }
    this.showRightArrow = this.levelNames.length > this.innerWidth && this.endIndex < this.levelNames.length? true: false;
    this.showLeftArrow = this.startIndex > 0?true: false;
  }
  addCriteria(): void {
    this.rubricData = [...this.myForm.getRawValue().criterias];
    const criteria = this.createNewCriteria();
    this.canEdit = false;
    this.rubricData.push(criteria);
    this.createFormControls();
    this.getLevelNameControls();
  }
  getLevels(): Array<string> {
    return this.rubricData[0]?.levels.map((level: any) => level.level);
  }
  clickEvent(data: any, type: any): void {
    switch (type) {
      case RubricOperations.REMOVE_CRITERIA:
        this.removeCriteria(data);
        break;
      case RubricOperations.REMOVE_LEVEL:
        this.removeGradeLevel(data);
        break;
      case RubricOperations.ADD_CRITERIA_ABOVE:
      case RubricOperations.ADD_CRITERIA_BELOW:
        this.addCriteriaAboveOrBelow(data);
        break;
      case RubricOperations.ADD_LEVEL_LEFT:
      case RubricOperations.ADD_LEVEL_RIGHT:
        this.addLevelBeforeOrAfter(data, type);
        break;
      case RubricOperations.COPY_CRITERIA:
        this.copyRubric(data);
        break;
      case RubricOperations.SAVE_CRITERIA:
        this.saveRubric('active');
        break;
      case RubricOperations.SAVE_AS_DRAFT:
        this.saveRubric('draft');
        break;
      case RubricOperations.DELETE:
        this.deleteRubric();
        break;
      case RubricOperations.EDIT:
        this.editRubric();
        break;
      case RubricOperations.CANCEL:
        this.routeBackToRubricListPage();
        break;
      default:
        break;
    }
  }
  async removeGradeLevel(gradeLevelData: any): Promise<void> {
    const message = `${this.rubricService.messagesTranslations.deleteRubric} the Grade Level?`;
    const keyToDelete = this.getFormControl(gradeLevelData);
    const index = this.levelKeys.findIndex((key: string) => key === keyToDelete);
    if (this.levelKeys.length > 1) {
      const confirmation = await this.dialogService.showConfirmDialog({ title: { translationKey: message } });
      if (!confirmation) {
        return;
      }
      this.removeLevel(keyToDelete, index);
      this.cdr.detectChanges();
    }
  }
  async removeCriteria(rowData: any): Promise<any> {
    const message = `${this.rubricService.messagesTranslations.deleteRubric} this Criteria?`;
    if (this.rubricData.length > 1) {
      const confirmation = await this.dialogService.showConfirmDialog({ title: { translationKey: message } });
      if (!confirmation) {
        return;
      }
      const index = this.getCriteriaControls().findIndex(fg => fg.controls.criteriaName.value === rowData.controls.criteriaName.value);
      this.getCriteriaControls().splice(index, 1);
      this.rubricData.splice(index, 1);
      const controls = this.getCriteriaControls();
      controls.forEach(fg => {
        //fg.controls.weightage.setValue("", { emitEvent: false });
        fg.controls.weightage.setErrors({ Validators: Validators.required });
      });
      this.cdr.detectChanges();
    }
  }
  createNewCriteria() {
    const criteria = JSON.parse(JSON.stringify(this.rubricData[0]));
    criteria.criteriaName = this.criteriaNumber < 9 ? "New Criteria 0" + (this.criteriaNumber += 1) : "New Criteria " + (this.criteriaNumber += 1);
    criteria.weightage = 0;
    const keys = Object.keys(criteria.levels);
    keys.forEach(key => {
      criteria.levels[key].description = "";
      criteria.levels[key].percentage = 0;
    });
    return criteria;
  }
  createNewLevel(criteria: any) {
    return { "description": "", "percentage": 0 };
  }
  addCriteriaAboveOrBelow(value: number): void {
    this.rubricData = [...this.myForm.getRawValue().criterias];
    const criteria = this.createNewCriteria();
    this.canEdit = false;
    this.rubricData.splice(value, 0, criteria);
    this.rubricData.join();
    this.createFormControls();
    this.getLevelNameControls();
  }

  copyRubric(copiedRubric: any): void {
    this.rubricData = [...this.myForm.getRawValue().criterias];
    copiedRubric.value.criteriaName = `Copy of ${copiedRubric.value.criteriaName}`;
    const existIndex = this.rubricData.findIndex((rd: any) => rd.criteriaName === copiedRubric.value.criteriaName);
    if(existIndex !== -1) {
      copiedRubric.value.criteriaName = `${copiedRubric.value.criteriaName}(1)`;
    }
    this.rubricData.push(copiedRubric.value);
    this.createFormControls();
    this.getLevelNameControls();
  }
  deleteRubric(): void {
    const payload = { type: RubricOperations.DELETE, rubricId: this.rubricId, title: this.rubricTitle };
    this.onSaveRubric.emit(payload);
  }

  editRubric(): void {
    const payload = { type: RubricOperations.EDIT, rubricId: this.rubricId };
    this.onSaveRubric.emit(payload);
  }

  saveRubric(_type: string) {
    if (this.myForm.invalid) {
      this.rubricService.showErrorToast(this.rubricService.messagesTranslations.mandatoryFields, 'toast-bottom-right');
      this.titleValid.emit({invalid: true});
    } else {
      const values = this.myForm.getRawValue();
      const payload = { status: _type, title: this.rubricTitle, criterias: values.criterias, levelNames: values.levelNames, type: RubricOperations.UPDATE };
      this.onSaveRubric.emit(payload);
    }
  }
  routeBackToRubricListPage() {
    const params = this.operation === 'edit' ? '../../../' : '../../';
    this.router.navigate([params], { relativeTo: this.activateRoute, queryParams: { leftMenu: "true", id: "learning-center", courseDropDown: "true", toc: "false" } });
  }
  drop(event: any) {
    this.rubricData = [...this.myForm.getRawValue().criterias];
    this.levelNames = [...this.myForm.getRawValue().levelNames];
    moveItemInArray(this.rubricLevelsData, event.previousIndex, event.currentIndex);
    moveItemInArray(this.levelKeys, event.previousIndex, event.currentIndex);
    moveItemInArray(this.levelNames, event.previousIndex, event.currentIndex);
    this.createFormControls();
    this.getLevelNameControls();
  }
  criteriaDrop(event: any) {
    moveItemInArray(this.getCriteriaControls(), event.previousIndex, event.currentIndex);
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
