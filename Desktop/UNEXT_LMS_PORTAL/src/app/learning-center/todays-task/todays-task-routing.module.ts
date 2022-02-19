import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodaysTaskComponent } from './todays-task.component';

const routes: Routes = [
  {
    path: '',
    component: TodaysTaskComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodaysTaskRoutingModule { }
