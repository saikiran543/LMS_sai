import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearningOutcomeRoutingModule } from './learning-outcome-routing.module';
import { LearningOutcomeComponent } from './learning-outcome.component';
import { TranslateModule } from '@ngx-translate/core';
import { LearningOutcomeListViewModule } from './learning-outcome-list-view/learning-outcome-list-view.module';

@NgModule({
  declarations: [
    LearningOutcomeComponent],
  imports: [
    CommonModule,
    LearningOutcomeRoutingModule,
    TranslateModule,
    LearningOutcomeListViewModule
  ]
})
export class LearningOutcomeModule { }
