import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { FilterComponent } from '../../progress/filter/filter.component';

@NgModule({
  declarations: [HeaderComponent, FilterComponent],
  imports: [
    CommonModule
  ],
  exports: [HeaderComponent, FilterComponent]
})
export class HeaderModule { }
