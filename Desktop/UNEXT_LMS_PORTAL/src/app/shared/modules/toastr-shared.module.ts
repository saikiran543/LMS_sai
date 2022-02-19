import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../toast/toast.component';
import { ToastContainerModule, ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    ToastComponent
  ],
  imports: [
    CommonModule,
    ToastContainerModule,
    ToastrModule.forRoot(),

  ],
  exports: [
    ToastComponent
  ]
})
export class ToastrSharedModule { }
