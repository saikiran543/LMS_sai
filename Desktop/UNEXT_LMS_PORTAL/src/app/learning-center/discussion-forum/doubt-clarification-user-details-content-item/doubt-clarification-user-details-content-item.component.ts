/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Input } from '@angular/core';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';

const defaultFilterOptions = {
  limit: 5,
  skip: 0,
};

@Component({
  selector: 'app-doubt-clarification-user-details-content-item',
  templateUrl: './doubt-clarification-user-details-content-item.component.html',
  styleUrls: ['./doubt-clarification-user-details-content-item.component.scss']
})
export class DoubtClarificationUserDetailsContentItemComponent {

  @Input()
  content: any;

  @Input('userId')
  userId!: string;

  private limitReachedQuestions = false;
  private includeThreadsParticipated = false;

  public filterOptions = {...defaultFilterOptions}

  public currentActiveTab = 'questions-posted';

  constructor(private discussionForumService: DiscussionForumService, private elementRef: ElementRef) { }

  async toggleShow(elementId: any) {
    const toggleDivClass = (this.elementRef.nativeElement.querySelector("#toggle_"+elementId) as HTMLDivElement)?.classList;
    const arrowTopClass = (this.elementRef.nativeElement.querySelector("#arrow_top_"+elementId) as HTMLDivElement)?.classList;
    const arrowBottomClass = (this.elementRef.nativeElement.querySelector("#arrow_bottom_"+elementId) as HTMLDivElement)?.classList;
    const contentDivClass = (this.elementRef.nativeElement.querySelector("#content_"+elementId) as HTMLDivElement)?.classList;
    if(toggleDivClass.contains("show")){
      toggleDivClass.remove("show");
      toggleDivClass.add("hide");
      arrowTopClass.remove("show");
      arrowTopClass.add("hide");
      arrowBottomClass.remove("hide");
      arrowBottomClass.add("show");
      contentDivClass.remove("border-color");
    }else{
      this.updateQuestions(elementId);
      toggleDivClass.remove("hide");
      toggleDivClass.add("show");
      arrowTopClass.remove("hide");
      arrowTopClass.add("show");
      arrowBottomClass.remove("show");
      arrowBottomClass.add("hide");
      contentDivClass.add("border-color");
    }
  }

  async updateQuestions(elementId: string, answersGivenTabTrigger = false) {
    this.includeThreadsParticipated = answersGivenTabTrigger;
    if(answersGivenTabTrigger) {
      this.includeThreadsParticipated = true;
      this.currentActiveTab = 'answers-given';
    } else {
      this.includeThreadsParticipated = false;
      this.currentActiveTab = 'questions-posted';
    }
    this.content.questions = [];
    this.limitReachedQuestions = false;
    this.filterOptions = {...defaultFilterOptions};
    const contentQuestions = await this.discussionForumService.getThreadsByUser(elementId, this.userId, this.filterOptions.limit, this.filterOptions.skip, this.includeThreadsParticipated);
    this.content.questions.push(...contentQuestions.questions);
    this.filterOptions.skip+=5;
  }

  public async fetchQuestions(element: any): Promise<void> {
    if(!this.limitReachedQuestions) {
      const response = await this.discussionForumService.getThreadsByUser(element.elementId, this.userId, this.filterOptions.limit, this.filterOptions.skip, this.includeThreadsParticipated);
      if(!response.questions.length) {
        this.limitReachedQuestions = true;
        return;
      }
      const distinctBatch = response.questions.every((question: any) => element.questions.map((ele: any) => ele._id).includes(question._id));
      if(!distinctBatch) {
        element.questions.push(...response.questions);
      }
      this.filterOptions.skip+=5;
    }
  }

  onScrollDownQuestions(element: any): void {
    this.fetchQuestions(element);
  }
}
