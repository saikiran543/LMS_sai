import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './login-layout/login-form/login-form.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { ResetPasswordComponent } from './login-layout/reset-password/reset-password.component';
import { LayoutComponent } from './layout/layout.component';
import { SignupComponent } from './signup/signup/signup.component';
import { ForgotPasswordComponent } from './login-layout/forgot-password/forgot-password.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { BrandingComponent } from './branding/branding.component';
import { NotFoundPageComponent } from './404-page/not-found-page.component';
import { LoginAuthGuard } from './guards/login.auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    data: {
      title: 'layout',
      breadcrumb: [
        {
          label: 'layout',
          url: ''
        }
      ]
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((module) => module.DashboardModule)
      },
      {
        path: 'learning-center',
        loadChildren: () => import('./learning-center/learning-center.module').then((module) => module.LearningCenterModule)
      },
      {
        path: 'program-gamification',
        loadChildren: () => import('./program-gamification/program-gamification.module').then((module) => module.ProgramGamificationModule)
      },
      
      {
        path: 'config-and-settings',
        loadChildren: () => import('./config-and-settings/config-and-settings.module').then((module)=>module.ConfigAndSettingsModule)
      }
    ]

  },
  {
    path: 'branding',
    canActivate: [AuthGuard],
    component: BrandingComponent,
    data: {
      title: 'branding',
      breadcrumb: [
        {
          label: 'branding',
          url: ''
        }
      ]
    }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'home',
      breadcrumb: [
        {
          label: 'home page',
          url: ''
        }
      ]
    }
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then((module) => module.SettingsModule),
    data: {
      title: 'settings',
      breadcrumb: [
        {
          label: 'home page ',
          url: './home'
        },
        {
          label: 'settings',
          url: ''
        }
      ]
    }
  },
  {
    path: 'login', component: LoginLayoutComponent,
    canActivate: [LoginAuthGuard],
    children: [
      {
        path: '', component: LoginFormComponent, pathMatch: 'full',
        data: {
          title: 'login',
          breadcrumb: [
            {
              label: 'login',
              url: ''
            }
          ]
        }
      },
      {
        path: 'forgotpassword', component: ForgotPasswordComponent,
        data: {
          title: 'forgotpassword',
          breadcrumb: [
            {
              label: 'login',
              url: '/login'
            },
            {
              label: 'forgotpassword',
              url: ''
            }
          ]
        }
      },
      {
        path: 'resetpassword/:id', component: ResetPasswordComponent,
        data: {
          title: 'resetpassword',
          breadcrumb: [
            {
              label: 'login',
              url: '/login'
            },
            {
              label: 'resetpassword',
              url: ''
            }
          ]
        }
      }
    ]
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      title: 'signup',
      breadcrumb: [
        {
          label: 'signup',
          url: ''
        }
      ]
    }
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
