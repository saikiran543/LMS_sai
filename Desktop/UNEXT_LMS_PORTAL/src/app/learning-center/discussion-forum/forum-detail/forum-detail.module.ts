import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';
import { ToastrSharedModule } from 'src/app/shared/modules/toastr-shared.module';
import { ForumDetailComponent } from './forum-detail.component';
import { ForumContentQnaThreadsStatisticsModule } from '../shared-modules/forum-content-qna-threads-statistics/forum-content-qna-threads-statistics.module';
import { ForumContentQnaThreadsStatisticsComponent } from '../shared-modules/forum-content-qna-threads-statistics/forum-content-qna-threads-statistics.component';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import { SortPipe } from 'src/app/pipes/sort.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [ForumDetailComponent, ForumContentQnaThreadsStatisticsComponent,
    SortPipe
  ],
  imports: [
    CommonModule,
    TranslateModule,
    InfiniteScrollModule,
    AngularSvgIconModule.forRoot(),
    Ng7BootstrapBreadcrumbModule,
    ToastrSharedModule,
    ForumContentQnaThreadsStatisticsModule,
    TimesAgoPipeModule,
  ],
  providers: [SortPipe]
})
export class ForumDetailModule { }
