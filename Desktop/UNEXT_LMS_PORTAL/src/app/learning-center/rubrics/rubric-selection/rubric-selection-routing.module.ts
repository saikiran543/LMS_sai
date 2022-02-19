import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RubricSelectionComponent } from './rubric-selection.component';

const routes: Routes = [
  {
    path: '',
    component: RubricSelectionComponent
  },
  {
    path: 'preview/:rubricId',
    loadChildren: ()=> import('../rubric-preview/rubric-preview.module').then(module=>module.RubricPreviewModule)
  },
  {
    path: ':operation/:type',
    loadChildren: ()=> import('./rubric-selection.module').then(module=>module.RubricSelectionModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubricSelectionRoutingModule { }
