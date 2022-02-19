import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RubricEvaluationComponent } from './rubric-evaluation.component';
import { RubricsService } from '../../service/rubrics.service';
import {CKEditorSharedModule} from "../../../../shared/modules/ckeditor-shared.module";
import { EvaluationInstructionsModalComponent } from './evaluation-instructions-modal/evaluation-instructions-modal.component';
@NgModule({
  declarations: [RubricEvaluationComponent, EvaluationInstructionsModalComponent],
  imports: [
    CommonModule,
    CKEditorSharedModule
  ],
  exports: [RubricEvaluationComponent],
  providers: [RubricsService]
})
export class RubricEvaluationModule { }
