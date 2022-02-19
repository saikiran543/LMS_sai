import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassProgressListComponent } from './class-progress-list/class-progress-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClassProgressListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgressRoutingModule { }
