/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { StorageKey } from 'src/app/enums/storageKey';
import { QuestionAnswerService } from 'src/app/learning-center/course-services/question-answer.service';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { StorageService } from 'src/app/services/storage.service';
import { EditAnswerReplyComponent } from '../edit-answer-reply/edit-answer-reply.component';
import { MockNgbModalRef } from '../question-thread/question-thread.component.spec';

import { AnswerReplyComponent } from './answer-reply.component';

describe('AnswerReplyComponent', () => {
  let component: AnswerReplyComponent;
  let fixture: ComponentFixture<AnswerReplyComponent>;
  let storageService: StorageService;
  let questionAnswerService: QuestionAnswerService;
  let dialogService: DialogService;
  let toastrService: ToastrService;
  let ngbModal: NgbModal;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnswerReplyComponent],
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
    fixture = TestBed.createComponent(AnswerReplyComponent);
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
    component.edit();
    expect(ngbModal.open).toHaveBeenCalledWith(EditAnswerReplyComponent, { backdrop: false, size: 'xl', centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
  });

  it('should call show replies', async () => {
    component.answer =
      {
        "_id": "61c2af55b5dfa11348f4afb9",
        "firstLevelAnswerId": undefined,
        "parentAnswerId": '',
        "numOfReplies": 1,
        "numOfUpvotes": 0,
        "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>a1</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "065d0701-e407-4eab-a252-391619207824",
        "createdAt": "2021-12-22T04:53:41.512Z",
        "updatedAt": "2021-12-22T04:53:41.512Z",
        "verifiedAt": "2021-12-22T04:53:41.622Z",
        "verifiedBy": "1",
        "userName": "username1"
      };
    const expectedResponse = [
      {
        "_id": "61c2af5db5dfa11348f4afc3",
        "firstLevelAnswerId": "065d0701-e407-4eab-a252-391619207824",
        "parentAnswerId": "065d0701-e407-4eab-a252-391619207824",
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>ra1</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "a6dca7a1-a35b-40d7-90fd-17aacff92297",
        "createdAt": "2021-12-22T04:53:49.133Z",
        "updatedAt": "2021-12-22T04:53:49.133Z",
        "userName": "username1"
      }
    ];
    component.limit = 5;
    component.skip = 0;
    spyOn(questionAnswerService, 'getAnswers').withArgs(`bbb79ff4-030d-4af3-9da2-3d3e6cec937c`, component.limit, component.skip, '065d0701-e407-4eab-a252-391619207824').and.resolveTo(expectedResponse);
    await component.showReplies();
    expect(component.totalAnswers).toEqual(component.answer.numOfReplies);
    expect(component.skip).toEqual(5);
    expect(component.extended).toEqual(true);
    // expect(component.secondLevelAnswers).toEqual([]);
    expect(component.loadedAnswers).toEqual(1);
  });

  it('should call toggle expand', () => {
    component.extended = true;
    component.toggleExpand();
    expect(component.secondLevelAnswers).toEqual([]);
    expect(component.verifiedSecondLevelAnswers).toEqual([]);
    expect(component.totalAnswers).toEqual(0);
    expect(component.loadedAnswers).toEqual(0);
    expect(component.isReplying).toEqual(false);
    expect(component.skip).toEqual(0);
  });

  it('should call showMoreReplies', async () => {
    component.answer = {
      "_id": "61b332bf008c327eec5e0374",
      "firstLevelAnswerId": undefined,
      "parentAnswerId": '',
      "numOfReplies": 12,
      "numOfUpvotes": 0,
      "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "answer": "<p>1</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "answerId": "da5210ea-0985-4522-b041-3de99837a671",
      "createdAt": "2021-12-10T10:58:07.462Z",
      "updatedAt": "2021-12-10T10:58:07.462Z",
      "userName": "username1"
    };
    const expectedResponse =
      [
        {
          "_id": "61b6d8f6008c327eec5e06dd",
          "firstLevelAnswerId": "da5210ea-0985-4522-b041-3de99837a671",
          "parentAnswerId": "da5210ea-0985-4522-b041-3de99837a671",
          "numOfReplies": 0,
          "numOfUpvotes": 0,
          "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "answer": "<p>1</p>",
          "createdBy": "1",
          "updatedBy": "1",
          "answerId": "670ec94e-0d0b-477f-beb2-5e50bd24d347",
          "createdAt": "2021-12-13T05:24:06.145Z",
          "updatedAt": "2021-12-13T05:24:06.145Z",
          "userName": "username1"
        },
        {
          "_id": "61b6d8fc008c327eec5e06e3",
          "firstLevelAnswerId": "da5210ea-0985-4522-b041-3de99837a671",
          "parentAnswerId": "da5210ea-0985-4522-b041-3de99837a671",
          "numOfReplies": 0,
          "numOfUpvotes": 0,
          "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "answer": "<p>2</p>",
          "createdBy": "1",
          "updatedBy": "1",
          "answerId": "00c39c44-0576-4089-ae58-34a4defbbaa6",
          "createdAt": "2021-12-13T05:24:12.604Z",
          "updatedAt": "2021-12-13T05:24:12.604Z",
          "userName": "username1"
        },
        {
          "_id": "61b6d900008c327eec5e06e9",
          "firstLevelAnswerId": "da5210ea-0985-4522-b041-3de99837a671",
          "parentAnswerId": "da5210ea-0985-4522-b041-3de99837a671",
          "numOfReplies": 0,
          "numOfUpvotes": 0,
          "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "answer": "<p>44444</p>",
          "createdBy": "1",
          "updatedBy": "1",
          "answerId": "110da3e1-58cb-4153-96cb-cc5af7f3b7b9",
          "createdAt": "2021-12-13T05:24:16.706Z",
          "updatedAt": "2021-12-14T08:22:56.398Z",
          "userName": "username1"
        },
        {
          "_id": "61b6d908008c327eec5e06f5",
          "firstLevelAnswerId": "da5210ea-0985-4522-b041-3de99837a671",
          "parentAnswerId": "da5210ea-0985-4522-b041-3de99837a671",
          "numOfReplies": 0,
          "numOfUpvotes": 0,
          "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "answer": "<p>6</p>",
          "createdBy": "1",
          "updatedBy": "1",
          "answerId": "9cf2f712-e078-4182-bed4-c5fa487b0281",
          "createdAt": "2021-12-13T05:24:24.612Z",
          "updatedAt": "2021-12-13T05:24:24.612Z",
          "userName": "username1"
        },
        {
          "_id": "61b6d90d008c327eec5e0701",
          "firstLevelAnswerId": "da5210ea-0985-4522-b041-3de99837a671",
          "parentAnswerId": "da5210ea-0985-4522-b041-3de99837a671",
          "numOfReplies": 0,
          "numOfUpvotes": 0,
          "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "answer": "<p>7</p>",
          "createdBy": "1",
          "updatedBy": "1",
          "answerId": "aecaa774-566e-4cf3-98b4-abf779e32876",
          "createdAt": "2021-12-13T05:24:29.170Z",
          "updatedAt": "2021-12-13T05:24:29.170Z",
          "userName": "username1"
        }
      ];
    component.limit = 5;
    component.skip = 5;
    spyOn(questionAnswerService, 'getAnswers').withArgs(`ba1fbf02-4b16-4678-9558-ae21af05b478`, component.limit, component.skip, 'da5210ea-0985-4522-b041-3de99837a671').and.resolveTo(expectedResponse);
    await component.showMoreReplies();
    expect(component.loadedAnswers).toEqual(component.loadedAnswers + 5);
    expect(component.skip).toEqual(10);
    expect(component.secondLevelAnswers).toEqual(expectedResponse);
  });

  it('should call calculateRemainingAnswer', () => {
    component.totalAnswers = 2;
    component.loadedAnswers = 1;
    component.extended = true;
    const boolean = component.calculateRemainingAnswer();
    expect(boolean).toEqual(true);
  });

  it('should call deleteAnswer', async () => {
    const expectedResponse = {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://localhost:3035/api/courseservice/qna/answers/2bd6dd6e-f986-402c-bd75-8f1574809f9b",
      "ok": true,
      "type": 4,
      "body": {
        "status": "success"
      }
    };
    component.answer = {
      "_id": "61c2af5db5dfa11348f4afc3",
      "firstLevelAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "parentAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "numOfReplies": 0,
      "numOfUpvotes": 0,
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "answer": "<p>ra1</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "answerId": "a6dca7a1-a35b-40d7-90fd-17aacff92297",
      "createdAt": "2021-12-22T04:53:49.133Z",
      "updatedAt": "2021-12-22T04:53:49.133Z",
      "userName": "username1"
    };
    spyOn(questionAnswerService, 'deleteAnswer').withArgs(`a6dca7a1-a35b-40d7-90fd-17aacff92297`).and.resolveTo(expectedResponse);
    spyOn(dialogService, 'showConfirmDialog').withArgs({title: {translationKey: "qna.answerReply.deleteReplyWarningMessage"}}).and.resolveTo(true);
    spyOn(toastrService, 'success').withArgs('Reply deleted successfully', '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
    spyOn(component.increaseReplyNumber, 'emit').withArgs(false);
    await component.deleteAnswer();
    expect(toastrService.success).toHaveBeenCalledWith('Reply deleted successfully', '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
    expect(component.increaseReplyNumber.emit).toHaveBeenCalledWith(false);
  });

  it('should call give reply', async () => {
    component.answer = {
      "_id": "61c2af55b5dfa11348f4afb9",
      "firstLevelAnswerId": undefined,
      "parentAnswerId": '',
      "numOfReplies": 0,
      "numOfUpvotes": 0,
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "answer": "<p>a1</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "answerId": "065d0701-e407-4eab-a252-391619207824",
      "createdAt": "2021-12-22T04:53:41.512Z",
      "updatedAt": "2021-12-22T04:53:41.512Z",
      "verifiedAt": "2021-12-22T04:53:41.622Z",
      "verifiedBy": "1",
      "userName": "username1"
    };
    const payLoad = {
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "parentAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "answer": "<p>ra1</p>",
      "firstLevelAnswerId": "065d0701-e407-4eab-a252-391619207824"
    };
    const expectedResponse = {
      "firstLevelAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "parentAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "numOfReplies": 0,
      "numOfUpvotes": 0,
      "_id": "61c2b806b5dfa11348f4b061",
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "answer": "<p>ra1</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "answerId": "2bd6dd6e-f986-402c-bd75-8f1574809f9b",
      "createdAt": "2021-12-22T05:30:46.228Z",
      "updatedAt": "2021-12-22T05:30:46.228Z"
    };
    spyOn(questionAnswerService, 'giveReply').withArgs(payLoad).and.resolveTo(expectedResponse);
    await component.giveReply("<p>ra1</p>");
    expect(component.isReplying).toEqual(false);
    expect(toastrService.success).toHaveBeenCalled();
  });

  it('should call interaction', async () => {
    component.answer = {
      "firstLevelAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "parentAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "numOfReplies": 0,
      "numOfUpvotes": 0,
      "_id": "61c2b806b5dfa11348f4b061",
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "answer": "<p>ra1</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "answerId": "2bd6dd6e-f986-402c-bd75-8f1574809f9b",
      "createdAt": "2021-12-22T05:30:46.228Z",
      "updatedAt": "2021-12-22T05:30:46.228Z",
      "userName": '1'
    };
    const payLoad = {
      interactionType: `upvote`,
      objectType: 'answer'
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
    spyOn(questionAnswerService, 'vote').withArgs('2bd6dd6e-f986-402c-bd75-8f1574809f9b', payLoad).and.resolveTo(expectedResponse);
    await component.interaction('vote/unvote');
    fixture.detectChanges();
    expect(component.answer.isUpvoted).toEqual(true);
    expect(component.answer.numOfUpvotes).toEqual(1);
  });

  it('should call close', () => {
    component.close();
    expect(component.isReplying).toEqual(true);
  });

  it('should call toggleLabel', () => {
    spyOn(component.toggleLabel, 'emit').withArgs(true);
    component.toggleLabelEvent(true);
    expect(component.isAnyVerified).toEqual(true);
    expect(component.toggleLabel.emit).toHaveBeenCalledWith(true);
  });

  it('should call increaseReplyCounter', () => {
    component.answer = {
      "firstLevelAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "parentAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "numOfReplies": 0,
      "numOfUpvotes": 0,
      "_id": "61c2b806b5dfa11348f4b061",
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "answer": "<p>ra1</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "answerId": "2bd6dd6e-f986-402c-bd75-8f1574809f9b",
      "createdAt": "2021-12-22T05:30:46.228Z",
      "updatedAt": "2021-12-22T05:30:46.228Z",
      "userName": '1'
    };
    spyOn(component.increaseReplyNumber, 'emit').withArgs(true);
    component.increaseReplyCounter(true);
    expect(component.increaseReplyNumber.emit).toHaveBeenCalledWith(true);
  });

  it('should call updateVerifiedAnswer', () => {
    component.answer = {
      "firstLevelAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "parentAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "numOfReplies": 0,
      "numOfUpvotes": 0,
      "_id": "61c2b806b5dfa11348f4b061",
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "answer": "<p>ra1</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "answerId": "2bd6dd6e-f986-402c-bd75-8f1574809f9b",
      "createdAt": "2021-12-22T05:30:46.228Z",
      "updatedAt": "2021-12-22T05:30:46.228Z",
      "userName": '1'
    };
    spyOn(component.updateVerifiedAnswerId, 'emit').withArgs('2bd6dd6e-f986-402c-bd75-8f1574809f9b');
    component.updateVerifiedAnswer('2bd6dd6e-f986-402c-bd75-8f1574809f9b');
    expect(component.updateVerifiedAnswerId.emit).toHaveBeenCalledWith('2bd6dd6e-f986-402c-bd75-8f1574809f9b');
  });

  it('should call toggleVerify', async () => {
    const expectedResponse = {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://localhost:3035/api/courseservice/qna/answers/065d0701-e407-4eab-a252-391619207824",
      "ok": true,
      "type": 4,
      "body": {
        "status": "success"
      }
    };
    component.answer = {
      "_id": "61c2af5db5dfa11348f4afc3",
      "firstLevelAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "parentAnswerId": "065d0701-e407-4eab-a252-391619207824",
      "numOfReplies": 0,
      "numOfUpvotes": 0,
      "questionId": "bbb79ff4-030d-4af3-9da2-3d3e6cec937c",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "answer": "<p>ra1</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "answerId": "a6dca7a1-a35b-40d7-90fd-17aacff92297",
      "createdAt": "2021-12-22T04:53:49.133Z",
      "updatedAt": "2021-12-22T04:53:49.133Z",
      "userName": "username1",
      "verifiedBy": "1",
    };
    spyOn(questionAnswerService, 'toggleVerifyAnswer').withArgs(`a6dca7a1-a35b-40d7-90fd-17aacff92297`, {verified: false}).and.resolveTo(expectedResponse);
    spyOn(dialogService, 'showConfirmDialog').withArgs({ title: { translationKey: "qna.unverifyWarningMessage" } }).and.resolveTo(true);
    spyOn(toastrService, 'success').withArgs('Answer unverified successfully', '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
    spyOn(component.toggleLabel, 'emit').withArgs(!component.isAnyVerified);
    await component.toggleVerify();
    expect(dialogService.showConfirmDialog).toHaveBeenCalledWith({ title: { translationKey: "qna.unverifyWarningMessage" } });
    expect(toastrService.success).toHaveBeenCalledWith('Answer unverified successfully', '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
    expect(component.answer.verifiedBy).toEqual(null);
    expect(component.isAnyVerified).toEqual(true);
    expect(component.toggleLabel.emit).toHaveBeenCalledWith(component.isAnyVerified);
  });
});
