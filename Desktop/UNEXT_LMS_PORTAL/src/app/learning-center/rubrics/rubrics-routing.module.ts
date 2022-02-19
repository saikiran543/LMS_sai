import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RubricsComponent } from './rubrics.component';

const routes: Routes = [
  {
    path: '',
    component: RubricsComponent
  },
  {
    path: 'manipulate/:operation',
    loadChildren: ()=> import('../rubrics/rubric-manipulation/rubric-manipulation.module').then(module=>module.RubricManipulationModule),
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
          label: 'Crash Course in Account & Finance',
          url: '/'
        },
        {
          label: 'Content Area',
          url: '/'
        },
        {
          label: 'Rubrics',
          url: '/'
        },
        {
          label: 'Create Rubric',
          url: ''
        }
      ]
    }
  },
  {
    path: 'manipulate/:operation/:rubricId',
    loadChildren: ()=> import('../rubrics/rubric-manipulation/rubric-manipulation.module').then(module=>module.RubricManipulationModule),
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
          label: 'Crash Course in Account & Finance',
          url: '/'
        },
        {
          label: 'Content Area',
          url: '/'
        },
        {
          label: 'Rubrics',
          url: '/'
        },
        {
          label: 'Edit Rubric',
          url: ''
        }
      ]
    }
  },
  {
    path: 'preview/:rubricId',
    loadChildren: ()=> import('../rubrics/rubric-preview/rubric-preview.module').then(module=>module.RubricPreviewModule),
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
          label: 'Crash Course in Account & Finance',
          url: '/'
        },
        {
          label: 'Content Area',
          url: '/'
        },
        {
          label: 'Rubrics',
          url: '/'
        },
        {
          label: 'Preview Rubric',
          url: ''
        }
      ]
    }
  },
  {
    path: ':rubricOperation/:type',
    loadChildren: ()=> import('../rubrics/rubric-selection/rubric-selection.module').then(module=>module.RubricSelectionModule),
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
          label: 'Crash Course in Account & Finance',
          url: '/'
        },
        {
          label: 'Content Area',
          url: '/'
        },
        {
          label: 'Rubrics',
          url: '/'
        },
        {
          label: 'Selection Rubric',
          url: ''
        }
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubricsRoutingModule { }
