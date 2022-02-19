/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb';
import { ContentType } from 'src/app/enums/contentType';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { StorageService } from 'src/app/services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentService } from 'src/app/learning-center/course-services/content.service';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.scss']
})
export class ExcelComponent implements OnInit, OnDestroy {
  @ViewChild('excelHolder') excelHolder!: ElementRef;
  @ViewChild('excelHolderParent') excelHolderParent!: ElementRef;
  @ViewChild('excelHolderParentZoom') excelHolderParentZoom!: ElementRef;
  @ViewChild('playerFooter') playerFooter!: ElementRef;
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  // eslint-disable-next-line no-invalid-this
  position = new FormControl(this.positionOptions[0]);
  isFullScreen = false;
  zoomValue = 100;
  showHeaderFooter!: boolean;
  rotateAngle = 0;
  fitToWidth = false;
  transformIframe = 1.0;
  transformIframeOrigin = 0.0;
  showHeaderFooterTimeout!: any;
  elementData: any = null;
  s3Url!: string;
  public contentId: any;
  public courseId: any;
  public rotationValue!: 0 | 90 | 180 | 270;
  public count = 0;
  contentTypes: any = ContentType;
  bookmarked = false;
  activeTab = 'overview'

  constructor(private router: Router,
    private route: ActivatedRoute,
    private contentService: ContentService,
    private contentPlayerService: ContentPlayerService,
    private storageService: StorageService,
    private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,
    private leftNavService: LeftNavService,
    private sanitizer: DomSanitizer) {

  }

  async ngOnInit(): Promise<void> {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.fitToWidth = this.route.snapshot.queryParamMap.get('leftMenu') === 'true' ? true : false;
    this.contentId = this.route.snapshot.parent?.parent?.paramMap.get('id');
    this.courseId = this.route.snapshot.parent?.parent?.parent?.parent?.parent?.paramMap.get('courseId');
    this.storageService.listen(StorageKey.ELEMENT_DETAIL).subscribe((res) => {
      this.elementData = res;
      // this.elementData.description = this.sanitizer.bypassSecurityTrustHtml(this.elementData.description);
      this.checkBookmarkState();
    });
    const s3Data = await this.contentPlayerService.getSignedUrl(this.elementData.s3FileName, this.elementData.originalFileName);
    this.s3Url = s3Data.body.url;
    const breadcrumb = { programName: 'BBA', semester: 'semester1', topicName: 'Crash course in Account & Finance', subtitle: this.elementData.title };
    this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
  }

  checkBookmarkState(): void {
    this.bookmarked = this.elementData.isBookMarked;
  }

  zoom(zoomCase: string): void {
    const el = this.excelHolderParent.nativeElement;
    const parentZoomElement = this.excelHolderParentZoom.nativeElement;
    const playerFooter = this.playerFooter.nativeElement;
    switch (zoomCase) {
      case 'positive':
        el.style.transform = `scale(${this.transformIframe += 0.1})`;
        this.zoomValue === 195 ? this.zoomValue += 5 : this.zoomValue += 10;
        setTimeout(() => {
          parentZoomElement.style.width = "100%";
          parentZoomElement.style.maxWidth = "100%";
        }, 500);
        break;
      case 'negative':
        el.style.transform = `scale(${this.transformIframe -= 0.1})`;
        this.zoomValue === 30 ? this.zoomValue -= 5 : this.zoomValue -= 10;
        break;
    }
    if (this.zoomValue > 100) {
      parentZoomElement.style.overflow = "auto";
      playerFooter.style.bottom = "20px";
    } else {
      parentZoomElement.style.overflow = "initial";
      playerFooter.style.bottom = "0px";
    }
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
        courseId,
        elementId,
      };
      this.bookmarked = await this.contentService.createBookmark(payload);
    }
    this.leftNavService.nodeDetailsEmitter.next(elementId);
  }

  rotate(): void {
    const el = this.excelHolder.nativeElement;
    el.style.transform = `rotate(${this.rotateAngle += 90}deg)`;
    if (this.rotateAngle === 90 || this.rotateAngle === 270) {
      el.style.marginTop = '0';
      el.style.marginLeft = 'auto';
      el.style.marginRight = 'auto';
      el.style.width = '602px';
      if (this.isFullScreen) {
        el.style.marginTop = '0%';
        // el.style.height = '185%';
        el.style.width = '100vh';
      }
    } else {
      el.style.width = '100%';
      el.style.marginTop = '0';
      if (this.isFullScreen) {
        el.style.marginTop = '0';
      }

    }
    this.rotateAngle === 360 ? this.rotateAngle = 0 : '';
    if (this.rotateAngle === 360 || this.rotateAngle === 0) {
      el.style.width = '100%';
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  fullScreen() {
    const el = this.excelHolder.nativeElement;
    el.style.width = '100%';
    el.style.height = '102vh';
    if ([90, 270].includes(this.rotateAngle)) {
      el.style.width = '102vh';
    }
    if (this.isFullScreen) {
      el.style.height = '74vh';
      if ([90, 270].includes(this.rotateAngle)) {
        el.style.width = '602px';
      }
    }
    this.isFullScreen = !this.isFullScreen;
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
    const response: any = await this.contentPlayerService.getSignedUrl(this.elementData.s3FileName, this.elementData.originalFileName);
    window.open(response.body.url);
  }

  async getPreviousElement(): Promise<any> {
    const previousElement = await this.contentPlayerService.getPreviousElement(this.courseId, this.contentId);
    this.router.navigate([`../../${previousElement.body.elementId}`], { relativeTo: this.route, queryParamsHandling: 'merge' });
    this.leftNavService.nodeActionPreviousNext.next(previousElement.body.elementId);
  }

  async getNextElement(): Promise<any> {
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

  ngOnDestroy(): void {
    const payload = {
      progress: 100,
      lastAccessedPoint: 'Completed',
      timeSpent: 10
    };
    const userCurrentView = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    userCurrentView === 'student' && this.elementData ? this.contentPlayerService.saveProgress(payload, this.courseId, this.contentId) : "";
  }
}
