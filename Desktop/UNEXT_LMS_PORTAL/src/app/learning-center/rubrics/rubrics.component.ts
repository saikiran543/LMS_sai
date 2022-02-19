/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { RubricOperations } from 'src/app/enums/rubricOperations';
import { Service } from 'src/app/enums/service';
import { IResponse } from 'src/app/Models/common-interfaces';
import { RubricsService } from './service/rubrics.service';

@Component({
  selector: 'app-rubrics',
  templateUrl: './rubrics.component.html',
  styleUrls: ['./rubrics.component.scss']
})
export class RubricsComponent implements OnInit {
  courseId: any;
  rubricLevelType: any;
  rows : any = [];
  ContextMenuOperation: any = [];
  totalRecords!: number
  rowsPerPage= 20
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private activateRoute: ActivatedRoute,private router: Router, private rubricService: RubricsService) {
    
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.courseId = params.courseId;
      this.rubricLevelType = params.type;
      this.setContextMenuItems();
      this.readRubrics();
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  ClickEvent(event:any): void{
    switch (event) {
      case RubricOperations.CREATE_RUBRIC:
        this.router.navigate(['./manipulate/create'], {relativeTo: this.activateRoute, queryParams: {leftMenu: "true", id: "learning-center", courseDropDown: "true", toc: "false"}});
        break;
      case RubricOperations.COURSE_LEVEL:
        this.rubricLevelType = RubricOperations.COURSE;
        this.onRouteAndReadData();
        break;
      case RubricOperations.PROGRAM_LEVEL:
        this.rubricLevelType = RubricOperations.PROGRAM;
        this.onRouteAndReadData();
        break;
      case RubricOperations.RUBRIC_SELECTION:
        this.openSelectionDialog();
        break;
      default:
        break;
    }
  }
  onRouteAndReadData(): void{
    this.setContextMenuItems();
    this.router.navigate([`./../${this.rubricLevelType}`], {relativeTo: this.activateRoute, queryParams: {leftMenu: "true", id: "learning-center", courseDropDown: "true", toc: "false"}});
    this.rows = [];
    this.readRubrics();
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async readRubrics(): Promise<void>{
    this.rows = [];
    const response: IResponse = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, `rubrics?scope=${this.rubricLevelType}&parentId=${this.courseId}&page=1&size=${this.rowsPerPage}`, HttpMethod.GET, '{}');
    if(response.status === 200){
      this.rows.push(...response.body.rubrics);
      this.totalRecords = response.body.total;
    }
  }
  setContextMenuItems(): void{
    this.ContextMenuOperation = [
      {
        'name': 'Copy',
        'event': 'copy',
        'icon': 'icon-copy',
        'show': true,
      },
      {
        'name': 'Edit',
        'event': 'edit',
        'icon': 'icon-edit',
        'show': this.rubricLevelType === 'program'? false: true,
      },
      {
        'name': 'Delete',
        'event': 'delete',
        'icon': 'icon-delete',
        'show': this.rubricLevelType === 'program'? false: true,
      },
    ];
  }
  openSelectionDialog(): void{
    this.router.navigate([`./selection/${this.rubricLevelType}`], {relativeTo: this.activateRoute, queryParams: {leftMenu: "true", id: "learning-center", courseDropDown: "false", toc: "false"}});
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onClickView(event: any){
    this.router.navigate([`./preview/${event.rubricId}`], {relativeTo: this.activateRoute, queryParams: {leftMenu: "true", id: "learning-center", courseDropDown: "true", toc: "false"}});
  }
  modifyRecordsPerPage(type: string) : void{
    if(type === 'plus' && this.rowsPerPage < 20){
      this.rowsPerPage += 5;
      this.rows = [];
      this.readRubrics();
    }else if(type === 'minus' && this.rowsPerPage > 5){
      this.rowsPerPage -= 5;
      this.rows = [];
      this.readRubrics();
    }
  }
  onChange(event: any) : void{
    this.rowsPerPage = Number(event.target.value);
    this.rows = [];
    this.readRubrics();
  }
}
