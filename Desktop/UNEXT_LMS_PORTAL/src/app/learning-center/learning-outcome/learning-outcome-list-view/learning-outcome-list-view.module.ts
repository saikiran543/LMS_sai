import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningOutcomeListViewComponent } from './learning-outcome-list-view.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [LearningOutcomeListViewComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule
  ],
  exports: [LearningOutcomeListViewComponent]
})
export class LearningOutcomeListViewModule { }
