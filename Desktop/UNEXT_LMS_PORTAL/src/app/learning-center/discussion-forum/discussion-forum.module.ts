import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscussionForumRoutingModule } from './discussion-forum-routing.module';
import { DiscussionForumComponent } from './discussion-forum.component';
import { TranslateModule } from '@ngx-translate/core';
import { ForumInfoPopupComponent } from './creation-and-manipulation/discussion/forum-info-popup/forum-info-popup.component';
import { DiscussionForumService } from './discussion-forum-services/discussion-forum.service';
import { ForumDetailComponent } from './forum-detail/forum-detail.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ForumStatisticsComponent } from './forum-statistics/forum-statistics.component';
import { ToastrSharedModule } from 'src/app/shared/modules/toastr-shared.module';
import { QuestionAnswerReplyModule } from '../shared/question-answer-reply/question-answer-reply.module';
import { RubricEvaluationModule } from '../rubrics/shared/rubric-evaluation/rubric-evaluation.module';
import { ContentPlayerService } from '../course-services/content-player.service';
import { DoubtClarificationContentComponent } from './doubt-clarification-content/doubt-clarification-content.component';
import { ForumContentQnaThreadsStatisticsModule } from './shared-modules/forum-content-qna-threads-statistics/forum-content-qna-threads-statistics.module';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { DiscussionForumContentModule } from './shared-modules/discussion-forum-content/discussion-forum-content.module';
import { StudentPerformanceDetailComponent } from './student-performance-detail/student-performance-detail.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DoubtClarificationUserDetailsContentItemModule } from './doubt-clarification-user-details-content-item/doubt-clarification-user-details-content-item.module';
import { DateTimePickerModule } from 'src/app/shared/modules/date-time-picker.module';
import { PdfmakeService } from 'src/app/services/pdfmake.service';
import { XlsxService } from 'src/app/services/xslx.service';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    DiscussionForumComponent,
    ForumInfoPopupComponent,
    ForumDetailComponent,
    ForumStatisticsComponent,
    DoubtClarificationContentComponent,
    StudentPerformanceDetailComponent,
  ],
  imports: [
    CommonModule,
    DiscussionForumRoutingModule,
    TranslateModule,
    AngularSvgIconModule.forRoot(),
    Ng7BootstrapBreadcrumbModule,
    NgxDatatableModule,
    ToastrSharedModule,
    QuestionAnswerReplyModule,
    RubricEvaluationModule,
    ForumContentQnaThreadsStatisticsModule,
    TimesAgoPipeModule,
    InfiniteScrollModule,
    SafePipeModule,
    DiscussionForumContentModule,
    NgCircleProgressModule.forRoot(),
    DoubtClarificationUserDetailsContentItemModule,
    DateTimePickerModule,
    NgxPaginationModule
  ],
  providers: [
    DiscussionForumService,
    ContentPlayerService,
    PdfmakeService,
    XlsxService
  ]
})
export class DiscussionForumModule { }
