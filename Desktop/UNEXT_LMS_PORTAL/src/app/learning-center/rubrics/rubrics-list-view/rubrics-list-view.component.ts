/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogTypes } from 'src/app/enums/Dialog';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { RubricOperations } from 'src/app/enums/rubricOperations';
import { Service } from 'src/app/enums/service';
import { IResponse } from 'src/app/Models/common-interfaces';
import { Page } from 'src/app/Models/page';
import { DialogService } from 'src/app/services/dialog.service';
import { RubricsService } from '../service/rubrics.service';

@Component({
  selector: 'rubrics-list-view',
  templateUrl: './rubrics-list-view.component.html',
  styleUrls: ['./rubrics-list-view.component.scss']
})
export class RubricsListViewComponent implements OnInit {
  @Input() rows: any = [];
  @Input() rubricLevelType: any;
  @Input() ContextMenuOperation: any;
  @Input() totalRecords!: number;
  @Input() courseId!: string;
  @Input() isSelection!: boolean;
  @Input() selectedRubric!: any;
  page = new Page();
  Date = new Date();
  @Input() rowsPerPage!: number;
  rubricData: any = [];
  @Output() selectRubric = new EventEmitter();
  @Output() previewClick = new EventEmitter();
  constructor(private rubricService: RubricsService, private dialogService: DialogService, private activateRoute: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {
    
  }

  ngOnInit(): void {
    //this.page.pageNumber = 1;
    this.page.size = this.rowsPerPage;
    this.rows;
  }

  contextMenuClick(operation: string, row: any){
    switch (operation) {
      case RubricOperations.COPY:
        this.copyRubric(row);
        break;
      case RubricOperations.EDIT:
        this.editRubric(row);
        break;
      case RubricOperations.DELETE:
        this.deleteRubric(row);
        break;
      default:
        break;
    }
  }
  async copyRubric(row:any){
    let message = `${this.rubricService.messagesTranslations.copyRubric}`;
    const confirmation = await this.dialogService.showConfirmDialog({title: {translationKey: message}});
    if(!confirmation){
      return;
    }
    try {
      const response: IResponse = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, `rubrics/${row.rubricId}/action/copy`, HttpMethod.POST, '{}');
      if(response.status === 200){
        if(this.rubricLevelType === RubricOperations.COURSE){
        // this.rows.push(data.body);
        // this.rows = [...this.rows];
          this.totalRecords += 1;
        }
        this.rubricService.showSuccessToast(`Copy of ${row.title} created successfully`);
      }
    } catch (error: any) {
      message = error.message;
      await this.dialogService.showAlertDialog({title: {translationKey: message},type: DialogTypes.ERROR});
    }
  }

  editRubric(row: any){
    this.router.navigate([`./manipulate/edit/${row.rubricId}`], {relativeTo: this.activateRoute, queryParams: {leftMenu: "true", id: "learning-center", courseDropDown: "true", toc: "false"}});
  }

  async deleteRubric(row: any){
    let message = `${this.rubricService.messagesTranslations.deleteRubric} ${row.title}?`;
    const confirmation = await this.dialogService.showConfirmDialog({title: {translationKey: message}});
    if(!confirmation){
      return;
    }
    try {
      const response: IResponse = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, `rubrics/${row.rubricId}`, HttpMethod.DELETE, '{}');
      if(response.body.status === RubricOperations.SUCCESS){
        const rubricIndex = this.rows.findIndex((data: any) => data["rubricId"] === row.rubricId);
        this.rows.splice(rubricIndex, 1);
        this.rows = [...this.rows];
        this.totalRecords -= 1;
        this.rubricService.showSuccessToast(`${row.title} Deleted Successfully`);
      }
    } catch (error: any) {
      message = error.message;
      await this.dialogService.showAlertDialog({title: {translationKey: message},type: DialogTypes.ERROR});
    }
  }
  onActivate(event: any, row: any){
    if(event.type === RubricOperations.CLICK) {
      this.router.navigate([`./preview/${row.rubricId}`], {relativeTo: this.activateRoute, queryParams: {leftMenu: "true", id: "learning-center", courseDropDown: "true", toc: "false"}});
    }
  }
  selectRow(event: any, row: any) {
    this.selectedRubric = row;
    this.selectRubric.emit(row);
  }
  async setPage(pageInfo: any){
    this.page.pageNumber = pageInfo.offset;
    this.rows = [];
    this.rowsPerPage = this.rowsPerPage? this.rowsPerPage: 20;
    const response: IResponse = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, `rubrics?scope=${this.rubricLevelType}&parentId=${this.courseId}&page=${pageInfo.offset + 1}&size=${this.rowsPerPage}`, HttpMethod.GET, '{}');
    if(response.status === 200){
      this.isSelection? this.rows.push(...this.removeDraftStatusRubrics(response.body.rubrics)): this.rows.push(...response.body.rubrics);
      this.page.totalElements = response.body.total;
      this.cdr.detectChanges();
    }
  }
  removeDraftStatusRubrics(rubrics: any): any{
    const filteredRubrics: any = [];
    rubrics.forEach((rubric: any) => {
      if(rubric.status !== 'draft'){
        filteredRubrics.push(rubric);
      }
    });
    return filteredRubrics;
  }
  onClickView(row: any){
    this.previewClick.emit(row);
  }
  getClassNameRubricStatus(status:string){
    if(status === RubricOperations.ACTIVE){
      return RubricOperations.ACTIVE_STATE;
    }
    else if(status === RubricOperations.DRAFT){
      return RubricOperations.DRAFT_STATE;
    }
    return RubricOperations.USE_STATE;
  }

  ngOnDestory() {
    this.selectedRubric = null;
  }
}
