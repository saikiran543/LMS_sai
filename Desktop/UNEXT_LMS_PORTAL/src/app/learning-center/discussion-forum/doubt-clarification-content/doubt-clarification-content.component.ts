/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { ForumType } from 'src/app/enums/forumType';
import { StorageKey } from 'src/app/enums/storageKey';
import { UserRoles } from 'src/app/enums/userRoles';
import { StorageService } from 'src/app/services/storage.service';
import { InfiniteScrollFilterAttributes, QuestionAnswerService, QuestionResponse } from '../../course-services/question-answer.service';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';
import { AskQuestionComponent } from '../../shared/question-answer-reply/ask-question/ask-question.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ContentPlayerService } from '../../course-services/content-player.service';
import { ActivityContent, ContentService } from '../../course-services/content.service';
import moment from 'moment-timezone';
import { GradedForumValidityState } from 'src/app/enums/gradedForumValidityState';
import { Question } from '../../shared/question-answer-reply/question-thread/question-thread.component';

const defaultFilterOptions: InfiniteScrollFilterAttributes = {
  limit: 5,
  skip: 0,
};

@Component({
  selector: 'app-doubt-clarification-content',
  templateUrl: './doubt-clarification-content.component.html',
  styleUrls: ['./doubt-clarification-content.component.scss']
})
export class DoubtClarificationContentComponent implements OnInit {

  relatedDoubtsItem: any;
  elementId: any;
  courseId: any;
  forumActivityId: any;
  currentDiscussionItem!: ActivityContent;
  questions: QuestionResponse[] = [];
  userCurrentView: any;
  userRole = UserRoles;

  filterOptions: InfiniteScrollFilterAttributes = { ...defaultFilterOptions };

  limitReached = false;
  idQueryParams: any;
  validityState: GradedForumValidityState | null = null;
  questionsLoaded = false;
  validityExpired = false;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private discussionForumService: DiscussionForumService,
    private questionAnswerService: QuestionAnswerService,
    private storageService: StorageService,
    private ngbModal: NgbModal,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private contentPlayerService: ContentPlayerService,
    private contentService: ContentService
  ) { }

  ngOnInit() {
    this.loadDependencies();
  }

  async loadDependencies() {
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.courseId = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.params.courseId;
    this.elementId = await this.activatedRoute.snapshot.paramMap.get('forumId');
    this.idQueryParams = await this.activatedRoute.snapshot.queryParams.id;
    this.storageService.set(StorageKey.ELEMENT_ID, this.elementId);
    this.forumActivityId = this.activatedRoute.snapshot.queryParams.activityId;
    this.userCurrentView = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    const relatedDoubtsItem = (await this.discussionForumService.specificContentDoubts(this.courseId, this.forumActivityId, ForumType.DOUBT_CLARIFICATION_FORUM, this.elementId))?.[0];
    this.relatedDoubtsItem = relatedDoubtsItem;
    this.fetchQuestions();
    this.currentDiscussionItem = await this.discussionForumService.forumDetail(this.forumActivityId, this.courseId);
    this.validityState = this.checkValidity();
    const now = moment();
    const end = moment(this.currentDiscussionItem.activitymetadata[0].endDate);
    if (now.isAfter(end)) {
      this.validityExpired = true;
    }
    if (!this.currentDiscussionItem.activitymetadata[0].isGradable) {
      this.saveProgress();
    }
  }

  get forumValidityState(): typeof GradedForumValidityState {
    return GradedForumValidityState;
  }

  checkValidity(): GradedForumValidityState | null {
    if (this.currentDiscussionItem.activitymetadata[0].startDate && this.currentDiscussionItem.activitymetadata[0].endDate) {
      const startDate = moment(this.currentDiscussionItem.activitymetadata[0].startDate);
      const endDate = moment(this.currentDiscussionItem.activitymetadata[0].endDate);
      if (moment().isAfter(startDate)) {
        if (moment().isBefore(endDate)) {
          return GradedForumValidityState.ONGOING;
        }
        return GradedForumValidityState.EXPIRED;
      }
      return GradedForumValidityState.UPCOMING;
    }
    return null;
  }

  public async fetchQuestions(): Promise<void> {
    if (!this.limitReached) {
      this.questionsLoaded = false;
      const { elementId, filterOptions } = this;
      const response = await this.questionAnswerService.getFilteredQuestionsByElementId(elementId, filterOptions);
      this.questionsLoaded = true;
      if (!response.questions.length) {
        this.limitReached = true;
        return;
      }
      const distinctQuestion = response.questions.every((question) => this.questions.map((ele) => ele._id).includes(question._id));
      if (!distinctQuestion) {
        this.questions.push(...response.questions);
      }
      filterOptions.skip += 5;
    }
  }

  onScrollDown(): void {
    this.fetchQuestions();
  }

  backToList(): void{
    this.questionsLoaded = false;
    this.limitReached = false;
    this.filterOptions = { ...defaultFilterOptions };
    this.questions = [];
    this.location.back();
  }

  public deleteQuestion(questionId: string) {
    this.questions = this.questions.filter((ele: Question) => ele.questionId !== questionId);
  }

  goToContent() {
    let contentType = this.relatedDoubtsItem.type.toLowerCase();
    if (contentType === "content") {
      contentType = "other-attachements";
    }
    this.router.navigate([`../../../content-area/list/content/${this.elementId}`], { relativeTo: this.activatedRoute, queryParams: { leftMenu: true, id: this.idQueryParams, courseDropDown: true, toc: true }, queryParamsHandling: '' });
  }

  askANewQuestion(): void {
    const modalDialogClass = 'content-builder-modal add-learning-objective-modal';
    const modalRef = this.ngbModal.open(AskQuestionComponent, { backdrop: false, size: 'xl', centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modalRef.componentInstance.askedQuestion.subscribe(async (response: any) => {
      if (response) {
        this.translateService.get('discussionForums.forumContent.questionCreatedSuccessMessage').subscribe((res: string) => {
          this.toastrService.success(res, '', {
            closeButton: true,
            timeOut: 3000,
            extendedTimeOut: 3000,
            tapToDismiss: false
          });
        }).unsubscribe();
        const userData = this.storageService.get(StorageKey.USER_DETAILS);
        response.userName = userData.username;
        this.questions.unshift(response);
        this.relatedDoubtsItem.qnAmetaData.totalQuestions += 1;
        this.relatedDoubtsItem.qnAmetaData.updatedBy = userData.username;
        this.relatedDoubtsItem.qnAmetaData.updatedAt = new Date().toISOString();
        if (this.currentDiscussionItem.activitymetadata[0].isGradable) {
          this.saveProgress();
        }
      }
    });
  }

  onReplyAdded(event: boolean) {
    const userData = this.storageService.get(StorageKey.USER_DETAILS);
    if (event) {
      this.relatedDoubtsItem.qnAmetaData.totalAnswers += 1;
    } else {
      this.relatedDoubtsItem.qnAmetaData.totalAnswers -= 1;
    }
    this.relatedDoubtsItem.qnAmetaData.updatedBy = userData.username;
    this.relatedDoubtsItem.qnAmetaData.updatedAt = new Date().toISOString();
    if (this.currentDiscussionItem.activitymetadata[0].isGradable) {
      this.saveProgress();
    }
  }

  saveProgress() {
    const courseContent = this.storageService.get(StorageKey.COURSE_JSON);
    const contentNode = this.contentService.locateElement(this.currentDiscussionItem.elementId, courseContent);
    if (contentNode?.progress === 0) {
      const progressPayload = {
        progress: 100,
        lastAccessedPoint: 'Completed',
        timeSpent: 1
      };
      const userCurrentView = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
      userCurrentView === "student" ? this.contentPlayerService.saveProgress(progressPayload, this.courseId, this.forumActivityId) : "";
    }
  }

  onLikeUnlike(event: boolean) {
    if (event) {
      if (this.currentDiscussionItem.activitymetadata[0].isGradable) {
        this.saveProgress();
      }
    }
  }
}
