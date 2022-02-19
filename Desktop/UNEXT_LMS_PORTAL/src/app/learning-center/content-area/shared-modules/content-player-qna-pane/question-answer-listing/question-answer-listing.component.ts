import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageKey } from 'src/app/enums/storageKey';
import { InfiniteScrollFilterAttributes, QuestionResponse } from 'src/app/learning-center/course-services/question-answer.service';
import { StorageService } from 'src/app/services/storage.service';

const defaultFilterOptions: InfiniteScrollFilterAttributes = {
  limit: 5,
  skip: 0,
};

@Component({
  selector: 'app-question-answer-listing',
  templateUrl: './question-answer-listing.component.html',
  styleUrls: ['./question-answer-listing.component.scss']
})
export class QuestionAnswerListingComponent implements OnInit {

  questionId = '';

  question!: QuestionResponse;

  limitReached = false;

  filterOptions: InfiniteScrollFilterAttributes = defaultFilterOptions;

  constructor(private router: ActivatedRoute, private storageService: StorageService) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params) => {
      const questionId = params.get('questionId');
      if(questionId) {
        this.questionId = questionId;
        this.question = this.storageService.get(StorageKey.CONTENT_PANE_SELECTED_QUESTION);
      }
    });
  }
}
