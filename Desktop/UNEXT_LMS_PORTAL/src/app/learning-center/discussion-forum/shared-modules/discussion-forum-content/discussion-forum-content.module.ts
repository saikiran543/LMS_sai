import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscussionForumContentComponent } from './discussion-forum-content.component';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrSharedModule } from 'src/app/shared/modules/toastr-shared.module';

@NgModule({
  declarations: [DiscussionForumContentComponent],
  imports: [
    CommonModule,
    SafePipeModule,
    TimesAgoPipeModule,
    TranslateModule,
    ToastrSharedModule
  ],
  exports: [DiscussionForumContentComponent]
})
export class DiscussionForumContentModule { }
