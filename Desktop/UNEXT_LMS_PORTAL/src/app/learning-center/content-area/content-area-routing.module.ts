import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './content-area.component';
import { GridComponent } from './grid/grid.component';
import { ListComponent } from './list/list.component';

const manipulationRoutes: Routes = [
  {
    path: 'manipulate/:operation/:type/:id',
    loadChildren: ()=> import('../manipulation/manipulation.module').then(module=>module.ManipulationModule)
  },
  {
    path: 'manipulate/:operation/:type',
    loadChildren: ()=> import('../manipulation/manipulation.module').then(module=>module.ManipulationModule)
  }
];

const contentPlayerRoutes: Routes = [
  {
    path: 'content/:id',
    loadChildren: ()=> import('./content-player/content-player.module').then(module=>module.ContentPlayerModule)
  }
];

const addLearningObjective: Routes = [
  {
    path: 'add-learning-objective/:type/:id/:viewType',
    loadChildren: ()=> import('../learning-outcome/add-learning-objective/add-learning-objective.module').then(module=>module.AddLearningObjectiveModule)
  }
];

const routes: Routes = [
  {
    path: '',
    component: CourseComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ListComponent,
        children: [...manipulationRoutes,...contentPlayerRoutes,...addLearningObjective],
        data: {
          title: 'Learning center',
          breadcrumb: [
            {
              label: 'Home',
              url: '/'
            },
            {
              label: 'Learning Center',
              url: 'learning-center'
            },
            {
              label: 'BBA',
              url: '/'
            },
            {
              label: 'semester1',
              url: '/'
            },
            {
              label: 'Content Area',
              url: '/'
            },
            {
              label: '{{courseName}}',
              url: ''
            }
          ]
        },
      },
      // {
      //   path: 'progress-list',
      //   loadChildren: () => import('./progress/progress.module').then(module => module.ProgressModule)
      // },
      {
        path: 'grid',
        component: GridComponent,
        children: [...manipulationRoutes,...contentPlayerRoutes,...addLearningObjective]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
