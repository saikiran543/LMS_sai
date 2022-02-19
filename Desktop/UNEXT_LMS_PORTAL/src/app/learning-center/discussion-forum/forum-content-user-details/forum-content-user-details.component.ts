/* eslint-disable max-params */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { ForumType } from 'src/app/enums/forumType';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';
import { Service } from 'src/app/enums/service';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { DiscussionForum } from 'src/app/enums/discussionForum';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from "../../../services/storage.service";
import { StorageKey } from "../../../enums/storageKey";
import { FormControl } from '@angular/forms';

const defaultQuestionFilterOptions = {
  limit: 5,
  skip: 0,
};

@Component({
  selector: 'app-forum-content-user-details',
  templateUrl: './forum-content-user-details.component.html',
  styleUrls: ['./forum-content-user-details.component.scss']
})
export class ForumContentUserDetailsComponent implements OnInit {

  forumEvaluateItemId: any;
  forumEvaluateItem: any;
  prevComponent: any;
  courseId: any;
  questions: any;
  loggedInUserDetails!: any;
  forumType = ForumType
  relatedContents: any;
  contentQuestions: any;
  userId: any;
  userName: any;
  limit = 5;
  skipThreadsInitiated = 0;
  skipThreadsParticipated = 0;
  userThreads: any;
  userThreadDetails: any;
  includeThreadsParticipated = false;
  userParticipation: any;
  limitReachedQuestions = false;
  limitReachedThreadsInitiated = false;
  limitReachedThreadsParticipated = false;
  routeFrom: any;
  discussionForum = DiscussionForum;
  rubricId!: string;
  feedback: FormControl = new FormControl("");

  questionFilterOptions = { ...defaultQuestionFilterOptions }

  constructor(private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private discussionForumService: DiscussionForumService,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private storageService: StorageService
  ) {
  }

  ngOnInit() {
    this.loadDependencies();
  }

  async loadDependencies() {
    this.forumEvaluateItemId = await this.activatedRoute.snapshot.paramMap.get('forumId');
    const userId = this.activatedRoute.snapshot.queryParams.userId;
    this.loggedInUserDetails = this.storageService.get(StorageKey.USER_DETAILS);
    this.userId = userId;
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.courseId = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.params.courseId;
    this.routeFrom = snapshot?.root?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.url[0].path;
    this.userThreadDetails = (await this.discussionForumService.studentActivityResultByUserId(this.forumEvaluateItemId, this.userId, this.courseId))[0];
    if (this.userThreadDetails && this.userThreadDetails?.feedback) {
      this.feedback.setValue(this.userThreadDetails?.feedback);
    }
    const res = await this.discussionForumService.forumDetail(this.forumEvaluateItemId, this.courseId);
    this.forumEvaluateItem = res;
    this.rubricId = res.activitymetadata[0].rubricId;
    if (this.forumEvaluateItem.subType === this.forumType.DOUBT_CLARIFICATION_FORUM) {
      const relatedContents = await this.discussionForumService.relatedContents(this.courseId, this.forumEvaluateItemId, ForumType.DOUBT_CLARIFICATION_FORUM);
      this.relatedContents = relatedContents.elementDetails;
    } else {
      this.userThreads = await this.discussionForumService.getThreadsByUser(this.forumEvaluateItemId, this.userId, this.limit, this.skipThreadsInitiated);
      this.skipThreadsInitiated += 5;
    }
  }

  backToList(): void {
    this.location.back();
  }

  moreContent(forum: any, event: any): void {
    event.stopPropagation();
    forum.isTextFullHeight = !forum.isTextFullHeight;
  }

  async threadsParticipated() {
    this.skipThreadsParticipated = 0;
    this.userParticipation = await this.discussionForumService.getThreadsByUser(this.forumEvaluateItemId, this.userId, this.limit, this.skipThreadsParticipated, true);
    this.skipThreadsParticipated += 5;
  }

  public async fetchThreadsInitiated(): Promise<void> {
    if (!this.limitReachedThreadsInitiated) {
      const response = await this.discussionForumService.getThreadsByUser(this.forumEvaluateItemId, this.userId, this.limit, this.skipThreadsInitiated);
      if (!response.questions.length) {
        this.limitReachedThreadsInitiated = true;
        return;
      }
      const distinctBatch = response.questions.every((question: any) => this.userThreads.questions.map((ele: any) => ele._id).includes(question._id));
      if (!distinctBatch) {
        this.userThreads.questions.push(...response.questions);
      }
      this.skipThreadsInitiated += 5;
    }
  }

  public async fetchThreadsParticipated(): Promise<void> {
    if (!this.limitReachedThreadsParticipated) {
      const response = await this.discussionForumService.getThreadsByUser(this.forumEvaluateItemId, this.userId, this.limit, this.skipThreadsParticipated, true);
      if (!response.questions.length) {
        this.limitReachedThreadsParticipated = true;
        return;
      }
      const distinctBatch = response.questions.every((question: any) => this.userParticipation.questions.map((ele: any) => ele._id).includes(question._id));
      if (!distinctBatch) {
        this.userParticipation.questions.push(...response.questions);
      }
      this.skipThreadsParticipated += 5;
    }
  }

  onScrollDownThreadsInititated(): void {
    this.fetchThreadsInitiated();
  }

  onScrollDownThreadsParticipated(): void {
    this.fetchThreadsParticipated();
  }

  clickEvent(type: string) {
    switch (type) {
      case 'saveEvaluation':
        this.commonService.rubricEvaluationSave.next({ type: 'saveEvaluation' });
        break;
      case 'cancel':
        this.router.navigate([`../../${this.forumEvaluateItemId}`], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge' });
        break;
      default:
        break;
    }
  }
  saveEvaluationForm(rubricData: any) {
    const payload = { activityId: this.forumEvaluateItem.activitymetadata[0].activityId, responseStatus: 'discussion-forum-evaluation', feedback: rubricData.feedback, activityName: this.forumEvaluateItem.activitymetadata[0].title, activityType: this.userThreadDetails?.subActivityType, gradedBy: this.loggedInUserDetails.userId, userId: this.userThreadDetails?.userId, userName: this.userThreadDetails?.userName, startDate: new Date(), submittedDate: new Date(), lastSubmittedDate: new Date(), gradedOn: new Date(), score: rubricData.totalSum, attemptNumber: 1, timeSpent: 1, attempts: 1, attemptsMade: 1, maxMarks: 100, isGradable: true, rubricScore: rubricData };
    this.discussionForumService.sendMessageToBackEnd(Service.COURSE_SERVICE, `discussion-forum/student-evaluations`, HttpMethod.PUT, payload).then(() => {
      this.toastrService.success(`${this.userThreadDetails?.userName} Grade and Feedback Saved Successfully`);
      setTimeout(() => {
        this.router.navigate([`../../${this.forumEvaluateItemId}`], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge' });
      }, 1000);
    });
  }
}
