import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RubricManipulationComponent } from './rubric-manipulation.component';

const routes: Routes = [
  {
    path: '',
    component: RubricManipulationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubricManipulationRoutingModule { }
