import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdfRoutingModule } from './pdf-routing.module';
import { PdfComponent } from './pdf.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotesModule } from '../../notes/notes.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';

@NgModule({
  declarations: [
    PdfComponent
  ],
  imports: [
    CommonModule,
    PdfRoutingModule,
    NgxExtendedPdfViewerModule,
    MatTooltipModule,
    NotesModule,
    TranslateModule,
    SafePipeModule
  ]
})
export class PdfModule { }
