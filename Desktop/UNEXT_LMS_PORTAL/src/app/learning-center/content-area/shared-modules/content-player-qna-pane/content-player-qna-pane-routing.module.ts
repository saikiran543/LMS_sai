import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuestionComponent } from './add-question/add-question.component';
import { ContentPlayerQnaPaneComponent } from './content-player-qna-pane.component';
import { QuestionAnswerListingComponent } from './question-answer-listing/question-answer-listing.component';

const routes: Routes = [
  {
    path: '',
    component: ContentPlayerQnaPaneComponent,
    children: [{
      path: ':questionId',
      component: QuestionAnswerListingComponent
    }]
  }, {
    path: 'questions/add',
    component: AddQuestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentPlayerQnaPaneRoutingModule { }
