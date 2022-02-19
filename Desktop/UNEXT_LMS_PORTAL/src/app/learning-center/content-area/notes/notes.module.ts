import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesComponent } from './notes.component';
import { NotesRoutingModule } from './notes-routing.module';
import { NotesRightPaneComponent } from './notes-right-pane/notes-right-pane.component';
import { NotesLeftPaneComponent } from './notes-left-pane/notes-left-pane.component';
// import { TocComponent } from '../layout/left-nav/toc/toc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonUtils } from 'src/app/utils/common-utils';
import { TranslateModule } from '@ngx-translate/core';
import { CKEditorSharedModule } from 'src/app/shared/modules/ckeditor-shared.module';
import { ToastrSharedModule } from 'src/app/shared/modules/toastr-shared.module';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { MobileHeaderModule } from '../../shared/mobile-header/mobile-header.module';

@NgModule({
  declarations: [
    NotesComponent,
    NotesRightPaneComponent,
    NotesLeftPaneComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NotesRoutingModule,
    CKEditorSharedModule,
    TranslateModule,
    ToastrSharedModule,
    Ng7BootstrapBreadcrumbModule,
    AngularSvgIconModule.forRoot(),
    SafePipeModule,
    MobileHeaderModule
  ],
  providers: [
    // TocComponent,
    CommonUtils,
    NotesLeftPaneComponent
  ],
  exports: [
    CommonModule,
    NotesRightPaneComponent
  ]
})
export class NotesModule { }
