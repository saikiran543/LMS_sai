import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NotesRightPaneComponent } from './notes-right-pane/notes-right-pane.component';
import { NotesComponent } from './notes.component';

const routes: Routes = [
  {
    path: '',
    component: NotesComponent,
    children: [
      {
        path: ':noteId',
        component: NotesRightPaneComponent,
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
              label: 'Notes',
              url: ''
            }
          ]
        },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule,],
  exports: [RouterModule]
})
export class NotesRoutingModule { }
