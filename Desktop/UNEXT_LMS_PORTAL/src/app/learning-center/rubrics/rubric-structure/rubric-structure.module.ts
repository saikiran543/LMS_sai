import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RubricStructureComponent } from './rubric-structure.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    RubricStructureComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DragDropModule,
    AngularSvgIconModule
  ],
  exports: [
    RubricStructureComponent
  ]
})
export class RubricStructureModule { }
