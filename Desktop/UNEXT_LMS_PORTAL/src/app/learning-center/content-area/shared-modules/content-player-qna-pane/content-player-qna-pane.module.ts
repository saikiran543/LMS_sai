import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentPlayerQnaPaneComponent } from './content-player-qna-pane.component';
import { ContentPlayerQnaPaneRoutingModule } from './content-player-qna-pane-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QuestionAnswerListingComponent } from './question-answer-listing/question-answer-listing.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { QuestionAnswerReplyModule } from '../../../shared/question-answer-reply/question-answer-reply.module';
import { AddQuestionComponent } from './add-question/add-question.component';
import { CKEditorSharedModule } from '../../../../shared/modules/ckeditor-shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContentPlayerQnaPaneComponent,
    QuestionAnswerListingComponent,
    AddQuestionComponent,
  ],
  imports: [
    CommonModule,
    ContentPlayerQnaPaneRoutingModule,
    InfiniteScrollModule,
    AngularSvgIconModule.forRoot(),
    QuestionAnswerReplyModule,
    ReactiveFormsModule,
    CKEditorSharedModule,
    TranslateModule,
  ]
})
export class ContentPlayerQnaPaneModule { }
