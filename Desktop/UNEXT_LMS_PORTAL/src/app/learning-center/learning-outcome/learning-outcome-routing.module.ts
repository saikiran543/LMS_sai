import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningOutcomeComponent } from './learning-outcome.component';

const routes: Routes = [
  {
    path: '',
    component: LearningOutcomeComponent,
    children: [
      {
        path: 'manipulate/:operation/:type/:formType/:parentId',
        loadChildren: ()=> import('../manipulation/manipulation.module').then(module=>module.ManipulationModule)
      },
      {
        path: 'manipulate/:operation/:type/:formType/:parentId/:id',
        loadChildren: ()=> import('../manipulation/manipulation.module').then(module=>module.ManipulationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearningOutcomeRoutingModule { }
