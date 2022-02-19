/* eslint-disable max-lines-per-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumContentUserDetailsComponent } from './forum-content-user-details.component';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';
import { CommonService } from 'src/app/services/common.service';
import { Location } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import translations from '../../../../assets/i18n/en.json';
import { StorageService } from "../../../services/storage.service";
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageKey } from 'src/app/enums/storageKey';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { Routes } from '@angular/router';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('ForumContentUserDetailsComponent', () => {
  let component: ForumContentUserDetailsComponent;
  let fixture: ComponentFixture<ForumContentUserDetailsComponent>;
  let storageService: StorageService;
  let discussionForumService: DiscussionForumService;
  let location: Location;
  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent }];
  const rubricData = {
    "criteria": [
      {
        "criteriaName": "test",
        "weightage": "100",
        "levels": {
          "L1": {
            "percentage": "100",
            "description": ""
          }
        },
        "levelNumbers": [
          {
            "levelNumber": 1,
            "levelName": "L1"
          }
        ],
        "showLeftArrow": false,
        "showRightArrow": false,
        "score": 100,
        "selectedLevel": 1,
        "selectedLevelPercentage": 100
      }
    ],
    "levelNames": [
      {
        "L1": "level 01"
      }
    ],
    "totalSum": 100
  };
  const userDetails = {
    "userId": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
    "username": "demostudent",
    "refreshToken": "demostudent",
    "emailId": "demostudent@gmail.com",
    "firstName": "Demo",
    "lastName": "Student",
    "role": "student",
    "iat": 1640689669,
    "exp": 1640691469,
    "activityType": "discussion_forum",
    "subActivityType": "doubt_clarification_forum"
  };

  const mockResult = [
    {
      "attemptId": "",
      "userId": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
      "userName": "demostudent",
      "activityId": "c435ea05-6114-4a88-81d2-915a24fa281a",
      "activityName": "",
      "activityType": "discussion_forum",
      "subActivityType": "doubt_clarification_forum",
      "isGradable": false,
      "attempts": 1,
      "attemptsMade": 1,
      "startDate": "",
      "lastSubmittedDate": "",
      "responseStatus": "",
      "maxMarks": 0,
      "score": 0,
      "feedback": "",
      "gradedOn": "",
      "gradedBy": "",
      "resultId": "",
      "attachedContents": [
        {
          "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
          "type": "document",
          "title": "Relianec IRL Report Example",
          "status": "unpublished",
          "createdOn": "2021-11-22T06:40:48.957Z",
          "createdBy": "",
          "updatedOn": "2021-11-22T06:40:48.957Z",
          "updatedBy": "",
          "childElements": [],
          "publishedOn": "2021-11-23T10:26:45.922Z",
          "breadcrumbTitle": "/Unit 1 Economics Financial Aspects Knowledge of stock market trade and investment/Week 1 - Introduction to Finance ",
          "questionsInitiated": 0,
          "numberOfUpvotes": 0,
          "threadsParticipated": 0
        },
        {
          "elementId": "014aed8a-f8b0-4b1e-8f3c-7ac37353997c",
          "type": "document",
          "title": "Economics pdf ",
          "status": "unpublished",
          "createdOn": "2021-11-22T15:27:18.607Z",
          "createdBy": "",
          "updatedOn": "2021-11-22T15:27:18.607Z",
          "updatedBy": "",
          "childElements": [],
          "publishedOn": "2021-11-23T10:26:45.922Z",
          "breadcrumbTitle": "/Unit 1 Economics Financial Aspects Knowledge of stock market trade and investment/Week 1 - Introduction to Finance /Topic 1 Disciplinary Perspectives on Accounting Specialized Knowledge of varied accounting topics and techniques",
          "questionsInitiated": 0,
          "numberOfUpvotes": 0,
          "threadsParticipated": 0
        }
      ],
      "questionsInitiated": 24,
      "numberOfUpvotes": 4,
      "threadsParticipated": 0
    }
  ];

  const mock = {
    "elementDetails": [
      {
        "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
        "type": "document",
        "title": "Relianec IRL Report Example",
        "status": "unpublished",
        "createdOn": "2021-11-22T06:40:48.957Z",
        "createdBy": "",
        "updatedOn": "2021-11-22T06:40:48.957Z",
        "updatedBy": "",
        "childElements": [],
        "publishedOn": "2021-11-23T10:26:45.922Z",
        "breadcrumbTitle": "/Unit 1 Economics Financial Aspects Knowledge of stock market trade and investment/Week 1 - Introduction to Finance ",
        "qnAmetaData": {
          "updatedAt": null,
          "updatedBy": null,
          "totalAnswers": 0,
          "totalQuestions": 0,
          "totalAnswersUpvotes": 0,
          "totalQuestionsUpvotes": 0
        }
      },
      {
        "elementId": "014aed8a-f8b0-4b1e-8f3c-7ac37353997c",
        "type": "document",
        "title": "Economics pdf ",
        "status": "unpublished",
        "createdOn": "2021-11-22T15:27:18.607Z",
        "createdBy": "",
        "updatedOn": "2021-11-22T15:27:18.607Z",
        "updatedBy": "",
        "childElements": [],
        "publishedOn": "2021-11-23T10:26:45.922Z",
        "breadcrumbTitle": "/Unit 1 Economics Financial Aspects Knowledge of stock market trade and investment/Week 1 - Introduction to Finance /Topic 1 Disciplinary Perspectives on Accounting Specialized Knowledge of varied accounting topics and techniques",
        "qnAmetaData": {
          "updatedAt": null,
          "updatedBy": null,
          "totalAnswers": 0,
          "totalQuestions": 0,
          "totalAnswersUpvotes": 0,
          "totalQuestionsUpvotes": 0
        }
      },
    ],
    "__v": 1717
  };

  const newMock = {
    "elementId": "c435ea05-6114-4a88-81d2-915a24fa281a",
    "activityType": "discussion_forum",
    "subActivityType": "doubt_clarification_forum",
    "title": "Doubt QA",
    "status": "unpublished",
    "createdOn": "2021-12-24T19:01:10.192Z",
    "createdBy": "1",
    "updatedOn": "2021-12-27T04:55:05.104Z",
    "updatedBy": "",
    "childElements": [],
    "activitymetadata": [
      {
        "_id": "61c618f66d2b1e037e09dd1b",
        "isGradable": true,
        "learningObjectives": [],
        "emailNotification": true,
        "tags": [],
        "courseId": "1142",
        "parentElementId": "1142",
        "title": "Doubt QA",
        "description": "<p>Doubt QA</p>",
        "rubricId": "9c53e89d-cbde-473a-b532-65faa66fdc73",
        "maxMarks": 100,
        "passMarks": 45,
        "startDate": "2021-12-25T07:00:51.000Z",
        "endDate": "2021-12-27T07:00:51.000Z",
        "visibilityCriteria": false,
        "activityStatus": "mandatory",
        "createdBy": "1",
        "updatedBy": "1",
        "activityId": "c435ea05-6114-4a88-81d2-915a24fa281a",
        "createdAt": "2021-12-24T19:01:10.211Z",
        "updatedAt": "2021-12-27T04:55:05.115Z",
        "fileName": null,
        "lastAccessedBy": "1",
        "originalFileName": null
      }
    ],
    "breadcrumbTitle": "",
    "qnAmetaData": {
      "totalQuestions": 24,
      "totalAnswers": 6,
      "updatedAt": "2021-12-29T04:41:16.588Z",
      "updatedBy": "demostudent"
    },
    "__v": 1717
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForumContentUserDetailsComponent],
      imports: [ToastrModule.forRoot(), SafePipeModule, RouterTestingModule.withRoutes(routes), HttpClientTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        },
        defaultLanguage: 'en'
      }),

      ],
      providers: [DiscussionForumService, CommonService, StorageService, DiscussionForumService, ToastrService, Location],
    })
      .compileComponents();
    storageService = TestBed.inject(StorageService);
    discussionForumService = TestBed.inject(DiscussionForumService);
    location = TestBed.inject(Location);
  });

  beforeEach(() => {
    spyOn(discussionForumService, 'studentActivityResultByUserId').and.resolveTo(mockResult);
    spyOn(discussionForumService, 'forumDetail').and.resolveTo(newMock);
    spyOn(discussionForumService, 'relatedContents').and.resolveTo(mock);
    storageService.set(StorageKey.USER_DETAILS, {
      "userId": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
      "username": "demostudent",
      "refreshToken": "demostudent",
      "emailId": "demostudent@gmail.com",
      "firstName": "Demo",
      "lastName": "Student",
      "role": "student",
      "iat": 1640689669,
      "exp": 1640691469
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ForumContentUserDetailsComponent.prototype.ngOnInit = () => { };
    fixture = TestBed.createComponent(ForumContentUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should on Scroll Down Threads Inititated', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchSpy = spyOn<any>(component, "fetchThreadsInitiated").and.resolveTo(
      {
        "totalQuestion": 9,
        "questions": [
          {
            "_id": "61cc588f3a5066037d5dd48e",
            "numOfUpvotes": 0,
            "numOfAnswers": 0,
            "courseId": "1142",
            "elementId": "0547e8db-b01a-4fea-b8cf-06319f0967f1",
            "title": "test4",
            "description": "",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "Testing attachment flow",
            "contentType": "standard_discussion_forum",
            "questionId": "059c12cd-c044-4258-9920-c4cba812d21f",
            "createdAt": "2021-12-29T12:46:07.790Z",
            "updatedAt": "2021-12-29T12:46:07.790Z",
            "userName": "demostudent"
          },
          {
            "_id": "61cc588a0ec63e03763f3d59",
            "numOfUpvotes": 0,
            "numOfAnswers": 0,
            "courseId": "1142",
            "elementId": "0547e8db-b01a-4fea-b8cf-06319f0967f1",
            "title": "test3",
            "description": "",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "Testing attachment flow",
            "contentType": "standard_discussion_forum",
            "questionId": "6d4614cc-d950-49bd-b5ad-7147513e4eda",
            "createdAt": "2021-12-29T12:46:02.192Z",
            "updatedAt": "2021-12-29T12:46:02.192Z",
            "userName": "demostudent"
          },
        ]
      });
    component.onScrollDownThreadsInititated();
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should on Scroll Down Threads Participated', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchSpy = spyOn<any>(component, "fetchThreadsParticipated").and.resolveTo(
      {
        "totalQuestion": 0,
        "questions": []
      });
    component.onScrollDownThreadsParticipated();
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should go back to list', () => {
    component.backToList();
    expect(location.back()).toEqual();
  });

  it('should event click', () => {
    spyOn(discussionForumService, 'sendMessageToBackEnd').and.resolveTo(newMock);
    component.forumEvaluateItemId = "0547e8db-b01a-4fea-b8cf-06319f0967f1";
    component.forumEvaluateItem = newMock;
    component.userThreadDetails = [userDetails];
    component.loggedInUserDetails = userDetails;
    component.clickEvent('saveEvaluation');
    component.clickEvent("cancel");
    fixture.detectChanges();
    expect(location.path()).toBe(`/context.html`);
  });

  it("should save evaluation", (done) => {
    component.forumEvaluateItem = newMock;
    component.userThreadDetails = [userDetails];
    component.loggedInUserDetails = userDetails;
    spyOn(discussionForumService, 'sendMessageToBackEnd').and.resolveTo(newMock);
    component.saveEvaluationForm(rubricData);
    done();
  });

  it('should show Participated threads', async () => {
    component.skipThreadsParticipated = 0;
    spyOn(discussionForumService, 'getThreadsByUser').and.resolveTo(
      {
        "totalQuestion": 1,
        "questions": [
          {
            "_id": "61cc58ca388c82037d0b2ff4",
            "numOfUpvotes": 0,
            "numOfAnswers": 9,
            "courseId": "1142",
            "elementId": "0547e8db-b01a-4fea-b8cf-06319f0967f1",
            "title": "test9",
            "description": "",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "Testing attachment flow",
            "contentType": "standard_discussion_forum",
            "questionId": "7ed07b3b-c18d-477b-8512-476650f5dde4",
            "createdAt": "2021-12-29T12:47:06.414Z",
            "updatedAt": "2021-12-29T12:47:06.414Z",
            "userName": "demostudent"
          }
        ]
      }
    );
    await component.threadsParticipated();
    expect(component.skipThreadsParticipated).toEqual(5);
  });

  it('should fetch Threads Participated', async () => {
    component.skipThreadsParticipated = 0;
    spyOn(discussionForumService, "getThreadsByUser").and.resolveTo(
      {
        "totalQuestion": 0,
        "questions": []
      }
    );
    await component.fetchThreadsParticipated();
    fixture.detectChanges();
    expect(component.skipThreadsParticipated).toEqual(0);
  });

  it('should fetch Threads Initiated', async () => {
    component.skipThreadsInitiated = 0;
    spyOn(discussionForumService, "getThreadsByUser").and.resolveTo(
      {
        "totalQuestion": 9,
        "questions": [
          {
            "_id": "61cc588f3a5066037d5dd48e",
            "numOfUpvotes": 0,
            "numOfAnswers": 0,
            "courseId": "1142",
            "elementId": "0547e8db-b01a-4fea-b8cf-06319f0967f1",
            "title": "test4",
            "description": "",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "Testing attachment flow",
            "contentType": "standard_discussion_forum",
            "questionId": "059c12cd-c044-4258-9920-c4cba812d21f",
            "createdAt": "2021-12-29T12:46:07.790Z",
            "updatedAt": "2021-12-29T12:46:07.790Z",
            "userName": "demostudent"
          },
          {
            "_id": "61cc588a0ec63e03763f3d59",
            "numOfUpvotes": 0,
            "numOfAnswers": 0,
            "courseId": "1142",
            "elementId": "0547e8db-b01a-4fea-b8cf-06319f0967f1",
            "title": "test3",
            "description": "",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "Testing attachment flow",
            "contentType": "standard_discussion_forum",
            "questionId": "6d4614cc-d950-49bd-b5ad-7147513e4eda",
            "createdAt": "2021-12-29T12:46:02.192Z",
            "updatedAt": "2021-12-29T12:46:02.192Z",
            "userName": "demostudent"
          },
        ]
      });
    await component.fetchThreadsInitiated();
    // fixture.detectChanges();
    // fixture.whenStable()
    expect(component.skipThreadsInitiated).toEqual(5);
  });

});
