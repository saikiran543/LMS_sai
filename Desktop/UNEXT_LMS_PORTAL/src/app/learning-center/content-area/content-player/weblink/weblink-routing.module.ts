import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeblinkComponent } from './weblink.component';

const routes: Routes = [
  {
    path: '',
    component: WeblinkComponent,
    data: {
      title: '  ',
      breadcrumb: [
        {
          label: 'Home',
          url: '/'
        },
        {
          label: 'Learning Center',
          url: '/learning-center'
        },
        {
          label: '{{programName}}',
          url: '/'
        },
        {
          label: '{{semester}}',
          url: '/'
        },
        {
          label: 'Content Area',
          url: '/'
        },
        {
          label: '{{topicName}}',
          url: '/'
        },
        {
          label: '{{subtitle}}',
          url: ''
        }
      ]
    },
    children: [{
      path: 'qna',
      loadChildren: () => import('../../shared-modules/content-player-qna-pane/content-player-qna-pane.module').then((module) => module.ContentPlayerQnaPaneModule)
    }, {
      path: 'ratings',
      loadChildren: () => import('../../rating/rating.module').then((module) => module.RatingModule)
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeblinkRoutingModule { }
