/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { ForumType } from 'src/app/enums/forumType';
import moment from 'moment';
@Component({
  selector: 'app-student-performance-detail',
  templateUrl: './student-performance-detail.component.html',
  styleUrls: ['./student-performance-detail.component.scss']
})
export class StudentPerformanceDetailComponent {
  forumEvaluateItemId!:any;
  userThreadDetails: any;
  userId!: string;
  courseId:any;
  formDetails: any;
  startDate!:string;
  endDate!:string;
  fullName!:string;
  type!:string;
  includeThreadsParticipated = false;
  userParticipation: any;
  limitReachedQuestions = false;
  limitReachedThreadsInitiated = false;
  limitReachedThreadsParticipated = false;
  limit = 5;
  skipThreadsInitiated = 0;
  skipThreadsParticipated = 0;
  userThreads: any;
  grade!:number;
  feedback!:string;
  maxGrade!:number;
  showMoreFeedback=false;
  subCategoryType = ForumType;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private discussionForumService: DiscussionForumService,
    private storageService: StorageService
  ) {
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async ngOnInit() {
    this.getUserIdAndName();
    this.forumEvaluateItemId = await this.activatedRoute.snapshot.paramMap.get('forumId');
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.courseId = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.params.courseId;
    this.userThreadDetails = (await this.discussionForumService.studentActivityResultByUserId(this.forumEvaluateItemId, this.userId, this.courseId))[0];
    this.maxGrade = this.userThreadDetails.maxMarks;
    if(this.userThreadDetails.isGradePublished){
      this.grade = this.userThreadDetails.score;
      this.feedback = this.userThreadDetails.isFeedbackPublished && this.userThreadDetails.feedback;
    }
    this.formDetails = await this.discussionForumService.forumDetail(this.forumEvaluateItemId,this.courseId);
    this.type = this.userThreadDetails.subActivityType;
    this.sanetizeDate(this.formDetails.activitymetadata[0]);
    if(this.type===ForumType.STANDARD_DISCUSSION_FORUM){
      this.userThreads = await this.discussionForumService.getThreadsByUser(this.forumEvaluateItemId, this.userId, this.limit, this.skipThreadsInitiated);
      this.skipThreadsInitiated += 5;
    }
  }

  getUserIdAndName():void{
    const userData = this.storageService.get(StorageKey.USER_DETAILS);
    this.fullName = `${userData.firstName} ${userData.lastName}`;
    this.userId = userData.userId;
  }

  getTitleForCircleProgress():string{
    return `${this.grade}/${this.maxGrade}`;
  }

  getMoreButtonTitle():string{
    if(this.showMoreFeedback){
      return "less";
    }
    return "more";
  }

  checkIfFeedbackExists():boolean{
    if(this.feedback && this.feedback.length>0){
      return true;
    }
    return false;
  }

  sanetizeDate(activityMetadata:any):void{
    this.startDate = moment(activityMetadata.startDate).format("Do MMM YYYY, h:mm a");
    this.endDate = moment(activityMetadata.endDate).format("Do MMM YYYY, h:mm a");
  }

  onScrollDownThreadsInititated(): void {
    this.fetchThreadsInitiated();
  }

  onScrollDownThreadsParticipated(): void {
    this.fetchThreadsParticipated();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

  backToForm():void{
    this.router.navigate(['../'], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
  }
}
