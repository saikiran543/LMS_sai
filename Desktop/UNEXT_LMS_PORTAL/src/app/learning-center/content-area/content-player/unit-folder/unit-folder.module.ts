import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitFolderRoutingModule } from './unit-folder-routing.module';
import { UnitFolderComponent } from './unit-folder.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';

@NgModule({
  declarations: [
    UnitFolderComponent
  ],
  imports: [
    CommonModule,
    UnitFolderRoutingModule,
    MatTooltipModule,
    TranslateModule,
    SafePipeModule
  ]
})
export class UnitFolderModule { }
