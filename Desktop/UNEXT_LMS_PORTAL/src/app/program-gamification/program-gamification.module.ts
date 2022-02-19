import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramGamificationRoutingModule } from './program-gamification-routing.module';
import { ProgramGamificationComponent } from './program-gamification.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Ng7BootstrapBreadcrumbModule } from 'ng7-bootstrap-breadcrumb';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProgramGamificationComponent
  ],
  imports: [
    CommonModule,
    ProgramGamificationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng7BootstrapBreadcrumbModule,
    AngularSvgIconModule.forRoot()
  ]
})
export class ProgramGamificationModule { }
