import { ToastrSharedModule } from 'src/app/shared/modules/toastr-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManipulationComponent } from './manipulation.component';
import { UnitComponent } from '../content-area/creation-and-manipulation/unit/unit.component';
import { FolderComponent } from '../content-area/creation-and-manipulation/folder/folder.component';
import { ContentComponent } from '../content-area/creation-and-manipulation/content/content.component';
import { ManipulationRoutingModule } from './manipulation-routing.module';
import { LocationSelectionComponent } from './location-selection/location-selection.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadSharedModule } from 'src/app/shared/modules/file-upload-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CKEditorSharedModule } from 'src/app/shared/modules/ckeditor-shared.module';
import { CommonUtils } from 'src/app/utils/common-utils';
import { DiscussionComponent } from '../discussion-forum/creation-and-manipulation/discussion/discussion.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { LearningOutcomeModelComponent } from '../learning-outcome/creation-and-manipulation/learning-outcome-model/learning-outcome-model.component';
import { DiscussionForumService } from '../course-services/discussion-forum.service';
import { DateTimePickerModule } from 'src/app/shared/modules/date-time-picker.module';
@NgModule({
  declarations: [
    ManipulationComponent,
    UnitComponent,
    FolderComponent,
    ContentComponent,
    LocationSelectionComponent,
    DiscussionComponent,
    LearningOutcomeModelComponent
  ],
  imports: [
    CommonModule,
    ManipulationRoutingModule,
    MatTreeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTreeModule,
    TranslateModule,
    FileUploadSharedModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrSharedModule,
    NgbModule,
    AngularSvgIconModule,
    CKEditorSharedModule,
    DpDatePickerModule,
    FormsModule,
    DateTimePickerModule
  ],
  providers: [
    NgbDropdown,
    NgbActiveModal,
    CommonUtils,
    DiscussionForumService
  ]
})
export class ManipulationModule { }
