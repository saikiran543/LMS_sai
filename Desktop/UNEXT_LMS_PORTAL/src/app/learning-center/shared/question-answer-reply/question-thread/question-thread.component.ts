import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { StorageKey } from 'src/app/enums/storageKey';
import { Dialog } from 'src/app/Models/Dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { StorageService } from 'src/app/services/storage.service';
import { QuestionAnswerService } from '../../../course-services/question-answer.service';
import { Answer, AnswerReplyComponent } from '../answer-reply/answer-reply.component';
import { EditQuestionThreadComponent } from '../edit-question-thread/edit-question-thread.component';

export interface Question {
  _id: string,
  numOfUpvotes: number,
  numOfAnswers: number,
  courseId: string,
  elementId: string,
  title: string,
  description: string,
  createdBy: string,
  updatedBy: string,
  questionId: string,
  createdAt: string,
  updatedAt: string,
  userName: string,
  isFollowing?: boolean,
  isPinned?: boolean,
  isUpvoted?: boolean,
  verifiedAnswerId?: string,
  contentType?: string
}

export interface User {
  userId: string,
  username: string,
  refreshToken: string,
  emailId: string,
  role: string,
  iat: number,
  exp: number
}

export interface Data {
  answerId: string,
  verifiedBy: string,
}

@Component({
  selector: 'app-question-thread',
  templateUrl: './question-thread.component.html',
  styleUrls: ['./question-thread.component.scss']
})

export class QuestionThreadComponent implements OnInit {
  @ViewChild(AnswerReplyComponent) answerReplyComponent!: AnswerReplyComponent;
  @Input() question!: Question;
  @Input() theme?= '';
  @Input() pinned?= false;
  @Input() showEditDelete?= false;
  @Input() extended = false;
  @Input() filterAnswerByUserId: string | null = null;
  @Input() viewOnlyMode = false;
  @Input() disableFeatureMap = {
    like: false,
    reply: false,
    markAsVerfied: false,
    pin: false,
  }

  isReplying = false;
  loggedInUser!: User;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answers: any = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verifiedAnswer!: any;
  loadedAnswers = 0;
  limit = 5;
  skip = 0;
  totalAnswers = 0;
  loadingAnswers = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verifiedChildAnswers: any;
  isAnyVerified = false;
  // eslint-disable-next-line @typescript-eslint/ban-types
  @Output() pinnedQuestionIdEmitter = new EventEmitter<string>();
  @Output() likeUnlikeEmitter = new EventEmitter<boolean>();
  @Output() deleteQuestionId = new EventEmitter<string>();
  @Output() replyAdded = new EventEmitter<boolean>();

  // eslint-disable-next-line max-params
  constructor(private questionAnswerService: QuestionAnswerService, private storageService: StorageService, private dialogService: DialogService, private toastrService: ToastrService, private ngbModal: NgbModal, private translateService: TranslateService) { }

  async ngOnInit(): Promise<void> {
    if (this.extended) {
      this.showReplies();
    }
    const userData = this.storageService.get(StorageKey.USER_DETAILS);
    this.loggedInUser = userData;
    this.isAnyVerified = this.question.verifiedAnswerId ? true : false;
  }

  async edit(event: Event): Promise<void> {
    event.stopPropagation();
    const modalDialogClass = 'content-builder-modal add-learning-objective-modal';
    const modalRef = this.ngbModal.open(EditQuestionThreadComponent, { backdrop: false, size: 'xl', centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
    modalRef.componentInstance.params.title = this.question.title;
    modalRef.componentInstance.params.description = this.question.description;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modalRef.componentInstance.editedQuestion.subscribe(async (question: any) => {
      const response = await this.questionAnswerService.updateQuestion(this.question.questionId, question);
      if(response.status === 200) {
        const type = this.question.contentType === 'standard_discussion_forum' ? 'Thread' : 'Question';
        this.question.title = question.title;
        this.question.description = question.description;
        this.translateService.get('qna.question.updatedQuestionSuccessMessage').subscribe((translatedText: string) => {
          this.toastrService.success(`${type} ${translatedText}`, '', {
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
    let answerResponse;
    if(!this.filterAnswerByUserId) {
      answerResponse = await this.questionAnswerService.getAnswers(this.question.questionId, this.limit, this.skip);
    }
    this.totalAnswers = +this.question.numOfAnswers;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.loadedAnswers = answerResponse.filter((answer: any) => answer.firstLevelAnswerId === null).length;
    for (let i = 0; i < answerResponse.length; i++) {
      if (answerResponse[i].firstLevelAnswerId === null) {
        this.totalAnswers -= answerResponse[i].numOfReplies;
      }
    }
    if (this.question.verifiedAnswerId) {
      await this.splitAnswers(answerResponse);
    } else {
      this.answers = answerResponse;
    }
    this.skip = this.skip + 5;
    this.isAnyVerified = (this.verifiedAnswer.length > 0 || this.verifiedChildAnswers.length > 0) ? true : false;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toggleExpand() {
    this.extended = !this.extended;
    if(!this.extended) {
      this.answers = [];
      this.verifiedAnswer = [];
      this.verifiedChildAnswers = [];
      this.totalAnswers = 0;
      this.loadedAnswers = 0;
      this.loadingAnswers = false;
      this.isReplying = false;
      this.skip = 0;
    } else {
      this.showReplies();
    }
  }

  async showMoreReplies(): Promise<void> {
    this.loadingAnswers = true;
    const answerResponse = await this.questionAnswerService.getAnswers(this.question.questionId, this.limit, this.skip);
    for (let i = 0; i < answerResponse.length; i++) {
      if (answerResponse[i].firstLevelAnswerId === null) {
        this.totalAnswers -= answerResponse[i].numOfReplies;
      }
    }
    this.loadedAnswers += answerResponse.length;
    this.answers = [...answerResponse, ...this.answers];
    this.skip = this.skip + 5;
    this.loadingAnswers = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async splitAnswers(answerResponse: any[]): Promise<void> {
    let splitIndex = 0;
    for (let index = 0; index < answerResponse.length; index++) {
      if (this.question.verifiedAnswerId === answerResponse[index].answerId) {
        splitIndex = index;
      }
    }
    this.verifiedAnswer = answerResponse;
    this.answers = this.verifiedAnswer.splice(splitIndex + 1);
    this.verifiedChildAnswers = this.verifiedAnswer.splice(1);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  calculateRemainingAnswer() {
    if (!this.extended) {
      return;
    }
    const answersLeft = this.totalAnswers - this.loadedAnswers;
    return answersLeft > 0;
  }

  async deleteQuestion(event: Event): Promise<void> {
    event.stopPropagation();
    const dialog: Dialog = {title: {translationKey: "qna.question.deleteQuestionWarningMessage"}};
    const res = await this.dialogService.showConfirmDialog(dialog);
    if (res) {
      const response = await this.questionAnswerService.deleteQuestion(this.question.questionId);
      if (response.status === 200) {
        this.deleteQuestionId.emit(this.question.questionId);
        this.replyAdded.emit(false);
        this.translateService.get('qna.question.deletedQuestionSuccessMessage').subscribe((translatedText: string) => {
          this.toastrService.success(`${translatedText}`, '', {
            positionClass: 'toast-top-right',
            closeButton: true,
            timeOut: 3000,
            extendedTimeOut: 3000,
            tapToDismiss: false
          });
        });
      }
    }
  }

  async giveReply(data: unknown): Promise<void> {
    if(this.disableFeatureMap.reply) { return; }
    const payLoad = {
      questionId: this.question.questionId,
      elementId: this.question.elementId,
      answer: data
    };
    const response = await this.questionAnswerService.giveReply(payLoad);
    if(response.status === 200) {
      this.isReplying = false;
      this.translateService.get('qna.answerReply.addedReplySuccessMessage').subscribe((translatedText: string) => {
        this.toastrService.success(`${translatedText}`, '', {
          positionClass: 'toast-top-right',
          closeButton: true,
          timeOut: 3000,
          extendedTimeOut: 3000,
          tapToDismiss: false
        });
      });
      response.body.userName = this.loggedInUser.username;
      if(this.loggedInUser.role === 'admin' && this.isAnyVerified === false) {
        response.body.verifiedBy = this.loggedInUser.userId;
        this.verifiedAnswer = [response.body];
        this.isAnyVerified = true;
      } else {
        this.answers = [...this.answers, response.body];
      }
      this.question.numOfAnswers += 1;
      this.loadedAnswers += 1;
      this.totalAnswers += 1;
      this.replyAdded.emit(true);
    }
  }

  async interaction(type: string): Promise<void> {
    if(this.viewOnlyMode) {return;}
    if (type === 'pin/unpin' && this.disableFeatureMap.pin) {return;}
    if (type === 'vote/unvote' && this.disableFeatureMap.like) {return;}
    const interactionValue = type === 'pin/unpin' ? this.question.isPinned ? 'unpin' : 'pin' : this.question.isUpvoted ? 'removeUpvote' : 'upvote';
    const payLoad = {
      interactionType: `${interactionValue}`,
      objectType: 'question'
    };
    const response = await this.questionAnswerService.vote(this.question.questionId, payLoad);
    if(response.status === 200) {
      if(type === 'pin/unpin') {
        this.pinnedQuestionIdEmitter.emit(this.question.questionId);
        this.question.isPinned = !this.question.isPinned;
      } else {
        this.question.isUpvoted = !this.question.isUpvoted;
        this.question.isUpvoted ? this.question.numOfUpvotes += 1 : this.question.numOfUpvotes -=1;
        this.likeUnlikeEmitter.emit(this.question.isUpvoted);
      }
    }
  }

  close(): void {
    this.isReplying = !this.isReplying;
  }

  deleteAnswer(data: Data): void {
    if(data.verifiedBy === undefined) {
      this.answers = this.answers.filter((answer: Answer) => answer.answerId !== data.answerId);
    } else {
      this.verifiedAnswer = this.verifiedAnswer.filter((answer: Answer) => answer.answerId !== data.answerId);
    }
  }

  toggleLabel(value: boolean): void {
    this.isAnyVerified = value;
  }

  increaseReplyCounter(bool: boolean): void {
    if(bool) {
      this.question.numOfAnswers += 1;
      this.replyAdded.emit(true);
    } else {
      this.question.numOfAnswers -= 1;
      this.replyAdded.emit(false);
    }
  }

  updateVerifiedAnswer(answerId: string): void {
    this.question.verifiedAnswerId= answerId;
    this.toggleExpand();
    this.toggleExpand();
  }

  updateUnverifiedAnswer(): void {
    this.question.verifiedAnswerId= "";
    this.toggleExpand();
    this.toggleExpand();
  }
}
