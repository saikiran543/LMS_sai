import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigAndSettingsRoutingModule } from './config-and-settings-routing.module';
import { ConfigAndSettingsComponent } from './config-and-settings.component';
@NgModule({
  declarations: [ConfigAndSettingsComponent],
  imports: [
    CommonModule,
    ConfigAndSettingsRoutingModule
  ]
})
export class ConfigAndSettingsModule { }
