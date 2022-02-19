/* eslint-disable no-invalid-this */
/* eslint-disable no-console */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';
import { DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { ForumType } from 'src/app/enums/forumType';
import moment from 'moment';
import { Page } from 'src/app/Models/page';
import { ContentService } from '../../course-services/content.service';
import { PdfmakeService } from 'src/app/services/pdfmake.service';
import { XlsxService } from 'src/app/services/xslx.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forum-statistics',
  templateUrl: './forum-statistics.component.html',
  styleUrls: ['./forum-statistics.component.scss']
})
export class ForumStatisticsComponent implements OnInit {

  forumStatisticsItemId: any;
  forumStatisticsItem: any;
  selectedItemsLength = 0;
  selection: SelectionType;
  courseId: any;
  studentActivities: any;
  standardDiscussionStatisticsDataTable = false;
  rows: {[key: string]: string}[] = [];
  recordsPerPage = 5;
  allRowsSelected = false;
  page = new Page();
  columns = [{
    prop: 'selected',
    name: '',
    sortable: false,
    canAutoResize: false,
    draggable: false,
    resizable: false,
    width: 30
  }, { prop: 'Username' }, { prop: 'ParticipationStatus' }, { prop: 'ThreadsInitiated' }, { prop: 'ThreadsParticipated' }, { prop: 'UpvotesReceived' }];
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
  }, { prop: 'Username' }, { prop: 'ParticipationStatus' }, {prop: 'ContentAccessible'}, {prop: 'VerifiedAnswers'}, { prop: 'QuestionsPosted' }, { prop: 'AnswersGiven' }, { prop: 'UpvotesReceived' }];
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
    private pdfmakeService: PdfmakeService,
    private xlsxService: XlsxService,
  ) {
    this.selection = SelectionType.checkbox;
  }

  async ngOnInit() {
    this.forumStatisticsItemId = await this.activatedRoute.snapshot.paramMap.get('forumId');
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.courseId = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.params.courseId;
    const currentDiscussionItem = await this.discussionForumService.forumDetail(this.forumStatisticsItemId, this.courseId);
    this.forumStatisticsItem = currentDiscussionItem;
    await this.getStudentActivity();
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
    this.studentActivities.forEach((users:any) => {
      if(users.userName === row.Username){
        userId = users.userId;
      }
    });
    this.router.navigate(['../forum-content-user-details/' + this.forumStatisticsItemId], { relativeTo: this.activatedRoute, queryParams: { userId: userId}, queryParamsHandling: 'merge' });
  }

  async getStudentActivity(pageNo = 1) {
    const forumType = this.forumStatisticsItem.subType;
    const res = await this.discussionForumService.studentActivityResult(this.forumStatisticsItemId, this.courseId, {
      limit: this.recordsPerPage,
      pageNo
    }, this.sortConfig).catch((err: any) => {
      console.log(err);
    });
    this.studentActivities = res.paginatedDiscussionElements;
    this.page.size = this.recordsPerPage;
    this.page.totalElements = res.paginationInfo.totalItems;
    this.page.pageNumber = res.paginationInfo.currentPage;
    this.loadStatisticsDataTable(forumType);
  }

  setPage(event: any) {
    this.getStudentActivity(event.offset + 1);
  }

  createDataTable(studentActivities: any, forumType: ForumType): {[key: string]: any}[] {
    const rowData: {[key: string]: any}[]= [];
    if(forumType === ForumType.STANDARD_DISCUSSION_FORUM){
      studentActivities.forEach((element: any) => {
        const obj: Record<string, any> = {
          "id": element.userId,
          "Username": element.userName,
          "ParticipationStatus": 'Not Participated',
          "ThreadsInitiated": element.questionsInitiated || 0,
          "ThreadsParticipated": element.threadsParticipated || 0,
          "UpvotesReceived": element.numberOfUpvotes || 0,
        };
        if(this.forumStatisticsItem.activitymetadata[0].isGradable) {
          obj['GradeStatus'] = element.isGradable;
          obj['OverallScore'] = element.isGradable ? element.score : '-';
        }
        if (element.questionsInitiated || element.threadsParticipated || element.numberOfVotes) {
          obj.ParticipationStatus = "Participated";
        }
        rowData.push(obj);
      });
      this.standardDiscussionStatisticsDataTable = true;
    }else{
      studentActivities.forEach((element: any) => {
        const obj: Record<string, any> = {
          "id": element.userId,
          "Username": element.userName,
          "ParticipationStatus": 'Not Participated',
          "ContentAccessible": element.attachedContents?.length || 0,
          "VerifiedAnswers": 0,
          "QuestionsPosted": element.questionsInitiated || 0,
          "AnswersGiven": element.threadsParticipated || 0,
          "UpvotesReceived": element.numberOfUpvotes || 0,
        };
        if(this.forumStatisticsItem.activitymetadata[0].isGradable) {
          obj['GradeStatus'] = element.isGradable;
          obj['OverallScore'] = element.isGradable ? element.score : '-';
        }
        if (element.questionsInitiated || element.threadsParticipated || element.numberOfUpvotes) {
          obj.ParticipationStatus = "Participated";
        }
        rowData.push(obj);
      });
    }
    return rowData;
  }

  loadStatisticsDataTable(forumType: any){
    const rowData = this.createDataTable(this.studentActivities, forumType);
    this.rows = rowData;
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

  async exportData(publishAs: string) {
    const learningObjectives = [];
    if(this.forumStatisticsItem.isLearningObjectiveLinked) {
      const res = await this.contentService.getLearningObjectives(this.forumStatisticsItemId);
      if(res.body?.length) {
        learningObjectives.push(res.body.map((objective: any) => objective.title));
      }
    }
    const firstSheet = [
      ['Title', this.forumStatisticsItem.title || ''],
      ['Description', this.forumStatisticsItem.activitymetadata?.[0]?.description?.replace(/<[^>]*>?/gm) || ''],
      ['Validity', `${
        moment(this.forumStatisticsItem.activitymetadata?.[0]?.startDate).format('dd MMM yyyy, h:mm a')
      } - ${
        moment(this.forumStatisticsItem.activitymetadata?.[0]?.endDate).format('dd MMM yyyy, h:mm a')
      }`],
      ['Learning Objective', learningObjectives.join(', ')],
      ['Total Questions Asked', this.forumStatisticsItem?.qnAmetaData?.totalQuestions || ''],
      ['Total Answers Given', this.forumStatisticsItem?.qnAmetaData?.totalAnswers || ''],
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
      secondSheet = [...this.selected];
    }
    if(publishAs === 'pdf') {
      this.exportAsPdf(firstSheet, secondSheet);
    } else if(publishAs === 'xlsx') {
      this.exportAsXlsx(firstSheet, secondSheet);
    }
  }

  async getAllRows(): Promise<{[key: string]: any}[]> {
    const response: any = await this.discussionForumService.studentActivityResult(this.forumStatisticsItemId, this.courseId).catch((err: any) => {
      console.log(err);
    });
    const rowData = this.createDataTable(response.paginatedDiscussionElements, this.forumStatisticsItem.subType);
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
    const fileName = this.forumStatisticsItem.title;
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
    const fileName = this.forumStatisticsItem.title;
    this.xlsxService.download(fileName);
    this.xlsxService.destroy();
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

  sortCallback(event: any) {
    if(event.column.prop === 'Username') {
      this.sortConfig.sortBy = 'userName';
      this.sortConfig.sortOrder = event.newValue;
      this.getStudentActivity(1);
    }
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
