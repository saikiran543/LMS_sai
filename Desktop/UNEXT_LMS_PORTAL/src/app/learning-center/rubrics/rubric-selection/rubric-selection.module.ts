import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RubricSelectionRoutingModule } from './rubric-selection-routing.module';
import { RubricListDialogComponent } from './rubric-list-dialog/rubric-list-dialog.component';
import { RubricsListViewModule } from '../rubrics-list-view/rubrics-list-view.module';
import { RubricPreviewModule } from '../rubric-preview/rubric-preview.module';

@NgModule({
  declarations: [
    RubricListDialogComponent,
  ],
  imports: [
    CommonModule,
    RubricSelectionRoutingModule,
    RubricsListViewModule,
    RubricPreviewModule
  ],
})
export class RubricSelectionModule { }
