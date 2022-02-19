/* eslint-disable no-invalid-this */
/* eslint-disable max-params */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { UserRoles } from 'src/app/enums/userRoles';
import { ForumType } from 'src/app/enums/forumType';
import { Page } from 'src/app/Models/page';
import moment from 'moment';
import { ContentService } from '../../course-services/content.service';
import { PdfmakeService } from 'src/app/services/pdfmake.service';
import { XlsxService } from 'src/app/services/xslx.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { DialogService } from 'src/app/services/dialog.service';
@Component({
  selector: 'app-forum-evaluate',
  templateUrl: './forum-evaluate.component.html',
  styleUrls: ['./forum-evaluate.component.scss']
})
export class ForumEvaluateComponent implements OnInit {
  forumEvaluateItemId: any;
  forumEvaluateItem: any;
  selection: SelectionType;
  courseId: any;
  studentActivities: any;
  userRole = UserRoles;
  forumType = ForumType;
  rows: {[key: string]: string}[] = [];
  standardDiscussionDataTable = false;
  page = new Page();
  recordsPerPage = 5;
  allRowsSelected = false;
  columns = [{
    prop: 'selected',
    name: '',
    sortable: false,
    canAutoResize: false,
    draggable: false,
    resizable: false,
    width: 30,
  }, { prop: 'Username' }, { prop: 'ParticipationStatus' }, { prop: 'SubmittedDate' }, { prop: 'ThreadsInitiated' }, { prop: 'ThreadsParticipated' }, { prop: 'UpvotesReceived' }, { prop: 'GradeStatus' }, { prop: 'OverallScore' }, {prop: 'PublishStatus'}];
  selected: {[key: string]: string}[] = [];
  unselected: {[key: string]: string}[] = [];
  doubtClarificationColumns = [{
    prop: 'selected',
    name: '',
    sortable: false,
    canAutoResize: false,
    draggable: false,
    resizable: false,
    width: 30
  }, { prop: 'Username' }, { prop: 'ParticipationStatus' }, { prop: 'ContentAccessible' }, { prop: 'SubmittedDate' }, { prop: 'QuestionsPosted' }, { prop: 'AnswersGiven' }, { prop: 'UpvotesReceived' }, {prop: 'VerifiedAnswers'}, { prop: 'GradeStatus' }, { prop: 'OverallScore' }, {prop: 'PublishStatus'}];
  sortConfig: {
    sortBy: string | null,
    sortOrder: 'asc' | 'desc',
  } = {
    sortBy: 'userName',
    sortOrder: 'asc',
  };
  @ViewChild('datatable') public datatable!: DatatableComponent;
  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private discussionForumService: DiscussionForumService,
    private contentService: ContentService,
    private toastrService: ToastrService,
    private pdfmakeService: PdfmakeService,
    private xlsxService: XlsxService,
    private dialogService: DialogService,
  ) {
    this.selection = SelectionType.checkbox;
  }

  async ngOnInit() {
    this.forumEvaluateItemId = await this.activatedRoute.snapshot.paramMap.get('forumId');
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.courseId = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.params.courseId;
    await this.discussionForumService.forumDetail(this.forumEvaluateItemId, this.courseId).then((res: any) => {
      this.forumEvaluateItem = res;
    });
    await this.getStudentActivity(this.page.pageNumber);
  }

  getRowId(row: any) {
    return row.id;
  }

  onSelect(event: any, value: any) {
    if(event.target.checked) {
      this.selected.push(value);
      if(this.allRowsSelected) {
        this.unselected = this.unselected.filter((ele) => ele.id !== value.id);
      }
    } else {
      this.selected = this.selected.filter((ele) => ele.id !== value.id);
      if(this.allRowsSelected) {
        this.unselected.push(value);
      }
    }
  }

  backToList(): void {
    this.location.back();
  }

  moreContent(forum: any, event: any): void {
    event.stopPropagation();
    forum.isTextFullHeight = !forum.isTextFullHeight;
  }

  navigateToStudentDetailsPage(row: any) {
    let userId: any;
    this.studentActivities.forEach((users: any) => {
      if (users.userName === row.Username) {
        userId = users.userId;
      }
    });
    this.router.navigate(['../forum-content-user-details/' + this.forumEvaluateItemId], { relativeTo: this.activatedRoute, queryParams: { userId }, queryParamsHandling: 'merge' });
  }

  async getStudentActivity(pageNo: number) {
    const res: any = await this.discussionForumService.studentActivityResult(this.forumEvaluateItemId, this.courseId, {
      limit: this.recordsPerPage,
      pageNo
    }, this.sortConfig).catch((err: any) => {
      console.log(err);
    });
    this.studentActivities = res.paginatedDiscussionElements;
    this.page.size = this.recordsPerPage;
    this.page.totalElements = res.paginationInfo.totalItems;
    this.page.pageNumber = res.paginationInfo.currentPage;
    this.loadDataTable(this.forumEvaluateItem.subType);
  }

  setPage(event: any) {
    this.getStudentActivity(event.offset + 1);
  }

  getPublishStatus(element:any):string{
    if(element.isGradePublished && element.isFeedbackPublished ){
      return "Grade & Feedback";
    }
    if(element.isGradePublished){
      return "Grade";
    }
    if(element.isFeedbackPublished){
      return "Feedback";
    }
    return "-";
  }

  setPublishUnPublish(element:any, type:string,publish:boolean):any{
    if( type==="both"){
      element.isGradePublished= publish;
      element.isFeedbackPublished= publish;
    }
    if(type==="grade"){
      element.isGradePublished= publish;
    }
    if(type==="feedback"){
      element.isFeedbackPublished= publish;
    }
    return element;
  }

  findElementAndAddStatus(type:string, publish:boolean){
    this.rows = this.rows.map((rowElement:any) => {
      const item = this.selected.find((selectedItem:any) => selectedItem.id === rowElement.id);
      if (item) {
        let studentActivity = this.studentActivities.find((studentActivity:any) => studentActivity.userId === rowElement.id);
        studentActivity = this.setPublishUnPublish(studentActivity,type,publish);
        item.PublishStatus = this.getPublishStatus(studentActivity);
        return item;
      }
      return rowElement;
    });
  }
 
  createDataTable(studentActivities: any, forumType: ForumType): {[key: string]: any}[] {
    const rowData: any = [];
    if (forumType === this.forumType.STANDARD_DISCUSSION_FORUM) {
      this.standardDiscussionDataTable = true;
      studentActivities.forEach((element: any) => {
        const obj = {
          "id": element.userId,
          "Username": element.userName,
          "ParticipationStatus": 'Not Participated',
          "SubmittedDate": element.lastParticipationDate || null,
          "ThreadsInitiated": element.questionsInitiated || 0,
          "ThreadsParticipated": element.threadsParticipated || 0,
          "UpvotesReceived": element.numberOfUpvotes || 0,
          "GradeStatus": element.isGradable,
          "OverallScore": element.isGradable ? element.score : '-',
          "PublishStatus": this.getPublishStatus(element)
        };
        if (element.questionsInitiated || element.threadsParticipated || element.numberOfVotes) {
          obj.ParticipationStatus = "Participated";
        }
        rowData.push(obj);
      });
    } else {
      studentActivities.forEach((element: any) => {
        const obj = {
          "id": element.userId,
          "Username": element.userName,
          "ParticipationStatus": 'Not Participated',
          "ContentAccessible": element.attachedContents?.length || 0,
          "SubmittedDate": element.lastParticipationDate || null,
          "QuestionsPosted": element.questionsInitiated || 0,
          "AnswersGiven": element.threadsParticipated || 0,
          "UpvotesReceived": element.numberOfUpvotes || 0,
          "GradeStatus": element.isGradable,
          "OverallScore": element.isGradable ? element.score : '-',
          "VerifiedAnswers": element.verifiedAnswers ? element.verifiedAnswers : "-",
          "PublishStatus": this.getPublishStatus(element)
        };
        if (element.questionsInitiated || element.threadsParticipated || element.numberOfUpvotes) {
          obj.ParticipationStatus = "Participated";
        }
        rowData.push(obj);
      });
    }
    return rowData;
  }

  loadDataTable(forumType: ForumType) {
    const rowData = this.createDataTable(this.studentActivities, forumType);
    this.rows = [...rowData];
    if(this.allRowsSelected) {
      const allSelected = [...new Map(this.rows.map((item: any) => [item.id, item])).values()] as any;
      const unselectedIds = this.unselected.map((ele) => ele.id);
      const selected = allSelected.filter((ele: any) => !unselectedIds.includes(ele.id));
      this.selected = selected;
    }
  }

  checkSelection(id: string) {
    const selected = this.selected.map((ele) => ele.id).includes(id);
    return selected;
  }

  selectAllRows(event: any) {
    this.allRowsSelected = event.target?.checked;
    if(event.target.checked) {
      this.selected = [...this.rows];
      this.unselected = [];
    } else {
      this.selected = [];
    }
  }

  modifyRecordsPerPage(type: string) {
    if (type === "+" && this.recordsPerPage < 20) {
      this.recordsPerPage += 5;
      this.getStudentActivity(1);
    } else if (type === "-" && this.recordsPerPage > 5) {
      this.recordsPerPage -= 5;
      this.getStudentActivity(1);
    }
  }

  async exportData(publishAs: string) {
    const learningObjectives = [];
    if(this.forumEvaluateItem.isLearningObjectiveLinked) {
      const res = await this.contentService.getLearningObjectives(this.forumEvaluateItemId);
      if(res.body?.length) {
        learningObjectives.push(res.body.map((objective: any) => objective.title));
      }
    }
    const firstSheet = [
      ['Title', this.forumEvaluateItem.title || ''],
      ['Description', this.forumEvaluateItem.activitymetadata?.[0]?.description?.replace(/<[^>]*>?/gm, '') || ''],
      ['Validity', `${
        moment(this.forumEvaluateItem.activitymetadata?.[0]?.startDate).format('dd MMM yyyy, h:mm a')
      } - ${
        moment(this.forumEvaluateItem.activitymetadata?.[0]?.endDate).format('dd MMM yyyy, h:mm a')
      }`],
      ['Learning Objective', learningObjectives.join(', ')],
      ['Total Questions Asked', this.forumEvaluateItem?.qnAmetaData?.totalQuestions || ''],
      ['Total Answers Given', this.forumEvaluateItem?.qnAmetaData?.totalAnswers || ''],
      ['Total Upvotes Receieved', 0],
      ['Total Verified Answers', 0],
    ];
    let secondSheet = [...this.rows];
    if(this.allRowsSelected) {
      const allRowResponse: any = await this.getAllRows();
      secondSheet = allRowResponse;
      if(this.unselected.length) {
        const unselectedIds = this.unselected.map((ele) => ele.id);
        secondSheet = secondSheet.filter((row) => !unselectedIds.includes(row.id));
      }
    } else if(this.selected.length) {
      secondSheet = this.selected;
    }
    if(publishAs === 'pdf') {
      this.exportAsPdf(firstSheet, secondSheet);
    } else if(publishAs === 'xlsx') {
      this.exportAsXlsx(firstSheet, secondSheet);
    }
  }

  getPayloadForPublishUnpublish(){
    let payload = {};
    if(this.allRowsSelected){
      const excludedUserIds = this.unselected.map((user) => user.id);
      payload= {
        allUsers: true,
        excludedUserIds
      };
    }
    else{
      const selectedUserIds = this.selected.map((user) => user.id);
      payload = {
        userIds: selectedUserIds,
        allUsers: false
      };
    }
    return payload;
  }

  async publishGradeFeedback(type:string){
    const payload = this.getPayloadForPublishUnpublish();
    const dialog = { title: { translationKey: "discussionForums.dialog.publishGrade" } };
    const allowPublish = await this.dialogService.showConfirmDialog(dialog);
    if(allowPublish){
      try{
        const response: any = await this.discussionForumService.publishGradeFeedback(payload,this.forumEvaluateItemId,type);
        if(response.status===200){
          this.findElementAndAddStatus(type,true);
          let title = "";
          if(type==="both"){
            title = "Grade and Feedback";
          }
          else{
            title = this.getTitleWithUpperCase(type);
          }
          this.showSuccessToast(`${title} Published Successfully`);
        }
      }
      catch(err:any){
        this.showErrorToast(err.error);
      }
    }
  }

  async unpublishFeedback(type:string){
    const payload = this.getPayloadForPublishUnpublish();
    try{
      const response: any = await this.discussionForumService.unpublishFeedback(payload,this.forumEvaluateItemId,type);
      if(response.status===200){
        this.findElementAndAddStatus(type,false);
        const title = this.getTitleWithUpperCase(type);
        this.showSuccessToast(`${title} UnPublished Successfully`);
      }
    }
    catch(err:any){
      this.showErrorToast(err.error);
    }
  }

  getTitleWithUpperCase(title:string){
    return title[0].toUpperCase() + title.slice(1);
  }

  async getAllRows(): Promise<{[key: string]: any}[]> {
    const response: any = await this.discussionForumService.studentActivityResult(this.forumEvaluateItemId, this.courseId);
    const rowData = this.createDataTable(response.paginatedDiscussionElements, this.forumEvaluateItem.subType);
    return rowData;
  }

  exportAsPdf(firstSheet: string[][], secondSheet: {[key: string]: string}[]) {
    const headerCells = Object.keys(secondSheet[0]).map((cell) => ({
      width: `${100/Object.keys(secondSheet[0]).length}%`,
      bold: true,
      text: cell
    }));
    const bodyCells = secondSheet.map((row) => Object.values(row).map((cell) => ({
      width: `${100/Object.values(row).length}%`,
      text: cell,
    })));
    
    this.pdfmakeService.create();
    this.pdfmakeService.addTable({
      widths: '*',
      headerRows: 0,
      body: firstSheet
    });
    this.pdfmakeService.addPageBreak('after');
    this.pdfmakeService.addTable({
      widths: headerCells.map((cell) => cell.width),
      headerRows: 1,
      body: [
        headerCells,
        ...bodyCells,
      ]
    });
    const fileName = this.forumEvaluateItem.title;
    this.pdfmakeService.download(fileName);
    this.pdfmakeService.destroy();
  }

  exportAsXlsx(firstSheet: string[][], secondSheet: {[key: string]: string}[]) {
    this.xlsxService.create();
    this.xlsxService.createSheetFromJson([{
      skipHeader: true,
      data: firstSheet,
    }]);
    this.xlsxService.createSheetFromJson([{
      data: secondSheet,
    }]);
    const fileName = this.forumEvaluateItem.title;
    this.xlsxService.download(fileName);
    this.xlsxService.destroy();
  }

  sortCallback(event: any) {
    if(event.column.prop === 'Username') {
      this.sortConfig.sortBy = 'userName';
      this.sortConfig.sortOrder = event.newValue;
      this.getStudentActivity(1);
    }
  }

  showErrorToast(message: string): void {
    this.toastrService.error(message, '', {
      positionClass: 'toast-top-center',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }

  showSuccessToast(message: string) {
    this.toastrService.success(message, '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }

  public scrollIconCheck(scrollPosition: 'left' | 'right' = 'right') {
    if(this.datatable?.bodyComponent) {
      const scrollableAmount = this.datatable.bodyComponent.scroller.element.scrollWidth - this.datatable.bodyComponent.innerWidth;
      const scrolledAmount = this.datatable.bodyComponent.scroller.scrollXPos;
      if(scrollPosition === 'left') {
        if(!scrolledAmount) {
          return false;
        }
        return true;
      }
      if(scrollableAmount >= scrolledAmount) {
        return true;
      }
      return false;
    }
    return false;
  }

  public scrollDatatableBody(scrollPosition: 'left' | 'right' = 'right'): void {
    const bodyElementRef = this.datatable.element.querySelector('.datatable-body');
    let scrollAmount = 150;
    if(bodyElementRef) {
      if(scrollPosition === 'left') {
        scrollAmount = bodyElementRef.scrollLeft - scrollAmount;
        bodyElementRef.scroll({
          left: scrollAmount,
          behavior: 'smooth'
        });
        return;
      }
      scrollAmount = bodyElementRef.scrollLeft + scrollAmount;
      bodyElementRef.scroll({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}
