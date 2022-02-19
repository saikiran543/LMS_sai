import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import { Dialog } from 'src/app/Models/Dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { StorageService } from 'src/app/services/storage.service';
import { QuestionAnswerService } from '../../../course-services/question-answer.service';
import { EditAnswerReplyComponent } from '../edit-answer-reply/edit-answer-reply.component';
import { User } from '../question-thread/question-thread.component';

export interface Answer {
  _id: string,
  parentAnswerId: string,
  numOfReplies: number,
  numOfUpvotes: number,
  questionId: string,
  elementId: string,
  answer: string,
  createdBy: string,
  updatedBy: string,
  answerId: string,
  createdAt: string,
  updatedAt?: string,
  verifiedAt?: string,
  verifiedBy?: string | null,
  userName: string,
  isFollowing?: boolean,
  isPinned?: boolean,
  isUpvoted?: boolean,
  firstLevelAnswerId?: string
}
@Component({
  selector: 'app-answer-reply',
  templateUrl: './answer-reply.component.html',
  styleUrls: ['./answer-reply.component.scss']
})
export class AnswerReplyComponent implements OnInit {
  @Input() answer!: Answer;
  @Input() verifiedSecondLevelAnswers: Answer[] = [];
  @Input() isAnyVerified = false;
  @Output() deleteAnswerId = new EventEmitter();
  @Output() toggleLabel = new EventEmitter();
  @Output() increaseReplyNumber = new EventEmitter();
  @Output() updateVerifiedAnswerId = new EventEmitter();
  @Output() updateUnverifiedAnswerId = new EventEmitter();
  @Input() viewOnlyMode = false;
  @Input() disableFeatureMap = {
    like: false,
    reply: false,
    markAsVerfied: false,
    pin: false,
  }

  isReplying = false;
  loggedInUser!: User;
  secondLevelAnswers: Answer[] = [];
  limit = 5;
  skip = 0;
  totalAnswers!: number;
  loadedAnswers!: number;
  extended!: boolean;
  childDeletion = false;

  // eslint-disable-next-line max-params
  constructor(private questionAnswerService: QuestionAnswerService, private storageService: StorageService, private dialogService: DialogService, private toastrService: ToastrService, private ngbModal: NgbModal, private translateService: TranslateService) { }

  ngOnInit(): void {
    const userData = this.storageService.get(StorageKey.USER_DETAILS);
    this.loggedInUser = userData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.questionAnswerService.questionAnswerOperations.pipe(filter((answer: any) => this.answer.answerId === answer.payLoad.firstLevelAnswerId)).subscribe(res => {
      switch (res.type) {
        case 'CREATE':
          if (this.secondLevelAnswers.length !== 0) {
            this.secondLevelAnswers = [];
          }
          this.secondLevelAnswers.push(res.payLoad);
          this.answer.numOfReplies += 1;
          break;
        case 'DELETE':
          if (this.verifiedSecondLevelAnswers) {
            this.verifiedSecondLevelAnswers = this.verifiedSecondLevelAnswers.filter((answer: Answer) => answer.answerId !== res.payLoad.answerId);
          }
          this.secondLevelAnswers = this.secondLevelAnswers.filter((answer: Answer) => answer.answerId !== res.payLoad.answerId);
          this.answer.numOfReplies -= 1;
          break;
        default:
          this.verifiedSecondLevelAnswers;
          this.secondLevelAnswers;
          break;
      }
    });
  }

