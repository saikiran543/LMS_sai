import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HtmlRoutingModule } from './html-routing.module';
import { HtmlComponent } from './html.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotesModule } from '../../notes/notes.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';

@NgModule({
  declarations: [
    HtmlComponent
  ],
  imports: [
    CommonModule,
    HtmlRoutingModule,
    MatTooltipModule,
    NotesModule,
    TranslateModule,
    SafePipeModule
  ]
})
export class HtmlModule { }
