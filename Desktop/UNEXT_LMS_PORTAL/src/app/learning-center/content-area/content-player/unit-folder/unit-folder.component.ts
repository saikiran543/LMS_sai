import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { StorageService } from 'src/app/services/storage.service';
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { ContentService } from 'src/app/learning-center/course-services/content.service';

@Component({
  selector: 'app-unit-folder',
  templateUrl: './unit-folder.component.html',
  styleUrls: ['./unit-folder.component.scss']
})
export class UnitFolderComponent implements OnInit {
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  // eslint-disable-next-line no-invalid-this
  position = new FormControl(this.positionOptions[0]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public contentId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public courseId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elementData: any = null;

  bookmarked = false;

  // eslint-disable-next-line max-params
  constructor(private route: ActivatedRoute, private contentService: ContentService, private contentPlayerService: ContentPlayerService, private storageService: StorageService, private router: Router, private sanitizer: DomSanitizer, private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService, private leftNavService: LeftNavService) {
  }
  ngOnInit(): void {
    this.contentId = this.route.snapshot.parent?.parent?.paramMap.get('id');
    this.courseId = this.route.snapshot.parent?.parent?.parent?.parent?.parent?.paramMap.get('courseId');
    this.contentId = this.route.snapshot.parent?.parent?.paramMap.get('id');
    this.courseId = this.route.snapshot.parent?.parent?.parent?.parent?.parent?.paramMap.get('courseId');
    this.storageService.listen(StorageKey.ELEMENT_DETAIL).subscribe((res)=>{
      this.elementData = res;
      // this.elementData.description = this.sanitizer.bypassSecurityTrustHtml(this.elementData.description);
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
        courseId,
        elementId,
      };
      this.bookmarked = await this.contentService.createBookmark(payload);
    }
    this.leftNavService.nodeDetailsEmitter.next(elementId);
  }

  async getPreviousElement(): Promise<void> {
    const previousElement = await this.contentPlayerService.getPreviousElement(this.courseId, this.contentId);
    this.router.navigate([`../../${previousElement.body.elementId}`], {relativeTo: this.route, queryParamsHandling: 'merge'});
    this.leftNavService.nodeActionPreviousNext.next(previousElement.body.elementId);
  }

  async getNextElement(): Promise<void> {
    const nextElement = await this.contentPlayerService.getNextElement(this.courseId, this.contentId);
    this.router.navigate([`../../${nextElement.body.elementId}`], {relativeTo: this.route, queryParamsHandling: 'merge'});
    this.leftNavService.nodeActionPreviousNext.next(nextElement.body.elementId);
  }
}
