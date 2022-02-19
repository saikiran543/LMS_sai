/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ElementStatuses } from 'src/app/enums/ElementStatuses';
import { ForumType } from 'src/app/enums/forumType';
import { StorageKey } from 'src/app/enums/storageKey';
import { UserRoles } from 'src/app/enums/userRoles';
import { StorageService } from 'src/app/services/storage.service';
import { ContentPlayerService } from '../../course-services/content-player.service';
import { ContentService } from '../../course-services/content.service';
import { ForumSortOptions } from 'src/app/enums/forumSortOptions';
import { AskQuestionComponent } from '../../shared/question-answer-reply/ask-question/ask-question.component';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';
import moment from 'moment';
import { Location } from '@angular/common';
import { GradedForumValidityState } from 'src/app/enums/gradedForumValidityState';
import { Question } from '../../shared/question-answer-reply/question-thread/question-thread.component';

const defaultFilterOptions = {
  limit: 5,
  skip: 0,
};
@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.component.html',
  styleUrls: ['./forum-detail.component.scss']
})
export class ForumDetailComponent implements OnInit {

  currentDiscussionItem: any;
  currentDiscussionItemId: any;
  userCurrentView: any;
  userRole = UserRoles;
  questionsAnswers = false;
  relatedContents = false;
  relatedContentItems: any = [];
  forumToast = false;
  toastType = 'error'
  toastMessage: any = "";
  courseId: any;
  forumSortOptions = ForumSortOptions;
  questions: any = [];
  sortOrder = "asc";
  throttle = 300;
  scrollDistance = 1;
  limitReached = false;
  filterOptions = { ...defaultFilterOptions }
  relatedContentItemsEmpty = false;
  questionsAnswersEmpty = false;
  startDate!: string;
  endDate!: string;
  todayDate!: string;
  validityState: GradedForumValidityState | null = null;
  validityExpired=false;
  paginationConfig = {
    id: 'loadDoubtDiscussionPagination',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 5
  };

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private contentService: ContentService,
    private discussionForumService: DiscussionForumService,
    private translate: TranslateService,
    private contentPlayerService: ContentPlayerService,
    private ngbModal: NgbModal,
    private toastService: ToastrService,
  ) { }

  get discussionForumType(): typeof ForumType {
    return ForumType;
  }

  async ngOnInit() {
    const sortBy = await this.activatedRoute.snapshot.queryParams.sortType;
    this.userCurrentView = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    if (sortBy) {
      this.sortByCount(sortBy);
    } else {
      this.currentDiscussionItemId = await this.activatedRoute.snapshot.paramMap.get('forumId');
      this.storageService.set(StorageKey.ELEMENT_ID, this.currentDiscussionItemId);
      const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
      this.courseId = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.params.courseId;
      this.currentDiscussionItem = await this.discussionForumService.forumDetail(this.currentDiscussionItemId, this.courseId);
      this.validityState = this.checkValidity();
      this.startDate = moment(this.currentDiscussionItem.activitymetadata[0].startDate).format("Do MMM YYYY, h:mm a");
      this.endDate = moment(this.currentDiscussionItem.activitymetadata[0].endDate).format("Do MMM YYYY, h:mm a");
      const now = moment();
      const end = moment(this.currentDiscussionItem.activitymetadata[0].endDate);
      if (now.isAfter(end)) {
        this.validityExpired = true;
      }
      if (!this.currentDiscussionItem.activitymetadata[0].isGradable) {
        this.saveProgress();
      }
      this.storageService.set(StorageKey.DOC_VERSION, this.currentDiscussionItem.__v.toString());
      if (this.currentDiscussionItem.subType === ForumType.DOUBT_CLARIFICATION_FORUM) {
        this.questionsAnswers = false;
        this.relatedContents = true;
        const response = await this.discussionForumService.relatedContents(this.courseId, this.currentDiscussionItemId, ForumType.DOUBT_CLARIFICATION_FORUM, {
          limit: this.paginationConfig.totalItems,
          pageNo: this.paginationConfig.currentPage
        });
        this.relatedContentItems = response.elementDetails;
        this.paginationConfig.currentPage = response.paginationInfo.currentPage;
        this.paginationConfig.totalItems = response.paginationInfo.totalItems;
        if(!this.relatedContentItems.length){
          this.relatedContentItemsEmpty = true;
        }
      } else {
        this.questionsAnswers = true;
        this.relatedContents = false;
        await this.fetchQuestions();
        if (this.questions.length < 1) {
          this.questionsAnswersEmpty = true;
        }
      }
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

  checkForumContentList(): boolean {
    if(this.currentDiscussionItem) {
      if(this.userCurrentView === UserRoles.STUDENT) {
        if(this.validityState) {
          if(this.validityState === GradedForumValidityState.UPCOMING) {
            return false;
          }
        } else {
          return true;
        }
      }
      if(this.currentDiscussionItem.subType === ForumType.DOUBT_CLARIFICATION_FORUM) {
        if(!this.relatedContents) {
          return false;
        }
      } else if(!this.questionsAnswers) {
        return false;
      }
      return true;
    }
    return false;
  }

  moreContent(forum: any, event: any) {
    event.stopPropagation();
    forum.isTextFullHeight = !forum.isTextFullHeight;
  }

  sendToMyPerformance(): void {
    this.router.navigate([`my-performance/`], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
  }

  backToList(): void {
    this.limitReached = false;
    this.filterOptions = { ...defaultFilterOptions };
    this.questions = [];
    this.location.back();
  }

  showMyPerformanceCTA(): boolean {
    if(this.userCurrentView === UserRoles.STUDENT && this.validityState && [GradedForumValidityState.EXPIRED, GradedForumValidityState.UPCOMING].includes(this.validityState) && this.currentDiscussionItem?.activitymetadata?.[0]?.isGradable){
      return true;
    }
    return false;
  }

  async publishUnpublish(elementId: string, event: any) {
    if (event.target.checked) {
      try {
        const res = await this.contentService.publish(this.courseId, elementId, true);
        this.translate.get("discussionForums.forumList.publishedSuccessMessage").subscribe(val => {
          this.showToaster(res, val);
        });
        this.currentDiscussionItem.status = ElementStatuses.PUBLISHED;
      } catch (error: any) {
        this.showToaster(error, error.error);
      }
    } else {
      try {
        const res = await this.contentService.unPublish(this.courseId, elementId);
        this.translate.get("discussionForums.forumList.unPublishedSuccessMessage").subscribe(val => {
          this.showToaster(res, val);
        });
        this.currentDiscussionItem.status = ElementStatuses.UNPUBLISHED;
      } catch (error: any) {
        this.showToaster(error, error.error);
      }
    }
  }

  showToaster(res: any, message: any) {
    if (res.status === 200) {
      this.forumToast = true;
      this.toastType = "success";
      this.toastMessage = message;
    } else {
      this.forumToast = true;
      this.toastType = "error";
      this.toastMessage = message;
    }
  }

  closeToast(): void {
    this.forumToast = false;
  }

  contentDoubts(elementId: any) {
    this.router.navigate(['../../doubt-clarification-content/' + elementId], { queryParams: { activityId: this.currentDiscussionItemId }, relativeTo: this.activatedRoute, queryParamsHandling: 'merge' });
  }

  deleteHandler(event: {
    id: string,
    type: ForumType,
  }) {
    if (event) {
      this.translate.get("discussionForums.forumList.deletedSuccessMessage").subscribe(val => {
        this.toastService.success(val, '', {
          closeButton: true,
          timeOut: 3000,
          extendedTimeOut: 3000,
          tapToDismiss: false
        });
      });
      this.router.navigate([`../../${event.type}`], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
    }
  }

  async downloadAttachment() {
    const s3Data = await this.contentPlayerService.getSignedUrl(this.currentDiscussionItem?.activitymetadata[0]?.fileName, this.currentDiscussionItem?.activitymetadata[0]?.originalFileName);
    window.open(s3Data.body.url);
  }

  sort(data: any, sortOrder: string, sortBy: string) {
    if (sortOrder === 'asc') {
      data.sort((firstElement: any, secondElement: any) => {
        if (sortBy === "createdOn") {
          const Elementfirst = new Date(firstElement.createdAt).valueOf();
          const Elementsecond = new Date(secondElement.createdAt).valueOf();
          return Elementsecond - Elementfirst;
        }
        return null;
      }
      );
    } else {
      data.sort((firstElement: any, secondElement: any) => {
        if (sortBy === "createdOn") {
          const Elementfirst = new Date(firstElement.createdAt).valueOf();
          const Elementsecond = new Date(secondElement.createdAt).valueOf();
          return Elementfirst - Elementsecond;
        }
        return null;
      }
      );
    }
    this.questions = data;
  }

  async sortByCount(sortBy: any) {
    this.currentDiscussionItemId = await this.activatedRoute.snapshot.paramMap.get('forumId');
    this.storageService.set(StorageKey.ELEMENT_ID, this.currentDiscussionItemId);
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.courseId = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.params.courseId;
    await this.discussionForumService.forumDetail(this.currentDiscussionItemId, this.courseId).then((res: any) => {
      this.currentDiscussionItem = res;
    });
    this.storageService.set(StorageKey.DOC_VERSION, this.currentDiscussionItem.__v.toString());
    if (this.currentDiscussionItem.subType === ForumType.DOUBT_CLARIFICATION_FORUM) {
      this.questionsAnswers = false;
      this.relatedContents = true;
      const response = await this.discussionForumService.relatedContents(this.courseId, this.currentDiscussionItemId, ForumType.DOUBT_CLARIFICATION_FORUM, {
        limit: this.paginationConfig.itemsPerPage,
        pageNo: this.paginationConfig.currentPage,
      }, {
        sortBy,
        sortOrder: 'desc'
      });
      this.relatedContentItems = response.elementDetails;
      this.paginationConfig.totalItems = response.paginationInfo.totalItems;
      this.paginationConfig.currentPage = response.paginationInfo.currentPage;
    } else {
      this.questionsAnswers = true;
      this.relatedContents = false;
      this.fetchQuestions();
    }
    this.userCurrentView = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
  }

  sortCount(listArray: any, sortBy: any) {
    if (this.sortOrder === 'asc') {
      this.sortOrder = 'desc';
      listArray.sort((firstElement: any, secondElement: any) => {
        if (sortBy === 'upvotes') {
          return secondElement.numOfUpvotes - firstElement.numOfUpvotes;
        }
        return null;
      }
      );
    } else {
      this.sortOrder = 'asc';
      listArray.sort((firstElement: any, secondElement: any) => {
        if (sortBy === 'upvotes') {
          return firstElement.numOfUpvotes - secondElement.numOfUpvotes;
        }
        return null;
      }
      );
    }

  }

  public deleteQuestion(questionId: string) {
    this.questions = this.questions.filter((ele: Question) => ele.questionId !== questionId);
  }

  public async fetchQuestions(): Promise<void> {
    if (!this.limitReached) {
      const { filterOptions } = this;
      const response = await this.discussionForumService.getQuestions(this.currentDiscussionItemId, filterOptions.limit, filterOptions.skip);
      if (!response.questions.length) {
        this.limitReached = true;
        return;
      }
      this.questions.push(...response.questions);
      filterOptions.skip += 5;
    }
  }

  createThread(): void {
    const modalDialogClass = 'content-builder-modal add-learning-objective-modal';
    const modalRef = this.ngbModal.open(AskQuestionComponent, { backdrop: false, size: 'xl', centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
    modalRef.componentInstance.type = 'thread';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modalRef.componentInstance.askedQuestion.subscribe((response: any) => {
      if (response) {
        this.translate.get('discussionForums.forumContent.threadCreatedSuccessMessage').subscribe((res: string) => {
          this.toastService.success(res, '', {
            closeButton: true,
            timeOut: 3000,
            extendedTimeOut: 3000,
            tapToDismiss: false
          });
        }).unsubscribe();
        const userData = this.storageService.get(StorageKey.USER_DETAILS);
        response.userName = userData.username;
        this.questions.unshift(response);
        this.currentDiscussionItem.qnAmetaData.totalQuestions += 1;
        this.currentDiscussionItem.qnAmetaData.updatedBy = userData.username;
        this.currentDiscussionItem.qnAmetaData.updatedAt = new Date().toISOString();
        if (this.currentDiscussionItem.activitymetadata[0].isGradable) {
          this.saveProgress();
        }
      }
    });
  }

  onScrollDown(): void {
    this.fetchQuestions();
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
      userCurrentView === "student" ? this.contentPlayerService.saveProgress(progressPayload, this.courseId, this.currentDiscussionItemId) : "";
    }
  }

  onReplyAdded(event: boolean) {
    const userData = this.storageService.get(StorageKey.USER_DETAILS);
    if (event) {
      this.currentDiscussionItem.qnAmetaData.totalAnswers += 1;
    } else {
      this.currentDiscussionItem.qnAmetaData.totalAnswers -= 1;
    }
    this.currentDiscussionItem.qnAmetaData.updatedBy = userData.username;
    this.currentDiscussionItem.qnAmetaData.updatedAt = new Date().toISOString();
    if (this.currentDiscussionItem.activitymetadata[0].isGradable) {
      this.saveProgress();
    }
  }

  onLikeUnlike(event: boolean) {
    if (event) {
      if (this.currentDiscussionItem.activitymetadata[0].isGradable) {
        this.saveProgress();
      }
    }
  }

  async getPage(pageNumber: any) {
    const response = await this.discussionForumService.relatedContents(this.courseId, this.currentDiscussionItemId, this.currentDiscussionItem.subType, {
      limit: this.paginationConfig.itemsPerPage,
      pageNo: pageNumber,
    });
    this.relatedContentItems = response.elementDetails;
    this.paginationConfig.totalItems = response.paginationInfo.totalItems;
    this.paginationConfig.currentPage = response.paginationInfo.currentPage;
  }
}