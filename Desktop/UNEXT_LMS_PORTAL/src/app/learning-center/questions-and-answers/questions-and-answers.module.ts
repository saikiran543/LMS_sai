import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionsAndAnswersRoutingModule } from './questions-and-answers-routing.module';
import { QuestionsAndAnswersComponent } from './questions-and-answers.component';
import { QnaLeftPanelComponent } from './qna-left-panel/qna-left-panel.component';
import { QnaRightPanelComponent } from './qna-right-panel/qna-right-panel.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QuestionAnswerReplyModule } from '../shared/question-answer-reply/question-answer-reply.module';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import { MobileHeaderModule } from '../shared/mobile-header/mobile-header.module';

@NgModule({
  declarations: [
    QuestionsAndAnswersComponent,
    QnaLeftPanelComponent,
    QnaRightPanelComponent
  ],
  imports: [
    CommonModule,
    QuestionsAndAnswersRoutingModule,
    QuestionAnswerReplyModule,
    AngularSvgIconModule.forRoot(),
    InfiniteScrollModule,
    TimesAgoPipeModule,
    MobileHeaderModule
  ]
})
export class QuestionsAndAnswersModule { }
