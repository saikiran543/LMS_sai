import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandingComponent } from '../../branding/branding.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [
    BrandingComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgCircleProgressModule.forRoot({}),
  ],
  exports: [
    BrandingComponent
  ]
})
export class BrandingSharedModule { }
