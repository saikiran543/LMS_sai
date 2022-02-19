import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseGamificationComponent } from './course-gamification.component';
import { CourseGamificationRoutingModule } from './course-gamification-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  declarations: [CourseGamificationComponent],
  imports: [
    CourseGamificationRoutingModule,
    AngularSvgIconModule.forRoot(),
    CommonModule
  ]
})
export class CourseGamificationModule { }
