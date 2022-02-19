import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressRoutingModule } from './progress-routing.module';
import { ProgressComponent } from './progress.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ClassProgressListComponent } from './class-progress-list/class-progress-list.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ProgressComponent,
    ClassProgressListComponent
  ],
  imports: [
    CommonModule,
    ProgressRoutingModule,
    NgxDatatableModule,
    AngularSvgIconModule,
    TranslateModule,
    MatProgressBarModule
  ]
})
export class ProgressModule { }
