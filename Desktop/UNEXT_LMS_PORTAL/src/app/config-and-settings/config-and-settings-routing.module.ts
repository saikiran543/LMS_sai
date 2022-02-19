import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigAndSettingsComponent } from './config-and-settings.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigAndSettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'login-settings',
        pathMatch: 'full'
      },
      {
        path: 'login-settings',
        loadChildren: () => import('./login-settings/login-settings.module').then((module) => module.LoginSettingsModule)
      },
      {
        path: 'branding-settings',
        loadChildren: () => import('./branding-settings/branding-settings.module').then((module) => module.BrandingSettingsModule)
      }
    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigAndSettingsRoutingModule { }