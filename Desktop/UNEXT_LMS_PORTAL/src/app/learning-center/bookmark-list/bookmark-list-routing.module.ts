import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookmarkListComponent } from './bookmark-list.component';

const routes: Routes = [
  {
    path: '',
    component: BookmarkListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookmarkListRoutingModule { }
