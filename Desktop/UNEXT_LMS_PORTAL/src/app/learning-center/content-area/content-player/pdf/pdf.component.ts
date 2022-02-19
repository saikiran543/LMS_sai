/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { NotesService } from 'src/app/learning-center/course-services/notes.service';
import { ContentType } from 'src/app/enums/contentType';
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { LinkTarget } from 'ngx-extended-pdf-viewer';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentService } from 'src/app/learning-center/course-services/content.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit, OnDestroy {
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  // eslint-disable-next-line no-invalid-this
  position = new FormControl(this.positionOptions[0]);
  public zoomValue = 100;
  public pageNumber = 1;
  public totalPages!: number;
  public rotationValue!: 0 | 90 | 180 | 270;
  public fitToWidth!: boolean;
  public count = 0;
  public getInfo: any; elementData: any = null;
  s3Url!: string; public contentId: any;
  public courseId: any;
  showHeaderFooter!: boolean;
  public showHeaderFooterTimeout!: any;
  isFullScreen = false;
  contentTypes: any = ContentType;

  bookmarked = false;

  activeTab = 'overview';

  constructor(private notesService: NotesService, private contentService: ContentService, private route: ActivatedRoute, private router: Router, private contentPlayerService: ContentPlayerService, private storageService: StorageService, private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService, private leftNavService: LeftNavService, private sanitizer: DomSanitizer) { }

  async ngOnInit(): Promise<void> {
    pdfDefaultOptions.externalLinkTarget = LinkTarget.BLANK;
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

  zoom(type: string) {
    type === 'positive' ? this.zoomValue === 195 ? this.zoomValue += 5 : this.zoomValue += 10 : this.zoomValue === 30 ? this.zoomValue -= 5 : this.zoomValue -= 10;
  }

  getTotalPages(event: any): void {
    this.totalPages = event.pagesCount;
    this.updateNotesOnPdfActions();
  }

  rotate() {
    this.count > 3 ? this.count = 0 : this.count++;
    switch (this.count) {
      case 1:
        this.rotationValue = 90;
        break;
      case 2:
        this.rotationValue = 180;
        break;
      case 3:
        this.rotationValue = 270;
        break;
      default:
        this.rotationValue = 0;
        break;
    }
  }

  toggleToWidth() {
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

  ngOnDestroy(): void {
    const payload = {
      progress: Math.trunc(+((this.pageNumber / this.totalPages) * 100)),
      lastAccessedPoint: `${this.pageNumber}`,
      timeSpent: 30
    };
    const userCurrentView = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    if (userCurrentView === 'student' && this.pageNumber && this.totalPages && this.elementData) {
      this.contentPlayerService.saveProgress(payload, this.courseId, this.contentId);
    }
  }

  updateNotesOnPdfActions(): any {
    this.notesService.notePositionInContent.next(this.pageNumber + "/" + this.totalPages);
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
