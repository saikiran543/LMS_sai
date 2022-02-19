/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/enums/service';
import { Subject, takeUntil } from 'rxjs';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { LearningOutcomeService } from '../service/learning-outcome.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { LearningOutcomeTypes } from 'src/app/enums/learning-outcome';
import { Dialog } from 'src/app/Models/Dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { ToastrService } from 'ngx-toastr';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ICommonBody, ILearningOutComeResponse } from 'src/app/Models/common-interfaces';
import { ContentType } from 'src/app/enums/contentType';
import { ForumType } from 'src/app/enums/forumType';
@Component({
  selector: 'app-learning-outcome-list-view',
  templateUrl: './learning-outcome-list-view.component.html',
  styleUrls: ['./learning-outcome-list-view.component.scss']
})
export class LearningOutcomeListViewComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any = {
    activatedRoute: null,
    addObjective: false,
    viewType: undefined
  }
  @Output() confirmStatus = new EventEmitter();
  learningOutcomes: any[] = [];
  learningCategories: any[] = [];
  learningObjectives: any[] = [];
  criteriaFormGroup = new FormGroup({});
  courseId = ""
  throttle = 50;
  scrollDistance = 1;
  ElementType: any;
  ElementSubType!: string;
  operationType!: string;
  elementId!: string;
  type!: string;
  private isInitialized!: boolean;
  selectedObjectives: any[] = [];
  sanetize!: any;
  elementDetail!: any;
  previousQueryParams: any = {
  }
  filterOptions: any = {
    'learning-outcome': {
      limit: 10,
      page: 1,
      limitReached: false
    },
    'learning-category': {
      limit: 10,
      page: 1,
      limitReached: false
    },
    'learning-objective': {
      limit: 10,
      page: 1,
      limitReached: false
    }
  };
  completionCriteriaToolTip = false;
  evaluationCriteriaToolTip = false;
  completionCriteriaToolTipMessage = "It tracks the progress of the content for the user"
  evaluationCriteriaToolTipMessage = "It tracks the %age of marks scored by user in that activity"
  private unsubscribe$ = new Subject<void>();
  removedObjectiveId: any = {}
  storageOutcomes: any = [];
  storedObjective: any = []
  // eslint-disable-next-line max-params
  constructor(private router: Router,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private routeOperation: RouteOperationService,
    private learningOutcomeService: LearningOutcomeService,
    private dialogService: DialogService,
    private leftNavService: LeftNavService,
    private toastrService: ToastrService,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    private location: Location) { }

  ngOnInit(): void {
    this.translate.use('en');
    this.sanetize = this.sanitizer;
    this.routeOperation.listenAllParams().pipe(takeUntil(this.unsubscribe$)).subscribe(async allParams => {
      this.courseId = allParams.params.courseId;
      this.type = allParams.params.type;
      this.operationType = allParams.params.operation;
      this.ElementSubType = allParams.params.type;
      if ((this.params.viewType === "viewLearningObjective" || this.params.viewType === "addLearningObjective") && allParams.params.type) {
        try {
          this.storageOutcomes = this.storageService.get('localAttachedObjectives');
          // eslint-disable-next-line no-empty
        } catch {
        }
        this.elementId = allParams.params.id;
        this.ElementType = this.ElementType || await this.learningOutcomeService.getElementType(this.ElementSubType);
      }
      if (this.params.viewType === "viewLearningObjective" || (this.params.viewType === "addLearningObjective" && this.operationType !== 'create')) {
        try {
          this.storageOutcomes = this.storageService.get('localAttachedObjectives');
          // eslint-disable-next-line no-empty
        } catch {
        }
        this.elementId = allParams.params.id;
        if (this.operationType !== 'create') {
          this.elementDetail = this.elementDetail || (this.elementId && await this.learningOutcomeService.getElementDetail(this.courseId, this.elementId));
        }
      }
      await this.initializeOutComes(allParams);
      await this.initializeCategoryAndObjectives(allParams.queryParams);
      this.previousQueryParams = allParams.queryParams;
    });

    this.listenToStorageService();
  }
  private async initializeCategoryAndObjectives(queryParams: any) {
    queryParams = JSON.parse(JSON.stringify(queryParams));
    if (queryParams.outcomeId && this.previousQueryParams.outcomeId !== queryParams.outcomeId) {
      this.learningCategories = [];
      if (this.params.viewType === "viewLearningObjective") {
        this.learningCategories = this.getAttachedCategories(queryParams.outcomeId);
      }
      else {
        this.initializeDefaultFilterOption(LearningOutcomeTypes.CATEGORY);
        await this.getCategories(queryParams.outcomeId);
      }
      if (!queryParams.categoryId) {
        this.learningObjectives = [];
        if (this.learningCategories.length > 0) {
          queryParams['categoryId'] = this.learningCategories[0].categoryId;
          setTimeout(() => {
            this.router.navigate([], { queryParams: queryParams, replaceUrl: true });
          }, 0);
        }
        return;
      }
    }
    if (queryParams.categoryId && this.previousQueryParams.categoryId !== queryParams.categoryId) {
      this.learningObjectives = [];
      if (this.params.viewType === "viewLearningObjective") {
        this.learningObjectives = this.getAttachedObjectives(queryParams.categoryId);
        this.createCriteriaControlAndSetValue(this.learningObjectives);
      }
      else {
        this.initializeDefaultFilterOption(LearningOutcomeTypes.OBJECTIVE);
        await this.getObjectives(queryParams.categoryId);
      }
    }
  }
  private async initializeOutComes(allParams: any) {
    const queryParams = JSON.parse(JSON.stringify(allParams.queryParams));
    if (!this.learningOutcomes.length) {
      if (this.params.viewType === "viewLearningObjective") {
        if (this.operationType !== 'create') {
          this.learningOutcomes = await this.learningOutcomeService.getAttachedOutcomes(this.elementDetail.elementId);
        }
        if (this.operationType === 'edit' || this.operationType === 'create') {
          this.storageOutcomes.forEach((item: any) => {
            const index = this.learningOutcomes.findIndex((element: any) => element.outcomeId === item.outcomeId);
            if (index !== -1) {
              item.categories.forEach((cat: any) => {
                const i = this.learningOutcomes[index].categories.findIndex((element: any) => element.categoryId === cat.categoryId);
                if (i !== -1) {
                  this.learningOutcomes[index].categories[i].objectives = [...this.learningOutcomes[index].categories[i].objectives, ...cat.objectives];
                } else {
                  this.learningOutcomes[index].categories.push(cat);
                }
              });
            }
            else {
              this.learningOutcomes.push(item);
            }
          });
        }
        this.makeCheckedAlreadyAttachedObjective(this.learningOutcomes);
      }
      else {
        await this.getLearningOutCome();
      }
      if (!queryParams.outcomeId) {
        this.learningCategories = [];
        if (this.learningOutcomes.length > 0) {
          queryParams['outcomeId'] = this.learningOutcomes[0].outcomeId;
          this.router.navigate([], { queryParams: queryParams, replaceUrl: true });
        }
      }
    }
  }

  makeCheckedAlreadyAttachedObjective(outcomes: any) {
    outcomes.forEach((outcome: any) => {
      outcome.categories.forEach((category: any) => {
        category.objectives.forEach((objective: any) => {
          if (!Object.keys(objective).includes('checked')) {
            objective.checked = true;
          }
        });
      });
    });
  }

  async getLearningOutCome(): Promise<any> {
    const filterOptions = this.filterOptions[LearningOutcomeTypes.OUTCOME];
    const result = await this.learningOutcomeService.getAll(Service.COURSE_SERVICE, LearningOutcomeTypes.OUTCOME, this.courseId, filterOptions.page, filterOptions.limit);
    this.learningOutcomes = [...this.learningOutcomes, ...result];
    return result;
  }

  private async getCategories(outcomeId: string): Promise<any> {
    const filterOptions = this.filterOptions[LearningOutcomeTypes.CATEGORY];
    const result = await this.learningOutcomeService.getAll(Service.COURSE_SERVICE, LearningOutcomeTypes.CATEGORY, outcomeId, filterOptions.page, filterOptions.limit, this.courseId);
    this.learningCategories = [...this.learningCategories, ...result];
    return result;
  }

  private async getObjectives(categoryId: string): Promise<any> {
    const filterOptions = this.filterOptions[LearningOutcomeTypes.OBJECTIVE];
    const result = await this.learningOutcomeService.getAll(Service.COURSE_SERVICE, LearningOutcomeTypes.OBJECTIVE, categoryId, filterOptions.page, filterOptions.limit, this.courseId);
    //this.ElementType? result = result.filter((objective: any) => objective.canBeLinkedTo === this.ElementType || objective.canBeLinkedTo === 'both'): '';
    this.learningObjectives = [...this.learningObjectives, ...result];
    if (this.operationType) {
      !this.storedObjective.length && this.storageOutcomes.length && this.storageOutcomes.forEach((element: any) => {
        element.categories.forEach((obj: any) => {
          this.storedObjective = [...this.storedObjective, ...obj.objectives];
        });
      });
      this.storedObjective.forEach((element: any) => {
        const index = this.learningObjectives.findIndex(item => item.objectiveId === element.objectiveId);
        if (index !== -1) {
          this.learningObjectives[index] = element;
        }
      });
    }
    return result;
  }

  getAttachedCategories(outcomeId: string): [] {
    const outcome = this.learningOutcomes.find(outcome => outcome.outcomeId === outcomeId);
    return outcome && outcome.categories ? outcome.categories : [];
  }

  getAttachedObjectives(categoryId: string): [] {
    const outcome = this.learningCategories.find(category => category.categoryId === categoryId);
    return outcome && outcome.objectives ? outcome.objectives : [];
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  createCriteriaControlAndSetValue(objectives: any): void {
    objectives.forEach((objective: any) => {
      if (!this.removedObjectiveId[objective.objectiveId]) {
        const form = new FormGroup({});
        if (objective.completionCriteria) {
          const criteriaForm = new FormGroup({});
          this.createCriteriaFormGroup(criteriaForm, 'achieved', objective, "completionCriteria", objective.completionCriteria.achieved);
          this.createCriteriaFormGroup(criteriaForm, 'partiallyAchieved', objective, "completionCriteria", objective.completionCriteria.partiallyAchieved);
          this.createCriteriaFormGroup(criteriaForm, 'notAchieved', objective, "completionCriteria", objective.completionCriteria.notAchieved);
          form.addControl('completionCriteria', criteriaForm);
        }
        if (objective.evaluationCriteria) {
          const criteriaForm = new FormGroup({});
          this.createCriteriaFormGroup(criteriaForm, 'achieved', objective, "evaluationCriteria", objective.evaluationCriteria.achieved);
          this.createCriteriaFormGroup(criteriaForm, 'partiallyAchieved', objective, "evaluationCriteria", objective.evaluationCriteria.partiallyAchieved);
          this.createCriteriaFormGroup(criteriaForm, 'notAchieved', objective, "evaluationCriteria", objective.evaluationCriteria.notAchieved);
          form.addControl('evaluationCriteria', criteriaForm);
        }
        this.criteriaFormGroup.addControl(objective.objectiveId, form);
      }

      // this.criteriaFormGroup.disable();
    });
  }

  truncateObjectiveBreadcrum(breadcrum: string): string {
    const breadcrumbs = breadcrum.split('/');
    breadcrum = breadcrumbs[0] + '... / ';
    return breadcrum;
  }

  breadCrumTitle(breadcrum: string): string {
    const breadcrumbs = breadcrum.split('/');
    return breadcrumbs[breadcrumbs.length - 1];
  }

  private initializeDefaultFilterOption(type: string): void {
    this.filterOptions[type].page = 1;
    this.filterOptions[type].limitReached = false;
  }

  private listenToStorageService() {
    this.storageService.listen('createdElement').pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.checkAndAdd(data.element, data.type);
    });
    this.storageService.listen('updatedElement').pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.findAndReplace(data.element, data.type);
    });
  }

  getNodeIconType(node: any): string {
    let nodeType: ContentType | ForumType = node.contentType;
    if(nodeType === ContentType.DISCUSSION_FORUM) {
      if(node.subContentType) {
        nodeType = node.subContentType;
      }
    }
    return nodeType;
  }

  async onScrollDown(type: string): Promise<void> {
    if (this.params.viewType === "viewLearningObjective") {
      return;
    }
    ++this.filterOptions[type].page;
    // eslint-disable-next-line no-console
    if (!this.filterOptions[type].limitReached) {
      let response: any;
      switch (type) {
        case LearningOutcomeTypes.OUTCOME:
          response = await this.getLearningOutCome();
          break;
        case LearningOutcomeTypes.CATEGORY:
          response = await this.getCategories(this.previousQueryParams.outcomeId);
          break;
        case LearningOutcomeTypes.OBJECTIVE:
          response = await this.getObjectives(this.previousQueryParams.categoryId);
          break;
        default:
          break;
      }
      if (!response.length) {
        this.filterOptions[type].limitReached = true;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  addElement(element: any, newElement: any, type: string): void {
    // adds element to the beggining of the elements array
    switch (type) {
      case LearningOutcomeTypes.OUTCOME: {
        const index = this.learningOutcomes.findIndex(ele => ele.outcomeId === element.outcomeId);
        index > -1 && this.learningOutcomes.splice(index + 1, 0, newElement);
        break;
      }
      case LearningOutcomeTypes.CATEGORY: {
        const index = this.learningCategories.findIndex(ele => ele.categoryId === element.categoryId);
        index > -1 && this.learningCategories.splice(index + 1, 0, newElement);
        break;
      }
      case LearningOutcomeTypes.OBJECTIVE:
        const index = this.learningObjectives.findIndex(ele => ele.objectiveId === element.objectiveId);
        index > -1 && this.learningObjectives.splice(index + 1, 0, newElement);
        break;
      default:
        break;
    }
  }

  addEmptyElements(element: any): any {
    if (!element.elements) {
      element.elements = [];
    }
    return element;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  findAndReplace(element: any, type: string): void {
    // adds element to the beggining of the elements array
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
        {
          const index = this.learningOutcomes.findIndex((ele: any) => ele.outcomeId === element.outcomeId);
          if (index > -1) {
            this.learningOutcomes.splice(index, 1);
            this.learningOutcomes.splice(index, 0, element);
          }
        }
        break;
      case LearningOutcomeTypes.CATEGORY:
        {
          const index = this.learningCategories.findIndex((ele: any) => ele.categoryId === element.categoryId);
          if (index > -1) {
            this.learningCategories.splice(index, 1);
            this.learningCategories.splice(index, 0, element);
          }
        }
        break;
      case LearningOutcomeTypes.OBJECTIVE:
        {
          const index = this.learningObjectives.findIndex((ele: any) => ele.objectiveId === element.objectiveId);
          if (index > -1) {
            this.learningObjectives.splice(index, 1);
            this.learningObjectives.splice(index, 0, element);
          }
        }
        break;

      default:
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  checkAndAdd(newElement: any, type: string): void {
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
        {
          const index = this.learningOutcomes.indexOf(newElement);
          if (index === -1) {
            this.learningOutcomes.unshift(newElement);
            this.click("select", type, this.learningOutcomes[0]);
          }

        }
        break;
      case LearningOutcomeTypes.CATEGORY:
        {
          const index = this.learningCategories.indexOf(newElement);
          if (index === -1) {
            this.learningCategories.unshift(newElement);
            this.click("select", type, this.learningCategories[0]);
          }
        }
        break;
      case LearningOutcomeTypes.OBJECTIVE:
        {
          const index = this.learningObjectives.indexOf(newElement);
          if (index === -1) {
            newElement = this.addEmptyElements(newElement);
            this.learningObjectives.unshift(newElement);
            this.click("select", type, this.learningObjectives[0]);
          }
        }
        break;

      default:
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  removeElement(element: any, type: string): void {
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
        {
          const index = this.learningOutcomes.indexOf(element);
          if (index > -1) {
            this.learningOutcomes.splice(index, 1);
            this.checkAndSelectNextElement(type, index);
          }
        }
        break;
      case LearningOutcomeTypes.CATEGORY:
        {
          const index = this.learningCategories.indexOf(element);
          if (index > -1) {
            this.learningCategories.splice(index, 1);
            this.checkAndSelectNextElement(type, index);
          }
        }
        break;
      case LearningOutcomeTypes.OBJECTIVE:
        {
          const index = this.learningObjectives.indexOf(element);
          if (index > -1) {
            this.learningObjectives.splice(index, 1);
            this.checkAndSelectNextElement(type, index);
          }
        }
        break;

      default:
        break;
    }
  }

  checkAndSelectNextElement(type: string, index: number): void {
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
        {
          if (this.learningOutcomes.length === 0) {
            this.learningObjectives = [];
            this.learningCategories = [];
            return;
          }
          if (this.learningOutcomes.length >= 1 && index === 0) {
            this.click("select", type, this.learningOutcomes[index]);
          }
          else {
            this.click("select", type, this.learningOutcomes[index - 1]);
          }
        }
        break;
      case LearningOutcomeTypes.CATEGORY:
        {
          if (this.learningCategories.length === 0) {
            this.learningObjectives = [];
            return;
          }
          if (this.learningCategories.length >= 1 && index === 0) {
            this.click("select", type, this.learningCategories[index]);
          }
          else {
            this.click("select", type, this.learningCategories[index - 1]);
          }
        }
        break;
      case LearningOutcomeTypes.OBJECTIVE:
        {
          if (this.learningObjectives.length === 0) {
            return;
          }
          if (this.learningObjectives.length >= 1 && index === 0) {
            this.click("select", type, this.learningObjectives[index]);
          }
          else {
            this.click("select", type, this.learningObjectives[index - 1]);
          }
        }
        break;

      default:
        break;
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getOutcomeCategoryId(element: any, type: string) {
    let id = "";
    if (type === LearningOutcomeTypes.OUTCOME) {
      id = element.outcomeId;
    }
    else if (type === LearningOutcomeTypes.CATEGORY) {
      id = element.categoryId;
    }
    else {
      id = element.objectiveId;
    }
    return id;
  }

  getStatusType(status: string, length: number): string {
    if (length > 0) {
      return "learningOutcomeListView.badges.inUse";
    }
    if (status === "active") {
      return "learningOutcomeListView.badges.active";
    }
    return "learningOutcomeListView.badges.inactive";
  }

  getApplicableTo(type: string): string {
    if (type === "content") {
      return "learningOutcome.applicableTo.content";
    }
    if (type === "activity") {
      return "learningOutcome.applicableTo.activity";
    }
    if (type === "both") {
      return "learningOutcome.applicableTo.both";
    }
    return "";
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getClassNameForStatus(objective: any): string {
    const status = this.getStatusType(objective.status, objective.elements.length);
    if (status === "learningOutcomeListView.badges.inUse") {
      return "use-state";
    }
    else if (status === "learningOutcomeListView.badges.active") {
      return "active-state";
    }
    return "inactive-state";
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getNumberOfLinks(elements: any) {
    return {
      number: elements.length
    };
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async deleteLinkedElement(elements: any, objective: any) {
    const dialog = { title: { translationKey: "learningOutcomeListView.unlinkWarning" } };

    const res = await this.dialogService.showConfirmDialog(dialog);
    if (res) {
      const payload: any = [];
      elements.forEach((item: any) => {
        payload.push({ type: 'content', elementId: item, objectives: [objective.objectiveId] });
      });
      await this.learningOutcomeService.unlinkElement(this.courseId, payload);
      this.showSuccessToast(this.learningOutcomeService.messagesTranslations.unlink);
      this.changeElementInObjective(elements, objective);
    }

  }

  navigateToContent(elementId: string, type: string): void {
    if (type === "content") {
      this.leftNavService.nodeDetailsEmitter.next(elementId);
      this.router.navigate(['../content-area/list/content/' + elementId], { relativeTo: this.activatedRoute, queryParams: { toc: true }, queryParamsHandling: 'merge' });
    }
    else {
      this.leftNavService.nodeDetailsEmitter.next(elementId);
      this.router.navigate(['../discussion-forums/forum-detail/' + elementId], { relativeTo: this.activatedRoute, queryParams: { toc: false }, queryParamsHandling: 'merge' });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  checkBoxClick(values: any, elementId: string, objectiveId: string, type: string): void {
    if (values.currentTarget.checked === true) {
      this.selectedObjectives.push({ elementId, objectiveId, type });
      return;
    }
    for (const selectedElement of this.selectedObjectives) {
      if (selectedElement.elementId === elementId && selectedElement.objectiveId === objectiveId) {
        const index = this.selectedObjectives.indexOf(selectedElement);
        if (index > -1) {
          this.selectedObjectives.splice(index, 1);
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  changeElementInObjective(elementIds: any, objective: any): void {
    const objectiveIndex = this.learningObjectives.indexOf(objective);
    elementIds.forEach((id: any) => {
      const elementIndex = objective.elements.findIndex((ele: any) => ele.elementId === id);
      if (objectiveIndex > -1 && elementIndex > -1) {
        objective.elements.splice(elementIndex, 1);
      }
    });
  }

  getWarningMessageForDelete(type: any): string {
    let message = "";
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
        message = "learningOutcomeListView.deleteOutcomeWarningMessage";
        break;
      case LearningOutcomeTypes.CATEGORY:
        message = "learningOutcomeListView.deleteCategoryWarningMessage";
        break;
      case LearningOutcomeTypes.OBJECTIVE:
        message = "learningOutcomeListView.deleteObjectiveWarningMessage";
        break;
      default:
        break;
    }
    return message;
  }

  async getErrorMessageForDelete(type: any): Promise<string> {
    let message = "";
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
        message = this.learningOutcomeService.messagesTranslations.outcomeDeleteErrorMessage;
        break;
      case LearningOutcomeTypes.CATEGORY:
        message = this.learningOutcomeService.messagesTranslations.categoryDeleteErrorMessage;
        break;
      case LearningOutcomeTypes.OBJECTIVE:
        message = this.learningOutcomeService.messagesTranslations.objectiveDeleteErrorMessage;
        break;
      default:
        break;
    }
    return message;
  }

  showSuccessToast(message: string) {
    this.toastrService.success(message, '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }

  // eslint-disable-next-line max-lines-per-function,@typescript-eslint/explicit-module-boundary-types
  async click(event: string, type: string, element?: any): Promise<void> {
    const relativeTo = this.params.activatedRoute || this.activatedRoute;
    switch (event) {
      case 'create': {
        let parentId = this.courseId;
        if (type === LearningOutcomeTypes.CATEGORY) {
          parentId = this.previousQueryParams.outcomeId;
        }
        else if (type === LearningOutcomeTypes.OBJECTIVE) {
          parentId = this.previousQueryParams.categoryId;
        }
        this.router.navigate([`./manipulate/create/learning-outcome/${type}/${parentId}`], { relativeTo: relativeTo, queryParamsHandling: 'merge' });
      }
        break;
      case 'edit': {
        const id = this.getOutcomeCategoryId(element, type);
        this.router.navigate([`./manipulate/edit/learning-outcome/${type}/${element.parentId}/${id}`], { relativeTo: relativeTo, queryParamsHandling: 'merge' });
      }
        break;
      case 'copy': {
        const id = this.getOutcomeCategoryId(element, type);
        const value = type.replace(/[^a-zA-Z ]/g, " ").replace(/^(.)|\s+(.)/g, letter => letter.toUpperCase());
        const dialog: Dialog = { title: { translationKey: "learningOutcomeListView.copyWarningMessage", translateArgs: { type: value } } };
        const res = await this.dialogService.showConfirmDialog(dialog);
        if (res) {
          const newElement: ILearningOutComeResponse = await this.learningOutcomeService.copy(Service.COURSE_SERVICE, type, id);
          const body: ICommonBody = newElement.body;
          if (type === LearningOutcomeTypes.OBJECTIVE) {
            // objective type needs a element array property to show status
            const copiedElement = { ...body, elements: [] };
            this.addElement(element, copiedElement, type);
            this.showSuccessToast(`Copy of ${element.title} ${this.learningOutcomeService.messagesTranslations.copy}`);
            return;
          }
          this.addElement(element, body, type);
          this.showSuccessToast(`Copy of ${element.title} ${this.learningOutcomeService.messagesTranslations.copy}`);
        }
      }
        break;
      case 'delete':
        {
          const id = this.getOutcomeCategoryId(element, type);
          const checkForDelete = await this.learningOutcomeService.checkIfMapped(Service.COURSE_SERVICE, id, type);
          if (checkForDelete.body.canBeDeleted) {
            const message = this.getWarningMessageForDelete(type);
            const dialog: Dialog = { title: { translationKey: message } };
            const res = await this.dialogService.showConfirmDialog(dialog);
            if (res) {
              try {
                const responce: ILearningOutComeResponse = await this.learningOutcomeService.delete(Service.COURSE_SERVICE, type, id);
                if (responce.body.status === "success") {
                  this.showSuccessToast(`${element.title} ${this.learningOutcomeService.messagesTranslations.delete}`);
                  this.removeElement(element, type);
                }
              }
              catch (err: any) {
                this.showErrorToast(err.error);
              }
            }
          }
          else {
            const message = await this.getErrorMessageForDelete(type);
            this.showErrorToast(message);
          }
        }
        break;
      case 'select': {
        const queryParams = JSON.parse(JSON.stringify(this.previousQueryParams));
        switch (type) {
          case LearningOutcomeTypes.OUTCOME:
            queryParams['outcomeId'] = element.outcomeId;
            delete queryParams.categoryId;
            this.router.navigate([], { queryParams: queryParams, replaceUrl: true });
            break;
          case LearningOutcomeTypes.CATEGORY:
            if (queryParams['categoryId'] !== element.categoryId) {
              this.filterOptions[LearningOutcomeTypes.OBJECTIVE].page = 1;
            }
            queryParams['categoryId'] = element.categoryId;
            this.router.navigate([], { queryParams: queryParams, replaceUrl: true });
            break;
          default:
            {
              if (this.getCriteriaFormGroup(element)) {
                this.criteriaFormGroup.removeControl(element.objectiveId);
                if (this.storageOutcomes.length) {
                  this.storageOutcomes.forEach((value: any, i: any) => {
                    const index = value.categories.findIndex((item: any) => item.categoryId === element.parentId);
                    if (value.categories.length === 1 && value.categories[0].objectives.length === 1) {
                      this.storageOutcomes.splice(i, 1);
                    }
                    if (value.categories.length > 1 && value.categories[index].objectives.length === 1) {
                      this.storageOutcomes[i].categories.splice(index, 1);
                    }
                    if (value.categories.length >= 1 && value.categories[index].objectives.length > 1) {
                      const objIndex = value.categories[index].objectives.findIndex((item: any) => item.objectiveId === element.element.objectiveId);
                      this.storageOutcomes[i].categories[index].objectives.splice(objIndex, 1);
                    }
                  });
                }
              }
              else {
                const form = new FormGroup({});
                let criteriaArray: any = [];
                if (this.ElementSubType === 'unit' || this.ElementSubType === 'folder') {
                  if (element.canBeLinkedTo === 'activity') {
                    criteriaArray = ['evaluationCriteria'];
                  } else if (element.canBeLinkedTo === 'content') {
                    criteriaArray = ['completionCriteria'];
                  } else {
                    criteriaArray = ['completionCriteria', 'evaluationCriteria'];
                  }
                }
                else if (this.ElementType === 'content') {
                  criteriaArray = ['completionCriteria'];
                }
                else if (this.ElementType === 'activity') {
                  criteriaArray = ['evaluationCriteria'];
                }
                criteriaArray.forEach((criteria: any) => {
                  const criteriaForm = new FormGroup({});
                  this.createCriteriaFormGroup(criteriaForm, 'achieved', element, criteria);
                  this.createCriteriaFormGroup(criteriaForm, 'partiallyAchieved', element, criteria);
                  this.createCriteriaFormGroup(criteriaForm, 'notAchieved', element, criteria);
                  form.addControl(criteria, criteriaForm);
                });
                this.criteriaFormGroup.addControl(element.objectiveId, form);
                if (this.params.viewType && (this.operationType === "create" || this.operationType === 'edit')) {
                  const category = this.learningCategories.filter(item => item.categoryId === element.parentId)[0];
                  const outcome = this.learningOutcomes.filter(item => item.outcomeId === category.parentId)[0];
                  const index = this.storageOutcomes.findIndex((item: any) => item.outcomeId === outcome.outcomeId);
                  if (index === -1) {
                    category.objectives = [element];
                    outcome.categories = [category];
                    this.storageOutcomes.push(outcome);
                  } else {
                    const existingCategoryIndex = this.storageOutcomes[index].categories.findIndex((item: any) => item.categoryId === category.categoryId);
                    if (existingCategoryIndex === -1) {
                      category.objectives = [element];
                      this.storageOutcomes[index].categories.push(category);
                    }
                    else {
                      this.storageOutcomes[index].categories[existingCategoryIndex].objectives.push(element);
                    }
                  }
                }
              }
            }
            break;
        }
      }
        break;
      case 'attach': {
        if (this.params.viewType === 'viewLearningObjective') {
          this.sendConfirmStatus('addLearningObjective');
        }
        else if (this.criteriaFormGroup.valid) {
          const objective: any = {};
          if (this.operationType === "create" || this.operationType === 'edit') {
            this.storageOutcomes.forEach((element: any) => {
              element.categories.forEach((item: any) => {
                item.objectives.forEach((element: any) => {
                  if (element.completionCriteria) {
                    objective[element.objectiveId] = { ...objective[element.objectiveId], completionCriteria: element.completionCriteria };
                  }
                  if (element.evaluationCriteria) {
                    objective[element.objectiveId] = { ...objective[element.objectiveId], evaluationCriteria: element.evaluationCriteria };
                  }
                  if (!element.operationType) {
                    element.operationType = this.operationType;
                    if (this.criteriaFormGroup.value[element.objectiveId].completionCriteria) {
                      element.completionCriteria = this.criteriaFormGroup.value[element.objectiveId].completionCriteria;
                      objective[element.objectiveId] = { ...objective[element.objectiveId], completionCriteria: element.completionCriteria };

                    }
                    if (this.criteriaFormGroup.value[element.objectiveId].evaluationCriteria) {
                      element.evaluationCriteria = this.criteriaFormGroup.value[element.objectiveId].evaluationCriteria;
                      objective[element.objectiveId] = { ...objective[element.objectiveId], evaluationCriteria: element.evaluationCriteria };
                    }
                  }
                });
              });
            });
            Object.keys(objective).length && this.storageService.set('availableObjective', Object.keys(objective).length);
            this.storageService.broadcastValue('attachedObjectives', objective);
            this.storageService.set('localAttachedObjectives', this.storageOutcomes);
            this.sendConfirmStatus(true);
          }
          else {
            await this.attachLearningObjective();
            this.sendConfirmStatus(true);
            this.showSuccessToast(this.learningOutcomeService.messagesTranslations.attach);

          }
        } else {
          const message = 'Please complete all the mandatory fields';
          this.showErrorToast(message);
        }
      }
        break;
      case 'edit-attached-objective':
        await this.attachLearningObjective();
        if (Object.keys(this.removedObjectiveId).length) {
          await this.deAttachMultipleObjective();
        }
        this.sendConfirmStatus(true);
        this.showSuccessToast(this.learningOutcomeService.messagesTranslations.edit);
        break;
      default:
        break;
    }
  }
  private async deAttachMultipleObjective() {
    const storageId = Object.keys(this.removedObjectiveId).filter(el => this.removedObjectiveId[el].parentId).map(key => ({ key, parentId: this.removedObjectiveId[key].parentId }));
    const id = Object.keys(this.removedObjectiveId).filter(el => !this.removedObjectiveId[el].parentId);
    storageId.length && this.storageOutcomes.forEach((value: any, i: any) => {
      storageId.forEach((obj: any, objIndex: any) => {
        const index = value.categories.findIndex((item: any) => item.categoryId === obj.parentId);
        if (index !== -1) {
          if (value.categories.length === 1 && value.categories[0].objectives.length === 1) {
            this.storageOutcomes.splice(i, 1);
          }else if (value.categories.length > 1 && value.categories[index].objectives.length === 1) {
            this.storageOutcomes[i].categories.splice(index, 1);
          }else if (value.categories.length >= 1 && value.categories[index].objectives.length > 1) {
            this.storageOutcomes[i].categories[index].objectives.splice(objIndex, 1);
          }
        }
      });
    });
    const objective: any = {};
    this.storageOutcomes.length && this.storageOutcomes.forEach((element: any) => {
      element.categories.forEach((item: any) => {
        item.objectives.forEach((element: any) => {
          if (element.completionCriteria) {
            objective[element.objectiveId] = { ...objective[element.objectiveId], completionCriteria: element.completionCriteria };
          }
          if (element.evaluationCriteria) {
            objective[element.objectiveId] = { ...objective[element.objectiveId], evaluationCriteria: element.evaluationCriteria };
          }
        });
      });
    });
    const length = this.isObjectiveAvailable();
    this.storageService.set('availableObjective', length);
    this.storageService.broadcastValue('attachedObjectives', objective);
    storageId.length && this.storageService.set('localAttachedObjectives', this.storageOutcomes);
    const payload = [{
      type: 'content',
      elementId: id.length ? this.elementDetail.elementId : undefined,
      objectives: id
    }];
    payload[0].objectives.length && await this.learningOutcomeService.unlinkElement(this.courseId, JSON.stringify(payload));
    this.operationType !=='create' && !length && this.storageService.broadcastValue("updateCourseElement", { elementId: this.elementId, payload: { isLearningObjectiveLinked: false } });
    this.showSuccessToast(this.learningOutcomeService.messagesTranslations.remove);
  }

  isObjectiveAvailable() {
    let length: any = 0;
    this.learningOutcomes.forEach(element => {
      element.categories.forEach((item: any) => {
        item.objectives.forEach((ele: any) => {
          if (!this.removedObjectiveId[ele.objectiveId]) {
            length = 1;
          }
        });
      });
    });
    return length;
  }

  private async attachLearningObjective() {
    const objectives = Object.keys(this.criteriaFormGroup.value).filter(objectiveId => !this.criteriaFormGroup.controls[objectiveId].pristine).map((objectiveId) => ({
      objectiveId,
      ...this.criteriaFormGroup.value[objectiveId],
    }));
    objectives.length && objectives.forEach((obj: any, i: any) => {
      const index = Object.keys(this.removedObjectiveId).findIndex((item: any) => item === obj.objectiveId);
      if (index !== -1 || !Object.keys(this.criteriaFormGroup.value[obj.objectiveId]).length) {
        objectives.splice(i, 1);
      }
    });
    let type = '';
    if (this.ElementSubType === 'unit' || this.ElementSubType === 'folder') {
      type = this.ElementSubType[0].toUpperCase() + this.ElementSubType.slice(1);
    }
    else {
      type = this.ElementType;
    }

    const learningObjectivePayload = {
      elementId: this.elementId,
      objectives: objectives,
      type: type
    };
    if (objectives.length) {
      if (this.params.viewType === "viewLearningObjective") {
        const dialog = { title: { translationKey: "learningOutcomeListView.editObjective" } };
        const allowUpdate = await this.dialogService.showConfirmDialog(dialog);
        if (!allowUpdate) {
          return;
        }
      }
      await this.learningOutcomeService.attach(this.courseId, learningObjectivePayload);
      this.showSuccessToast(`Learning Objective attached edited successfully`);
      this.storageService.broadcastValue("updateCourseElement", { elementId: this.elementId, payload: { isLearningObjectiveLinked: true } });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  selectContentToRemove(elementId: string, objective: any): void {
    const element = objective.elements.find((ele: any) => ele.elementId === elementId);
    element.checked = element.checked ? false : true;
    objective.isElementSelected = objective.elements.filter((element: any) => element.checked).length > 0;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async unlinkSelectedElement(objective: any): Promise<void> {
    const elementIds = objective.elements.filter((element: any) => element.checked).map((element: any) => element.elementId);
    await this.deleteLinkedElement(elementIds, objective);
    objective.isElementSelected = objective.elements.filter((element: any) => element.checked).length > 0;
  }

  async selectObjectiveElement(event: any, objective: any) {
    let allowUnlink = true;
    objective.checked = !objective.checked;
    const dialog = { title: { translationKey: "learningOutcomeListView.removeObjective" } };
    if (!objective.checked) {
      allowUnlink = await this.dialogService.showConfirmDialog(dialog);
    }
    if (!allowUnlink) {
      objective.checked = !objective.checked;
      return;
    }
    if (this.getCriteriaFormGroup(objective)) {
      this.removedObjectiveId[objective.objectiveId] = this.getCriteriaFormGroup(objective);
      this.criteriaFormGroup.removeControl(objective.objectiveId);
      if (objective.operationType) {
        this.removedObjectiveId[objective.objectiveId].parentId = objective.parentId;
      }
    } else {
      const control = this.removedObjectiveId[objective.objectiveId];
      delete this.removedObjectiveId[objective.objectiveId];
      this.criteriaFormGroup.addControl(objective.objectiveId, control);
    }

  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  createCriteriaFormGroup(form: FormGroup, key: string, objective: any, criteria: string, value?: any): void {
    const min = value ? value.min : key === 'notAchieved' ? 0 : '';
    const max = value ? value.max : key === 'achieved' ? 100 : '';
    form.addControl(key, new FormGroup({
      'min': new FormControl(min, [this.customValidator(key, 'min', objective, criteria)]),
      'max': new FormControl(max, [this.customValidator(key, 'max', objective, criteria)])
    }));
  }
  customValidator(type: string, formControlName: string, objective: any, criteria: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let validator = null;
      let formControl;
      let partiallyAchieved;
      let notAchieved;
      switch (type) {
        case 'achieved':
          switch (formControlName) {
            case 'min':
              if (this.criteriaFormGroup) {
                formControl = (this.criteriaFormGroup?.controls[`${objective.objectiveId}`]?.get(criteria) as FormGroup)?.controls['partiallyAchieved'] as FormGroup;
              }
              if (formControl) {
                if (Number(control.value) >= 100) {
                  validator = { Validators: Validators.required };
                } else if (control.value === '' || Number(control.value) !== Number(formControl.controls.max.value)) {
                  validator = { Validators: Validators.required };
                  formControl.controls.max.setErrors({ Validators: Validators.required });
                } else if (Number(formControl.controls.min.value) >= Number(formControl.controls.max.value)) {
                  formControl.controls.min.setErrors({ Validators: Validators.required });
                  Number(control.value) === Number(formControl.controls.max.value) ?
                    formControl.controls.max.setErrors(null) : formControl.controls.max.setErrors({ Validators: Validators.required });
                } else {
                  formControl.controls.max.setErrors(null);
                }
              }
              break;

            default:
              validator = null;
              break;
          }
          break;
        case 'partiallyAchieved':
          switch (formControlName) {
            case 'max':
              if (this.criteriaFormGroup) {
                formControl = (this.criteriaFormGroup?.controls[`${objective.objectiveId}`]?.get(criteria) as FormGroup)?.controls['achieved'] as FormGroup;
                notAchieved = (this.criteriaFormGroup?.controls[`${objective.objectiveId}`]?.get(criteria) as FormGroup)?.controls['notAchieved'] as FormGroup;
                partiallyAchieved = (this.criteriaFormGroup?.controls[`${objective.objectiveId}`]?.get(criteria) as FormGroup)?.controls['partiallyAchieved'] as FormGroup;
              }
              if (formControl) {
                if (Number(formControl.controls.min.value) !== Number(control.value)) {
                  validator = { Validators: Validators.required };
                  formControl.controls.min.setErrors({ Validators: Validators.required });
                  if (partiallyAchieved?.controls.min.value !== "" && partiallyAchieved?.controls.min.value < partiallyAchieved?.controls.max.value) {
                    partiallyAchieved?.controls.min.setErrors(null);
                    notAchieved?.controls.max.value !== "" && Number(notAchieved?.controls.max.value) === Number(partiallyAchieved?.controls.min.value) ?
                      notAchieved?.controls.max.setErrors(null) : null;
                  }
                } else if (Number(formControl.controls.min.value) >= 100) {
                  validator = { Validators: Validators.required };
                  formControl.controls.min.setErrors({ Validators: Validators.required });
                } else if (partiallyAchieved?.controls.min.value >= partiallyAchieved?.controls.max.value) {
                  partiallyAchieved?.controls.min.setErrors({ Validators: Validators.required });
                  if (formControl.controls.min.value !== "" && Number(formControl.controls.min.value) === Number(control.value)) {
                    validator = null;
                    formControl.controls.min.setErrors(null);
                  } else {
                    validator = { Validators: Validators.required };
                  }
                } else if (formControl.controls.min.value !== '') {
                  if (partiallyAchieved?.controls.min.value !== "" && notAchieved?.controls.max.value !== "" && Number(notAchieved?.controls.max.value) === Number(partiallyAchieved?.controls.min.value)) {
                    notAchieved?.controls.max.setErrors(null);
                    partiallyAchieved?.controls.min.setErrors(null);
                  }
                  validator = null;
                  formControl.controls.min.setErrors(null);
                }
              }
              break;
            case 'min':
              if (this.criteriaFormGroup) {
                formControl = (this.criteriaFormGroup?.controls[`${objective.objectiveId}`]?.get(criteria) as FormGroup)?.controls['notAchieved'] as FormGroup;
                partiallyAchieved = (this.criteriaFormGroup?.controls[`${objective.objectiveId}`]?.get(criteria) as FormGroup)?.controls['partiallyAchieved'] as FormGroup;
              }
              if (formControl) {
                if (Number(formControl.controls.max.value) !== Number(control.value) || control.value === '') {
                  validator = { Validators: Validators.required };
                  formControl.controls.max.setErrors({ Validators: Validators.required });
                } else if (formControl.controls.max.value !== "" && Number(formControl.controls.max.value) === Number(control.value)) {
                  if (Number(partiallyAchieved?.controls.min.value) >= Number(partiallyAchieved?.controls.max.value)) {
                    validator = { Validators: Validators.required };
                  } else {
                    validator = null;
                    formControl.controls.max.setErrors(null);
                  }
                }
              }
              break;
          }
          break;
        case 'notAchieved':
          switch (formControlName) {
            case 'max':
              if (this.criteriaFormGroup) {
                formControl = (this.criteriaFormGroup?.controls[`${objective.objectiveId}`]?.get(criteria) as FormGroup)?.controls['partiallyAchieved'] as FormGroup;
                partiallyAchieved = (this.criteriaFormGroup?.controls[`${objective.objectiveId}`]?.get(criteria) as FormGroup)?.controls['partiallyAchieved'] as FormGroup;
              }
              if (formControl) {
                if (Number(formControl.controls.min.value) !== Number(control.value) || control.value === '') {
                  validator = { Validators: Validators.required };
                  formControl.controls.min.setErrors({ Validators: Validators.required });
                } else if (formControl.controls.min.value !== "" && Number(formControl.controls.min.value) === Number(control.value)) {
                  if (Number(partiallyAchieved?.controls.min.value) >= Number(partiallyAchieved?.controls.max.value)) {
                    validator = { Validators: Validators.required };
                    partiallyAchieved?.controls.min.setErrors({ Validators: Validators.required });
                  } else {
                    validator = null;
                    formControl.controls.min.setErrors(null);
                  }
                }
              }
              break;
            default:
              validator = null;
              break;
          }
          break;
        default:
          break;
      }
      return validator;
    };
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getCriteriaFormGroup(element: any): FormGroup {
    return this.criteriaFormGroup.get(element.objectiveId) as FormGroup;
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (!this.params.viewType) {
      this.router.navigate([], { queryParams: { outcomeId: null, categoryId: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }
  sendConfirmStatus(value: any): void {
    const payload = { type: value };
    this.confirmStatus.emit(payload);
  }
  getFormControls(objective: any, property: string, groupName: string): any {
    // const objectiveId = Object.keys(objective.controls);
    return (this.criteriaFormGroup?.controls[`${objective.objectiveId}`]?.get(groupName) as FormGroup)?.controls[property];
  }
  showErrorToast(message: string): void {
    this.toastrService.error(message, '', {
      positionClass: 'toast-top-center',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }
  isAttachedToElement(objective: any) {
    return objective.elements.findIndex((element: any) => this.elementDetail && element.elementId === this.elementDetail.elementId) > -1 || objective.operationType;
  }

  filteredElement(elements: any) {
    return elements.filter((element: any) => element.type !== 'Unit' && element.type !== 'Folder');
  }

  showToolTip(type: string): void {
    if (type === "evaluationCriteria") {
      this.evaluationCriteriaToolTip = !this.evaluationCriteriaToolTip;
    }
    else {
      this.completionCriteriaToolTip = !this.completionCriteriaToolTip;
    }
  }
  displayObjective(objective: any): boolean {
    if ((!this.params.viewType || this.params.viewType === 'viewLearningObjective') || (this.params.viewType === 'addLearningObjective' && objective.status !== 'inactive' && (objective.canBeLinkedTo === this.ElementType || objective.canBeLinkedTo === 'both' || this.type === 'unit' || this.type === 'folder'))) {

      return true;
    }
    return false;

  }
}

