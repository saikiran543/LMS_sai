import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramGamificationComponent } from './program-gamification.component';

const routes: Routes = [
  {
    path: '',
    component: ProgramGamificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramGamificationRoutingModule { }
