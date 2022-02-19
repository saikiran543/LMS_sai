/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { DialogTypes } from 'src/app/enums/Dialog';
import { ElementStatuses } from 'src/app/enums/ElementStatuses';
import { ForumType } from 'src/app/enums/forumType';
import { StorageKey } from 'src/app/enums/storageKey';
import { UserRoles } from 'src/app/enums/userRoles';
import { Dialog } from 'src/app/Models/Dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { JWTService } from 'src/app/services/jwt.service';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { StorageService } from 'src/app/services/storage.service';
import { DiscussionForumService } from '../../discussion-forum-services/discussion-forum.service';

@Component({
  selector: 'app-forum-content-qna-threads-statistics',
  templateUrl: './forum-content-qna-threads-statistics.component.html',
  styleUrls: ['./forum-content-qna-threads-statistics.component.scss']
})
export class ForumContentQnaThreadsStatisticsComponent implements OnInit {

  currentDiscussionItemId: any;
  forumToast = false;
  toastType = 'error'
  toastMessage: any = "";
  activeNode: any;
  modelRef!: NgbModalRef;
  courseId: any;
  @ViewChild(ToastContainerDirective, { static: false })
  toastContainer!: ToastContainerDirective;
  @Output() confirmStatus = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() widgetData: any = { level: '', options: true, type: '', activityId: '', threads: '', replies: '', lastAccessedBy: '', lastAccessedAt: '', parentElementId: '', status: '', isBookMarked: false, startDate: '', endDate: '' };
  userCurrentView: any;
  userRole = UserRoles;
  forumType = ForumType;
  forumStatuses = ElementStatuses;
  validityExpired = false;
  unsubscribeFromStorageService$ = new Subject<void>();
  @Output() deleteEvent = new EventEmitter<{
    id: string,
    type: ForumType,
  }>();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private discussionForumService: DiscussionForumService,
    private ngbModal: NgbModal,
    private translate: TranslateService,
    private toastrService: ToastrService,
    private dialogService: DialogService,
    private leftNavService: LeftNavService,
    private jwtService: JWTService,
    private storageService: StorageService
  ) { }

  async ngOnInit() {
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.courseId = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.params.courseId;
    this.userCurrentView = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    this.validityExpired = this.checkForValidityExpiry();
    this.listenToStorageService();
  }

  checkForValidityExpiry(): boolean {
    const now = moment();
    const end = moment(this.widgetData.endDate);
    if (now.isAfter(end)) {
      return true;
    }
    return false;
  }

  async listenToStorageService() {
    this.storageService.listen('forumPublishStatusUpdate').pipe(
      takeUntil(this.unsubscribeFromStorageService$),
      filter((ele) => ele.forumId === this.widgetData.activityId),
    ).subscribe((ele: {
      forumId: string,
      published: boolean,
    }) => {
      this.widgetData.status = ele.published ? ElementStatuses.PUBLISHED : ElementStatuses.UNPUBLISHED;
    });
  }

  evaluate(activityId: any) {
    if (this.widgetData.startDate && this.widgetData.endDate) {
      if (moment().isBefore(this.widgetData.endDate)) {
        const dialogOption: Dialog = {
          type: DialogTypes.ERROR,
          title: {
            translationKey: `discussionForums.forumList.errorEvaluationBeforeExpiry`
          }
        };
        this.dialogService.showAlertDialog(dialogOption);
        return;
      }
    }
    if (this.widgetData.status !== "draft") {
      if (this.widgetData.level === 'firstLevel') {
        this.router.navigate(['../forum-evaluate/' + activityId], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
      } else {
        this.router.navigate(['../../forum-evaluate/' + activityId], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
      }
    }
  }

  async publishAllGradeFeedback(activityId: any, type: any) {
    const dialog = { title: { translationKey: "discussionForums.dialog.publishAllGrade" } };
    const allowPublish = await this.dialogService.showConfirmDialog(dialog);
    if (allowPublish) {
      try {
        const response: any = await this.discussionForumService.publishGradeFeedback({ allUsers: true }, activityId, type);
        if (response.status === 200) {
          let title = "";
          if (type === "both") {
            title = "Grade and Feedback";
          }
          else {
            title = this.getTitleWithUpperCase(type);
          }
          this.showSuccessToast(`${title} Published Successfully`);
        }
      }
      catch (err: any) {
        this.showErrorToast(err.error);
      }
    }
  }

  async edit(activityId: string, type: string) {
    const activityType = type === ForumType.DOUBT_CLARIFICATION_FORUM ? 'doubt-clarification-forum' : 'standard-disucssion-forum';
    if (this.widgetData.level === 'firstLevel') {
      this.router.navigate(['../manipulate/edit/discussion-forum/' + activityType + '/' + activityId], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['../../manipulate/edit/discussion-forum/' + activityType + '/' + activityId], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
    }
  }

  async deleteForum(activityId: any, event: any, parentElementId: any, type: any) {
    event.stopPropagation();
    let translationKey = type === ForumType.STANDARD_DISCUSSION_FORUM ? 'discussionForums.forumList.deleteConfirmationSDF' : 'discussionForums.forumList.deleteConfirmationDCF';
    const translateArgs = {} as any;
    if (this.widgetData.threads || this.widgetData.replies) {
      translationKey = type === ForumType.STANDARD_DISCUSSION_FORUM ? `discussionForums.forumList.deleteConsumedActivityConfirmationSDF` : `discussionForums.forumList.deleteConsumedActivityConfirmationDCF`;
    }
    const confirmation = await this.dialogService.showConfirmDialog({ title: { translationKey, translateArgs } });
    if (confirmation) {
      if (!parentElementId) {
        parentElementId = this.courseId;
      }
      await this.discussionForumService.deleteForum(this.courseId, activityId, parentElementId).then(async (res: any) => {
        if (res.status === 200) {
          const deletedForum: any = { id: activityId, type: type };
          this.deleteEvent.emit(deletedForum);
        } else {
          throw new Error("Something went wrong!!");
        }

      }).catch((err: any) => {
        this.forumToast = true;
        this.toastType = "error";
        this.toastMessage = err.error || err;
      });
    } else {
      if (this.modelRef) {
        this.modelRef.close();
      }
      this.sendConfirmStatus(false);
      // eslint-disable-next-line no-useless-return
      return;
    }
  }

  sendConfirmStatus(value: boolean): void {
    const payload = { type: value, node: this.activeNode };
    this.confirmStatus.emit(payload);
  }

  closeToast(): void {
    this.forumToast = false;
    if (this.modelRef) {
      this.modelRef.close();
    }
  }

  statistics(activityId: any) {
    if (this.widgetData.status !== "draft") {
      if (this.widgetData.level === 'firstLevel') {
        this.router.navigate(['../forum-statistics/' + activityId], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
      } else {
        this.router.navigate(['../../forum-statistics/' + activityId], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
      }
    }
  }

  async bookmark(elementId: any) {
    await this.discussionForumService.createBookmarkByElementId(elementId, this.courseId).then(async (res: any) => {
      if (res.status === 200) {
        this.forumToast = true;
        this.widgetData.isBookMarked = true;
        this.toastType = "success";
        let deletedSuccessMessage;
        this.translate.get("discussionForums.forumList.bookMarkedSuccessMessage").subscribe(val => {
          deletedSuccessMessage = val;
        });
        this.toastMessage = deletedSuccessMessage;
      } else {
        throw new Error("Something went wrong!!");
      }

    }).catch((err: any) => {
      this.forumToast = true;
      this.toastType = "error";
      this.toastMessage = err.error || err;
    });

  }

  async removeBookmark(elementId: any) {
    await this.discussionForumService.deleteBookmark(elementId, this.courseId).then(async (res: any) => {
      if (res.status === 200) {
        this.forumToast = true;
        this.widgetData.isBookMarked = false;
        this.toastType = "success";
        let deletedSuccessMessage;
        this.translate.get("discussionForums.forumList.bookMarkedRemovedMessage").subscribe(val => {
          deletedSuccessMessage = val;
        });
        this.toastMessage = deletedSuccessMessage;
      } else {
        throw new Error("Something went wrong!!");
      }

    }).catch((err: any) => {
      this.forumToast = true;
      this.toastType = "error";
      this.toastMessage = err.error || err;
    });
  }

  ngOnDestory() {
    this.unsubscribeFromStorageService$.next();
    this.unsubscribeFromStorageService$.complete();
  }

  getTitleWithUpperCase(title: string) {
    return title[0].toUpperCase() + title.slice(1);
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

  showErrorToast(message: string): void {
    this.toastrService.error(message, '', {
      positionClass: 'toast-top-center',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }

}
