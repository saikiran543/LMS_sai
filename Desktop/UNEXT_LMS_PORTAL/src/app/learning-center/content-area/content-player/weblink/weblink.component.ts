/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentPlayerService } from '../../../course-services/content-player.service';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { ContentType } from 'src/app/enums/contentType';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb';

@Component({
  selector: 'app-weblink',
  templateUrl: './weblink.component.html',
  styleUrls: ['./weblink.component.scss']
})
export class WeblinkComponent implements OnInit, OnDestroy {
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  // eslint-disable-next-line no-invalid-this
  position = new FormControl(this.positionOptions[0]);
  leftMenuActive!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public contentId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public courseId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elementData: any = null
  showHeaderFooter!: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showHeaderFooterTimeout!: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentTypes: any = ContentType;

  bookmarked = false;

  activeTab = 'overview';

  // eslint-disable-next-line max-params
  constructor(private route: ActivatedRoute, private contentService: ContentService, private contentPlayerService: ContentPlayerService, private storageService: StorageService, private router: Router, private leftNavService: LeftNavService, private sanitizer: DomSanitizer, private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService) { }

  async ngOnInit(): Promise<void> {
    this.contentId = this.route.snapshot.parent?.parent?.paramMap.get('id');
    this.courseId = this.route.snapshot.parent?.parent?.parent?.parent?.parent?.paramMap.get('courseId');
    this.storageService.listen(StorageKey.ELEMENT_DETAIL).subscribe((res) => {
      this.elementData = res;
      this.checkBookmarkState();
    });
    const breadcrumb = { programName: 'BBA', semester: 'semester1', topicName: 'Crash course in Account & Finance', subtitle: this.elementData.title };
    this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
  }

  checkBookmarkState(): void {
    this.bookmarked = this.elementData.isBookMarked;
  }

  async toggleBookmark(): Promise<void> {
    const { bookmarked, courseId, elementData } = this;
    const elementId = elementData.elementId;
    if (bookmarked) {
      const deleted = await this.contentService.deleteBookmark(elementId, elementData.originalFileName);
      if (deleted) {
        this.bookmarked = false;
      }
    } else {
      const payload = {
        elementId,
        courseId
      };
      this.bookmarked = await this.contentService.createBookmark(payload);
    }
    this.leftNavService.nodeDetailsEmitter.next(elementId);
  }

  async getPreviousElement(): Promise<void> {
    const previousElement = await this.contentPlayerService.getPreviousElement(this.courseId, this.contentId);
    this.router.navigate([`../../${previousElement.body.elementId}`], { relativeTo: this.route, queryParamsHandling: 'merge' });
    this.leftNavService.nodeActionPreviousNext.next(previousElement.body.elementId);
    this.elementData.description = this.sanitizer.bypassSecurityTrustHtml(this.elementData.description);
  }

  async getNextElement(): Promise<void> {
    const nextElement = await this.contentPlayerService.getNextElement(this.courseId, this.contentId);
    this.router.navigate([`../../${nextElement.body.elementId}`], { relativeTo: this.route, queryParamsHandling: 'merge' });
    this.leftNavService.nodeActionPreviousNext.next(nextElement.body.elementId);
  }
  showHideToolBars(visibility: boolean): void {
    if (visibility) {
      clearTimeout(this.showHeaderFooterTimeout);
      this.showHeaderFooter = true;
    } else {
      this.showHeaderFooterTimeout = setTimeout(() => {
        this.showHeaderFooter = false;
        clearTimeout(this.showHeaderFooterTimeout);
      }, 3000);
    }
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRouterActivate(tab: any): void {
    if (tab) {
      this.activeTab = 'shared';
    }
  }

  ngOnDestroy(): void {
    const payload = {
      progress: 100,
      lastAccessedPoint: 'Completed',
      timeSpent: 10
    };
    const userCurrentView = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    userCurrentView === "student" && this.elementData ? this.contentPlayerService.saveProgress(payload, this.courseId, this.contentId) : "";
  }
}
