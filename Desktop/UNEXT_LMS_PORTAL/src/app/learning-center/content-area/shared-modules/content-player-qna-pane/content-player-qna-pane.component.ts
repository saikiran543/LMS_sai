import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageKey } from 'src/app/enums/storageKey';
import { UserRoles } from 'src/app/enums/userRoles';
import { InfiniteScrollFilterAttributes, QuestionAnswerService, QuestionResponse } from 'src/app/learning-center/course-services/question-answer.service';
import { StorageService } from 'src/app/services/storage.service';

const defaultFilterOptions: InfiniteScrollFilterAttributes = {
  limit: 5,
  skip: 0,
};

@Component({
  selector: 'app-content-player-qna-pane',
  templateUrl: './content-player-qna-pane.component.html',
  styleUrls: ['./content-player-qna-pane.component.scss']
})
export class ContentPlayerQnaPaneComponent implements OnInit {

  throttle = 300;
  scrollDistance = 1;

  questions: QuestionResponse[] = [];

  totalQuestions = 0;

  limitReached = false;

  showQuestionListing = true;

  elementId = '';

  filterOptions: InfiniteScrollFilterAttributes = {...defaultFilterOptions};

  userCurrentRole!: UserRoles;

  constructor(private route: ActivatedRoute, private router: Router, private questionAnswerService: QuestionAnswerService, private storageService: StorageService, private ngbModal: NgbModal) {}

  ngOnInit(): void {
    this.route?.parent?.parent?.parent?.parent?.paramMap.subscribe(params => {
      const elementId = params.get('id');
      if(elementId) {
        this.elementId = elementId;
      }
    });
    this.userCurrentRole = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    this.fetchQuestions();
  }

  get isStudent(): boolean {
    return this.userCurrentRole === UserRoles.STUDENT;
  }

  private async fetchQuestions(): Promise<void> {
    if(!this.limitReached) {
      const {elementId, filterOptions} = this;
      const response = await this.questionAnswerService.getFilteredQuestionsByElementId(elementId, filterOptions);
      if(!response.questions.length) {
        this.limitReached = true;
        return;
      }
      if(!this.totalQuestions) {
        this.totalQuestions = response.totalQuestion;
      }
      const distinctQuestion = response.questions.every((question) => this.questions.map((ele) => ele._id).includes(question._id));
      if(!distinctQuestion) {
        this.questions.push(...response.questions);
      }
      filterOptions.skip+=5;
    }
  }

  onScrollDown(): void {
    this.fetchQuestions();
  }

  navigateBack(): void {
    this.showQuestionListing = true;
    this.navigate('./');
  }

  navigateToListing(question: QuestionResponse): void {
    this.storageService.set(StorageKey.CONTENT_PANE_SELECTED_QUESTION, question);
    this.navigate(question.questionId);
    this.showQuestionListing = false;
  }

  private navigate(path: string): void {
    this.router.navigate([path], {relativeTo: this.route, queryParamsHandling: 'merge'});
  }

  ask(): void {
    this.navigate('questions/add');
  }
  receiveDeletedQuestionId(questionIdToBeDeleted: string):void{
    this.questions = this.questions.filter((question:QuestionResponse) =>question.questionId !== questionIdToBeDeleted);
    this.totalQuestions-=1;
  }
  ngOnDestroy(): void {
    this.questions = [];
    this.limitReached = false;
    this.showQuestionListing = true;
    this.filterOptions = {...defaultFilterOptions};
  }
}
