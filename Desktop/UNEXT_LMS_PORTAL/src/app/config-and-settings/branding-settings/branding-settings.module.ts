import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrandingSettingsRoutingModule } from './branding-settings-routing.module';
import { BrandingSettingsComponent } from './branding-settings.component';
import { LoginBrandingSettingsSharedModule } from 'src/app/shared/modules/login-branding-settings-shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrSharedModule } from 'src/app/shared/modules/toastr-shared.module';
import { CommonUtils } from 'src/app/utils/common-utils';
import { PerfectScrollbarModule,PerfectScrollbarConfigInterface,PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  declarations: [
    BrandingSettingsComponent,
  ],
  imports: [
    CommonModule,
    BrandingSettingsRoutingModule,
    TranslateModule,
    LoginBrandingSettingsSharedModule,
    ReactiveFormsModule,
    ToastrSharedModule,
    PerfectScrollbarModule
  ],
  providers: [
    TranslateService,
    CommonUtils,{provide: PERFECT_SCROLLBAR_CONFIG,useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}
  ],
})
export class BrandingSettingsModule { }
