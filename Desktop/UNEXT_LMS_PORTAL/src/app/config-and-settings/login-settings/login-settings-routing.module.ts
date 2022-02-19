import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginSettingsComponent } from './login-settings.component';

const routes: Routes = [
  {
    path: '',
    component: LoginSettingsComponent,
    data: {
      title: 'Login Page',
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
          label: 'Login Page',
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
export class LoginSettingsRoutingModule { }
