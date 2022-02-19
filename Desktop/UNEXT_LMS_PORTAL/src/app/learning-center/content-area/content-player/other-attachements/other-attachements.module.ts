import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherAttachementsRoutingModule } from './other-attachements-routing.module';
import { OtherAttachementsComponent } from './other-attachements.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';

@NgModule({
  declarations: [
    OtherAttachementsComponent
  ],
  imports: [
    CommonModule,
    OtherAttachementsRoutingModule,
    MatTooltipModule,
    TranslateModule,
    SafePipeModule
  ]
})
export class OtherAttachementsModule { }
