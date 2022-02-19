/* eslint-disable require-atomic-updates */
/* eslint-disable no-invalid-this */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ElementStatuses } from 'src/app/enums/ElementStatuses';
import { ForumSortOptions } from 'src/app/enums/forumSortOptions';
import { ForumType } from 'src/app/enums/forumType';
import { StorageKey } from 'src/app/enums/storageKey';
import { UserRoles } from 'src/app/enums/userRoles';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { ContentService } from '../../course-services/content.service';
import { DiscussionForumService } from '../discussion-forum-services/discussion-forum.service';

@Component({
  selector: 'app-forum-content-list',
  templateUrl: './forum-content-list.component.html',
  styleUrls: ['./forum-content-list.component.scss']
})
export class ForumContentListComponent implements OnInit {
  header = true;
  discussionData: any=[];
  courseId: any;
  forumToast = false;
  toastType = 'error'
  toastMessage: any = "";
  userCurrentView: any;
  userRole = UserRoles;
  forumType = ForumType;
  forumSortOptions = ForumSortOptions
  discussionDataShow = false;
  discussionDataEmptyScreen = false;
  sortOrder = 'asc';
  allDiscussionData: any;
  elementStatuses= ElementStatuses;
  loading!: boolean;
  moreLess = false;
  paginationConfig = {
    id: 'loadStandardDiscussionPagination',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 5
  };
  paginationConfigForDoubtClarification = {
    id: 'loadDoubtDiscussionPagination',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 5
  };
  unsubscribeSDFParams$ = new Subject<void>();
  routerParams: any;
  unsubscribeDCFParams$ = new Subject<void>();

