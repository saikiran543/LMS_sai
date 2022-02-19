import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentPlayerRoutingModule } from './content-player-routing.module';
import { ContentPlayerComponent } from './content-player.component';
import { ContentPlayerService } from '../../course-services/content-player.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { ProgressWrapperModule } from '../progress/shared/progress-wrapper/progress-wrapper.module';

@NgModule({
  declarations: [
    ContentPlayerComponent
  ],
  imports: [
    CommonModule,
    ContentPlayerRoutingModule,
    TranslateModule,
    MatTooltipModule,
    SafePipeModule,
    ProgressWrapperModule
  ],
  providers: [ContentPlayerService]
})
export class ContentPlayerModule { }
