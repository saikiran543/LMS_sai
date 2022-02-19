import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RubricPreviewRoutingModule } from './rubric-preview-routing.module';
import { RubricPreviewComponent } from './rubric-preview.component';
import { RubricStructureModule } from '../rubric-structure/rubric-structure.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RubricPreviewComponent,
  ],
  imports: [
    CommonModule,
    RubricStructureModule,
    TranslateModule,
    ReactiveFormsModule,
    RubricPreviewRoutingModule
  ],
  exports: [RubricPreviewComponent]
})
export class RubricPreviewModule { }
