/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { ProgressOperations } from 'src/app/enums/progressOperations';
import { Service } from 'src/app/enums/service';
import { Page } from 'src/app/Models/page';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { ProgressService } from '../service/progress.service';

@Component({
  selector: 'app-class-progress-list',
  templateUrl: './class-progress-list.component.html',
  styleUrls: ['./class-progress-list.component.scss']
})
export class ClassProgressListComponent implements OnInit {

  courseId!: string;
  lastUpdated!: string;
  rows: any = [];
  rowsPerPage = 20;
  constructor(private routeOperationService: RouteOperationService, private activateRoute: ActivatedRoute, private router: Router, private progressService: ProgressService, private configuration: ConfigurationService) { }
  private unsubscribe$ = new Subject<void>();
  type!: string;
  totalRecords!: number;
  orgId!: string;
  skipRecords = 0;
  progressColumns = [{prop: 's.No'}, {prop: 'learnerName'}, {prop: 'emailId'}, {prop: 'no.OfContentsAccessible'}, {prop: 'no.OfActivitiesAccessible'}, {prop: 'courseProgress %'}]
  columns: any = [];
  page = new Page();
  ngOnInit(): void {
    this.loadDependencies();
  }
  loadDependencies(): void {
    this.routeOperationService.listenAllParams().pipe(takeUntil(this.unsubscribe$)).subscribe((params: any) => {
      this.courseId = params.params.courseId;
      this.columns = this.progressColumns;
      this.page.size = this.rowsPerPage;
    });
    this.orgId = this.configuration.getAttribute("orgId");
    this.readStudentList();
  }
  clickEvent(type: string): void {
    switch (type) {
      case ProgressOperations.BACK:
        window.history.back();
        break;
    }
  }
  modifyRecordsPerPage(type: string): void {
    if(type === ProgressOperations.PLUS && this.rowsPerPage < 50){
      this.rowsPerPage += 10;
    }else if(type === ProgressOperations.MINUS && this.rowsPerPage > 10){
      this.rowsPerPage -= 10;
    }
    this.page.size = this.rowsPerPage;
    this.skipRecords = 0;
    this.readStudentList();
    this.page.pageNumber = 0;
  }
  setPage(event: any): void {
    this.skipRecords = event.offset * this.rowsPerPage;
    this.page.pageNumber = event.offset;
    this.readStudentList();
  }
  getClass(value: number): string {
    if(value === 100){
      return 'progress-bar-green';
    }else if(value >= 50 && value < 100){
      return 'progress-bar-orange';
    }
    return 'progress-bar-red';
  }
  async readStudentList(): Promise<void> {
    const headers:any ={
      'organizationid': this.orgId
    };
    const list = await this.progressService.sendMessageToBackEnd(Service.COURSE_SERVICE, `progress/${this.courseId}/class-progress?limit=${this.rowsPerPage}&skip=${this.skipRecords}`, HttpMethod.GET, '{}', true, headers);
    this.rows = [];
    this.rows = [...list.body.studentsProgress];
    this.totalRecords = list.body.totalStudents;
    this.lastUpdated = list.body.lastUpdatedAt;
  }
  getSerialNumber(rowNumber: number): any {
    let serialNumber: any = 0;
    serialNumber = this.page.pageNumber === 0? (rowNumber + 1) <= 9? `0${rowNumber + 1}`: rowNumber + 1: ((this.page.pageNumber) * this.rowsPerPage) + (rowNumber + 1);
    return serialNumber;
  }
}
