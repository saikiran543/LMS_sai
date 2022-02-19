/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable require-atomic-updates */
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ElementStatuses } from 'src/app/enums/ElementStatuses';
import { StorageKey } from 'src/app/enums/storageKey';
import { UserRoles } from 'src/app/enums/userRoles';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { StorageService } from 'src/app/services/storage.service';
import moment from 'moment';
import { GradedForumValidityState } from 'src/app/enums/gradedForumValidityState';
import { ForumType } from 'src/app/enums/forumType';
import { DialogService } from 'src/app/services/dialog.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-discussion-forum-content',
  templateUrl: './discussion-forum-content.component.html',
  styleUrls: ['./discussion-forum-content.component.scss']
})
export class DiscussionForumContentComponent implements OnInit {
  courseId: any;
  userCurrentView: any;
  elementStatuses= ElementStatuses;
  userRole = UserRoles;
  forumValidityState: GradedForumValidityState | null = null
  @Input() forumDetail: any = {breadcrumbTitle: '', title: '', type: ForumType.STANDARD_DISCUSSION_FORUM, description: '', createdAt: '', status: '', activityId: '', isGradable: '', originalFileName: '', fileName: '', startDate: '', endDate: '', learningObjectives: '', showValidity: false, clickable: false, isParticipated: false }
  
  constructor(
    private storageService: StorageService,
    private contentService: ContentService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contentPlayerService: ContentPlayerService,
    private elementRef: ElementRef,
    private dialogService: DialogService,
    private toastrService: ToastrService,
  ) { }

  async ngOnInit() {
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.courseId = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.params.courseId;
    this.userCurrentView = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    await this.moreLessOption();
    this.computeForumDependencies();
  }

  computeForumDependencies(){
    if(this.forumDetail.startDate && this.forumDetail.endDate) {
      if(moment().isAfter(moment(this.forumDetail.startDate))) {
        if(moment().isBefore(moment(this.forumDetail.endDate))) {
          this.forumValidityState = GradedForumValidityState.ONGOING;
        } else {
          this.forumValidityState = GradedForumValidityState.EXPIRED;
        }
      }
    }
  }

  moreContent(forum: any, event: any): void {
    event.stopPropagation();
    forum.isTextFullHeight = !forum.isTextFullHeight;
  }

  async publishUnpublish(event: any) {
    const elementId = this.forumDetail.activityId;
    if (event.target.checked) {
      event.target.checked = false;
      let titleTranslationKey = '';
      if(this.forumValidityState) {
        if(this.forumValidityState === GradedForumValidityState.ONGOING) {
          titleTranslationKey = this.forumDetail.type === ForumType.STANDARD_DISCUSSION_FORUM ? `discussionForums.forumList.publishForumConfirmationValidityStartedNoteSDF` : `discussionForums.forumList.publishForumConfirmationValidityStartedNoteDCF`;
        } else if(this.forumValidityState === GradedForumValidityState.EXPIRED) {
          titleTranslationKey = this.forumDetail.type === ForumType.STANDARD_DISCUSSION_FORUM ? `discussionForums.forumList.publishForumConfirmationValidityExpiredNoteSDF` : `discussionForums.forumList.publishForumConfirmationValidityExpiredNoteDCF`;
        }
      }
      const translationKey = `discussionForums.forumList.publishForumConfirmation`;
      const dialog = {title: {translationKey}};
      const confirmation = await this.dialogService.showConfirmDialog(dialog);
      if(!confirmation) {
        return;
      }
      try {
        await this.contentService.publish(this.courseId, elementId, true);
        const translationKey = `discussionForums.forumList.publishedSuccessMessage`;
        this.showToaster(translationKey, titleTranslationKey);
        this.forumDetail.status = ElementStatuses.PUBLISHED;
        this.storageService.broadcastValue('forumPublishStatusUpdate', {
          forumId: elementId,
          published: true,
        });
      } catch (error: any) {
        this.showToaster(error.error, '', 'error');
      }
    } else {
      event.target.checked = true;
      let translationKey = this.forumDetail.type === ForumType.STANDARD_DISCUSSION_FORUM ? `discussionForums.forumList.unPublishForumConfirmationSDF` : `discussionForums.forumList.unPublishForumConfirmationDCF`;
      if(this.forumDetail.isParticipated) {
        translationKey = this.forumDetail.type === ForumType.STANDARD_DISCUSSION_FORUM ? `discussionForums.forumList.unPublishForumConfirmationSDFParticipated` : `discussionForums.forumList.unPublishForumConfirmationDCFParticipated`;
      }
      const dialog = {title: {translationKey}};
      const confirmation = await this.dialogService.showConfirmDialog(dialog);
      if(!confirmation) {
        return;
      }
      try {
        await this.contentService.unPublish(this.courseId, elementId);
        const translationKey = `discussionForums.forumList.unPublishedSuccessMessage`;
        this.showToaster(translationKey);
        this.forumDetail.status = ElementStatuses.UNPUBLISHED;
        this.storageService.broadcastValue('forumPublishStatusUpdate', {
          forumId: elementId,
          published: false,
        });
      } catch (error: any) {
        this.showToaster(error.error, '', 'error');
      }
    }
  }

  async showToaster(messageTranslationKey: string, titleTranslationKey = '', type: "success" | "error" = "success") {
    const message = await firstValueFrom(this.translate.get(messageTranslationKey));
    const toastrConfig = {
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    };
    let title = '';
    if(titleTranslationKey) {
      title = await firstValueFrom(this.translate.get(titleTranslationKey));
    }
    if(type === 'success') {
      this.toastrService.success(message, title, toastrConfig);
    } else if(type === 'error') {
      this.toastrService.error(message, title, toastrConfig);
    }
  }

  goToForumDetail(activityId: any) {
    if(this.forumDetail.clickable){
      this.router.navigate(['../forum-detail/' + activityId], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve' });
    }
  }

  async downloadAttachment() {
    const s3Data = await this.contentPlayerService.getSignedUrl(this.forumDetail.fileName, this.forumDetail.originalFileName);
    window.open(s3Data.body.url);
  }

  async moreLessOption(){
    const allElements = await this.elementRef.nativeElement.querySelectorAll('.forum-description span.df-description');
    [].forEach.call(allElements, (element: any) => {
      const divHeight = element.offsetHeight;
      const lineHeight = 28;
      const lines = divHeight / lineHeight;
      if(element && lines > 3){
        this.elementRef.nativeElement.querySelector('#show-more-'+element.getAttribute('id'))?.classList.add("show");
      }
      else if(element){
        this.elementRef.nativeElement.querySelector('#show-more-'+element.getAttribute('id'))?.classList.remove("show");
      }
    });
  }

}
