/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { Observable,of } from 'rxjs';
import { CKEditorSharedModule } from 'src/app/shared/modules/ckeditor-shared.module';
import { StudentPerformanceDetailComponent } from './student-performance-detail.component';
import translations from 'src/assets/i18n/en.json';
import { StorageKey } from 'src/app/enums/storageKey';
import { StorageService } from 'src/app/services/storage.service';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';
import { DoubtClarificationUserDetailsContentItemModule } from '../doubt-clarification-user-details-content-item/doubt-clarification-user-details-content-item.module';
import { QuestionAnswerReplyModule } from '../../shared/question-answer-reply/question-answer-reply.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
describe('StudentPerformanceDetailComponent', () => {
  let component: StudentPerformanceDetailComponent;
  let fixture: ComponentFixture<StudentPerformanceDetailComponent>;
  let storageService: StorageService;
  let translate: TranslateService;
  let discussionForumService: DiscussionForumService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule ,DoubtClarificationUserDetailsContentItemModule,InfiniteScrollModule,QuestionAnswerReplyModule,NgCircleProgressModule.forRoot({}),ToastrModule.forRoot(),RouterTestingModule,TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      }),CKEditorSharedModule],
      declarations: [ StudentPerformanceDetailComponent ]
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    storageService = TestBed.inject(StorageService);
    discussionForumService = TestBed.inject(DiscussionForumService);
  });

  beforeEach(() => {
    storageService.set(StorageKey.USER_CURRENT_VIEW ,"student");
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
    fixture = TestBed.createComponent(StudentPerformanceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ui', () => {
    const compiled = fixture.debugElement.nativeElement;
    const myPerformanceUserName = compiled.querySelector('.my-performanceuser-name');
    expect(myPerformanceUserName.textContent).toContain('Demo Student');
    const validityBlock = compiled.querySelector('.header-validity');
    expect(validityBlock.textContent).toContain('Validity');
  });
  
  it('Verify if my performance tab is showing Questions Initiated ,Upvotes, Feedback and Attached Content',async()=>{
    spyOn(discussionForumService,"studentActivityResultByUserId").and.resolveTo(
      [
        {
          "_id": "61fa151b3c794203757136ba",
          "activityId": "8db62125-6b41-47ba-b449-9c943953bb23",
          "userId": "54d655d0-64d9-4c6e-83a1-1bc6c2178b58",
          "__v": 0,
          "activityName": "Test 101",
          "activityType": "doubt_clarification_forum",
          "attemptId": "65fc8959-dec4-4eaf-9dc6-3f828145e0d8",
          "attempts": 1,
          "attemptsMade": 1,
          "feedback": "<p>You can do better</p>",
          "gradedBy": "1",
          "gradedOn": "2022-02-02T08:34:35.763Z",
          "isGradable": true,
          "lastSubmittedDate": "2022-02-02T08:34:35.763Z",
          "maxMarks": 100,
          "responseStatus": "discussion-forum-evaluation",
          "resultId": "10953515-8505-4212-b556-929a061773f1",
          "score": 20,
          "startDate": "2022-02-02T08:34:35.763Z",
          "userName": "joseph",
          "isFeedbackPublished": true,
          "isGradePublished": true,
          "attachedContents": [
            {
              "elementId": "d81c1c2d-040c-4993-9b86-235510633b0d",
              "type": "image",
              "title": "Deffered Revenue",
              "status": "published",
              "createdOn": "2022-02-01T13:04:52.883Z",
              "createdBy": "",
              "updatedOn": "2022-02-01T13:04:52.883Z",
              "updatedBy": "",
              "conversionStatus": null,
              "childElements": [],
              "breadcrumbTitle": "",
              "questionsInitiated": 0,
              "numberOfUpvotes": 0,
              "threadsParticipated": 0
            },
            {
              "elementId": "5719dac8-0857-456a-9958-552d34436e7f",
              "type": "document",
              "title": "Reliance IR 2020",
              "status": "unpublished",
              "createdOn": "2022-02-01T13:03:42.349Z",
              "createdBy": "",
              "updatedOn": "2022-02-01T13:03:42.349Z",
              "updatedBy": "",
              "conversionStatus": null,
              "childElements": [],
              "breadcrumbTitle": "/Unit 1 - Introduction /Chapter 1 - Capitalism",
              "questionsInitiated": 0,
              "numberOfUpvotes": 0,
              "threadsParticipated": 0
            }
          ],
          "questionsInitiated": 1,
          "numberOfUpvotes": 20,
          "threadsParticipated": 0
        }
      ]);
    spyOn(discussionForumService,"forumDetail").and.resolveTo(
      {
        "elementId": "8db62125-6b41-47ba-b449-9c943953bb23",
        "type": "doubt_clarification_forum",
        "title": "Test 101",
        "status": "published",
        "createdOn": "2022-02-01T13:10:24.329Z",
        "createdBy": "1",
        "updatedOn": "2022-02-01T13:10:24.329Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61f93140d776450377e5e334",
            "isGradable": true,
            "emailNotification": true,
            "tags": [],
            "title": "Test 101",
            "courseId": "1152",
            "parentElementId": "1152",
            "description": "<p>Test 101</p>",
            "activityStatus": "mandatory",
            "maxMarks": 100,
            "passMarks": 40,
            "rubricId": "ea89a706-e00e-4ba9-b03b-e8048d6a17f7",
            "startDate": "2022-02-01T13:10:00.092Z",
            "endDate": "2022-02-23T01:10:00.000Z",
            "visibilityCriteria": false,
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "8db62125-6b41-47ba-b449-9c943953bb23",
            "createdAt": "2022-02-01T13:10:24.340Z",
            "updatedAt": "2022-02-01T13:10:24.340Z"
          }
        ],
        "breadcrumbTitle": "",
        "qnAmetaData": {
          "totalQuestions": 1,
          "totalAnswers": 0,
          "updatedAt": "2022-02-02T04:56:43.959Z",
          "updatedBy": "demostudent01"
        },
        "__v": 14
      }
    );
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
    const contentValidity = compiled.querySelector('.content-validity');
    expect(contentValidity.textContent).toContain('1st Feb 2022, 6:40 pm - 23rd Feb 2022, 6:40 am');
    const doubtClarificationElement = compiled.querySelector('.content-header');
    expect(doubtClarificationElement.textContent).toContain('Deffered Revenue');
    const feedback = compiled.querySelector('.feedback-content');
    expect(feedback.textContent).toContain('You can do better');
    const questionsPosted = compiled.querySelector('#myperformance-qtn-posted').querySelector('.stat-box-text');
    expect(questionsPosted.textContent).toContain('1');
    const upvotesReceived = compiled.querySelector('#myperformance-upvotes-rcd').querySelector('.stat-box-text');
    expect(upvotesReceived.textContent).toContain('20');
  });

  it('Verify if Empty Feedback screen is valid',async()=>{
    spyOn(discussionForumService,"studentActivityResultByUserId").and.resolveTo(
      [
        {
          "_id": "61fa151b3c794203757136ba",
          "activityId": "8db62125-6b41-47ba-b449-9c943953bb23",
          "userId": "54d655d0-64d9-4c6e-83a1-1bc6c2178b58",
          "__v": 0,
          "activityName": "Test 101",
          "activityType": "doubt_clarification_forum",
          "attemptId": "65fc8959-dec4-4eaf-9dc6-3f828145e0d8",
          "attempts": 1,
          "attemptsMade": 1,
          "feedback": "<p>You can do better</p>",
          "gradedBy": "1",
          "gradedOn": "2022-02-02T08:34:35.763Z",
          "isGradable": true,
          "lastSubmittedDate": "2022-02-02T08:34:35.763Z",
          "maxMarks": 100,
          "responseStatus": "discussion-forum-evaluation",
          "resultId": "10953515-8505-4212-b556-929a061773f1",
          "score": 20,
          "startDate": "2022-02-02T08:34:35.763Z",
          "userName": "joseph",
          "isFeedbackPublished": false,
          "isGradePublished": false,
          "attachedContents": [
            {
              "elementId": "d81c1c2d-040c-4993-9b86-235510633b0d",
              "type": "image",
              "title": "Deffered Revenue",
              "status": "published",
              "createdOn": "2022-02-01T13:04:52.883Z",
              "createdBy": "",
              "updatedOn": "2022-02-01T13:04:52.883Z",
              "updatedBy": "",
              "conversionStatus": null,
              "childElements": [],
              "breadcrumbTitle": "",
              "questionsInitiated": 0,
              "numberOfUpvotes": 0,
              "threadsParticipated": 0
            },
            {
              "elementId": "5719dac8-0857-456a-9958-552d34436e7f",
              "type": "document",
              "title": "Reliance IR 2020",
              "status": "unpublished",
              "createdOn": "2022-02-01T13:03:42.349Z",
              "createdBy": "",
              "updatedOn": "2022-02-01T13:03:42.349Z",
              "updatedBy": "",
              "conversionStatus": null,
              "childElements": [],
              "breadcrumbTitle": "/Unit 1 - Introduction /Chapter 1 - Capitalism",
              "questionsInitiated": 0,
              "numberOfUpvotes": 0,
              "threadsParticipated": 0
            }
          ],
          "questionsInitiated": 1,
          "numberOfUpvotes": 20,
          "threadsParticipated": 0
        }
      ]);
    spyOn(discussionForumService,"forumDetail").and.resolveTo(
      {
        "elementId": "8db62125-6b41-47ba-b449-9c943953bb23",
        "type": "doubt_clarification_forum",
        "title": "Test 101",
        "status": "published",
        "createdOn": "2022-02-01T13:10:24.329Z",
        "createdBy": "1",
        "updatedOn": "2022-02-01T13:10:24.329Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61f93140d776450377e5e334",
            "isGradable": true,
            "emailNotification": true,
            "tags": [],
            "title": "Test 101",
            "courseId": "1152",
            "parentElementId": "1152",
            "description": "<p>Test 101</p>",
            "activityStatus": "mandatory",
            "maxMarks": 100,
            "passMarks": 40,
            "rubricId": "ea89a706-e00e-4ba9-b03b-e8048d6a17f7",
            "startDate": "2022-02-01T13:10:00.092Z",
            "endDate": "2022-02-23T01:10:00.000Z",
            "visibilityCriteria": false,
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "8db62125-6b41-47ba-b449-9c943953bb23",
            "createdAt": "2022-02-01T13:10:24.340Z",
            "updatedAt": "2022-02-01T13:10:24.340Z"
          }
        ],
        "breadcrumbTitle": "",
        "qnAmetaData": {
          "totalQuestions": 1,
          "totalAnswers": 0,
          "updatedAt": "2022-02-02T04:56:43.959Z",
          "updatedBy": "demostudent01"
        },
        "__v": 14
      }
    );
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
    const contentValidity = compiled.querySelector('.content-validity');
    expect(contentValidity.textContent).toContain('1st Feb 2022, 6:40 pm - 23rd Feb 2022, 6:40 am');
    const feedback = compiled.querySelector('.myperformance-no-feedback-box').querySelector('.no-feedback-text');
    expect(feedback.textContent).toContain('Looks like there is no feedback given!');
    const emptyFeedbackImageLink = compiled.querySelector('.myperformance-no-feedback-box').querySelector('.text-center>img');
    expect(emptyFeedbackImageLink.src).toContain('assets/images/icons/discussion-forum/empty_feedback.svg');
 
  });

});