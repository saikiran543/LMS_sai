/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { ElementStatuses } from 'src/app/enums/ElementStatuses';
import { ForumType } from 'src/app/enums/forumType';
import { StorageService } from 'src/app/services/storage.service';
import { CommonUtils } from 'src/app/utils/common-utils';
import translations from '../../../../assets/i18n/en.json';
import { ContentPlayerService } from '../../course-services/content-player.service';
import { ContentService } from '../../course-services/content.service';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';
import { ForumDetailComponent } from './forum-detail.component';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

export class MockNgbModalRefYes {
  componentInstance = {
    confirmStatus: of(true),
    params: {
      message: '',
      confirmBtn: '',
      cancelBtn: ''
    },
    askedQuestion: of({
      "_id": "61c9d9cd9179670376bd678b",
      "numOfUpvotes": 1,
      "numOfAnswers": 1,
      "courseId": "1142",
      "elementId": "78733681-0921-4da6-8827-6f4515136700",
      "title": "TEst STD Forum",
      "description": "",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Test STD forum",
      "contentType": "standard_discussion_forum",
      "questionId": "57bc8f71-fb11-4c8d-b477-3fce09a642d5",
      "createdAt": "2021-12-27T15:20:45.520Z",
      "updatedAt": "2021-12-27T15:20:45.520Z",
      "verifiedAnswerId": "46ec277c-aa23-4a28-87e1-46ee8c50d8be",
      "isUpvoted": true,
      "isFollowing": true,
      "userName": "Admin"
    })
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Promise<any> = new Promise((resolve) => resolve({ test: 1 }));

  close(): void {
    //mock function
  }
}

describe('ForumDetailComponent', () => {
  let component: ForumDetailComponent;
  let fixture: ComponentFixture<ForumDetailComponent>;
  let contentService: ContentService;
  let router: Router;
  let discussionForumService: DiscussionForumService;
  let modalService: NgbModal;
  let contentPlayerService: ContentPlayerService;
  let storageService: StorageService;
  const mockModalRef: MockNgbModalRefYes = new MockNgbModalRefYes();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForumDetailComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          },
          defaultLanguage: 'en'
        }),
        ToastrModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers: [
        TranslateService,
        ContentPlayerService,
        DiscussionForumService,
        CommonUtils,
        NgbModal
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    contentService = TestBed.inject(ContentService);
    router = TestBed.inject(Router);
    discussionForumService = TestBed.inject(DiscussionForumService);
    modalService = TestBed.inject(NgbModal);
    storageService = TestBed.inject(StorageService);
    contentPlayerService = TestBed.inject(ContentPlayerService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call more content', async () => {
    const forum = {
      isTextFullHeight: false
    };
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    const event = { stopPropagation: () => { } };
    spyOn(component, 'moreContent').and.callThrough();
    component.moreContent(forum, event);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(forum.isTextFullHeight).toEqual(true);
  });

  it('should call publishUnpublish', fakeAsync(async () => {
    let event = {
      target: {
        checked: true
      }
    };
    const elementId = '5e7bceae-0631-4f3b-b683-592963adf9a3';
    component.courseId = 1142;
    component.currentDiscussionItemId = '5e7bceae-0631-4f3b-b683-592963adf9a3';
    const data = {
      "elementId": "5e7bceae-0631-4f3b-b683-592963adf9a3",
      "type": "standard_discussion_forum",
      "title": "sdfdsfg",
      "status": "unpublished",
      "createdOn": "2021-12-22T10:50:03.384Z",
      "createdBy": "1",
      "updatedOn": "2021-12-22T10:50:03.384Z",
      "updatedBy": "1",
      "childElements": [],
      "activitymetadata": [
        {
          "_id": "61c302dba8d6d0036f7b6f50",
          "isGradable": false,
          "learningObjectives": [],
          "emailNotification": true,
          "tags": [],
          "courseId": "1142",
          "parentElementId": "22f18ca4-bc71-48b9-9126-4dbfa3dbf47b",
          "title": "sdfdsfg",
          "description": "",
          "visibilityCriteria": false,
          "activityStatus": "mandatory",
          "createdBy": "1",
          "updatedBy": "1",
          "activityId": "5e7bceae-0631-4f3b-b683-592963adf9a3",
          "createdAt": "2021-12-22T10:50:03.393Z",
          "updatedAt": "2021-12-22T10:50:03.393Z"
        }
      ],
      "breadcrumbTitle": "/Unit 1 Economics Financial Aspects Knowledge of stock market trade and investment/Week 1 - Introduction to Finance ",
      "qnAmetaData": {
        "updatedAt": null,
        "updatedBy": null,
        "totalAnswers": 0,
        "totalQuestions": 0,
        "totalAnswersUpvotes": 0,
        "totalQuestionsUpvotes": 0
      },
      "__v": 1536
    };
    component.currentDiscussionItem = data;
    const result = { status: 200, __v: 1537 };
    spyOn(contentService, 'publish').withArgs(component.courseId, elementId, true).and.resolveTo(result);
    spyOn(component, 'publishUnpublish').and.callThrough();
    await component.publishUnpublish(elementId, event);
    expect(component.currentDiscussionItem.status).toEqual(ElementStatuses.PUBLISHED);
    flush();
    event = {
      target: {
        checked: false
      }
    };
    spyOn(contentService, 'unPublish').withArgs(component.courseId, elementId).and.resolveTo(result);
    await component.publishUnpublish(elementId, event);
    expect(component.currentDiscussionItem.status).toEqual(ElementStatuses.UNPUBLISHED);
    flush();
  }));

  it('should call closeToast', () => {
    component.closeToast();
    expect(component.forumToast).toBeFalse();
  });

  it('should call sortByCount by answers', async(done) => {
    spyOn(discussionForumService, 'getDoubtclarificationSort').and.resolveTo(
      {
        "elementDetails": [
          {
            "elementId": "39e3c6c8-cedf-4516-ada8-ff9856998b89",
            "type": "document",
            "title": "Test Document Content",
            "status": "published",
            "createdOn": "2022-01-05T08:30:30.138Z",
            "createdBy": "",
            "updatedOn": "2022-01-05T08:30:30.138Z",
            "updatedBy": "",
            "conversionStatus": null,
            "childElements": [],
            "publishedOn": "2022-01-05T08:30:36.779Z",
            "breadcrumbTitle": "",
            "qnAmetaData": {
              "updatedAt": "2022-01-05T09:00:36.377Z",
              "updatedBy": "demostudent01",
              "totalAnswers": 3,
              "totalQuestions": 1,
              "totalAnswersUpvotes": 0,
              "totalQuestionsUpvotes": 0
            }
          },
          {
            "elementId": "6eca132f-9e10-4c01-855c-81d29061b33b",
            "type": "image",
            "title": "test2022",
            "status": "published",
            "createdOn": "2022-01-05T11:40:04.257Z",
            "createdBy": "",
            "updatedOn": "2022-01-05T11:40:04.257Z",
            "updatedBy": "",
            "conversionStatus": null,
            "childElements": [],
            "breadcrumbTitle": "/Unit 1 Economics Financial Aspects (Knowledge of stock market trade and investment)/Week-1 Introduction to finance/new",
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
            "elementId": "e0c3ec95-994f-4601-8489-74510388eb23",
            "type": "weblink",
            "title": "test weblink",
            "status": "unpublished",
            "createdOn": "2022-01-06T05:15:21.390Z",
            "createdBy": "",
            "updatedOn": "2022-01-06T05:15:21.390Z",
            "updatedBy": "",
            "conversionStatus": null,
            "childElements": [],
            "breadcrumbTitle": "",
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
            "elementId": "56eec138-17dc-4d71-9336-203bc15d06b3",
            "type": "scorm",
            "title": "test scrom notes",
            "status": "unpublished",
            "createdOn": "2022-01-06T05:25:33.388Z",
            "createdBy": "",
            "updatedOn": "2022-01-06T05:25:33.388Z",
            "updatedBy": "",
            "conversionStatus": null,
            "childElements": [],
            "breadcrumbTitle": "",
            "qnAmetaData": {
              "updatedAt": null,
              "updatedBy": null,
              "totalAnswers": 0,
              "totalQuestions": 0,
              "totalAnswersUpvotes": 0,
              "totalQuestionsUpvotes": 0
            }
          }
        ],
        "__v": 2101
      });
    const sortBy = 'answers';
    component.currentDiscussionItemId = "44084c4b-71c4-4d40-b964-ce30bdb24755";
    component.courseId = "1142";
    component.currentDiscussionItem.type = "doubt_clarification_forum";
    await component.sortByCount(sortBy);
    expect(component.fetchQuestions).toHaveBeenCalled();
    done();
  });

  it('should call sortByCount by questions', async (done) => {
    spyOn(discussionForumService, 'getDoubtclarificationSort').and.resolveTo(
      {
        "elementDetails": [
          {
            "elementId": "39e3c6c8-cedf-4516-ada8-ff9856998b89",
            "type": "document",
            "title": "Test Document Content",
            "status": "published",
            "createdOn": "2022-01-05T08:30:30.138Z",
            "createdBy": "",
            "updatedOn": "2022-01-05T08:30:30.138Z",
            "updatedBy": "",
            "conversionStatus": null,
            "childElements": [],
            "publishedOn": "2022-01-05T08:30:36.779Z",
            "breadcrumbTitle": "",
            "qnAmetaData": {
              "updatedAt": "2022-01-07T05:07:16.627Z",
              "updatedBy": "demostudent01",
              "totalAnswers": 5,
              "totalQuestions": 2,
              "totalAnswersUpvotes": 0,
              "totalQuestionsUpvotes": 1
            }
          },
          {
            "elementId": "6eca132f-9e10-4c01-855c-81d29061b33b",
            "type": "image",
            "title": "test2022",
            "status": "published",
            "createdOn": "2022-01-05T11:40:04.257Z",
            "createdBy": "",
            "updatedOn": "2022-01-05T11:40:04.257Z",
            "updatedBy": "",
            "conversionStatus": null,
            "childElements": [],
            "breadcrumbTitle": "/Unit 1 Economics Financial Aspects (Knowledge of stock market trade and investment)/Week-1 Introduction to finance/new",
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
            "elementId": "e0c3ec95-994f-4601-8489-74510388eb23",
            "type": "weblink",
            "title": "test weblink",
            "status": "unpublished",
            "createdOn": "2022-01-06T05:15:21.390Z",
            "createdBy": "",
            "updatedOn": "2022-01-06T05:15:21.390Z",
            "updatedBy": "",
            "conversionStatus": null,
            "childElements": [],
            "breadcrumbTitle": "",
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
            "elementId": "56eec138-17dc-4d71-9336-203bc15d06b3",
            "type": "scorm",
            "title": "test scrom notes",
            "status": "unpublished",
            "createdOn": "2022-01-06T05:25:33.388Z",
            "createdBy": "",
            "updatedOn": "2022-01-06T05:25:33.388Z",
            "updatedBy": "",
            "conversionStatus": null,
            "childElements": [],
            "breadcrumbTitle": "",
            "qnAmetaData": {
              "updatedAt": null,
              "updatedBy": null,
              "totalAnswers": 0,
              "totalQuestions": 0,
              "totalAnswersUpvotes": 0,
              "totalQuestionsUpvotes": 0
            }
          }
        ],
        "__v": 2101
      });
    const sortBy = 'questions';
    component.currentDiscussionItemId = "44084c4b-71c4-4d40-b964-ce30bdb24755";
    component.courseId = "1142";
    component.currentDiscussionItem.type = "doubt_clarification_forum";
    await component.sortByCount(sortBy);
    expect(component.fetchQuestions).toHaveBeenCalled();
    done();
  });

  it('should call onReplyAdded', fakeAsync(async () => {
    let event = true;
    component.courseId = 1142;
    component.currentDiscussionItemId = '5e7bceae-0631-4f3b-b683-592963adf9a3';
    component.currentDiscussionItem = {
      "elementId": "5e7bceae-0631-4f3b-b683-592963adf9a3",
      "type": "standard_discussion_forum",
      "title": "sdfdsfg",
      "status": "unpublished",
      "createdOn": "2021-12-22T10:50:03.384Z",
      "createdBy": "1",
      "updatedOn": "2021-12-22T10:50:03.384Z",
      "updatedBy": "1",
      "childElements": [],
      "activitymetadata": [
        {
          "_id": "61c302dba8d6d0036f7b6f50",
          "isGradable": false,
          "learningObjectives": [],
          "emailNotification": true,
          "tags": [],
          "courseId": "1142",
          "parentElementId": "22f18ca4-bc71-48b9-9126-4dbfa3dbf47b",
          "title": "sdfdsfg",
          "description": "",
          "visibilityCriteria": false,
          "activityStatus": "mandatory",
          "createdBy": "1",
          "updatedBy": "1",
          "activityId": "5e7bceae-0631-4f3b-b683-592963adf9a3",
          "createdAt": "2021-12-22T10:50:03.393Z",
          "updatedAt": "2021-12-22T10:50:03.393Z"
        }
      ],
      "breadcrumbTitle": "/Unit 1 Economics Financial Aspects Knowledge of stock market trade and investment/Week 1 - Introduction to Finance ",
      "qnAmetaData": {
        "updatedAt": null,
        "updatedBy": null,
        "totalAnswers": 0,
        "totalQuestions": 0,
        "totalAnswersUpvotes": 0,
        "totalQuestionsUpvotes": 0
      },
      "__v": 1536
    };
    spyOn(component, 'onReplyAdded').and.callThrough();
    component.onReplyAdded(event);
    expect(component.currentDiscussionItem.qnAmetaData.totalAnswers).toEqual(1);
    event = false;
    component.onReplyAdded(event);
    expect(component.currentDiscussionItem.qnAmetaData.totalAnswers).toEqual(0);
  }));

  it('should call deleteHandler', () => {
    const event = {
      id: "string",
      type: ForumType.DOUBT_CLARIFICATION_FORUM
    };

    spyOn(router, 'navigate').and.resolveTo(true);
    spyOn(component, 'deleteHandler').and.callThrough();
    component.deleteHandler(event);
    expect(component.deleteHandler).toHaveBeenCalled;
  });

  it('should fetch questions on ScrollDown', async () => {
    const questionsData = {
      "totalQuestion": 1,
      "questions": [
        {
          "_id": "61c9d9cd9179670376bd678b",
          "numOfUpvotes": 1,
          "numOfAnswers": 1,
          "courseId": "1142",
          "elementId": "78733681-0921-4da6-8827-6f4515136700",
          "title": "TEst STD Forum",
          "description": "",
          "createdBy": "1",
          "updatedBy": "1",
          "contentTitle": "Test STD forum",
          "contentType": "standard_discussion_forum",
          "questionId": "57bc8f71-fb11-4c8d-b477-3fce09a642d5",
          "createdAt": "2021-12-27T15:20:45.520Z",
          "updatedAt": "2021-12-27T15:20:45.520Z",
          "verifiedAnswerId": "46ec277c-aa23-4a28-87e1-46ee8c50d8be",
          "isUpvoted": true,
          "isFollowing": true,
          "userName": "Admin"
        }
      ]
    };
    component.limitReached = false;
    spyOn(discussionForumService, 'getQuestions').and.resolveTo(questionsData);
    spyOn(component, 'onScrollDown').and.callThrough();
    await component.onScrollDown();
    expect(component.questions).toEqual(questionsData.questions);
    expect(component.limitReached).toBeFalse();
  });

  it('should call backToList', () => {
    spyOn(router, 'navigate').and.resolveTo(true);
    component.backToList();
    expect(component.backToList).toHaveBeenCalled;
  });

  it('should call createThread', () => {
    component.courseId = 1142;
    component.currentDiscussionItemId = '5e7bceae-0631-4f3b-b683-592963adf9a3';
    const data = {
      "elementId": "5e7bceae-0631-4f3b-b683-592963adf9a3",
      "type": "standard_discussion_forum",
      "title": "sdfdsfg",
      "status": "unpublished",
      "createdOn": "2021-12-22T10:50:03.384Z",
      "createdBy": "1",
      "updatedOn": "2021-12-22T10:50:03.384Z",
      "updatedBy": "1",
      "childElements": [],
      "activitymetadata": [
        {
          "_id": "61c302dba8d6d0036f7b6f50",
          "isGradable": false,
          "learningObjectives": [],
          "emailNotification": true,
          "tags": [],
          "courseId": "1142",
          "parentElementId": "22f18ca4-bc71-48b9-9126-4dbfa3dbf47b",
          "title": "sdfdsfg",
          "description": "",
          "visibilityCriteria": false,
          "activityStatus": "mandatory",
          "createdBy": "1",
          "updatedBy": "1",
          "activityId": "5e7bceae-0631-4f3b-b683-592963adf9a3",
          "createdAt": "2021-12-22T10:50:03.393Z",
          "updatedAt": "2021-12-22T10:50:03.393Z"
        }
      ],
      "breadcrumbTitle": "/Unit 1 Economics Financial Aspects Knowledge of stock market trade and investment/Week 1 - Introduction to Finance ",
      "qnAmetaData": {
        "updatedAt": null,
        "updatedBy": null,
        "totalAnswers": 0,
        "totalQuestions": 0,
        "totalAnswersUpvotes": 0,
        "totalQuestionsUpvotes": 0
      },
      "__v": 1536
    };
    component.currentDiscussionItem = data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(storageService, 'get').and.returnValue({ username: 'admin' });
    component.createThread();
    expect(component.questions.length).toEqual(1);
    expect(component.currentDiscussionItem.qnAmetaData.totalQuestions).toEqual(1);
  });

  it('should call downloadAttachment', async () => {
    component.courseId = 1142;
    component.currentDiscussionItemId = '5e7bceae-0631-4f3b-b683-592963adf9a3';
    const data = {
      "elementId": "5e7bceae-0631-4f3b-b683-592963adf9a3",
      "type": "standard_discussion_forum",
      "title": "sdfdsfg",
      "status": "unpublished",
      "createdOn": "2021-12-22T10:50:03.384Z",
      "createdBy": "1",
      "updatedOn": "2021-12-22T10:50:03.384Z",
      "updatedBy": "1",
      "childElements": [],
      "activitymetadata": [
        {
          "_id": "61c302dba8d6d0036f7b6f50",
          "isGradable": false,
          "learningObjectives": [],
          "emailNotification": true,
          "tags": [],
          "courseId": "1142",
          "parentElementId": "22f18ca4-bc71-48b9-9126-4dbfa3dbf47b",
          "title": "sdfdsfg",
          "description": "",
          "visibilityCriteria": false,
          "activityStatus": "mandatory",
          "createdBy": "1",
          "updatedBy": "1",
          "activityId": "5e7bceae-0631-4f3b-b683-592963adf9a3",
          "createdAt": "2021-12-22T10:50:03.393Z",
          "updatedAt": "2021-12-22T10:50:03.393Z"
        }
      ],
      "breadcrumbTitle": "/Unit 1 Economics Financial Aspects Knowledge of stock market trade and investment/Week 1 - Introduction to Finance ",
      "qnAmetaData": {
        "updatedAt": null,
        "updatedBy": null,
        "totalAnswers": 0,
        "totalQuestions": 0,
        "totalAnswersUpvotes": 0,
        "totalQuestionsUpvotes": 0
      },
      "__v": 1536
    };
    component.currentDiscussionItem = data;
    const signedUrlRes = {
      body:
      {
        "url": "https://edunew-filerepo.s3.ap-southeast-1.amazonaws.com/edunxtqa01/66b570e1-de02-420b-9050-cd2164613ecd.png?AWSAccessKeyId=AKIAZNC7VU4PSHWYU3HL&Expires=1640691177&Signature=umY0X%2FfaG9ckZO8unksx6lwvjk4%3D&response-content-disposition=attachment%3B%20filename%3DScreenshot%202021-12-21%20at%2010.18.30%20AM.png",
        "expiresIn": 300
      }
    };
    spyOn(contentPlayerService, 'getSignedUrl').and.resolveTo(signedUrlRes);
    await component.downloadAttachment();
    expect(component.downloadAttachment).toHaveBeenCalled;
  });

  it('should call contentDoubts', () => {
    const elementId = "1c9c5761-5967-463a-8f78-c5f25cefba9a";
    spyOn(router, 'navigate').and.resolveTo(true);
    component.contentDoubts(elementId);
    expect(component.contentDoubts).toHaveBeenCalled;
  });

  it('should call for showToaster for failure response', () => {
    const res = { status: 401 };
    const message = "Something went wrong. Please try again.";
    component.showToaster(res, message);
    expect(component.toastType).toEqual("error");
    expect(component.toastMessage).toEqual(message);
  });

});
