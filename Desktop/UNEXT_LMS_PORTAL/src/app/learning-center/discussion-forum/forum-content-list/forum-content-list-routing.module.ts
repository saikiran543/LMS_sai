import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumType } from 'src/app/enums/forumType';
import { ForumContentUserDetailsComponent } from '../forum-content-user-details/forum-content-user-details.component';
import { ForumEvaluateComponent } from '../forum-evaluate/forum-evaluate.component';
import { StudentPerformanceDetailComponent } from '../student-performance-detail/student-performance-detail.component';
import { ForumContentListComponent } from './forum-content-list.component';

const routes: Routes = [
  { path: '', redirectTo: ForumType.STANDARD_DISCUSSION_FORUM },
  {
    path: ':forumType',
    component: ForumContentListComponent,
  },
  {
    path: 'forum-evaluate/:forumId',
    component: ForumEvaluateComponent,
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
          label: 'semester',
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
    path: 'forum-evaluate/forum-content-user-details/:forumId',
    component: ForumContentUserDetailsComponent,
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
          label: 'semester',
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
    path: 'forum-statistics/forum-content-user-details/:forumId',
    component: ForumContentUserDetailsComponent,
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
          label: 'semester',
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
    path: 'forum-performance/user-performance/:forumId',
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
          label: 'semester',
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumContentListRoutingModule { }
