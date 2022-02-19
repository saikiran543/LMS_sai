import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

import { ExcelRoutingModule } from './excel-routing.module';
import { ExcelComponent } from './excel.component';
import { NotesModule } from '../../notes/notes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
@NgModule({
  declarations: [
    ExcelComponent
  ],
  imports: [
    CommonModule,
    ExcelRoutingModule,
    NgxDocViewerModule,
    NotesModule,
    MatTooltipModule,
    TranslateModule,
    SafePipeModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ExcelModule { }
