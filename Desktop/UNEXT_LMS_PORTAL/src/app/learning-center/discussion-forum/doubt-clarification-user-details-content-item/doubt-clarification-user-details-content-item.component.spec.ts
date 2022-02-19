/* eslint-disable max-lines-per-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import translations from '../../../../assets/i18n/en.json';
import { DoubtClarificationUserDetailsContentItemComponent } from './doubt-clarification-user-details-content-item.component';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('DoubtClarificationUserDetailsContentItemComponent', () => {
  let component: DoubtClarificationUserDetailsContentItemComponent;
  let fixture: ComponentFixture<DoubtClarificationUserDetailsContentItemComponent>;
  let discussionForumService: DiscussionForumService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let element: any;

  beforeEach(async () => {
    element = {
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
    };
    await TestBed.configureTestingModule({
      declarations: [DoubtClarificationUserDetailsContentItemComponent],
      imports: [ToastrModule.forRoot(), RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        },
        defaultLanguage: 'en'
      }),
      ],
      providers: [DiscussionForumService],
    })
      .compileComponents();
    discussionForumService = TestBed.inject(DiscussionForumService);
  });

  beforeEach(() => {
    DoubtClarificationUserDetailsContentItemComponent.prototype.content = element;
    fixture = TestBed.createComponent(DoubtClarificationUserDetailsContentItemComponent);
    component = fixture.componentInstance;
    component.content = element;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle', () => {
    component.content = element;
    fixture.detectChanges();
    const divElement = fixture.nativeElement.querySelector('#toggle_4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3');
    const hasShown = divElement.classList.contains('show');
    expect(hasShown).toBe(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'updateQuestions').and
    // eslint-disable-next-line @typescript-eslint/no-empty-function
      .callFake(() => { });
    const div = fixture.nativeElement.querySelector('#arrow_top_4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3');
    expect(div.classList.contains('hide')).toBe(true);
    const arrowBottonRef = fixture.nativeElement.querySelector('#arrow_bottom_4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3');
    expect(arrowBottonRef.classList.contains('hide')).toBe(false);
    const elementDiv = fixture.nativeElement.querySelector('#content_4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3');
    expect(elementDiv.classList.contains("border-color")).toBe(false);
    component.toggleShow("4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3");
    fixture.detectChanges();
    expect(divElement.classList.contains('show')).toBe(true);
    expect(div.classList.contains('hide')).toBe(false);
    expect(arrowBottonRef.classList.contains('hide')).toBe(true);
    expect(elementDiv.classList.contains("border-color")).toBe(true);
  });

  it('should on Scroll Down', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchSpy = spyOn<any>(component, "fetchQuestions").and
    // eslint-disable-next-line @typescript-eslint/no-empty-function
      .callFake(() => { });
    component.content = {
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
    };
    component.onScrollDownQuestions({
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
    });
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should update questions', async () => {
    component.filterOptions = {
      limit: 5,
      skip: 0,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(discussionForumService, "getThreadsByUser").and.resolveTo(
      {
        "questions": [
          {
            "_id": "61c97fdb1eccce9084ce5f08",
            "numOfUpvotes": 1,
            "numOfAnswers": 1,
            "courseId": "1142",
            "elementId": "5a32abb3-0857-4b29-ad1c-5bf564234ff0",
            "title": "Question 23",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "moon",
            "contentType": "image",
            "questionId": "5ba04561-79fd-4906-93d4-6823037e07f5",
            "createdAt": "2021-12-27T08:56:59.164Z",
            "updatedAt": "2021-12-27T08:56:59.164Z",
            "verifiedAnswerId": "760f1da3-7980-4623-b04a-538c9cce54db",
            "isUpvoted": true,
            "isFollowing": true,
            "userName": "demostudent"
          },
          {
            "_id": "61c97fd71eccce9084ce5f05",
            "numOfUpvotes": 0,
            "numOfAnswers": 0,
            "courseId": "1142",
            "elementId": "5a32abb3-0857-4b29-ad1c-5bf564234ff0",
            "title": "Question 22",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "moon",
            "contentType": "image",
            "questionId": "415d3ed8-b4d4-4ab9-aa05-2437a4092e52",
            "createdAt": "2021-12-27T08:56:55.948Z",
            "updatedAt": "2021-12-27T08:56:55.948Z",
            "userName": "demostudent"
          }
        ]
      }
    );
    await component.updateQuestions("5a32abb3-0857-4b29-ad1c-5bf564234ff0", false);
    fixture.detectChanges();
    fixture.whenStable();
    expect(component.filterOptions.skip).toEqual(5);
  });

  it('should fetch questions', async () => {
    component.filterOptions = {
      limit: 5,
      skip: 0,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(discussionForumService, "getThreadsByUser").and.resolveTo(
      {
        "totalQuestion": 23,
        "questions": [
          {
            "_id": "61c97fca1eccce9084ce5ef9",
            "numOfUpvotes": 0,
            "numOfAnswers": 0,
            "courseId": "1142",
            "elementId": "5a32abb3-0857-4b29-ad1c-5bf564234ff0",
            "title": "Question 18",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "moon",
            "contentType": "image",
            "questionId": "a727fe7e-546b-43ed-8d9f-c3998542d1e8",
            "createdAt": "2021-12-27T08:56:42.496Z",
            "updatedAt": "2021-12-27T08:56:42.496Z",
            "userName": "demostudent"
          },
          {
            "_id": "61c97fc71eccce9084ce5ef6",
            "numOfUpvotes": 1,
            "numOfAnswers": 0,
            "courseId": "1142",
            "elementId": "5a32abb3-0857-4b29-ad1c-5bf564234ff0",
            "title": "Question 17",
            "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
            "contentTitle": "moon",
            "contentType": "image",
            "questionId": "a0086b29-8ccd-410b-89f4-62c499e09875",
            "createdAt": "2021-12-27T08:56:39.333Z",
            "updatedAt": "2021-12-27T08:56:39.333Z",
            "userName": "demostudent"
          },
        ]
      }
    );
    await component.fetchQuestions({
      "totalQuestion": 23,
      "questions": [
        {
          "_id": "61c97fca1eccce9084ce5ef9",
          "numOfUpvotes": 0,
          "numOfAnswers": 0,
          "courseId": "1142",
          "elementId": "5a32abb3-0857-4b29-ad1c-5bf564234ff0",
          "title": "Question 18",
          "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
          "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
          "contentTitle": "moon",
          "contentType": "image",
          "questionId": "a727fe7e-546b-43ed-8d9f-c3998542d1e8",
          "createdAt": "2021-12-27T08:56:42.496Z",
          "updatedAt": "2021-12-27T08:56:42.496Z",
          "userName": "demostudent"
        },
        {
          "_id": "61c97fc71eccce9084ce5ef6",
          "numOfUpvotes": 1,
          "numOfAnswers": 0,
          "courseId": "1142",
          "elementId": "5a32abb3-0857-4b29-ad1c-5bf564234ff0",
          "title": "Question 17",
          "createdBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
          "updatedBy": "b07a2f87-cd13-4245-9a8e-c1d14ff34451",
          "contentTitle": "moon",
          "contentType": "image",
          "questionId": "a0086b29-8ccd-410b-89f4-62c499e09875",
          "createdAt": "2021-12-27T08:56:39.333Z",
          "updatedAt": "2021-12-27T08:56:39.333Z",
          "userName": "demostudent"
        },
      ]
    });
    expect(component.filterOptions.skip).toEqual(5);
  });
});
