/* eslint-disable @typescript-eslint/no-empty-function */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { StorageKey } from 'src/app/enums/storageKey';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent {
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private storageService: StorageService) { }
  courseJson = [
    {
      title: 'Dev Team',
      tags: ['UI Design','AutoCad', 'Photoshop',],
      facultyName: 'Harry Garza',
      status: 40,
      id: '1152'
    },
    {
      title: 'QA Team',
      tags: ['Business','Balance', 'Profit'],
      facultyName: 'Rishabh Khatri',
      status: 70,
      id: '1147'
    },
    {
      title: 'Mobile Team',
      tags: ['Data','Algorithm'],
      facultyName: 'Akhil Sharma',
      status: 90,
      id: '1148'
    },
    {
      title: 'Communication Skills',
      tags: ['Talk','Communicate','listen'],
      facultyName: 'Saket Ranjan',
      status: 10,
      id: '1149'
    },
    {
      title: 'OOP',
      tags: ['OOP','Objects','Classes','Modularity'],
      facultyName: 'Suhani Jain',
      status: 56,
      id: '1150'
    },
    {
      title: 'Demo Course - Do not modify',
      tags: ['SDLC','Waterfall','Agile','Scrum'],
      facultyName: 'Mohini Khare',
      status: 56,
      id: '1151'
    },
  ]
  public isCollapsed = false;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    items: 2,
    dots: true,
    margin: 20,
    navSpeed: 600,
    autoplay: true,
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 2
      },
      760: {
        items: 2
      },
      1000: {
        items: 2
      }
    },
    nav: false
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  goToCourseDashboard(courseId : string, course: any): void{
    this.storageService.set(StorageKey.COURSE_LIST_SELECTION, course);
    this.router.navigate([ courseId + '/dashboard'], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve'});
  }
}
