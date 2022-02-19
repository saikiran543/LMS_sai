/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { StorageKey } from 'src/app/enums/storageKey';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { ProgressService } from '../../service/progress.service';

@Component({
  selector: 'app-progress-wrapper',
  templateUrl: './progress-wrapper.component.html',
  styleUrls: ['./progress-wrapper.component.scss']
})
export class ProgressWrapperComponent implements OnInit {
  @Input() type!:string
  courseId!: string;
  view!: string;
  typeOfList = 'top'
  params: any= {};
  isMyProgressLess!: boolean;
  progressValue!: number;
  classProgressValue!: number;
  classAverage: any;
  studentAverage: any;
  studentList: any = [];
  private unsubscribe$ = new Subject<void>();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private storageService: StorageService, private progressService: ProgressService, private routeOperationService: RouteOperationService) { }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.loadDependencies();
  }
  loadDependencies(): void {
    this.routeOperationService.listenParams().pipe(takeUntil(this.unsubscribe$)).subscribe((params: any) => {
      this.courseId = params.courseId;
    });
    this.view = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    this.getProgress();
    if(this.view !== 'student'){
      this.getTopAndBottomList();
    }
  }

  async getProgress(): Promise<void> {
    if(this.view === 'student'){
      await this.getStudentAverage();
    }
    await this.getClassAverage();
  }
  async getClassAverage() : Promise<void> {
    this.classAverage = await this.progressService.sendMessageToBackEnd(Service.COURSE_SERVICE, `progress/${this.courseId}/class-progress/average`, HttpMethod.GET, '{}',true);
    this.progressValue = this.classAverage.body.progress;
    if(this.view === 'student'){
      this.updateProgress();
    }
  }

  async getStudentAverage() : Promise<void> {
    this.studentAverage = await this.progressService.sendMessageToBackEnd(Service.COURSE_SERVICE, `progress/${this.courseId}/student-progress/average`, HttpMethod.GET, '{}', true);
    this.classProgressValue = this.studentAverage.body.progress;
  }
  updateProgress(): void{
    const value = this.classProgressValue;
    this.classProgressValue = this.progressValue;
    this.progressValue = value;
    this.isMyProgressLess = this.progressValue >= this.classProgressValue? false: true;
  }
  async getTopAndBottomList(): Promise<void>{
    const list = await this.progressService.sendMessageToBackEnd(Service.COURSE_SERVICE, `progress/${this.courseId}/class-progress?performerRanking=${this.typeOfList}&limit=${5}&skip=${0}`, HttpMethod.GET, '{}', true);
    this.studentList = list.body.studentsProgress;
  }
  onClick(value: string): void{
    this.typeOfList = value;
    this.getTopAndBottomList();
  }
}
