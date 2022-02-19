import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CkeditorComponent } from '../components/ckeditor/ckeditor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CkeditorComponent
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    ReactiveFormsModule
  ],
  exports: [
    CkeditorComponent
  ]
})
export class CKEditorSharedModule { }
