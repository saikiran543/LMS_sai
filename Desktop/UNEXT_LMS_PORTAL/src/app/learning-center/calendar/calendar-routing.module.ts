import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
    children: [
      {
        path: 'manipulate/:operation/:type',
        loadChildren: ()=> import('../manipulation/manipulation.module').then(module=>module.ManipulationModule)
      },
      {
        path: 'manipulate/:operation/:type/:id',
        loadChildren: ()=> import('../manipulation/manipulation.module').then(module=>module.ManipulationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
 