/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { InfiniteScrollFilterAttributes, QuestionAnswerService, QuestionResponseForQnADashboard } from '../../course-services/question-answer.service';
import * as lodash from 'lodash';
import { distinctUntilChanged } from 'rxjs';
import { ScreenSizeKey } from 'src/app/enums/screenSizeKey';
import { StorageKey } from 'src/app/enums/storageKey';

const defaultFilterOptions: InfiniteScrollFilterAttributes = {
  limit: 10,
  skip: 0,
};
@Component({
  selector: 'app-qna-left-panel',
  templateUrl: './qna-left-panel.component.html',
  styleUrls: ['./qna-left-panel.component.scss']
})
export class QnaLeftPanelComponent implements OnInit {
  questionList: QuestionResponseForQnADashboard[] = [];
  pinnedQuestions: QuestionResponseForQnADashboard[] = [];
  unpinnedQuestions: QuestionResponseForQnADashboard[] = [];
  pinQuestionId!: string;
  currentDate = new Date();
  activeQuestionId!: string;
  counter = 1;
  showQuestionnaire = true;
  isMobileOrTablet!: boolean;
  limitReached = false;
  filterOptions: InfiniteScrollFilterAttributes = defaultFilterOptions;
  @Output() isShow = new EventEmitter();
  constructor(private questionAnswerService: QuestionAnswerService, private router: Router, private activatedRoute: ActivatedRoute, private routeOperationService: RouteOperationService, private storageService: StorageService){}
  async ngOnInit(): Promise<void> {
    this.getScreenType();
    await this.fetchQuestions();
    this.activeQuestionId = this.questionList[0].questionId;
    this.routeOperationService.listen('questionId').subscribe((data: string) => {
      if (data && data !== "undefined") {
        this.activeQuestionId = data;
      }
      if(!this.isMobileOrTablet) {
        this.showQuestion(this.activeQuestionId);
      }
    });
    this.likeUnlikeListener();
    this.pinUnpinListener();
    this.deleteQuestionListener();
    this.replyListener();
  }

  getScreenType(): void {
    this.storageService.listen(StorageKey.CURRENT_DEVICE).pipe(distinctUntilChanged()).subscribe(screenType => {
      this.isMobileOrTablet = screenType === ScreenSizeKey.MOBILE || screenType === ScreenSizeKey.TABLET ? true : false;
      switch (screenType) {
        case ScreenSizeKey.TABLET:
          this.isMobileOrTablet = true;
          break;
        case ScreenSizeKey.MOBILE:
          this.isMobileOrTablet = true;
          break;
        default:
          this.showQuestion(this.activeQuestionId);
          break;
      }
    });
  }

  showQuestion(questionId: string): void {
    if (this.isMobileOrTablet) {
      this.isShow.emit(true);
    }
    this.router.navigate(['./question/' + questionId], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge' });
  }

  onScrollDown(): void {
    this.fetchQuestions();
  }

  private async fetchQuestions(): Promise<void> {
    if (!this.limitReached) {
      const { filterOptions } = this;
      const questions = await this.questionAnswerService.getQuestionsForQnaDashboard(filterOptions);
      if (!questions.length) {
        this.limitReached = true;
        return;
      }
      if (this.questionList.length === 0) {
        this.questionList.push(...questions);
        this.generatedPinnedQuestions();
      } else {
        this.questionList.push(...questions);
        const pinnedQuestionsFetched = questions.filter((data: any) => data.isPinned);
        const unPinnedQuestionsFetched = questions.filter((data: any) => !data.isPinned);
        if (pinnedQuestionsFetched.length !== 0) {
          this.pinnedQuestions.push(...pinnedQuestionsFetched);
          this.pinnedQuestions = lodash.orderBy(this.pinnedQuestions, question => question.createdAt, ['desc']);
          this.pinnedQuestions = lodash.uniqBy(this.pinnedQuestions, question => question.questionId);
        }
        if (unPinnedQuestionsFetched.length !== 0) {
          this.unpinnedQuestions.push(...unPinnedQuestionsFetched);
          this.unpinnedQuestions = lodash.orderBy(this.unpinnedQuestions, question => question.createdAt, ['desc']);
          this.unpinnedQuestions = lodash.uniqBy(this.unpinnedQuestions, question => question.questionId);
        }
      }
      filterOptions.skip += this.filterOptions.limit;
    }
  }

  private generatedPinnedQuestions() {
    this.pinnedQuestions = this.questionList.filter((data: any) => data.isPinned);
    this.unpinnedQuestions = this.questionList.filter((data: any) => !data.isPinned);
  }
  ngOnDestroy(): void {
    this.filterOptions.skip = 0;
  }
  likeUnlikeListener(): void {
    this.storageService.listen('likeUnlikeEmitter').subscribe((payLoad: any) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const questionToBeLikedOrUnliked = lodash.find(this.questionList, { questionId: payLoad.questionId })!;
      if (payLoad.likeUnlike) {
        questionToBeLikedOrUnliked.isUpvoted = true;
        questionToBeLikedOrUnliked.numOfUpvotes += 1;
      } else {
        questionToBeLikedOrUnliked.isUpvoted = false;
        questionToBeLikedOrUnliked.numOfUpvotes -= 1;
      }
    });
  }
  pinUnpinListener(): void {
    this.storageService.listen('pinQuestion').subscribe((data: string) => {
      this.pinQuestionId = data;
      const unpinnedQuestionToBePinned = lodash.find(this.unpinnedQuestions, { questionId: this.pinQuestionId });
      if (unpinnedQuestionToBePinned) {
        this.unpinnedQuestions = this.unpinnedQuestions.filter(question => question.questionId !== unpinnedQuestionToBePinned.questionId);
        unpinnedQuestionToBePinned.isPinned = true;
        this.pinnedQuestions.push(unpinnedQuestionToBePinned);
        this.pinnedQuestions = lodash.orderBy(this.pinnedQuestions, question => question.createdAt, ['desc']);
        this.pinnedQuestions = lodash.uniqBy(this.pinnedQuestions, question => question.questionId);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const pinnedQuestionToBeUnpinned = lodash.find(this.pinnedQuestions, { questionId: this.pinQuestionId })!;
        this.pinnedQuestions = this.pinnedQuestions.filter(question => question.questionId !== pinnedQuestionToBeUnpinned.questionId);
        pinnedQuestionToBeUnpinned.isPinned = false;
        this.unpinnedQuestions.push(pinnedQuestionToBeUnpinned);
        this.unpinnedQuestions = lodash.orderBy(this.unpinnedQuestions, question => question.createdAt, ['desc']);
        this.unpinnedQuestions = lodash.uniqBy(this.unpinnedQuestions, question => question.questionId);
      }
    });
  }

  deleteQuestionListener(): void {
    let index;
    this.storageService.listen('deleteQuestionEmitter').subscribe((questionId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const questionToBeDeleted = lodash.find(this.questionList, { questionId })!;
      if (questionToBeDeleted.isPinned) {
        index = lodash.findIndex(this.questionList, { questionId });
        lodash.remove(this.pinnedQuestions, { questionId });
        if (this.pinnedQuestions.length > 0 && this.pinnedQuestions[index + 1]) {
          this.showQuestion(this.pinnedQuestions[index + 1].questionId);
        } else if (this.pinnedQuestions.length > 0 && this.pinnedQuestions[index - 1]) {
          this.showQuestion(this.pinnedQuestions[index - 1].questionId);
        } else {
          this.showQuestion(this.unpinnedQuestions[0].questionId);
        }
      } else {
        index = lodash.findIndex(this.questionList, { questionId });
        lodash.remove(this.unpinnedQuestions, { questionId });
        if (this.unpinnedQuestions.length > 0 && this.unpinnedQuestions[index + 1]) {
          this.showQuestion(this.unpinnedQuestions[index + 1].questionId);
        } else if (this.unpinnedQuestions.length > 0 && this.unpinnedQuestions[index - 1]) {
          this.showQuestion(this.unpinnedQuestions[index - 1].questionId);
        } else {
          const question = this.pinnedQuestions[this.pinnedQuestions.length - 1];
          this.showQuestion(question.questionId);
        }
      }
    });
  }

  replyListener(): void {
    this.storageService.listen('replyAddedEmitter').subscribe((payLoad: any) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const questionToBeLikedOrUnliked = lodash.find(this.questionList, { questionId: payLoad.questionId })!;
      if (payLoad.isAdded) {
        questionToBeLikedOrUnliked.numOfAnswers += 1;
      } else {
        questionToBeLikedOrUnliked.numOfAnswers -= 1;
      }
    });
  }
}