  async edit(): Promise<void> {
    const modalDialogClass = 'content-builder-modal add-learning-objective-modal';
    const modalRef = this.ngbModal.open(EditAnswerReplyComponent, { backdrop: false, size: 'xl', centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
    modalRef.componentInstance.params.answer = this.answer.answer;
    modalRef.componentInstance.editedAnswer.subscribe(async (answer: string) => {
      const response = await this.questionAnswerService.updateAnswer(this.answer.answerId, answer);
      if (response.status === 200) {
        this.answer.answer = answer;
        this.translateService.get('qna.answerReply.updatedReplySuccessMessage').subscribe((translatedText: string) => {
          this.toastrService.success(`${translatedText}`, '', {
            positionClass: 'toast-top-right',
            closeButton: true,
            timeOut: 3000,
            extendedTimeOut: 3000,
            tapToDismiss: false
          });
        });
      }
    });
  }

  async showReplies(): Promise<void> {
    const secondLevelAnswers = await this.questionAnswerService.getAnswers(this.answer.questionId, this.limit, this.skip, this.answer.answerId);
    this.totalAnswers = +this.answer.numOfReplies;
    if (this.verifiedSecondLevelAnswers) {
      this.totalAnswers -= this.verifiedSecondLevelAnswers.length;
    }
    this.skip = this.skip + 5;
    this.extended = true;
    this.secondLevelAnswers = [...secondLevelAnswers];
    this.loadedAnswers = this.secondLevelAnswers.length;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toggleExpand() {
    this.extended = !this.extended;
    if (!this.extended) {
      this.secondLevelAnswers = [];
      // this.verifiedSecondLevelAnswers = [];
      this.totalAnswers = 0;
      this.loadedAnswers = this.verifiedSecondLevelAnswers.length > 0 ? this.verifiedSecondLevelAnswers.length : 0;
      this.isReplying = false;
      this.skip = 0;
    } else {
      this.showReplies();
    }
  }

  async showMoreReplies(): Promise<void> {
    const answerResponse = await this.questionAnswerService.getAnswers(this.answer.questionId, this.limit, this.skip, this.answer.answerId);
    this.loadedAnswers += answerResponse.length;
    this.secondLevelAnswers = [...answerResponse, ...this.secondLevelAnswers];
    this.skip = this.skip + 5;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  calculateRemainingAnswer() {
    if (!this.extended) {
      return;
    }
    const answersLeft = this.totalAnswers - this.loadedAnswers;
    return answersLeft > 0;
  }

  async deleteAnswer(): Promise<void> {
    const dialog: Dialog = { title: { translationKey: "qna.answerReply.deleteReplyWarningMessage" } };
    const res = await this.dialogService.showConfirmDialog(dialog);
    if (res) {
      const response = await this.questionAnswerService.deleteAnswer(this.answer.answerId);
      if (response.status === 200) {
        if (this.answer.firstLevelAnswerId) {
          this.questionAnswerService.questionAnswerOperations.next({ type: 'DELETE', payLoad: this.answer });
        }
        if (this.secondLevelAnswers.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.secondLevelAnswers = this.secondLevelAnswers.filter((answer: any) => answer.answerId !== this.answer.answerId);
        }
        else {
          const payLoad = {
            answerId: this.answer.answerId,
            verifiedBy: this.answer.verifiedBy
          };
          this.deleteAnswerId.emit(payLoad);
        }
        this.translateService.get('qna.answerReply.deletedReplySuccessMessage').subscribe((translatedText: string) => {
          this.toastrService.success(`${translatedText}`, '', {
            positionClass: 'toast-top-right',
            closeButton: true,
            timeOut: 3000,
            extendedTimeOut: 3000,
            tapToDismiss: false
          });
        });
        this.increaseReplyNumber.emit(false);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async giveReply(data: unknown): Promise<any> {
    if(this.disableFeatureMap.reply) { return; }
    const firstLevelAnswerId = this.answer.firstLevelAnswerId ? this.answer.firstLevelAnswerId : this.answer.answerId;
    const payLoad = {
      questionId: this.answer.questionId,
      elementId: this.answer.elementId,
      parentAnswerId: this.answer.answerId,
      answer: data,
      firstLevelAnswerId: firstLevelAnswerId
    };
    const response = await this.questionAnswerService.giveReply(payLoad);
    if (response.status === 200) {
      this.translateService.get('qna.answerReply.addedReplySuccessMessage').subscribe((translatedText: string) => {
        this.toastrService.success(`${translatedText}`, '', {
          positionClass: 'toast-top-right',
          closeButton: true,
          timeOut: 3000,
          extendedTimeOut: 3000,
          tapToDismiss: false
        });
      });
      if (this.loggedInUser.role === 'admin' && this.isAnyVerified === false) {
        response.body.verifiedBy = this.loggedInUser.userId;
        this.verifiedSecondLevelAnswers = [response.body];
        this.isAnyVerified = true;
        this.updateVerifiedAnswerId.emit(response.body.answerId);
        this.toggleLabel.emit(this.isAnyVerified);
      } else if (this.extended) {
        this.questionAnswerService.questionAnswerOperations.next({ type: 'CREATE', payLoad: response.body });
      } else {
        this.secondLevelAnswers = [response.body];
      }
      this.isReplying = false;
      this.answer.numOfReplies += 1;
      response.body.userName = this.loggedInUser.username;
      this.increaseReplyNumber.emit(true);
    }
  }

  async interaction(type: string): Promise<void> {
    if (this.viewOnlyMode) { return; }
    if (type === 'pin/unpin' && this.disableFeatureMap.pin) {return;}
    if (type === 'vote/unvote' && this.disableFeatureMap.like) {return;}
    const interactionValue = type === 'pin/unpin' ? this.answer.isPinned ? 'unpin' : 'pin' : this.answer.isUpvoted ? 'removeUpvote' : 'upvote';
    const payLoad = {
      interactionType: `${interactionValue}`,
      objectType: 'answer'
    };
    const response = await this.questionAnswerService.vote(this.answer.answerId, payLoad);
    if (response.status === 200) {
      this.answer.isUpvoted = !this.answer.isUpvoted;
      this.answer.isUpvoted ? this.answer.numOfUpvotes += 1 : this.answer.numOfUpvotes -= 1;
    }
  }

  async toggleVerify(): Promise<void> {
    if (this.loggedInUser.role !== 'admin' || this.viewOnlyMode || this.disableFeatureMap.markAsVerfied) { return; }
    if (this.answer.verifiedBy) {
      const dialog: Dialog = { title: { translationKey: "qna.answerReply.unverifyWarningMessage" } };
      const res = await this.dialogService.showConfirmDialog(dialog);
      if (res) {
        const response = await this.questionAnswerService.toggleVerifyAnswer(this.answer.answerId, {
          verified: false
        });
        if (response.status === 200) {
          this.translateService.get('qna.answerReply.unverifiedReplySuccessMessage').subscribe((translatedText: string) => {
            this.toastrService.success(`${translatedText}`, '', {
              positionClass: 'toast-top-right',
              closeButton: true,
              timeOut: 3000,
              extendedTimeOut: 3000,
              tapToDismiss: false
            });
          });
          this.answer.verifiedBy = null;
          this.isAnyVerified = !this.isAnyVerified;
          this.toggleLabel.emit(this.isAnyVerified);
          this.updateUnverifiedAnswerId.emit();
        }
      }
    } else {
      const response = await this.questionAnswerService.toggleVerifyAnswer(this.answer.answerId, {
        verified: true
      });
      if (response.status === 200) {
        this.translateService.get('qna.answerReply.verifiedReplySuccessMessage').subscribe((translatedText: string) => {
          this.toastrService.success(`${translatedText}`, '', {
            positionClass: 'toast-top-right',
            closeButton: true,
            timeOut: 3000,
            extendedTimeOut: 3000,
            tapToDismiss: false
          });
        });
        this.answer.verifiedBy = this.loggedInUser.userId;
        this.isAnyVerified = !this.isAnyVerified;
        this.toggleLabel.emit(this.isAnyVerified);
        this.updateVerifiedAnswerId.emit(this.answer.answerId);
      }
    }
  }

  close(): void {
    this.isReplying = !this.isReplying;
  }

  toggleLabelEvent(value: boolean): void {
    this.isAnyVerified = value;
    this.toggleLabel.emit(this.isAnyVerified);
  }

  increaseReplyCounter(bool: boolean): void {
    this.increaseReplyNumber.emit(bool);
  }

  updateVerifiedAnswer(answerId: string): void {
    this.updateVerifiedAnswerId.emit(answerId);
  }

  updateUnverifiedAnswer(): void {
    this.updateUnverifiedAnswerId.emit();
  }
}
