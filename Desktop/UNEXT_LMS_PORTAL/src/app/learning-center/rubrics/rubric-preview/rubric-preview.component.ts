/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogTypes } from 'src/app/enums/Dialog';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { RubricOperations } from 'src/app/enums/rubricOperations';
import { Service } from 'src/app/enums/service';
import { IBodyCommon, IResponse } from 'src/app/Models/common-interfaces';
import { DialogService } from 'src/app/services/dialog.service';
import { RubricsService } from '../service/rubrics.service';

@Component({
  selector: 'app-rubric-preview',
  templateUrl: './rubric-preview.component.html',
  styleUrls: ['./rubric-preview.component.scss']
})
export class RubricPreviewComponent implements OnInit {
  rubricData: any = [];
  levelNames: any = [];
  rubricTitle!:string;
  initializeStructure!:boolean
  rubricId!: string;
  params: any = {};
  status!: string;
  @Output() confirmStatus = new EventEmitter()
  constructor(private route: ActivatedRoute, private router: Router, private rubricService: RubricsService,
    private activateRoute: ActivatedRoute ,private dialogService : DialogService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.rubricId = params?.rubricId;
    });
    this.readRubricDetails(this.rubricId);
  }
  async readRubricDetails(rubricId: string): Promise<void>{
    if(!rubricId){
      rubricId = this.params.rubricId;
    }
    const response: IResponse = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, `rubrics/${rubricId}`,HttpMethod.GET, '{}');
    if(response.status === 200){
      const rubricDetails: IBodyCommon = response.body;
      this.rubricData = rubricDetails.criterias;
      this.levelNames = rubricDetails.levelNames;
      this.rubricTitle = rubricDetails.title;
      this.status = rubricDetails.status;
      this.initializeStructure = true;
    }
  }
  async updateRubric(data: any) {
    let message;
    const payload = { status: data.status, title: this.rubricTitle, criterias: data.criterias, levelNames: data.levelNames };
    try {
      const response: IResponse = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, `rubrics/${this.rubricId}`, HttpMethod.PUT, payload);
      if(response.status === 200){
        message = `${this.rubricTitle} ${this.rubricService.messagesTranslations.rubricUpdate}`;
        this.rubricService.showSuccessToast(message);
        this.routeBackToRubricListPage('../../');
      }
    } catch (error: any) {
      message = error.message;
      await this.dialogService.showAlertDialog({title: {translationKey: message},type: DialogTypes.ERROR});
    }
  }
  async deleteRubric(currentRubric: any){
    let message = `${this.rubricService.messagesTranslations.deleteRubric} ${currentRubric.title}?`;
    const confirmation = await this.dialogService.showConfirmDialog({title: {translationKey: message}});
    if(!confirmation){
      return;
    }
    try {
      const response: IResponse = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, `rubrics/${currentRubric.rubricId}`, HttpMethod.DELETE, '{}');
      if(response.body.status === RubricOperations.SUCCESS){
        this.rubricService.showSuccessToast(`${currentRubric.title} Deleted Successfully`);
        this.routeBackToRubricListPage('../../');
      }
    } catch (error: any) {
      message = error.message;
      await this.dialogService.showAlertDialog({title: {translationKey: message},type: DialogTypes.ERROR});
    }
  }
  editRubric(row: any){
    // this.router.navigate([`./manipulate/edit/${row.rubricId}`], {queryParams: {leftMenu: "true", id: "learning-center", courseDropDown: "true", toc: "false"}});
    this.router.navigateByUrl(this.router.url.replace("preview","manipulate/edit"));
  }
  routeBackToRubricListPage(params: string) {
    //const params = this.operation === 'edit'? '../../../': '../../';
    this.router.navigate([params], { relativeTo: this.activateRoute, queryParams: { leftMenu: "true", id: "learning-center", courseDropDown: "true", toc: "false" } });
  }
  ClickEvent(event? : any): void {
    switch (event.type) {
      case RubricOperations.UPDATE:
        this.updateRubric(event);
        break;
      case RubricOperations.DELETE:
        this.deleteRubric(event);
        break;
      case RubricOperations.EDIT:
        this.editRubric(event);
        break;
      default:
        this.confirmStatus.emit();
        break;
    }
  }
}
