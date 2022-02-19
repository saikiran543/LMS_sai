import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeblinkRoutingModule } from './weblink-routing.module';
import { WeblinkComponent } from './weblink.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotesModule } from '../../notes/notes.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';

@NgModule({
  declarations: [
    WeblinkComponent
  ],
  imports: [
    CommonModule,
    WeblinkRoutingModule,
    MatTooltipModule,
    NotesModule,
    TranslateModule,
    SafePipeModule
  ]
})
export class WeblinkModule { }
