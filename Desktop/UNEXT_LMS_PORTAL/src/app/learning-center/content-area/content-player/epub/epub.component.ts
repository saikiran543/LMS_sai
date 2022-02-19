/* eslint-disable no-empty */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb';
import { TranslateService } from '@ngx-translate/core';
import { ContentType } from 'src/app/enums/contentType';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { StorageService } from 'src/app/services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularEpubViewerComponent, EpubChapter, EpubLocation, EpubPage } from "@edunxtv2/unext-epub-viewer";
import { NotesService } from 'src/app/learning-center/course-services/notes.service';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
@Component({
  selector: 'app-epub',
  templateUrl: './epub.component.html',
  styleUrls: ['./epub.component.scss']
})
export class EpubComponent implements OnInit, OnDestroy {
  @ViewChild('epubHolder') epubHolder!: ElementRef;
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  // eslint-disable-next-line no-invalid-this
  position = new FormControl(this.positionOptions[0]);
  isFullScreen = false;
  public zoomValue = 100;
  public pageNumber = 1;
  public rotationValue!: 0 | 90 | 180 | 270;
  showHeaderFooter!: boolean;
  rotateAngle = 0;
  fitToWidth = false;
  widthIframe = 1;
  public showHeaderFooterTimeout!: any;
  elementData: any = null;
  s3Url!: any;
  public contentId: any;
  public courseId: any;
  contentTypes: any = ContentType;
  EpubTocContent: any;
  totalPages!: number;
  currentPage!: number;
  epubToc = false;
  elementProgress: any;
  bookTitle: string | undefined;
  bookmarked = false;
  allEpubCfi: any;
  calculatedPage: any;
  calculatedPageCfi: any;
  activeTab = 'overview';
  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute, private contentPlayerService: ContentPlayerService, private storageService: StorageService, private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService, private translate: TranslateService, private leftNavService: LeftNavService, private sanitizer: DomSanitizer, private contentService: ContentService) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.storageService.listen('epubJSON').subscribe((res) => {
      this.openLastAccessedPage();
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.openlinkEpub();
  }
  @ViewChild('epubViewer')
  epubViewer: AngularEpubViewerComponent | undefined;
  @ViewChild('playerFooter') playerFooter!: ElementRef;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  openFile(event: any) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.epubViewer?.openFile(event.target.files[0]);

  }

  tocEvent(event: EpubChapter[]) {
    this.bookTitle = this.epubViewer?.epub.contents.metadata.bookTitle;
    this.EpubTocContent = event;
  }

  goToEpubLoc(link: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.epubViewer.goTo(link);

  }

  async pageComputation(event: EpubPage[]) {
    this.totalPages = await event.length;
    this.allEpubCfi = await event;
    await this.storageService.set('epubJSON', event);
  }

  async openLastAccessedPage() {
    if (this.allEpubCfi && this.allEpubCfi.length > 0) {
      this.calculatedPage = Math.trunc(+((this.elementProgress.progress * this.totalPages) / 100));
      const element = await this.allEpubCfi.filter((item: any) => {
        return this.calculatedPage === item.page;
      });
      this.calculatedPageCfi = element[0].cfi;
    }
  }

  async located(event: EpubLocation) {
    this.currentPage = event.page;
    this.notesService.notePositionInContent.next('');
    const epubPageNumberWithTotal = event.page + "/" + this.totalPages;
    this.notesService.notePositionInContent.next(epubPageNumberWithTotal);
  }

  async chapterLoaded() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.epubViewer.computePagination();
  }
  async epubDocLoaded() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.epubViewer.loadTOC();
    await this.epubViewer?.epub.pageListReady.then((res: any) => {
      if (res) {
        setTimeout(() => {
          this.epubViewer?.goTo(this.calculatedPageCfi);
        }, 0);
      }
    });
  }

  async ngOnInit(): Promise<void> {
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
    await this.openlinkEpub();
    const breadcrumb = { programName: 'BBA', semester: 'semester1', topicName: 'Crash course in Account & Finance', subtitle: this.elementData.title };
    this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
    await this.contentService.getContentDetails(this.courseId, true);
    await this.storageService.listen(StorageKey.COURSE_JSON).subscribe(async (res) => {
      await this.getProgress(res);
    });
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

  async getProgress(courseJson: any) {
    this.elementProgress = await this.locateElement(courseJson, this.contentId);
  }

  locateElement(rootElementsId: any, elementId: any) {
    for (const element of rootElementsId) {
      if (element.elementId === elementId) {
        return element;
      } else if (element.children && element.children.length > 0) {
        for (const children of element.children) {
          if (children.elementId === elementId) {
            return element;
          }
        }
        const elemFoundInChild: any = this.locateElement(
          element.children,
          elementId
        );
        if (elemFoundInChild) {
          return elemFoundInChild;
        }
      }
    }
    return null;
  }

  openlinkEpub() {
    this.epubViewer?.openLink(this.s3Url);
  }

  zoom(zoomCase: string): void {
    const el = this.epubHolder.nativeElement;
    switch (zoomCase) {
      case 'positive':
        el.style.transform = `scale(${this.widthIframe += 0.1})`;
        this.zoomValue === 195 ? this.zoomValue += 5 : this.zoomValue += 10;
        break;
      case 'negative':
        el.style.transform = `scale(${this.widthIframe -= 0.1})`;
        this.zoomValue === 30 ? this.zoomValue -= 5 : this.zoomValue -= 10;
        break;
    }
  }

  getTotalPages(event: any): void {
    this.totalPages = event.pagesCount;
    this.updateNotesOnPdfActions();
  }

  rotate(): void {
    const el = this.epubHolder.nativeElement;
    el.style.transform = `rotate(${this.rotateAngle += 90}deg)`;
    el.style.width = '100%';
    el.style.height = '100%';
    if (this.rotateAngle === 90 || this.rotateAngle === 270) {
      if (this.isFullScreen) {
        el.style.marginTop = '0';
        el.style.width = '100vh';
        el.style.height = '100%';
      } else {
        el.style.marginTop = '0';
        el.style.height = '71.8vw';
      }
    } else {
      el.style.marginTop = '0';
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
      progress: Math.trunc(+((this.currentPage / this.totalPages) * 100)),
      lastAccessedPoint: `${this.currentPage}`,
      timeSpent: 30
    };
    const userCurrentView = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    if (userCurrentView==='student' && this.elementProgress && this.elementProgress.progress < payload.progress && this.elementData) {
      this.contentPlayerService.saveProgress(payload, this.courseId, this.contentId);
    }
  }

  updateNotesOnPdfActions(): any {
    this.notesService.notePositionInContent.next(this.pageNumber + "/" + this.totalPages);
  }

  toggleEpubMenu() {
    if (this.epubToc === true) {
      this.epubToc = false;
    } else {
      this.epubToc = true;
    }
  }

  fullScreen() {
    if (this.isFullScreen) {
      this.isFullScreen = false;
    } else {
      this.isFullScreen = true;
    }
    const el = this.epubHolder.nativeElement;
    el.style.width = '100%';
    el.style.height = '100%';
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

}
