import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionThreadComponent } from './question-thread/question-thread.component';
import { AnswerReplyComponent } from './answer-reply/answer-reply.component';
import { GiveReplyComponent } from './give-reply/give-reply.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CKEditorSharedModule } from 'src/app/shared/modules/ckeditor-shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditAnswerReplyComponent } from './edit-answer-reply/edit-answer-reply.component';
import { EditQuestionThreadComponent } from './edit-question-thread/edit-question-thread.component';
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [QuestionThreadComponent, AnswerReplyComponent, GiveReplyComponent, EditAnswerReplyComponent, EditQuestionThreadComponent, AskQuestionComponent],
  imports: [
    CommonModule,
    AngularSvgIconModule,
    InfiniteScrollModule,
    CKEditorSharedModule,
    ReactiveFormsModule,
    SafePipeModule,
    TimesAgoPipeModule,
    TranslateModule
  ],
  exports: [QuestionThreadComponent, AnswerReplyComponent, GiveReplyComponent]
})
export class QuestionAnswerReplyModule { }
