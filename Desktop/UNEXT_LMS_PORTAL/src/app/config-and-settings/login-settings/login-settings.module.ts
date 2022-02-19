import { ToastrSharedModule } from 'src/app/shared/modules/toastr-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginSettingsRoutingModule } from './login-settings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoginBrandingSettingsSharedModule } from '../../shared/modules/login-branding-settings-shared.module';
import { LoginSettingsComponent } from './login-settings.component';
import { CommonUtils } from 'src/app/utils/common-utils';
import { PerfectScrollbarModule,PerfectScrollbarConfigInterface,PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  declarations: [
    LoginSettingsComponent,
  ],
  imports: [
    CommonModule,
    LoginSettingsRoutingModule,
    FormsModule,
    TranslateModule,
    LoginBrandingSettingsSharedModule,
    ReactiveFormsModule,
    ToastrSharedModule,
    PerfectScrollbarModule
  ],
  providers: [
    CommonUtils,{provide: PERFECT_SCROLLBAR_CONFIG,useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}
  ]
})
export class LoginSettingsModule { }
