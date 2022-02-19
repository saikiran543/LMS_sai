/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { StorageKey } from 'src/app/enums/storageKey';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { ContentService } from '../course-services/content.service';

@Component({
  selector: 'app-discussion-forum',
  templateUrl: './discussion-forum.component.html',
  styleUrls: ['./discussion-forum.component.scss']
})
export class DiscussionForumComponent implements OnInit {

  constructor(private routeOperationService: RouteOperationService, private storageService: StorageService, private contentService: ContentService) {

  }

  ngOnInit() {
    this.routeOperationService.listenParams().subscribe((params) => {
      try {
        this.storageService.get(StorageKey.COURSE_JSON);
      } catch (error) {
        this.getContent(params.courseId);
      }
    });
  }

  getContent(courseId: string): void {
    this.contentService.getContentDetails(courseId, true);
  }

}
