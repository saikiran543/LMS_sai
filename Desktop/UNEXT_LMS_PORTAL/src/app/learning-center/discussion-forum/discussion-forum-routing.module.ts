import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscussionForumComponent } from './discussion-forum.component';
import { DoubtClarificationContentComponent } from './doubt-clarification-content/doubt-clarification-content.component';
import { ForumDetailComponent } from './forum-detail/forum-detail.component';
import { ForumStatisticsComponent } from './forum-statistics/forum-statistics.component';
import { StudentPerformanceDetailComponent } from './student-performance-detail/student-performance-detail.component';

const manipulationRoutes: Routes = [{
  path: 'manipulate/:operation/:type/:forumType/:id',
  loadChildren: ()=> import('../manipulation/manipulation.module').then(module=>module.ManipulationModule)
},{
  path: 'manipulate/:operation/:type/:forumType',
  loadChildren: () => import('../manipulation/manipulation.module').then(module => module.ManipulationModule)
}, {
  path: 'manipulate/:operation/:type',
  loadChildren: () => import('../manipulation/manipulation.module').then(module => module.ManipulationModule)
},
{
  path: '',
  loadChildren: () => import('./forum-content-list/forum-content-list.module').then(module => module.ForumContentListModule),
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
        label: 'Discussion Forums',
        url: ''
      }
    ]
  },
},
{
  path: 'forum-detail/:forumId',
  component: ForumDetailComponent,
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
        label: 'through the explanation',
        url: ''
      }
    ]
  },
},
{
  path: 'forum-detail/:forumId/my-performance',
  component: StudentPerformanceDetailComponent,
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
        label: 'through the explanation',
        url: ''
      }
    ]
  },
},

{
  path: 'forum-statistics/:forumId',
  component: ForumStatisticsComponent,
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
        label: 'through the explanation',
        url: ''
      }
    ]
  },
},
{
  path: 'doubt-clarification-content/:forumId',
  component: DoubtClarificationContentComponent,
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
        label: 'through the explanation',
        url: ''
      }
    ]
  },
},

];

const routes: Routes = [{
  path: '',
  component: DiscussionForumComponent,
  children: [...manipulationRoutes]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussionForumRoutingModule { }
