import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ForumContentQnaThreadsStatisticsComponent } from './forum-content-qna-threads-statistics.component';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';
import { ToastrSharedModule } from 'src/app/shared/modules/toastr-shared.module';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import { FormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { DateTimePickerComponent } from '../components/date-time-picker/date-time-picker.component';

@NgModule({
  declarations: [DateTimePickerComponent],
  imports: [
    CommonModule,
    TranslateModule,
    AngularSvgIconModule.forRoot(),
    Ng7BootstrapBreadcrumbModule,
    ToastrSharedModule,
    TimesAgoPipeModule,
    FormsModule,
    DpDatePickerModule,

  ],
  exports: [DateTimePickerComponent],
})
export class DateTimePickerModule { }
