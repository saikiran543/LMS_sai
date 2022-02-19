/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { ForumType } from 'src/app/enums/forumType';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { StorageService } from 'src/app/services/storage.service';
import translations from '../../../../../assets/i18n/en.json';

import { DiscussionComponent } from './discussion.component';
import { ForumInfoPopupComponent } from './forum-info-popup/forum-info-popup.component';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('DiscussionComponent', () => {
  let component: DiscussionComponent;
  let fixture: ComponentFixture<DiscussionComponent>;
  let contentService: ContentService;
  let ngBModalService: NgbModal;
  let routerSpy: any;
  let storageService: StorageService;

  beforeEach(async () => {
    routerSpy = {navigate: jasmine.createSpy('navigate')};
    await TestBed.configureTestingModule({
      declarations: [ DiscussionComponent, ForumInfoPopupComponent],
      imports: [
        ToastrModule.forRoot(),
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          },
          defaultLanguage: 'en'
        }),
        HttpClientTestingModule,
      ],
      providers: [ContentService, NgbModal,
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    // ngOnInitFn = DiscussionComponent.prototype.ngOnInit;
    DiscussionComponent.prototype.ngOnInit = () => {};
    fixture = TestBed.createComponent(DiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    contentService = TestBed.inject(ContentService);
    storageService = TestBed.inject(StorageService);
    ngBModalService = TestBed.inject(NgbModal);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default forum type to standard discussion forum and show attachment input', () => {
    component.params = {
      courseId: '1142',
      forumType: 'standard-discussion-forum',
      operation: 'create',
    };
    spyOn<any>(component, 'setAcceptedFileTypes').and.resolveTo();
    spyOn<any>(component, 'listenToStorageService').and.resolveTo();
    component['loadDependencies']();
    const discussionForumType = component.discussionForm.value.type;
    expect(discussionForumType).toBe(ForumType.STANDARD_DISCUSSION_FORUM);
    const attachementReference = document.querySelector('#standard-discussion-attachement');
    expect(attachementReference).toBeTruthy();
  });

  it('should set forum type to doubt clarification forum and hide attachment input', (done) => {
    component.params = {
      courseId: '1142',
      forumType: 'doubt-clarification-forum',
      operation: 'create',
    };
    spyOn<any>(component, 'setAcceptedFileTypes').and.resolveTo();
    spyOn<any>(component, 'listenToStorageService').and.resolveTo();
    component['loadDependencies']();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const discussionForumType = component.discussionForm.value.type;
      expect(discussionForumType).toBe(ForumType.DOUBT_CLARIFICATION_FORUM);
      const attachementReference = document.querySelector('#standard-discussion-attachement');
      expect(attachementReference).toBeNull();
      done();
    });
  });

  it('should switch forum type to doubt clarification and hide the attachment input', (done) => {
    const discussionForumType = component.discussionForm.value.type;
    expect(discussionForumType).toBe(ForumType.STANDARD_DISCUSSION_FORUM);
    const ele = fixture.nativeElement;
    component?.discussionForm.valueChanges.subscribe(() => {
      const changedDiscussionForumType = component.discussionForm.value.type;
      expect(changedDiscussionForumType).toBe(ForumType.DOUBT_CLARIFICATION_FORUM);
      done();
    });
    component?.discussionForm.controls.type.setValue(ForumType.DOUBT_CLARIFICATION_FORUM);
  });

  it('should change from non graded to graded and display respective form inputs', (done) => {
    const graded = component.discussionForm.value.graded;
    expect(graded).toBeFalse();
    component['handleGradedSwitch']();
    component.discussionForm.controls['graded'].setValue(true);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const ele = fixture.nativeElement;
      const attachRubricsCta = ele.querySelector('.attach-rubric-cta');
      expect(attachRubricsCta).toBeTruthy();
      const maxMarksInput = ele.querySelector('#discussionForumMarksInput');
      expect(maxMarksInput).toBeTruthy();
      done();
    });
  });

  it('should update the default characters left', (done) => {
    component['setDefaultCharLength']();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('.char-count').textContent).toBe('Max of 500 Characters');
      done();
    });
  });

  it('should update the characters left when text is updated', (done) => {
    component['setDefaultCharLength']();
    const titleElement = fixture.nativeElement.querySelector('#title');
    component['setCharacterLeftText']();
    titleElement.value = 'new';
    titleElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('.char-count').textContent).toBe('Max of 500 Characters');
      done();
    });
  });

  it('should have a disabled save cta when there is not input entered', () => {
    const saveCta = fixture.nativeElement.querySelector('.yes-btn');
    expect(saveCta.disabled).toBeTrue();
  });

  it('should have a disabled save draft cta when there is not input entered', () => {
    const saveDraftCta = fixture.nativeElement.querySelector('.basic-btn.modal-btn');
    expect(saveDraftCta.classList.contains('disabled')).toBeTrue();
  });

  it('should have an enabled save cta if a non graded forum with a title', async () => {
    const saveCta = fixture.nativeElement.querySelector('.yes-btn');
    component.discussionForm.controls.title.setValue('test');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(saveCta.disabled).toBeFalse();
  });

  it('should have an enabled save draft cta if a non graded forum with a title', async () => {
    const saveDraftCta = fixture.nativeElement.querySelector('.basic-btn.modal-btn');
    component.discussionForm.controls.title.setValue('test');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(saveDraftCta.classList.contains('disabled')).toBeFalse();
  });

  it('should have a disabled save cta if a graded forum with a title', async () => {
    component.params = {
      courseId: '1142',
      forumType: 'standard-discussion-forum',
      operation: 'create',
    };
    spyOn<any>(component, 'setAcceptedFileTypes').and.resolveTo();
    spyOn<any>(component, 'listenToStorageService').and.resolveTo();
    component['loadDependencies']();
    const saveCta = fixture.nativeElement.querySelector('.yes-btn');
    component.discussionForm.controls.title.setValue('test');
    component.discussionForm.controls.graded.setValue(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(saveCta.disabled).toBeTrue();
  });

  it('shoud have an enabled save cta if all mandatory fields of a graded forum is added', async () => {
    component.params = {
      courseId: '1142',
      forumType: 'standard-discussion-forum',
      operation: 'create',
    };
    spyOn<any>(component, 'setAcceptedFileTypes').and.resolveTo();
    spyOn<any>(component, 'listenToStorageService').and.resolveTo();
    component['loadDependencies']();
    const saveCta = fixture.nativeElement.querySelector('.yes-btn');
    component.discussionForm.controls.title.setValue('test');
    component.discussionForm.controls.graded.setValue(true);
    component.discussionForm.controls.maxMarks.setValue(1);
    component.discussionForm.controls.passMarks.setValue(1);
    component.discussionForm.controls.validityStartDate.setValue(moment());
    component.discussionForm.controls.validityEndDate.setValue(moment());
    component.discussionForm.controls.rubricId.setValue('a');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(saveCta.disabled).toBeFalse();
  });

  it('should return the expected payload as per the inputs entered for a non graded forum', () => {
    component.params = {
      courseId: '1142',
      forumType: 'standard-discussion-forum',
      operation: 'create',
    };
    spyOn<any>(component, 'setAcceptedFileTypes').and.resolveTo();
    spyOn<any>(component, 'listenToStorageService').and.resolveTo();
    component['loadDependencies']();
    component.discussionForm.controls.title.setValue('test');
    const payloadResponse = component['preparePayload'](component.submitActionTypes.SAVE);
    expect(payloadResponse).toEqual({
      courseId: '1142',
      title: 'test',
      description: '',
      isGradable: false,
      type: 'standard_discussion_forum',
      visibilityCriteria: false,
      emailNotification: true,
      activityStatus: 'mandatory',
      status: 'published',
      tags: [ ],
      learningObjectives: [],
    });
  });

  it('should return the expected payload as per the inputs entered for a graded forum', () => {
    component.params = {
      courseId: '1142',
      forumType: 'standard-discussion-forum',
      operation: 'create',
    };
    spyOn<any>(component, 'setAcceptedFileTypes').and.resolveTo();
    spyOn<any>(component, 'listenToStorageService').and.resolveTo();
    const now = moment();
    component['loadDependencies']();
    component.discussionForm.controls.title.setValue('title');
    component.discussionForm.controls.description.setValue('description');
    component.discussionForm.controls.graded.setValue(true);
    component.discussionForm.controls.maxMarks.setValue(1);
    component.discussionForm.controls.passMarks.setValue(1);
    component.discussionForm.controls.validityStartDate.setValue(now);
    component.discussionForm.controls.validityEndDate.setValue(now);
    component.discussionForm.controls.rubricId.setValue('a');
    const payloadResponse = component['preparePayload'](component.submitActionTypes.SAVE);
    expect(payloadResponse).toEqual({
      courseId: '1142',
      title: 'title',
      description: 'description',
      isGradable: true,
      type: 'standard_discussion_forum',
      visibilityCriteria: false,
      emailNotification: true,
      activityStatus: 'mandatory',
      status: 'published',
      maxMarks: 1,
      passMarks: 1,
      startDate: now.toISOString(),
      endDate: now.toISOString(),
      rubricId: 'a',
      tags: [ ],
      learningObjectives: [],
    });
  });

  it('should set payload status to draft if saved as draft', () => {
    component.params = {
      courseId: '1142',
      forumType: 'standard-discussion-forum',
      operation: 'create',
    };
    spyOn<any>(component, 'setAcceptedFileTypes').and.resolveTo();
    spyOn<any>(component, 'listenToStorageService').and.resolveTo();
    const now = moment();
    component['loadDependencies']();
    component.discussionForm.controls.title.setValue('title');
    const payloadResponse = component['preparePayload'](component.submitActionTypes.DRAFT);
    expect(payloadResponse.status).toBe('draft');
  });

  it('should display forum info popup if info icon is clicked on', async () => {
    component['triggerForumInfoPopup']();
    fixture.detectChanges();
    await fixture.whenStable();
    const dialogueRef = document.querySelector('.forum-info-modal');
    expect(dialogueRef).toBeTruthy();
    expect(component.showForumInfoPopup).toBeTruthy();
    expect(component.showDiscussionComponent).toBeFalsy();
  });

  it('should hide forum info popup when ', async () => {
    component.showForumInfoPopup = true;
    component.showDiscussionComponent = false;
    fixture.detectChanges();
    await fixture.whenStable();
    component['triggerForumInfoPopup']();
    fixture.detectChanges();
    await fixture.whenStable();
    const dialogueRef = document.querySelector('.forum-info-modal');
    expect(dialogueRef).toBeNull();
    expect(component.showForumInfoPopup).toBeFalsy();
    expect(component.showDiscussionComponent).toBeTrue();
  });

  it('should navigate to attach rubrics popup when attach rubric cta is clicked on', async () => {
    component.discussionForm.controls.graded.setValue(true);
    component.params.currentActivtedRoute = undefined;
    fixture.detectChanges();
    await fixture.whenStable();
    const attachRubricCta = fixture.nativeElement.querySelector('#attachRubricCta');
    attachRubricCta.click();
    expect (routerSpy.navigate).toHaveBeenCalledWith(['./rubric/selection/course'], {
      relativeTo: undefined,
      replaceUrl: true,
      state: {
        preventReinitilizing: true,
        previousSelectedRubric: [ ]
      }
    });
  });

  it('should navigate to attach learning objective popup when attach learning cta is clicked on', async () => {
    component.params.currentActivtedRoute = undefined;
    fixture.detectChanges();
    await fixture.whenStable();
    const attachLearningObjectiveCta = fixture.nativeElement.querySelector('#attachLearningObjective');
    attachLearningObjectiveCta.click();
    expect (routerSpy.navigate).toHaveBeenCalledWith(['./learning-objective/add'], {
      relativeTo: undefined,
      replaceUrl: true,
      state: {
        preventReinitilizing: true,
      }
    });
  });

  it('should prefil the values for the discussion forum for a non graded edit flow', async () => {
    component.params = {
      courseId: '1142',
      forumType: 'standard-discussion-forum',
      id: '1',
      operation: 'edit',
    };
    spyOn<any>(component, 'setAcceptedFileTypes').and.resolveTo();
    spyOn<any>(component, 'listenToStorageService').and.resolveTo();
    const activityResponse = {
      "elementId": "682eed70-fc4d-41a8-aae4-7f60de66d875",
      "type": "doubt_clarification_forum",
      "title": "Test New Rubric Attach",
      "status": "published",
      "createdOn": "2021-12-15T05:08:39.035Z",
      "createdBy": "1",
      "updatedOn": "2021-12-15T05:08:39.035Z",
      "updatedBy": "1",
      "activitymetadata": [
        {
          "_id": "61b978578c320a5bf0389661",
          "isGradable": true,
          "learningObjectives": [],
          "emailNotification": true,
          "tags": [],
          "courseId": "1142",
          "title": "Test New Rubric Attach",
          "description": "",
          "rubricId": "",
          "maxMarks": 1,
          "passMarks": 1,
          "startDate": "2021-12-15T05:07:38.508Z",
          "endDate": "2021-12-23T05:07:38.000Z",
          "visibilityCriteria": false,
          "activityStatus": "mandatory",
          "createdBy": "1",
          "updatedBy": "1",
          "activityId": "682eed70-fc4d-41a8-aae4-7f60de66d875",
          "createdAt": "2021-12-15T05:08:39.227Z",
          "updatedAt": "2021-12-15T05:08:39.227Z"
        }
      ]
    };
    spyOn(contentService, 'fetchActivityContent').and.resolveTo(activityResponse);
    component['loadDependencies']();
    fixture.detectChanges();
    await fixture.whenStable();
    const discussionForumValues = component.discussionForm.value;
    expect(discussionForumValues.title).toBe(activityResponse.title);
    expect(discussionForumValues.description).toBe(activityResponse.activitymetadata[0].description);
    expect(discussionForumValues.sendEmailNotification).toBe(activityResponse.activitymetadata[0].emailNotification);
    expect(discussionForumValues.visibilityCriteria).toBe(activityResponse.activitymetadata[0].visibilityCriteria);
    expect(discussionForumValues.validityStartDate).toEqual(moment(activityResponse.activitymetadata[0].startDate));
    expect(discussionForumValues.validityEndDate).toEqual(moment(activityResponse.activitymetadata[0].endDate));
    expect(discussionForumValues.maxMarks).toBe(activityResponse.activitymetadata[0].maxMarks);
    expect(discussionForumValues.passMarks).toBe(activityResponse.activitymetadata[0].passMarks);
    expect(discussionForumValues.graded).toBe(activityResponse.activitymetadata[0].isGradable);
  });

  it('should add rubricId to the form data when rubric attachment is successfull', async () => {
    component.params = {
      courseId: '1142',
      forumType: 'standard-discussion-forum',
      id: '1',
      operation: 'create',
    };
    spyOn<any>(component, 'setAcceptedFileTypes').and.resolveTo();
    const attachedRubric = {
      "_id": "61b194f4a3154e55c4a38043",
      "criterias": [
        {
          "criteriaName": "JAVA",
          "weightage": "50",
          "levels": {
            "L3": {
              "percentage": "30",
              "description": "Java is a programming language and a platform. Java is a high level, robust, object-oriented and secure programming language. Java was developed by Sun Microsystems (which is now the subsidiary of Oracle) in the year 1995. James Gosling is known as the father of Java"
            },
            "L1": {
              "percentage": "25",
              "description": "OOPS"
            },
            "L2": {
              "percentage": "20",
              "description": "OOPS"
            },
            "L4": {
              "percentage": "10",
              "description": ""
            },
            "L5": {
              "percentage": "5",
              "description": ""
            },
            "L6": {
              "percentage": "2",
              "description": ""
            }
          }
        },
        {
          "criteriaName": "Grammer",
          "weightage": "50",
          "levels": {
            "L3": {
              "percentage": "30",
              "description": "Java is a programming language and a platform. Java is a high level, robust, object-oriented and secure programming language. Java was developed by Sun Microsystems (which is now the subsidiary of Oracle) in the year 1995. James Gosling is known as the father of Java"
            },
            "L1": {
              "percentage": "25",
              "description": "English"
            },
            "L2": {
              "percentage": "20",
              "description": "English"
            },
            "L4": {
              "percentage": "10",
              "description": ""
            },
            "L5": {
              "percentage": "5",
              "description": ""
            },
            "L6": {
              "percentage": "2",
              "description": ""
            }
          }
        }
      ],
      "levelNames": [
        {
          "L3": "level 03"
        },
        {
          "L1": "stage 01"
        },
        {
          "L2": "stage 02"
        },
        {
          "L4": "level 04"
        },
        {
          "L5": "level 05"
        },
        {
          "L6": "level 06"
        }
      ],
      "title": "New Rubric",
      "status": "active",
      "scope": "course",
      "parentId": "1142",
      "isDeleted": false,
      "createdBy": "1",
      "updatedBy": "1",
      "createdOn": "2021-12-09T05:32:36.145Z",
      "updatedOn": "2021-12-20T16:50:17.380Z",
      "rubricId": "9c53e89d-cbde-473a-b532-65faa66fdc73",
      "creationDetail": "username1 Thu Dec 09 2021 11:02:36 GMT+0530 (India Standard Time)",
      "modificationDetail": "username1 Mon Dec 20 2021 22:20:17 GMT+0530 (India Standard Time)"
    };
    const spyOnAttachRubricFn = spyOn<any>(component, 'onRubricAttachment').and.callThrough();
    component['handleGradedSwitch']();
    component['listenToStorageService']();
    component.discussionForm.controls.graded.setValue(true);
    fixture.detectChanges();
    await fixture.whenStable();
    storageService.broadcastValue(StorageKey.ATTACHED_RUBRIC, attachedRubric);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spyOnAttachRubricFn).toHaveBeenCalledWith(attachedRubric);
    expect(component.selectedRubric).toEqual(attachedRubric);
    expect(component.discussionForm.value.rubricId).toBe(attachedRubric._id);
    const attachedRubricCta = fixture.nativeElement.querySelector('#attachedRubricCta');
    expect(attachedRubricCta).toBeTruthy();
    const attachRubricCta = fixture.nativeElement.querySelector('#attachRubricCta');
    expect(attachRubricCta).toBeNull();
  });

  it('should add learning objectives to the form data when learning objective attachment is successfull', async () => {
    component.params = {
      courseId: '1142',
      forumType: 'standard-discussion-forum',
      id: '1',
      operation: 'edit',
    };
    spyOn<any>(component, 'setAcceptedFileTypes').and.resolveTo();
    const attachedLearningObjectives = {
      "d64d5b49-cadc-4adf-af57-69414402a27f": {
        "completionCriteria": {
          "achieved": {
            "min": 0,
            "max": 0
          },
          "partiallyAchieved": {
            "min": 0,
            "max": 0
          },
          "notAchieved": {
            "min": 0,
            "max": 0
          }
        },
        "evaluationCriteria": {
          "achieved": {
            "min": 0,
            "max": 0
          },
          "partiallyAchieved": {
            "min": 0,
            "max": 0
          },
          "notAchieved": {
            "min": 0,
            "max": 0
          }
        }
      }
    };
    const spyOnAttachRubricFn = spyOn<any>(component, 'onLearningObjectivesAttachement').and.callThrough();
    component['handleGradedSwitch']();
    component['listenToStorageService']();
    component.discussionForm.controls.graded.setValue(true);
    expect(spyOnAttachRubricFn).toHaveBeenCalledOnceWith(attachedLearningObjectives);
    fixture.detectChanges();
    await fixture.whenStable();
    const setSelectedLearningObjectivesSpy = spyOn<any>(component, 'setSelectedLearningObjectives');
    storageService.broadcastValue('attachedObjectives', attachedLearningObjectives);
    expect(setSelectedLearningObjectivesSpy).toHaveBeenCalledOnceWith(attachedLearningObjectives);
    expect(component.discussionForm.value.learningObjectives).toEqual(attachedLearningObjectives);
    fixture.detectChanges();
    await fixture.whenStable();
    const attachedLearningObjectiveCta = fixture.nativeElement.querySelector('#attachedLearningObjectiveCta');
    expect(attachedLearningObjectiveCta).toBeTruthy();
    const attachLearningObjectiveCta = fixture.nativeElement.querySelector('#attachLearningObjective');
    expect(attachLearningObjectiveCta).toBeNull();
  });
});
