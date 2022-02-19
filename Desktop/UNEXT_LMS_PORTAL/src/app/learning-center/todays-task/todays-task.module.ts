import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodaysTaskRoutingModule } from './todays-task-routing.module';
import { TodaysTaskComponent } from './todays-task.component';
import { TodaysTaskService } from './service/todays-task.service';
import { TranslateModule } from '@ngx-translate/core';
import { PopupSelfTaskComponent } from '../calendar/popup-self-task/popup-self-task.component';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';

@NgModule({
  declarations: [TodaysTaskComponent, PopupSelfTaskComponent],
  imports: [
    CommonModule,
    TodaysTaskRoutingModule,
    TranslateModule,
    SafePipeModule,
  ],
  providers: [
    TodaysTaskService
  ]
})
export class TodaysTaskModule { }
