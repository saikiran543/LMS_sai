import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RubricManipulationRoutingModule } from './rubric-manipulation-routing.module';
import { RubricManipulationComponent } from './rubric-manipulation.component';
import { RubricStructureModule } from '../rubric-structure/rubric-structure.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CharactersCountPipe } from 'src/app/pipes/characters-count.pipe';

@NgModule({
  declarations: [
    RubricManipulationComponent,
    CharactersCountPipe
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RubricStructureModule,
    RubricManipulationRoutingModule,
    FormsModule,
    MatInputModule
  ]
})
export class RubricManipulationModule { }
