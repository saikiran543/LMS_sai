import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumContentListRoutingModule } from './forum-content-list-routing.module';
import { ForumContentListComponent } from './forum-content-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';
import { ToastrSharedModule } from 'src/app/shared/modules/toastr-shared.module';
import { ForumContentQnaThreadsStatisticsModule } from '../shared-modules/forum-content-qna-threads-statistics/forum-content-qna-threads-statistics.module';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import { SortPipe } from 'src/app/pipes/sort.pipe';
import { ForumEvaluateComponent } from '../forum-evaluate/forum-evaluate.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { QuestionAnswerReplyModule } from '../../shared/question-answer-reply/question-answer-reply.module';
import { RubricEvaluationModule } from '../../rubrics/shared/rubric-evaluation/rubric-evaluation.module';
import { ForumContentUserDetailsComponent } from '../forum-content-user-details/forum-content-user-details.component';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DiscussionForumContentModule } from '../shared-modules/discussion-forum-content/discussion-forum-content.module';
import { PdfmakeService } from 'src/app/services/pdfmake.service';
import { DoubtClarificationUserDetailsContentItemModule } from '../doubt-clarification-user-details-content-item/doubt-clarification-user-details-content-item.module';
import { XlsxService } from 'src/app/services/xslx.service';

@NgModule({
  declarations: [ForumContentListComponent, ForumEvaluateComponent, ForumContentUserDetailsComponent, SortPipe],
  imports: [
    CommonModule,
    ForumContentListRoutingModule,
    TranslateModule,
    AngularSvgIconModule.forRoot(),
    Ng7BootstrapBreadcrumbModule,
    ToastrSharedModule,
    ForumContentQnaThreadsStatisticsModule,
    TimesAgoPipeModule,
    NgxDatatableModule,
    QuestionAnswerReplyModule,
    RubricEvaluationModule,
    SafePipeModule,
    NgxPaginationModule,
    InfiniteScrollModule,
    DiscussionForumContentModule,
    DoubtClarificationUserDetailsContentItemModule
  ],
  providers: [SortPipe, PdfmakeService, XlsxService]
})
export class ForumContentListModule { }
