import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressWrapperComponent } from './progress-wrapper.component';
import { ChartComponent } from '../../chart/chart.component';
import { TopBottomProgressListComponent } from '../../top-bottom-progress-list/top-bottom-progress-list.component';
import { GaugeChartModule } from 'angular-gauge-chart';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from '../../../shared-modules/header/header.module';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [ChartComponent, TopBottomProgressListComponent, ProgressWrapperComponent],
  imports: [
    CommonModule,
    TranslateModule,
    GaugeChartModule,
    HeaderModule,
    MatTooltipModule
  ],
  exports: [ProgressWrapperComponent, ChartComponent, TopBottomProgressListComponent]
})
export class ProgressWrapperModule { }
