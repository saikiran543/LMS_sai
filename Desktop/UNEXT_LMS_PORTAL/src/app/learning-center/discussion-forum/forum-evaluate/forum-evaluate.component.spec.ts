/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';

import { ForumEvaluateComponent } from './forum-evaluate.component';

describe('ForumEvaluateComponent', () => {
  let component: ForumEvaluateComponent;
  let fixture: ComponentFixture<ForumEvaluateComponent>;
  let discussionForumService: DiscussionForumService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForumEvaluateComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        DiscussionForumService
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    discussionForumService = TestBed.inject(DiscussionForumService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ', () => {
    const row = {
      "selected": [
        {
          "Username": "demostudent",
          "ParticipationStatus": "Not Participated",
          "SubmittedDate": "2021-12-28T12:39:27.978Z",
          "ThreadsInitiated": 0,
          "ThreadsParticipated": 0,
          "UpvotesReceived": 0,
          "GradeStatus": true,
          "OverallScore": 30
        },
        {
          "Username": "string",
          "ParticipationStatus": "Not Participated",
          "SubmittedDate": 0,
          "ThreadsInitiated": 0,
          "ThreadsParticipated": 0,
          "UpvotesReceived": 0,
          "GradeStatus": false,
          "OverallScore": 0
        },
        {
          "Username": "pandiya",
          "ParticipationStatus": "Not Participated",
          "SubmittedDate": 0,
          "ThreadsInitiated": 0,
          "ThreadsParticipated": 0,
          "UpvotesReceived": 0,
          "GradeStatus": false,
          "OverallScore": 0
        }
      ]
    };

    component.onSelect(row, "standard_discussion_forum");
    expect(component.selected.length).toEqual(row.selected.length);

  });

  it('should call backToList', () => {
    spyOn(router, 'navigate').and.resolveTo(true);
    component.backToList();
    expect(component.backToList).toHaveBeenCalled;
  });

  it('should call getStudentActivity', fakeAsync(async () => {
    component.forumEvaluateItem = {
      "elementId": "71d1b65d-0cb0-4b34-b794-d5afb2aab497",
      "type": "discussion_forum",
      "subType": "standard_discussion_forum",
      "title": "sfgsgsfg",
      "status": "published",
      "createdOn": "2021-12-22T10:25:12.889Z",
      "createdBy": "1",
      "updatedOn": "2021-12-27T07:21:11.411Z",
      "updatedBy": "",
      "childElements": [],
      "activitymetadata": [
        {
          "_id": "61c2fd08a8d6d0036f7b6e69",
          "isGradable": true,
          "learningObjectives": [],
          "emailNotification": true,
          "tags": [],
          "courseId": "1142",
          "parentElementId": "9209415b-5b74-4e91-8359-10a3a9fb8d34",
          "title": "sfgsgsfg",
          "description": "",
          "visibilityCriteria": false,
          "activityStatus": "mandatory",
          "createdBy": "1",
          "updatedBy": "1",
          "activityId": "71d1b65d-0cb0-4b34-b794-d5afb2aab497",
          "createdAt": "2021-12-22T10:25:12.903Z",
          "updatedAt": "2021-12-27T07:21:11.432Z",
          "endDate": "2021-12-31T05:24:20.000Z",
          "fileName": null,
          "lastAccessedBy": "1",
          "maxMarks": 100,
          "originalFileName": null,
          "passMarks": 45,
          "rubricId": "9c53e89d-cbde-473a-b532-65faa66fdc73",
          "startDate": "2021-12-27T05:24:20.000Z"
        }
      ],
      "breadcrumbTitle": "/Unit 1 Economics Financial Aspects Knowledge of stock market trade and investment/Week 1 - Introduction to Finance /Day 1 Introduction to Accounting",
      "qnAmetaData": {
        "updatedAt": null,
        "updatedBy": null,
        "totalAnswers": 0,
        "totalQuestions": 0,
        "totalAnswersUpvotes": 0,
        "totalQuestionsUpvotes": 0
      },
      "__v": 1648
    };

    const res = [
      {
        "_id": "61cb05805ebb4903708434cb",
        "activityId": "71d1b65d-0cb0-4b34-b794-d5afb2aab497",
        "userId": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
        "__v": 0,
        "activityName": "sfgsgsfg",
        "activityType": "discussion_forum",
        "subActivityType": "standard_discussion_forum",
        "attemptId": "7e7f31c4-5437-4803-8da6-bb7fd344f0a2",
        "attempts": 1,
        "attemptsMade": 1,
        "feedback": null,
        "gradedBy": "1",
        "gradedOn": "2021-12-28T12:39:27.978Z",
        "isGradable": true,
        "lastSubmittedDate": "2021-12-28T12:39:27.978Z",
        "maxMarks": 100,
        "responseStatus": "discussion-forum-evaluation",
        "resultId": "e0359a5c-6201-472d-a844-f6de75649ffd",
        "score": 30,
        "startDate": "2021-12-28T12:39:27.978Z",
        "userName": "demostudent",
        "questionsInitiated": 0,
        "numberOfUpvotes": 0,
        "threadsParticipated": 0
      },
      {
        "attemptId": "",
        "userId": "017965b9-8f22-4abe-95f0-6798fa874e44",
        "userName": "string",
        "activityId": "71d1b65d-0cb0-4b34-b794-d5afb2aab497",
        "activityName": "",
        "activityType": "discussion_forum",
        "subActivityType": "standard_discussion_forum",
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
        "questionsInitiated": 0,
        "numberOfUpvotes": 0,
        "threadsParticipated": 0
      },
      {
        "attemptId": "",
        "userId": "cff0279c-e832-4501-85af-3c5c05fd2a05",
        "userName": "pandiya",
        "activityId": "71d1b65d-0cb0-4b34-b794-d5afb2aab497",
        "activityName": "",
        "activityType": "discussion_forum",
        "subActivityType": "standard_discussion_forum",
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
        "questionsInitiated": 0,
        "numberOfUpvotes": 0,
        "threadsParticipated": 0
      }
    ];
    component.forumEvaluateItemId = "71d1b65d-0cb0-4b34-b794-d5afb2aab497";
    component.courseId = "1142";
    spyOn(discussionForumService, 'studentActivityResult').withArgs(component.forumEvaluateItemId, component.courseId, {
      limit: 5,
      pageNo: 1,
    }).and.resolveTo(res);

    await component.getStudentActivity(component.forumEvaluateItem.subType);
    expect(component.studentActivities).toEqual(res);
    expect(component.standardDiscussionDataTable).toBeTrue();
    flush();
    component.forumEvaluateItem = {
      "elementId": "71d1b65d-0cb0-4b34-b794-d5afb2aab497",
      "type": "discussion_forum",
      "subType": "doubt_discussion_forum",
      "title": "sfgsgsfg",
      "status": "published",
      "createdOn": "2021-12-22T10:25:12.889Z",
      "createdBy": "1",
      "updatedOn": "2021-12-27T07:21:11.411Z",
      "updatedBy": "",
      "childElements": [],
      "activitymetadata": [
        {
          "_id": "61c2fd08a8d6d0036f7b6e69",
          "isGradable": true,
          "learningObjectives": [],
          "emailNotification": true,
          "tags": [],
          "courseId": "1142",
          "parentElementId": "9209415b-5b74-4e91-8359-10a3a9fb8d34",
          "title": "sfgsgsfg",
          "description": "",
          "visibilityCriteria": false,
          "activityStatus": "mandatory",
          "createdBy": "1",
          "updatedBy": "1",
          "activityId": "71d1b65d-0cb0-4b34-b794-d5afb2aab497",
          "createdAt": "2021-12-22T10:25:12.903Z",
          "updatedAt": "2021-12-27T07:21:11.432Z",
          "endDate": "2021-12-31T05:24:20.000Z",
          "fileName": null,
          "lastAccessedBy": "1",
          "maxMarks": 100,
          "originalFileName": null,
          "passMarks": 45,
          "rubricId": "9c53e89d-cbde-473a-b532-65faa66fdc73",
          "startDate": "2021-12-27T05:24:20.000Z"
        }
      ],
      "breadcrumbTitle": "/Unit 1 Economics Financial Aspects Knowledge of stock market trade and investment/Week 1 - Introduction to Finance /Day 1 Introduction to Accounting",
      "qnAmetaData": {
        "updatedAt": null,
        "updatedBy": null,
        "totalAnswers": 0,
        "totalQuestions": 0,
        "totalAnswersUpvotes": 0,
        "totalQuestionsUpvotes": 0
      },
      "__v": 1648
    };
    await component.getStudentActivity(component.forumEvaluateItem.subType);
    expect(component.studentActivities).toEqual(res);
  }));

  it('should call moreContent', () => {
    const forum = {
      isTextFullHeight: false
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const event = { stopPropagation: () => { } };
    component.forumEvaluateItemId = "71d1b65d-0cb0-4b34-b794-d5afb2aab497";
    component.courseId = "1142";
    component.moreContent(forum, event);
  });

  it('should call navigateToStudentDetailsPage', () => {
    const row = {
      "Username": "demostudent",
      "ParticipationStatus": "Not Participated",
      "SubmittedDate": "2021-12-28T12:39:27.978Z",
      "ThreadsInitiated": 0,
      "ThreadsParticipated": 0,
      "UpvotesReceived": 0,
      "GradeStatus": true,
      "OverallScore": 30
    };
    component.studentActivities = [
      {
        "_id": "61cb05805ebb4903708434cb",
        "activityId": "71d1b65d-0cb0-4b34-b794-d5afb2aab497",
        "userId": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
        "__v": 0,
        "activityName": "sfgsgsfg",
        "activityType": "discussion_forum",
        "subActivityType": "standard_discussion_forum",
        "attemptId": "7e7f31c4-5437-4803-8da6-bb7fd344f0a2",
        "attempts": 1,
        "attemptsMade": 1,
        "feedback": null,
        "gradedBy": "1",
        "gradedOn": "2021-12-28T12:39:27.978Z",
        "isGradable": true,
        "lastSubmittedDate": "2021-12-28T12:39:27.978Z",
        "maxMarks": 100,
        "responseStatus": "discussion-forum-evaluation",
        "resultId": "e0359a5c-6201-472d-a844-f6de75649ffd",
        "score": 30,
        "startDate": "2021-12-28T12:39:27.978Z",
        "userName": "demostudent",
        "questionsInitiated": 0,
        "numberOfUpvotes": 0,
        "threadsParticipated": 0
      },
      {
        "attemptId": "",
        "userId": "017965b9-8f22-4abe-95f0-6798fa874e44",
        "userName": "string",
        "activityId": "71d1b65d-0cb0-4b34-b794-d5afb2aab497",
        "activityName": "",
        "activityType": "discussion_forum",
        "subActivityType": "standard_discussion_forum",
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
        "questionsInitiated": 0,
        "numberOfUpvotes": 0,
        "threadsParticipated": 0
      },
      {
        "attemptId": "",
        "userId": "cff0279c-e832-4501-85af-3c5c05fd2a05",
        "userName": "pandiya",
        "activityId": "71d1b65d-0cb0-4b34-b794-d5afb2aab497",
        "activityName": "",
        "activityType": "discussion_forum",
        "subActivityType": "standard_discussion_forum",
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
        "questionsInitiated": 0,
        "numberOfUpvotes": 0,
        "threadsParticipated": 0
      }
    ];
    component.forumEvaluateItemId = "71d1b65d-0cb0-4b34-b794-d5afb2aab497";
    component.courseId = "1142";
    spyOn(router, 'navigate').and.resolveTo(true);
    component.navigateToStudentDetailsPage(row);
  });
});
