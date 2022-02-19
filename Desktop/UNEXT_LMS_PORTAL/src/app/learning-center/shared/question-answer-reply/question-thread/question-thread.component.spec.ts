/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { StorageKey } from 'src/app/enums/storageKey';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import { HttpClientService } from 'src/app/services/http-client.service';
import { StorageService } from 'src/app/services/storage.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { QuestionThreadComponent } from './question-thread.component';
import { EditQuestionThreadComponent } from '../edit-question-thread/edit-question-thread.component';
import { Routes } from '@angular/router';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { QuestionAnswerService } from 'src/app/learning-center/course-services/question-answer.service';
import { DialogService } from 'src/app/services/dialog.service';

export class MockNgbModalRef {
  componentInstance = {
    title: 'title',
    description: 'description'
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Promise<any> = new Promise((resolve) => resolve(true));
}

describe('QuestionThreadComponent', () => {
  let component: QuestionThreadComponent;
  let fixture: ComponentFixture<QuestionThreadComponent>;
  let storageService: StorageService;
  let questionAnswerService: QuestionAnswerService;
  let dialogService: DialogService;
  let toastrService: ToastrService;
  let ngbModal: NgbModal;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionThreadComponent],
      providers: [HttpClientService, StorageService, QuestionAnswerService, DialogService, ToastrService],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot({}), ToastrModule.forRoot({}), AngularSvgIconModule.forRoot({}), SafePipeModule, TimesAgoPipeModule, NgbModule, RouterTestingModule.withRoutes(routes)]
    })
      .compileComponents();
    storageService = TestBed.inject(StorageService);
    questionAnswerService = TestBed.inject(QuestionAnswerService);
    dialogService = TestBed.inject(DialogService);
    toastrService = TestBed.inject(ToastrService);
    ngbModal = TestBed.inject(NgbModal);
    const spyGet = spyOn(storageService, 'get');
    spyGet.withArgs(StorageKey.USER_DETAILS).and.returnValue('USER_DETAILS');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal', () => {
    const modalDialogClass = 'content-builder-modal add-learning-objective-modal';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(ngbModal, 'open').and.returnValue(mockModalRef as any);
    const event = new MouseEvent('click');
    component.edit(event);
    expect(ngbModal.open).toHaveBeenCalledWith(EditQuestionThreadComponent, { backdrop: false, size: 'xl', centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
  });

  it('should call show replies', async () => {
    component.verifiedAnswer = [];
    component.verifiedChildAnswers = [];
    component.question = {
      courseId: "12345",
      createdAt: "2021-12-15T11:43:42.493Z",
      createdBy: "1",
      description: "<p>q30</p>",
      elementId: "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      isFollowing: true,
      numOfAnswers: 2,
      numOfUpvotes: 0,
      questionId: "02ced0f9-417f-4491-b628-7b27f3a16610",
      title: "q30",
      updatedAt: "2021-12-15T11:43:42.493Z",
      updatedBy: "1",
      userName: "username1",
      _id: "61b9d4ee8387823d14698150"
    };
    const expectedResponse = [{
      answer: "<p>a1</p>",
      answerId: "19f84414-25c8-422a-8ce0-4a7613b091ad",
      createdAt: "2021-12-15T11:45:47.424Z",
      createdBy: "1",
      elementId: "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      firstLevelAnswerId: null,
      numOfReplies: 1,
      numOfUpvotes: 0,
      parentAnswerId: null,
      questionId: "02ced0f9-417f-4491-b628-7b27f3a16610",
      updatedAt: "2021-12-15T11:45:47.424Z",
      updatedBy: "1",
      userName: "username1",
      _id: "61b9d56b8387823d1469818f"
    }];
    component.limit = 5;
    component.skip = 0;
    spyOn(questionAnswerService, 'getAnswers').withArgs(`02ced0f9-417f-4491-b628-7b27f3a16610`, component.limit, component.skip).and.resolveTo(expectedResponse);
    await component.showReplies();
    expect(component.loadedAnswers).toEqual(1);
    expect(component.totalAnswers).toEqual(1);
    expect(component.answers).toEqual(expectedResponse);
    expect(component.skip).toEqual(5);
  });

  it('should call toggle expand', () => {
    component.extended = true;
    component.toggleExpand();
    expect(component.answers).toEqual([]);
    expect(component.verifiedAnswer).toEqual([]);
    expect(component.verifiedChildAnswers).toEqual([]);
    expect(component.totalAnswers).toEqual(0);
    expect(component.loadedAnswers).toEqual(0);
    expect(component.loadingAnswers).toEqual(false);
    expect(component.isReplying).toEqual(false);
    expect(component.skip).toEqual(0);
  });

  it('should call showMoreReplies', async () => {
    component.question = {
      courseId: "12345",
      createdAt: "2021-11-26T12:21:05.735Z",
      createdBy: "1",
      description: "q7",
      elementId: "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      isFollowing: true,
      numOfAnswers: 24,
      numOfUpvotes: 0,
      questionId: "ba1fbf02-4b16-4678-9558-ae21af05b478",
      title: "q7",
      updatedAt: "2021-11-26T12:21:05.735Z",
      updatedBy: "1",
      userName: "username1",
      verifiedAnswerId: "906013d1-389a-4924-940c-6ce3370f5df2",
      _id: "61a0d13168a7dc1e9063c8dc"
    };
    const expectedResponse = [
      {
        "_id": "61af3d017aafe574c871706b",
        "firstLevelAnswerId": null,
        "parentAnswerId": null,
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>a15</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "89af90ed-e908-463a-8264-9219d1ec1400",
        "createdAt": "2021-12-07T10:52:49.222Z",
        "updatedAt": "2021-12-07T10:52:49.222Z",
        "isFollowing": true,
        "userName": "username1"
      }
    ];
    component.limit = 5;
    component.skip = 5;
    spyOn(questionAnswerService, 'getAnswers').withArgs(`ba1fbf02-4b16-4678-9558-ae21af05b478`, component.limit, component.skip).and.resolveTo(expectedResponse);
    await component.showMoreReplies();
    fixture.detectChanges();
    expect(component.loadedAnswers).toEqual(1);
    expect(component.totalAnswers).toEqual(0);
    expect(component.answers).toEqual(expectedResponse);
    expect(component.loadingAnswers).toEqual(false);
    // expect(questionAnswerService.getAnswers).toHaveBeenCalledWith(`ba1fbf02-4b16-4678-9558-ae21af05b478`, component.limit, component.skip);
  });

  it('should call calculateRemainingAnswer', () => {
    component.totalAnswers = 2;
    component.loadedAnswers = 1;
    component.extended = true;
    const boolean = component.calculateRemainingAnswer();
    expect(boolean).toEqual(true);
  });

  it('should call deleteQuestion', async () => {
    const expectedResponse = {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://localhost:3035/api/courseservice/qna/questions/bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "ok": true,
      "type": 4,
      "body": {
        "status": "success"
      }
    };
    component.question = {
      "_id": "61c1afc4b5ea720e400d1bf1",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "12345",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "title": "q31",
      "description": "<p>q31</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "createdAt": "2021-12-21T10:43:16.314Z",
      "updatedAt": "2021-12-21T10:43:16.314Z",
      "userName": "username1"
    };
    spyOn(questionAnswerService, 'deleteQuestion').withArgs(`bbb79ff4-030d-4af3-9da2-3d3e6cec937c`).and.resolveTo(expectedResponse);
    spyOn(dialogService, 'showConfirmDialog').withArgs({title: {translationKey: "qna.answerReply.deleteReplyWarningMessage"}}).and.resolveTo(true);
    spyOn(component.deleteQuestionId, 'emit').withArgs('bbb79ff4-030d-4af3-9da2-3d3e6cec937c');
    spyOn(toastrService, 'success').withArgs('Question deleted successfully', '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
    const event = new MouseEvent('click');
    await component.deleteQuestion(event);
    expect(dialogService.showConfirmDialog).toHaveBeenCalledWith({title: {translationKey: "qna.answerReply.deleteReplyWarningMessage"}});
    expect(toastrService.success).toHaveBeenCalledWith('Question deleted successfully', '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
    expect(component.deleteQuestionId.emit).toHaveBeenCalledWith('bbb79ff4-030d-4af3-9da2-3d3e6cec937c');
  });

  it('should call give reply', async () => {
    component.question = {
      "_id": "61c1afc4b5ea720e400d1bf1",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "12345",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "title": "q31",
      "description": "<p>q31</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "createdAt": "2021-12-21T10:43:16.314Z",
      "updatedAt": "2021-12-21T10:43:16.314Z",
      "userName": "username1",
      "verifiedAnswerId": ''
    };
    const payLoad = {
      questionId: 'bbb79ff4-030d-4af3-9da2-3d3e6cec937c',
      elementId: "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      answer: "<p>1111</p>"
    };
    const expectedResponse = {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://localhost:3035/api/courseservice/qna/answers",
      "ok": true,
      "type": 4,
      "body": {
        "firstLevelAnswerId": null,
        "parentAnswerId": null,
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "_id": "61c1b90fb5ea720e400d1c07",
        "questionId": "02ced0f9-417f-4491-b628-7b27f3a16610",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>1111</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "d023a09b-9b66-48b4-9ace-f91bfd06e6ca",
        "createdAt": "2021-12-21T11:22:55.059Z",
        "updatedAt": "2021-12-21T11:22:55.059Z"
      }
    };
    spyOn(questionAnswerService, 'giveReply').withArgs(payLoad).and.resolveTo(expectedResponse);
    spyOn(toastrService, 'success').withArgs('Reply Posted Successfully', '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
    await component.giveReply("<p>1111</p>");
    expect(component.isReplying).toEqual(false);
    expect(component.question.numOfAnswers).toEqual(1);
    expect(component.loadedAnswers).toEqual(1);
    expect(component.totalAnswers).toEqual(1);
    expect(toastrService.success).toHaveBeenCalledWith('Reply Posted Successfully', '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  });

  it('should call interaction', async () => {
    component.question = {
      "_id": "61c1afc4b5ea720e400d1bf1",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "12345",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "title": "q31",
      "description": "<p>q31</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "createdAt": "2021-12-21T10:43:16.314Z",
      "updatedAt": "2021-12-21T10:43:16.314Z",
      "userName": "username1",
      "verifiedAnswerId": ''
    };
    const payLoad = {
      interactionType: `pin`,
      objectType: 'question'
    };
    const expectedResponse = {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://localhost:3035/api/courseservice/qna/user-interactions/2bd6dd6e-f986-402c-bd75-8f1574809f9b",
      "ok": true,
      "type": 4,
      "body": {
        "status": "success"
      }
    };
    spyOn(questionAnswerService, 'vote').withArgs('bbb79ff4-030d-4af3-9da2-3d3e6cec937c', payLoad).and.resolveTo(expectedResponse);
    spyOn(component.pinnedQuestionIdEmitter, 'emit').withArgs('bbb79ff4-030d-4af3-9da2-3d3e6cec937c');
    await component.interaction('pin/unpin');
    fixture.detectChanges();
    expect(component.pinnedQuestionIdEmitter.emit).toHaveBeenCalledWith('bbb79ff4-030d-4af3-9da2-3d3e6cec937c');
    expect(component.question.isPinned).toEqual(true);
  });

  it('should call close', () => {
    component.close();
    expect(component.isReplying).toEqual(true);
  });

  it('should call toggleLabel', () => {
    component.toggleLabel(true);
    expect(component.isAnyVerified).toEqual(true);
  });

  it('should call increaseReplyCounter', () => {
    component.question = {
      "_id": "61c1afc4b5ea720e400d1bf1",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "12345",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "title": "q31",
      "description": "<p>q31</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "createdAt": "2021-12-21T10:43:16.314Z",
      "updatedAt": "2021-12-21T10:43:16.314Z",
      "userName": "username1"
    };
    component.increaseReplyCounter(true);
    expect(component.question.numOfAnswers).toEqual(1);
  });
});
