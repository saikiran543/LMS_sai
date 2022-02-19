import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentType } from 'src/app/enums/contentType';
import { ForumType } from 'src/app/enums/forumType';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { ContentService, IBookmark } from '../course-services/content.service';

@Component({
  selector: 'app-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.scss']
})
export class BookmarkListComponent implements OnInit {

  courseId!: string | null;

  bookmarks: IBookmark[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private contentService: ContentService, private leftNavService: LeftNavService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('courseId');
    });
    this.loadBookmarks();
  }

  async loadBookmarks(): Promise<void> {
    const { courseId } = this;
    if(courseId) {
      const bookmarks = await this.contentService.fetchAllBookmarks(courseId);
      if(bookmarks?.length) {
        this.bookmarks = this.truncateBookmarkBreadcrumbs(bookmarks);
      }
    }
  }

  getNodeIconType(node: IBookmark): string {
    let nodeType: ContentType | ForumType = node.contentType;
    if(nodeType === ContentType.DISCUSSION_FORUM) {
      if(node.subContentType) {
        nodeType = node.subContentType;
      }
    }
    return nodeType?.toLowerCase();
  }

  private truncateBookmarkBreadcrumbs(bookmarks: IBookmark[]): IBookmark[] {
    const updatedBookmarks = bookmarks.map((bookmark) => {
      const breadcrumbs = bookmark.breadcrum.split('/');
      bookmark.breadcrum = breadcrumbs[0] + '... / ' + breadcrumbs[breadcrumbs.length-1];
      return bookmark;
    });
    return updatedBookmarks;
  }

  async removeBookmark(elementData: IBookmark): Promise<void> {
    if (elementData.elementId) {
      const deleted = await this.contentService.deleteBookmark(elementData.elementId, elementData.title);
      if (deleted) {
        const filteredBookmarks = this.bookmarks.filter((bookmark) => bookmark.elementId !== elementData.elementId);
        this.bookmarks = filteredBookmarks;
      }
    }
  }

  navigateToBookmark(bookmark: IBookmark): void {
    let routeToNavigate = '';
    let showToc = false;
    if(bookmark.contentType === ContentType.DISCUSSION_FORUM) {
      routeToNavigate = `/learning-center/${bookmark.courseId}/discussion-forums/forum-detail/${bookmark.elementId}`;
    } else {
      routeToNavigate = `/learning-center/${bookmark.courseId}/content-area/list/content/${bookmark.elementId}`;
      this.leftNavService.nodeDetailsEmitter.next(bookmark.elementId);
      showToc = true;
    }
    this.router.navigate([routeToNavigate], { relativeTo: this.route, queryParams: {toc: showToc}, queryParamsHandling: 'merge'});
  }
}