  @ViewChild('doubtClarificationTab') doubtClarificationTabBtn!: ElementRef;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private contentService: ContentService,
    private discussionForumService: DiscussionForumService,
    private translate: TranslateService,
    private routeOperationService: RouteOperationService,
  ) {
  }

  async ngAfterViewInit() {
    await this.openActiveTab();
  }

  async openActiveTab(){
    if (this.routerParams.forumType === ForumType.DOUBT_CLARIFICATION_FORUM) {
      this.doubtClarificationTabBtn.nativeElement.click();
    }else{
      await this.getPage(this.paginationConfig.currentPage, this.routerParams.forumType);
    }
  }

  async ngOnInit() {
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.courseId = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.params.courseId;
    this.userCurrentView = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    this.activatedRoute.params.subscribe((params) => {
      this.routerParams = params;
    });

    this.routeOperationService.listen('pageNumberSDF').pipe(takeUntil(this.unsubscribeSDFParams$)).subscribe((pageNumber: string)=>{
      if(pageNumber){
        this.paginationConfig.currentPage = +pageNumber;
      }else{
        this.router.navigate([],{queryParams: {pageNumberSDF: this.paginationConfig.currentPage},queryParamsHandling: 'merge'});
      }
    });

    this.routeOperationService.listen('pageNumberDCF').pipe(takeUntil(this.unsubscribeDCFParams$)).subscribe((pageNumberDCF: string)=>{
      if(pageNumberDCF){
        this.paginationConfigForDoubtClarification.currentPage = +pageNumberDCF;
      }else{
        this.router.navigate([],{queryParams: {pageNumberDCF: this.paginationConfigForDoubtClarification.currentPage},queryParamsHandling: 'merge'});
      }
    });
    this.paginationConfig.itemsPerPage = this.paginationConfigForDoubtClarification.itemsPerPage = 10;
  }

  async toggleForum(path: string) {
    this.router.navigate([`../${path}`], {relativeTo: this.activatedRoute, queryParamsHandling: 'merge'});
    this.discussionData = [];
    if(path === ForumType.STANDARD_DISCUSSION_FORUM){
      await this.getPage(this.paginationConfig.currentPage, path);
    }else{
      await this.getPage(this.paginationConfigForDoubtClarification.currentPage, path);
    }
  }

  async deleteEventHandler(res: any) {
    if(res){
      await this.getPage(this.paginationConfig.currentPage, this.routerParams.forumType);
      this.deleteSuccess();
    }
  }

  deleteSuccess(){
    let deletedSuccessMessage;
    this.translate.get("discussionForums.forumList.deletedSuccessMessage").subscribe(val => {
      deletedSuccessMessage = val;
    });
    this.forumToast = true;
    this.toastType = "success";
    this.toastMessage = deletedSuccessMessage;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forumDetail(forum: any, from: any) {
    this.router.navigate(['../forum-detail/' + forum?.activitymetadata[0]?.activityId], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
  }

  moreContent(forum: any, event: any): void {
    event.stopPropagation();
    forum.isTextFullHeight = !forum.isTextFullHeight;
  }

  async publishUnpublish(activity: any, event: any) {
    const elementId = activity?.activitymetadata[0]?.activityId;
    if (event.target.checked) {
      try {
        const res = await this.contentService.publish(this.courseId, elementId, true);
        this.translate.get("discussionForums.forumList.publishedSuccessMessage").subscribe(val => {
          this.showToaster(res, val);
        });
        activity.status = ElementStatuses.PUBLISHED;
      } catch (error: any) {
        this.showToaster(error, error.error);
      }
    } else {
      try {
        const res = await this.contentService.unPublish(this.courseId, elementId);
        this.translate.get("discussionForums.forumList.unPublishedSuccessMessage").subscribe(val => {
          this.showToaster(res, val);
        });
        activity.status = ElementStatuses.UNPUBLISHED;
      } catch (error: any) {
        this.showToaster(error, error.error);
      }
    }
  }

  showToaster(res: any, message: any) {
    if (res.status === 200) {
      this.forumToast = true;
      this.toastType = "success";
      this.toastMessage = message;
    } else {
      this.forumToast = true;
      this.toastType = "error";
      this.toastMessage = message;
    }
  }

  closeToast(): void {
    this.forumToast = false;
  }

  async getPage(page: number, forumType:any) {
    const sortBy = this.activatedRoute.snapshot.queryParams.sortBy;
    if(sortBy) {
      this.sortForum(sortBy, page, forumType);
    } else {
      this.sortForum('', page, forumType);
    }
  }

  async sortForum(sortBy: any, page: any, forumType: any) {
    this.discussionData = [];
    this.allDiscussionData = [];
    if(sortBy){
      this.allDiscussionData = await this.discussionForumService.getDiscussionForumsPaginatedSort(this.courseId, forumType, page, this.paginationConfig.itemsPerPage, sortBy);
    }else{
      this.allDiscussionData = await this.discussionForumService.getDiscussionForumsPaginated(this.courseId, forumType, page, this.paginationConfig.itemsPerPage);
    }
    if(this.routerParams.forumType === ForumType.STANDARD_DISCUSSION_FORUM){
      this.paginationConfig.totalItems = this.allDiscussionData.paginationInfo.totalItems;
      this.paginationConfig.currentPage = this.allDiscussionData.paginationInfo.currentPage;
      if(sortBy){
        this.router.navigate([],{queryParams: {sortBy: sortBy, pageNumberSDF: this.paginationConfig.currentPage},queryParamsHandling: 'merge'});
      }else{
        this.router.navigate([],{queryParams: {pageNumberSDF: this.paginationConfig.currentPage},queryParamsHandling: 'merge'});
      }
    }else{
      this.paginationConfigForDoubtClarification.totalItems = this.allDiscussionData.paginationInfo.totalItems;
      this.paginationConfigForDoubtClarification.currentPage = this.allDiscussionData.paginationInfo.currentPage;
      if(sortBy){
        this.router.navigate([],{queryParams: {sortBy: sortBy, pageNumberDCF: this.paginationConfigForDoubtClarification.currentPage},queryParamsHandling: 'merge'});
      }else{
        this.router.navigate([],{queryParams: {pageNumberDCF: this.paginationConfigForDoubtClarification.currentPage},queryParamsHandling: 'merge'});
      }
    }
    this.discussionData = this.allDiscussionData.paginatedDiscussionElements;
    if(this.discussionData.length){
      this.discussionDataShow = true;
      this.discussionDataEmptyScreen = false;
    }else{
      this.discussionDataShow = false;
      this.discussionDataEmptyScreen = true;
    }
    this.storageService.set(StorageKey.DOC_VERSION, this.allDiscussionData.__v.toString());
  }

  createForum(type: string): void {
    this.router.navigate([`../manipulate/create/discussion-forum/${type}/new`], {relativeTo: this.activatedRoute, queryParamsHandling: 'merge'});
  }

  modifyRecordsPerPage(type: string, forumType:any){
    if(type === 'plus' && this.paginationConfig.itemsPerPage < 20){
      this.paginationConfig.itemsPerPage += 5;
      this.getPage(1, forumType);
    }else if(type === 'minus' && this.paginationConfig.itemsPerPage > 5){
      this.paginationConfig.itemsPerPage -= 5;
      this.getPage(1, forumType);
    }
  }

  modifyRecordsPerPageForDoubt(type: string, forumType:any){
    if(type === 'plus' && this.paginationConfigForDoubtClarification.itemsPerPage < 20){
      this.paginationConfigForDoubtClarification.itemsPerPage += 5;
      this.getPage(1, forumType);
    }else if(type === 'minus' && this.paginationConfigForDoubtClarification.itemsPerPage > 5){
      this.paginationConfigForDoubtClarification.itemsPerPage -= 5;
      this.getPage(1, forumType);
    }
  }

  ngOnDestroy():void {
    this.discussionDataEmptyScreen = false;
    this.discussionDataShow = false;
    this.unsubscribeSDFParams$.next();
    this.unsubscribeSDFParams$.complete();
    this.unsubscribeDCFParams$.next();
    this.unsubscribeDCFParams$.complete();
  }
}