/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { CourseGamificationService } from './services/course-gamification.service';

@Component({
  selector: 'app-course-gamification',
  templateUrl: './course-gamification.component.html',
  styleUrls: ['./course-gamification.component.scss']
})
export class CourseGamificationComponent implements OnInit {
  courseId: any
  courseConfig =
    [{
      category: 'content',
      criteria: "label1",
      logic: "w*p",
      points: 10,
      criteriaId: 1
    },
    {
      category: '',
      criteria: "label",
      logic: "w*p",
      points: 10,
      criteriaId: 1
    },
    {
      category: '',
      criteria: "label",
      logic: "w*p",
      points: 10,
      criteriaId: 1
    },
    {
      category: '',
      criteria: "label",
      logic: "w*p",
      points: 10,
      criteriaId: 1
    }
    ];
 
  constructor(private routeOperationService : RouteOperationService,private courseGamificationService :CourseGamificationService) { }

  ngOnInit(): void {
    this.routeOperationService.listenAllParams().pipe().subscribe((params: any) => {
      this.courseId = params.params.courseId;
      // this.getCourseConfig();
    });
  }
  getCourseConfig():void{
    this.courseGamificationService.fetchCourseConfig(this.courseId);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  modifyRecordsPerPageForDoubt(type:string, config: any):void{
    if(type === '+' && config.points<10){
      config.points = config.points + 1;
    }
    if(type === '-' && config.points>0){
      config.points = config.points - 1;
    }
  }

  savePoints():void{
    const criterias:any = [];
    this.courseConfig.forEach((resp: any) => {
      criterias.push({'criteriaId': resp.criteriaId,'points': resp.points});
    });
    this.courseGamificationService.saveCourseConfig(this.courseId,criterias);
  }

}
