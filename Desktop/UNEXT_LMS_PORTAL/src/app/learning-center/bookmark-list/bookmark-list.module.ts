import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookmarkListRoutingModule } from './bookmark-list-routing.module';
import { BookmarkListComponent } from './bookmark-list.component';

@NgModule({
  declarations: [
    BookmarkListComponent
  ],
  imports: [
    CommonModule,
    BookmarkListRoutingModule
  ]
})
export class BookmarkListModule { }
