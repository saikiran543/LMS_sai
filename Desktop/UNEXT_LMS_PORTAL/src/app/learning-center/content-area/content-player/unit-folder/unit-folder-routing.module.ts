import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitFolderComponent } from './unit-folder.component';

const routes: Routes = [
  {
    path: '',
    component: UnitFolderComponent,
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitFolderRoutingModule { }
