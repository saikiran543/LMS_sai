/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-params */
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb';
import { Constants } from 'src/app/constants/Constants';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { StorageService } from 'src/app/services/storage.service';
import { ContentType } from 'src/app/enums/contentType';

@Component({
  selector: 'app-html',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss']
})
export class HtmlComponent implements OnDestroy {
  @ViewChild('iframeHolder') iframeHolder!: ElementRef;
  timespent!: Date;
  zoomValue = 100;
  pageUrl = 'https://edunew.s3.us-east-2.amazonaws.com/html/IT_4.html?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA24YBCO4USNU2N267%2F20211001%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20211001T053608Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCmFwLXNvdXRoLTEiRjBEAiAWLmVHLvymGLYsJfjTzl%2FwgbdxJAffcGR%2FWklS9xmT%2FgIgBQtnOqFGlSV9mONZlrQ1U%2Ff%2FBG%2B9YlYWNiIpsQsxWOwqowMI5%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw3NDg5MzcxODA5NjkiDK4l8TUukuxFOi3HbCr3As6VuVqDqtNX2peycAISYRc56C1LszVOpfVxWdYpZFGnAtXRZShVhwtN1KrvBM3t5I6aP1jt0ItzyoQeTUPejjGmAGsnWSSzjg2PLeZoU6vFKcKLx2EL7MMolpFQ%2FO5frdeUxtZ0CGtQLYFh0LyEQKRw9HFKxmANa036Pif98nixyb3LsGVMxuMNWXVSDu2HJ%2FLNjDYQGSveuvng8BXcYi%2BZeyxtaiTGU8mZLH%2F5gJTbbapPd%2BeUtscdZw6LxWJmLzpZt2Rk4wWCVqsVNWwlU8cwv9EbeW2kqkZem43NuW9Yyvee8dAYRXvHvyORaAE5%2Fj%2F2%2BUSg1%2BUrQyr76d5FCh2oila4eBIQ6BDjRkdm6yycxe9oqshsGJuezFR%2FAxizUxxA9LHRvesrEOr1QXJ3scXQD0DI6u%2F615YGqUgk4%2BX6LX0BSBfUkxMvD4Nz7Luc00y8Sr%2BGHLEncA1cCRHl9FRUmFjJ1TgVI6ABesJvE%2BemrcdHK94hOTCtutqKBjqnAdIuoNtRb2NZVySP8v460s%2FdtxiKHM%2FITFDUEj9N5fA55%2BtKZYPoTUfNixxKvfI68nIUUKk%2BrvNs7uyvYBS%2BMIDYH%2Bmegx6%2BEPm9akS9FhHgXOfiyZaDNQUAOBu41R2eJDKr2MJpYdK75zZ0kDeBPn77OgifuAsBTDa2dWKcSbCN5Ykb8%2BTYhJdx0lkqJlcUUBPhHcYBb9qo8uW%2BL91RRHha6xc7Xoxw&X-Amz-Signature=54f61cdbdcc0ca8f490e50061d2487cfe645904cfbb16d2ba655fa3e05701ea8&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3DIT_4.html';
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  // eslint-disable-next-line no-invalid-this
  position = new FormControl(this.positionOptions[0]);
  contentId!: string;
  courseId!: string;
  showHeaderFooter!: boolean;
  showHeaderFooterTimeout!: any;
  rotateAngle = 0;
  elementData: any = null;
  widthIframe = 55;
  fitToWidth = false;
  isFullScreen = false;
  bookmarked = false;
  contentTypes: any = ContentType;
  activeTab = 'overview'

  constructor(private router: Router, private route: ActivatedRoute, private contentService: ContentService, private contentPlayerService: ContentPlayerService, private storageService: StorageService, private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService, private leftNavService: LeftNavService, private sanitizer: DomSanitizer, private configService: ConfigurationService) { }
  ngOnInit(): void {
    this.fitToWidth = this.route.snapshot.queryParamMap.get('leftMenu') === 'true' ? true : false;
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain, @typescript-eslint/no-non-null-assertion
    this.contentId = this.route.snapshot.parent?.parent?.paramMap.get('id')!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain, @typescript-eslint/no-non-null-assertion
    this.courseId = this.route.snapshot.parent?.parent?.parent?.parent?.parent?.paramMap.get('courseId')!;
    this.storageService.listen(StorageKey.ELEMENT_DETAIL).subscribe((res) => {
      this.elementData = res;
      // this.elementData.description = this.sanitizer.bypassSecurityTrustHtml(this.elementData.description);
      this.checkBookmarkState();
    });
    this.timespent = new Date();
    const breadcrumb = { programName: 'BBA', semester: 'semester1', topicName: 'Crash course in Account & Finance', subtitle: this.elementData.title };
    this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
  }

  checkBookmarkState(): void {
    this.bookmarked = !!this.elementData?.isBookMarked;
  }

  ngAfterViewInit(): void {
    const jwtToken = localStorage.getItem(Constants.JWT_TOKEN);
    document.cookie = `contentId=${this.elementData.elementId};path=/;secure;SameSite=None`;
    document.cookie = `authToken=${jwtToken};path=/;secure;SameSite=None;`;
    this.iframeHolder.nativeElement.src = `/api/courseservice/content-store/getHTML/index.html`;
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
        courseId,
      };
      this.bookmarked = await this.contentService.createBookmark(payload);
    }
    this.leftNavService.nodeDetailsEmitter.next(elementId);
  }

  zoom(zoomCase: string): void {
    const el = this.iframeHolder.nativeElement;
    switch (zoomCase) {
      case 'positive':
        el.style.width = `${this.widthIframe += 10}vw`;
        this.zoomValue === 195 ? this.zoomValue += 5 : this.zoomValue += 10;
        break;
      case 'negative':
        el.style.width = `${this.widthIframe -= 10}vw`;
        this.zoomValue === 30 ? this.zoomValue -= 5 : this.zoomValue -= 10;
        break;
    }
  }
  rotate(): void {
    const el = this.iframeHolder.nativeElement;
    el.style.transform = `rotate(${this.rotateAngle += 90}deg)`;
    if (this.rotateAngle === 90 || this.rotateAngle === 270) {
      el.style.height = '55vw';
    } else {
      el.style.height = '55vh';
    }
    this.rotateAngle === 360 ? this.rotateAngle = 0 : '';
  }
  toggleToWidth(): void {
    this.fitToWidth = !this.fitToWidth;
    this.router.navigate([], { relativeTo: this.route, queryParams: { leftMenu: this.fitToWidth }, queryParamsHandling: 'merge' });
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

  async downloadFile(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await this.contentPlayerService.getSignedUrl(this.elementData.s3FileName, this.elementData.originalFileName);
    window.open(response.body.url);
  }

  storeProgressTimeLastAccessed(): void {
    const timeDifference = new Date().getTime() - this.timespent.getTime();
    const payload = {
      progress: 100,
      lastAccessedPoint: 'Completed',
      timeSpent: timeDifference
    };
    this.elementData ? this.contentPlayerService.saveProgress(payload, this.courseId, this.contentId) : "";
  }

  ngOnDestroy(): void {
    this.storeProgressTimeLastAccessed();
  }
  async getPreviousElement(): Promise<void> {
    const previousElement = await this.contentPlayerService.getPreviousElement(this.courseId, this.contentId);
    this.router.navigate([`../../${previousElement.body.elementId}`], { relativeTo: this.route, queryParamsHandling: 'merge' });
    this.leftNavService.nodeActionPreviousNext.next(previousElement.body.elementId);
  }

  async getNextElement(): Promise<void> {
    const nextElement = await this.contentPlayerService.getNextElement(this.courseId, this.contentId);
    this.router.navigate([`../../${nextElement.body.elementId}`], { relativeTo: this.route, queryParamsHandling: 'merge' });
    this.leftNavService.nodeActionPreviousNext.next(nextElement.body.elementId);
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onRouterActivate(tab: any): void {
    if (tab) {
      this.activeTab = 'shared';
    }
  }
}
