/* eslint-disable no-trailing-spaces */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearningCenterRoutingModule } from './learning-center-routing.module';
import { LearningCenterComponent } from './learning-center.component';
import { RouterModule } from '@angular/router';
import { CommonUtils } from '../utils/common-utils';
import { CourseListComponent } from './course-list/course-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CKEditorSharedModule } from '../shared/modules/ckeditor-shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionAnswerService } from './course-services/question-answer.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [LearningCenterComponent, CourseListComponent],
  imports: [
    CommonModule,
    LearningCenterRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    CKEditorSharedModule,
    CarouselModule, 
    NgbModule,
    AngularSvgIconModule.forRoot()
  ],
  providers: [
    CommonUtils,
    QuestionAnswerService
  ]
})
export class LearningCenterModule { }
