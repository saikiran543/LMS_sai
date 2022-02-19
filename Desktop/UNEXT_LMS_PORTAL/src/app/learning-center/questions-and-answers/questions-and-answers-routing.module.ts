import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QnaRightPanelComponent } from './qna-right-panel/qna-right-panel.component';
import { QuestionsAndAnswersComponent } from './questions-and-answers.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionsAndAnswersComponent,
    children: [
      {
        path: 'question/:questionId',
        component: QnaRightPanelComponent,
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
              label: 'Q & A',
              url: ''
            }
          ]
        },
      }
    ],
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsAndAnswersRoutingModule { }
