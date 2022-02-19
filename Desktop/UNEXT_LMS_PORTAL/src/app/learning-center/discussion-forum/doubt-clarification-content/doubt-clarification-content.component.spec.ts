/* eslint-disable max-lines-per-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionAnswerService } from '../../course-services/question-answer.service';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';
import { DoubtClarificationContentComponent } from './doubt-clarification-content.component';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import translations from '../../../../assets/i18n/en.json';

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
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "_id": "61caf0f3f472bf0371aab4c3",
      "courseId": "1142",
      "elementId": "1c9c5761-5967-463a-8f78-c5f25cefba9a",
      "title": "title",
      "description": "",
      "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
      "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
      "contentTitle": "Raptivity",
      "contentType": "html",
      "questionId": "68c39e0a-1e93-4e6b-84d1-9c470a2f9f8a",
      "createdAt": "2021-12-28T11:11:47.472Z",
      "updatedAt": "2021-12-28T11:11:47.472Z"
    }),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Promise<any> = new Promise((resolve) => resolve(true));

  close(): void {
    // mock function
  }
}

describe('DoubtClarificationContentComponent', () => {
  let component: DoubtClarificationContentComponent;
  let fixture: ComponentFixture<DoubtClarificationContentComponent>;
  let discussionForumService: DiscussionForumService;
  let questionAnswerService: QuestionAnswerService;
  let storageService: StorageService;
  let location: Location;
  let modalService: NgbModal;
  const mockModalRef: MockNgbModalRefYes = new MockNgbModalRefYes();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoubtClarificationContentComponent],
      imports: [ToastrModule.forRoot(), RouterTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        },
        defaultLanguage: 'en'
      }),
      HttpClientTestingModule,
      ],
      providers: [StorageService, QuestionAnswerService, DiscussionForumService, Location]
    })
      .compileComponents();
    discussionForumService = TestBed.inject(DiscussionForumService);
    questionAnswerService = TestBed.inject(QuestionAnswerService);
    storageService = TestBed.inject(StorageService);
    location = TestBed.inject(Location);
    modalService = TestBed.inject(NgbModal);
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    DoubtClarificationContentComponent.prototype.ngOnInit = () => { };
    fixture = TestBed.createComponent(DoubtClarificationContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back to list', () => {
    const locationspy = spyOn(location, 'back');
    component.backToList();
    expect(locationspy).toHaveBeenCalled();
  });

  it('should on Scroll Down', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, "fetchQuestions");
    component.onScrollDown();
  });

  it('should on Reply Added', async () => {
    spyOn(discussionForumService, "specificContentDoubts").and.resolveTo(
      {
        "elementDetails": [
          {
            "elementId": "2abf99e4-5821-40b3-b581-7260f35ab21f",
            "type": "image",
            "title": "image",
            "status": "unpublished",
            "createdOn": "2021-12-22T06:52:31.679Z",
            "createdBy": "",
            "updatedOn": "2021-12-22T06:52:31.679Z",
            "updatedBy": "",
            "conversionStatus": null,
            "childElements": [],
            "breadcrumbTitle": "/Unit 1 Economics Financial Aspects Knowledge of stock market trade and investment/Week 1 - Introduction to Finance ",
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
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'fetchQuestions').and
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .callFake(() => {});
    storageService.set(StorageKey.USER_CURRENT_VIEW, 'admin');
    await component.loadDependencies();
    component.onReplyAdded(true);
    expect(component.relatedDoubtsItem[0].qnAmetaData.totalAnswers).toEqual(1);
    component.onReplyAdded(false);
    expect(component.relatedDoubtsItem[0].qnAmetaData.totalAnswers).toEqual(0);
  });

  it('should ask a new question', (done) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    mockModalRef.componentInstance.confirmStatus.subscribe(val => {
      expect(val).toEqual(true);
      expect(mockModalRef.close.call.length).toEqual(1);
      done();
    });
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
    component.relatedDoubtsItem = [{ qnAmetaData: { totalQuestions: 0 } }];
    component.askANewQuestion();
  });

  it('should fetch questions', async () => {
    component.filterOptions = {
      limit: 5,
      skip: 0,
    };
    spyOn(questionAnswerService, "getFilteredQuestionsByElementId").and.resolveTo(
      {
        "totalQuestion": 4,
        "questions": [
          {
            "_id": "61caf0f3f472bf0371aab4c3",
            "numOfUpvotes": 0,
            "numOfAnswers": 0,
            "courseId": "1142",
            "elementId": "1c9c5761-5967-463a-8f78-c5f25cefba9a",
            "title": "title",
            "description": "",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "Raptivity",
            "contentType": "html",
            "questionId": "68c39e0a-1e93-4e6b-84d1-9c470a2f9f8a",
            "createdAt": "2021-12-28T11:11:47.472Z",
            "updatedAt": "2021-12-28T11:11:47.472Z",
            "userName": "demostudent"
          },
          {
            "_id": "61ca8bc04bc7e5036a66af95",
            "numOfUpvotes": 0,
            "numOfAnswers": 0,
            "courseId": "1142",
            "elementId": "1c9c5761-5967-463a-8f78-c5f25cefba9a",
            "title": "q1",
            "description": "<p>q1</p>",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "Raptivity",
            "contentType": "html",
            "questionId": "bc76f54d-9b39-4a29-830c-349ee4b853f1",
            "createdAt": "2021-12-28T04:00:00.208Z",
            "updatedAt": "2021-12-28T04:00:00.208Z",
            "userName": "demostudent"
          },
          {
            "_id": "61c9a149b8e943037591f4c4",
            "numOfUpvotes": 1,
            "numOfAnswers": 2,
            "courseId": "1142",
            "elementId": "1c9c5761-5967-463a-8f78-c5f25cefba9a",
            "title": "thread",
            "description": "",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "Raptivity",
            "contentType": "html",
            "questionId": "e78dcb74-2bca-4aec-ab43-d31852a639c5",
            "createdAt": "2021-12-27T11:19:37.371Z",
            "updatedAt": "2021-12-27T11:19:37.371Z",
            "userName": "demostudent"
          },
          {
            "_id": "61c9800a47c5dc037600548c",
            "numOfUpvotes": 1,
            "numOfAnswers": 31,
            "courseId": "1142",
            "elementId": "1c9c5761-5967-463a-8f78-c5f25cefba9a",
            "title": "Test question on Raptivity",
            "description": "",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "Raptivity",
            "contentType": "html",
            "questionId": "cf144171-9c20-4d82-9294-fcb8a456e101",
            "createdAt": "2021-12-27T08:57:46.961Z",
            "updatedAt": "2021-12-27T08:57:46.961Z",
            "verifiedAnswerId": "ac977a86-40c9-4ddf-bc3b-13379f294e17",
            "userName": "demostudent"
          }
        ]
      }
    );
    await component.fetchQuestions();
    expect(component.filterOptions.skip).toEqual(5);
  });
});