import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseRoutingModule } from './content-area-routing.module';
import { CourseComponent } from './content-area.component';
import { ChecklistDatabase, ListComponent } from './list/list.component';
import { GridComponent } from './grid/grid.component';
import { FacultyCourseViewComponent } from './list/faculty-course-view/faculty-course-view.component';
import { StudentCourseViewComponent } from './list/student-course-view/student-course-view.component';
import { ContentBuilderComponent } from './content-builder/content-builder.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { AlertModalComponent } from 'src/app/shared/components/alert-modal/alert-modal.component';
import { ContentPreviewComponent } from './content-preview/content-preview.component';
import { ToastrModule } from 'ngx-toastr';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PerfectScrollbarModule,PerfectScrollbarConfigInterface,PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { ProgressWrapperModule } from './progress/shared/progress-wrapper/progress-wrapper.module';
import { ProgressModule } from './progress/progress.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

@NgModule({
  declarations: [
    CourseComponent,
    ListComponent,
    GridComponent,
    FacultyCourseViewComponent,
    StudentCourseViewComponent,
    ContentBuilderComponent,
    AlertModalComponent,
    ContentPreviewComponent,
    TimePipe
  ],
  imports: [
    CommonModule,
    CourseRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTreeModule,
    TranslateModule,
    ToastrModule,
    PerfectScrollbarModule,
    ProgressWrapperModule,
    ProgressModule,
    AngularSvgIconModule.forRoot()
  ],
  providers: [ChecklistDatabase,{provide: PERFECT_SCROLLBAR_CONFIG,useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}]
})
export class ContentAreaModule { }
