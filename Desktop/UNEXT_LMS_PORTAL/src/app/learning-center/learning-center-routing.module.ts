import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseListComponent } from './course-list/course-list.component';
import { LearningCenterComponent } from './learning-center.component';

const routes: Routes = [
  {
    path: '',
    component: LearningCenterComponent,
    children: [
      {
        path: '',
        component: CourseListComponent,
        //redirectTo: '1142/content-area',
        //pathMatch: 'full'
      },
      {
        path: ':courseId/dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule)
      },
      {
        path: ':courseId/content-area',
        loadChildren: () => import('./content-area/content-area.module').then(module => module.ContentAreaModule)
      },
      {
        path: ':courseId/leaderboard',
        loadChildren: () => import('../leaderboard/leaderboard.module').then((module) => module.LeaderboardModule)
      },
      {
        path: ':courseId/progress-list-view',
        loadChildren: () => import('./content-area/progress/progress.module').then(module => module.ProgressModule),
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
              label: 'semester 1',
              url: '/'
            },
            {
              label: 'Crash Course in Account & Finance',
              url: '/'
            },
            {
              label: 'Class Progress',
              url: ''
            }
          ]
        }
      },
      {
        path: ':courseId/all-notes',
        loadChildren: () => import('./content-area/notes/notes.module').then(module => module.NotesModule),
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
              label: 'Notes',
              url: ''
            }
          ]
        },
      },
      {
        path: ':courseId/all-qna',
        loadChildren: () => import('./questions-and-answers/questions-and-answers.module').then(module => module.QuestionsAndAnswersModule),
      },
      {
        path: ':courseId/bookmark-list',
        loadChildren: () => import('./bookmark-list/bookmark-list.module').then(module => module.BookmarkListModule),
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
              label: 'Bookmark List',
              url: ''
            }
          ]
        },
      },
      {
        path: ':courseId/discussion-forums',
        loadChildren: () => import('./discussion-forum/discussion-forum.module').then(module => module.DiscussionForumModule),
      },
      {
        path: ':courseId/calendar',
        loadChildren: () => import('./calendar/calendar.module').then(module => module.LearningCenterCalendarModule),
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
              label: 'Calendar',
              url: ''
            }
          ]
        }
      },
      {
        path: ':courseId/course-gamification',
        loadChildren: () => import('./course-gamification/course-gamification.module').then(module => module.CourseGamificationModule)
      },
      {
        path: ':courseId/rubrics/:type',
        loadChildren: () => import('./rubrics/rubrics.module').then((module) => module.RubricsModule),
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
              url: ''
            },
          ]
        }
      },
      {
        path: ':courseId/learning-outcome',
        loadChildren: () => import('./learning-outcome/learning-outcome.module').then((module) => module.LearningOutcomeModule),
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
              label: 'Learning Outcome',
              url: ''
            }
          ]
        }
      },
      {
        path: ':courseId/todays-task',
        loadChildren: () => import ('./todays-task/todays-task.module').then((module) => module.TodaysTaskModule),
        data: {
          title: 'Todays Task',
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
              label: "What's New",
              url: '/'
            },
            {
              label: "Today's Task",
              url: ''
            }
          ]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearningCenterRoutingModule { }
