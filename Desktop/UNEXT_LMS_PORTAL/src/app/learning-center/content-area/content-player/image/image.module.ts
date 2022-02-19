import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageRoutingModule } from './image-routing.module';
import { ImageComponent } from './image.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotesModule } from '../../notes/notes.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
@NgModule({
  declarations: [
    ImageComponent
  ],
  imports: [
    CommonModule,
    ImageRoutingModule,
    MatTooltipModule,
    NotesModule,
    TranslateModule,
    SafePipeModule
  ]
})
export class ImageModule { }
