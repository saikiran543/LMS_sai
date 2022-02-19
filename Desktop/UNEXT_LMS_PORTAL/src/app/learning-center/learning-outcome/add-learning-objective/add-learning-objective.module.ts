import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLearningObjectiveRoutingModule } from './add-learning-objective-routing.module';
import { AddLearningObjectiveComponent } from './add-learning-objective.component';
import { LearningOutcomeListViewModule } from '../learning-outcome-list-view/learning-outcome-list-view.module';

@NgModule({
  declarations: [AddLearningObjectiveComponent],
  imports: [
    CommonModule,
    AddLearningObjectiveRoutingModule,
    LearningOutcomeListViewModule,
  ]
})
export class AddLearningObjectiveModule { }
