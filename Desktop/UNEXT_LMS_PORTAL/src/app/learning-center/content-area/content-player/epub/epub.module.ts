import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTooltipModule } from '@angular/material/tooltip';
import { NotesModule } from '../../notes/notes.module';
import { TranslateModule } from '@ngx-translate/core';
import { EpubComponent } from './epub.component';
import { EpubRoutingModule } from './epub-routing.module';
import { AngularEpubViewerModule } from '@edunxtv2/unext-epub-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfRoutingModule } from '../pdf/pdf-routing.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
@NgModule({
  declarations: [
    EpubComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EpubRoutingModule,
    MatTooltipModule,
    NotesModule,
    TranslateModule,
    AngularEpubViewerModule,
    PdfRoutingModule,
    NgxExtendedPdfViewerModule,
    SafePipeModule
  ]
})
export class EpubModule { }
