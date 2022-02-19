import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatRadioModule } from '@angular/material/radio';
import { RubricsListViewComponent } from './rubrics-list-view.component';

@NgModule({
  declarations: [RubricsListViewComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    MatRadioModule
  ],
  exports: [RubricsListViewComponent]
})
export class RubricsListViewModule { }
