import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScormRoutingModule } from './scorm-routing.module';
import { ScormComponent } from './scorm.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Scorm1_2Service } from './scorm-services/scorm1_2.service';
import { Scorm2004Service } from './scorm-services/scorm-2004.service';
import { NotesModule } from '../../notes/notes.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';

@NgModule({
  declarations: [
    ScormComponent
  ],
  imports: [
    CommonModule,
    ScormRoutingModule,
    MatTooltipModule,
    NotesModule,
    TranslateModule,
    SafePipeModule
  ],
  providers: [Scorm1_2Service , Scorm2004Service]
})
export class ScormModule { }
