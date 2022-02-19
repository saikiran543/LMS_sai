/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { StorageKey } from 'src/app/enums/storageKey';
import { QuestionAnswerService } from 'src/app/learning-center/course-services/question-answer.service';
import { AskQuestionComponent } from 'src/app/learning-center/shared/question-answer-reply/ask-question/ask-question.component';
import { StorageService } from 'src/app/services/storage.service';

import { ContentPlayerQnaPaneComponent } from './content-player-qna-pane.component';

describe('ContentPlayerQnaPaneComponent', () => {
  let component: ContentPlayerQnaPaneComponent;
  let fixture: ComponentFixture<ContentPlayerQnaPaneComponent>;
  let questionAnswerService: QuestionAnswerService;
  let storageService: StorageService;
  let dialogueService: NgbModal;
  let translateService: TranslateService;

  const initialResponse = {
    "totalQuestion": 13,
    "questions": [
      {
        "_id": "61b9d4ee8387823d14698150",
        "numOfUpvotes": 0,
        "numOfAnswers": 2,
        "courseId": "12345",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "title": "q30",
        "description": "<p>q30</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "questionId": "02ced0f9-417f-4491-b628-7b27f3a16610",
        "createdAt": "2021-12-15T11:43:42.493Z",
        "updatedAt": "2021-12-15T11:43:42.493Z",
        "userName": "1"
      },
      {
        "_id": "61b9bcf5908d192ac04e6c2b",
        "numOfUpvotes": 0,
        "numOfAnswers": 1,
        "courseId": "12345",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "title": "Ask a Question",
        "description": "<p><span style=\"background-color:rgb(255,255,255);color:rgb(77,81,86);font-size:14px;\">In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available</span></p>",
        "createdBy": "1",
        "updatedBy": "1",
        "questionId": "eeb7da32-7e83-4442-971b-1a157f6c4503",
        "createdAt": "2021-12-15T10:01:25.838Z",
        "updatedAt": "2021-12-15T10:01:25.838Z",
        "verifiedAnswerId": "a6ed9883-8969-4569-be14-48f3d665337c",
        "userName": "1"
      },
      {
        "_id": "61b89bdb52e97400f47efd10",
        "numOfUpvotes": 1,
        "numOfAnswers": 3,
        "courseId": "12345",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "title": "q23",
        "description": "<p>a23</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "questionId": "5523b091-cdc0-4557-a47e-79f04bdfc9c6",
        "createdAt": "2021-12-14T13:27:55.185Z",
        "updatedAt": "2021-12-14T13:27:55.185Z",
        "verifiedAnswerId": "8a6b2891-5284-492c-9407-f294fff69627",
        "userName": "1"
      },
      {
        "_id": "61b89a6a52e97400f47efcc6",
        "numOfUpvotes": 1,
        "numOfAnswers": 3,
        "courseId": "12345",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "title": "q21",
        "description": "<p>q21</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "questionId": "0a7d2e9e-4767-401f-83dc-a1143dbf1c51",
        "createdAt": "2021-12-14T13:21:46.412Z",
        "updatedAt": "2021-12-14T13:21:46.412Z",
        "verifiedAnswerId": "fd86a015-a002-498a-ac32-8f8437842482",
        "userName": "1"
      },
      {
        "_id": "61a452c6c889187a8850bec0",
        "numOfUpvotes": 1,
        "numOfAnswers": 5,
        "courseId": "12345",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "title": "q10",
        "description": "q10",
        "createdBy": "1",
        "updatedBy": "1",
        "questionId": "28eb39d0-dd30-4e62-a3be-327c79ede292",
        "createdAt": "2021-11-29T04:10:46.221Z",
        "updatedAt": "2021-11-29T04:10:46.221Z",
        "userName": "1"
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentPlayerQnaPaneComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule ],
      providers: [QuestionAnswerService]
    })
      .compileComponents();

    questionAnswerService = TestBed.inject(QuestionAnswerService);
    storageService = TestBed.inject(StorageService);
    dialogueService = TestBed.inject(NgbModal);
    translateService = TestBed.inject(TranslateService);
  });

  beforeEach(() => {
    storageService.set(StorageKey.USER_CURRENT_VIEW, 'admin');
    fixture = TestBed.createComponent(ContentPlayerQnaPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.elementId = '5ef6375e-9542-4bfd-be02-c550f70dfcf0';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch questions', async () => {
    spyOn(questionAnswerService, "getFilteredQuestionsByElementId").withArgs("5ef6375e-9542-4bfd-be02-c550f70dfcf0", {
      limit: 5,
      skip: 0,
    }).and.resolveTo(initialResponse);
    await component['fetchQuestions']();
    expect(component.questions).toEqual(initialResponse.questions);
    expect(component.filterOptions).toEqual({
      limit: 5,
      skip: 5,
    });
    expect(component.totalQuestions).toEqual(initialResponse.totalQuestion);
  });

  it('should add more questions to the list on scroll', async () => {
    component.questions = initialResponse.questions;
    component.filterOptions = {
      limit: 5,
      skip: 5,
    };
    const secondResponse = {
      "totalQuestion": 13,
      "questions": [
        {
          "_id": "61a0d13e68a7dc1e9063c8e0",
          "numOfUpvotes": 1,
          "numOfAnswers": 2,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q9",
          "description": "q9",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "6225086e-f943-4609-9606-dacc1bb3baad",
          "createdAt": "2021-11-26T12:21:18.363Z",
          "updatedAt": "2021-11-26T12:21:18.363Z",
          "userName": "1"
        },
        {
          "_id": "61a0d13868a7dc1e9063c8de",
          "numOfUpvotes": 0,
          "numOfAnswers": 7,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q8",
          "description": "q8",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "8738017b-53aa-4ca3-8278-f82c1a72bef6",
          "createdAt": "2021-11-26T12:21:12.228Z",
          "updatedAt": "2021-11-26T12:21:12.228Z",
          "verifiedAnswerId": "ee5594b3-7eb4-403d-92b0-7f2d096a01cf",
          "userName": "1"
        },
        {
          "_id": "61a0d13168a7dc1e9063c8dc",
          "numOfUpvotes": 0,
          "numOfAnswers": 24,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q7",
          "description": "q7",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
          "createdAt": "2021-11-26T12:21:05.735Z",
          "updatedAt": "2021-11-26T12:21:05.735Z",
          "verifiedAnswerId": "906013d1-389a-4924-940c-6ce3370f5df2",
          "userName": "1"
        },
        {
          "_id": "61a0d12b68a7dc1e9063c8da",
          "numOfUpvotes": 0,
          "numOfAnswers": 2,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q2222",
          "description": "<p>q55555</p>",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "cd89d433-4667-4341-b92e-45ef24dc6f0a",
          "createdAt": "2021-11-26T12:20:59.594Z",
          "updatedAt": "2021-12-14T09:09:19.387Z",
          "verifiedAnswerId": "a960044f-4ccc-4bfe-b95d-d01f939c26f8",
          "userName": "1"
        },
        {
          "_id": "61a0d12468a7dc1e9063c8d8",
          "numOfUpvotes": 0,
          "numOfAnswers": 2,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q5",
          "description": "q5",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "510f70b9-ae50-408a-aa44-8af55cfa7253",
          "createdAt": "2021-11-26T12:20:52.516Z",
          "updatedAt": "2021-11-26T12:20:52.516Z",
          "verifiedAnswerId": "1613be39-142c-4e0a-af81-448b04769007",
          "userName": "1"
        }
      ]
    };
    spyOn(questionAnswerService, 'getFilteredQuestionsByElementId').withArgs("5ef6375e-9542-4bfd-be02-c550f70dfcf0", {
      limit: 5,
      skip: 5,
    }).and.resolveTo(secondResponse);
    await component['fetchQuestions']();
    const allQuestions = initialResponse.questions;
    allQuestions.push(...secondResponse.questions);
    expect(component.questions).toEqual(allQuestions);
    expect(component.filterOptions).toEqual({
      limit: 5,
      skip: 10,
    });
  });

  it('should navigate to listing', async () => {
    const currentQuestion = initialResponse.questions[0];
    const storageSpy = spyOn(storageService, "set").and.returnValue();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const navigateSpy = spyOn<any>(component, 'navigate').and.resolveTo();
    component.navigateToListing(currentQuestion);
    expect(storageSpy).toHaveBeenCalledWith(StorageKey.CONTENT_PANE_SELECTED_QUESTION, currentQuestion);
    expect(navigateSpy).toHaveBeenCalledWith(currentQuestion.questionId);
    expect(component.showQuestionListing).toBe(false);
  });

  it('should open a the ask a question popup', () => {
    component.ask();
    const popupElement = document.querySelector('.content-builder-modal.add-learning-objective-modal');
    expect(popupElement).toBeTruthy();
  });

  it('should add a question to the list once user adds', () => {
    const modalDialogClass = "content-builder-modal add-learning-objective-modal";
    const askQuestionComponent = new AskQuestionComponent(dialogueService, questionAnswerService, translateService);
    spyOn(dialogueService, 'open').withArgs(AskQuestionComponent, { backdrop: false, size: 'xl', centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' }).and.callFake(() => {
      return <NgbModalRef>({ componentInstance: askQuestionComponent });
    });
    component.ask();
    const data = {
      "_id": "61a0d12468a7dc1e9063c8d8",
      "numOfUpvotes": 0,
      "numOfAnswers": 2,
      "courseId": "12345",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "title": "q5",
      "description": "q5",
      "createdBy": "1",
      "updatedBy": "1",
      "questionId": "510f70b9-ae50-408a-aa44-8af55cfa7253",
      "createdAt": "2021-11-26T12:20:52.516Z",
      "updatedAt": "2021-11-26T12:20:52.516Z",
      "verifiedAnswerId": "1613be39-142c-4e0a-af81-448b04769007",
      "userName": "1"
    };
    askQuestionComponent.askedQuestion.emit(data);
    expect(component.questions).toBeTruthy([data]);
  });

  it(`should hide the ask a question cta if the user role isn't a student`, () => {
    const askAQuestionCta = document.querySelector('.ask-a-question');
    expect(askAQuestionCta).toBeNull();
  });
});
