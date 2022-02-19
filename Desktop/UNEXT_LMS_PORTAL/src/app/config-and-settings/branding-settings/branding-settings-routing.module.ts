import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandingSettingsComponent } from './branding-settings.component';

const routes: Routes = [
  {
    path: '',
    component: BrandingSettingsComponent,
    data: {
      title: 'Branding Settings',
      breadcrumb: [
        {
          label: 'Home',
          url: '/'
        },
        {
          label: 'Config & Settings',
          url: '/login-settings'
        },
        {
          label: 'Branding Settings',
          url: ''
        }
      ]
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandingSettingsRoutingModule { }
