import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RubricPreviewComponent } from './rubric-preview.component';

const routes: Routes = [
  {
    path: '',
    component: RubricPreviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubricPreviewRoutingModule { }
