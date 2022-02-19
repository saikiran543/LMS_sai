import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginLayoutComponent } from '../../login-layout/login-layout.component';
import { LoginFormComponent } from '../../login-layout/login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrSharedModule } from './toastr-shared.module';
import { RouterModule } from '@angular/router';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';

@NgModule({
  declarations: [
    LoginLayoutComponent,
    LoginFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ToastrSharedModule,
    RouterModule,
    SafePipeModule
  ],
  exports: [
    LoginLayoutComponent,
    LoginFormComponent
  ]
})
export class LoginLayoutSharedModule { }
