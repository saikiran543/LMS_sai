import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RubricsRoutingModule } from './rubrics-routing.module';
import { RubricFilterComponent } from './rubric-filter/rubric-filter.component';
import { RubricsComponent } from './rubrics.component';
import { DialogComponent } from './rubric-manipulation/dialog/dialog.component';
import { RubricInformationComponent } from './rubric-manipulation/rubric-information/rubric-information.component';
import { TranslateModule } from '@ngx-translate/core';
import { RubricSelectionComponent } from './rubric-selection/rubric-selection.component';
import { RubricsListViewModule } from './rubrics-list-view/rubrics-list-view.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [
    RubricFilterComponent,
    RubricsComponent,
    DialogComponent,
    RubricInformationComponent,
    RubricSelectionComponent
  ],
  imports: [
    CommonModule,
    RubricsRoutingModule,
    TranslateModule,
    RubricsListViewModule,
    AngularSvgIconModule
  ]
})
export class RubricsModule { }
