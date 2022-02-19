import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { PreviewLayoutComponent } from '../components/preview-layout/preview-layout.component';
import { BrandingSharedModule } from './branding-shared.module';
import { LoginLayoutSharedModule } from './login-layout-shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrSharedModule } from './toastr-shared.module';
import { FileUploadSharedModule } from './file-upload-shared.module';
import { CKEditorSharedModule } from './ckeditor-shared.module';

@NgModule({
  declarations: [
    ConfirmationModalComponent,
    PreviewLayoutComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    BrandingSharedModule,
    LoginLayoutSharedModule,
    ReactiveFormsModule,
    ToastrSharedModule,
    NgbModule,
    FileUploadSharedModule,
    CKEditorSharedModule
  ],
  providers: [
    NgbActiveModal
  ],
  exports: [
    ConfirmationModalComponent,
    PreviewLayoutComponent,
    NgbModule,
    FileUploadSharedModule,
    CKEditorSharedModule
  ]
})
export class LoginBrandingSettingsSharedModule { }
