import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RatingRoutingModule } from './rating-routing.module';
import { RatingComponent } from './rating.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
// import {CharactersCountPipe } from '../../../../app/pipes/characters-count.pipe';
@NgModule({
  declarations: [RatingComponent],
  imports: [
    CommonModule,
    RatingRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TimesAgoPipeModule
  ]
})
export class RatingModule { }
