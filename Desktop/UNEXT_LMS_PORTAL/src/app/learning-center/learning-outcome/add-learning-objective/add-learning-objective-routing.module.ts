import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLearningObjectiveComponent } from './add-learning-objective.component';

const routes: Routes = [
  {
    path: '',
    component: AddLearningObjectiveComponent,
    children: [
      {
        path: 'manipulate/:operation/:type/:formType/:parentId',
        loadChildren: ()=> import('../../manipulation/manipulation.module').then(module=>module.ManipulationModule)
      },
      {
        path: 'manipulate/:operation/:type/:formType/:parentId/:id',
        loadChildren: ()=> import('../../manipulation/manipulation.module').then(module=>module.ManipulationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddLearningObjectiveRoutingModule { }
