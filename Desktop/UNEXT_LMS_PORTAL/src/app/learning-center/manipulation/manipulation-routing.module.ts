import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { ManipulationComponent } from './manipulation.component';

const rubricSelectionRoute: Route = {
  path: 'rubric/:rubricOperation/:type',
  loadChildren: ()=> import('../rubrics/rubric-selection/rubric-selection.module').then(module=>module.RubricSelectionModule)
};

const allLearningObjective: Route = {
  path: 'learning-objective/:viewType',
  loadChildren: ()=> import('../learning-outcome/add-learning-objective/add-learning-objective.module').then(module=>module.AddLearningObjectiveModule)
};

const routes: Routes = [
  {
    path: '',
    component: ManipulationComponent,
    children: [allLearningObjective, rubricSelectionRoute]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManipulationRoutingModule { }