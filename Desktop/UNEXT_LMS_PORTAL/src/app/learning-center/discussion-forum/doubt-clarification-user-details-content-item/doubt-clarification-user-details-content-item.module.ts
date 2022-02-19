import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoubtClarificationUserDetailsContentItemComponent } from './doubt-clarification-user-details-content-item.component';
import { QuestionAnswerReplyModule } from '../../shared/question-answer-reply/question-answer-reply.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DoubtClarificationUserDetailsContentItemComponent
  ],
  imports: [
    CommonModule,
    QuestionAnswerReplyModule,
    InfiniteScrollModule,
    TranslateModule
  ],
  exports: [
    DoubtClarificationUserDetailsContentItemComponent,
  ],
})
export class DoubtClarificationUserDetailsContentItemModule { }
