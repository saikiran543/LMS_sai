/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/services/http-client.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';

export interface CreateDiscussionForumPayload {
  courseId: string;
  parentElementId?: string;
  title: string;
  description: string;
  rubricScope?: string;
  rubricId?: string;
  activityStatus: string;
  fileName?: string;
  originalFileName?: string;
  isGradable: boolean;
  visibilityCriteria: boolean;
  emailNotification: boolean;
  maxMarks?: number;
  passMarks?: number;
  learningObjectives: string[];
  tags: string[];
  status: string;
  startDate?: string;
  endDate?: string;
  type: string;
}

export type EditDiscussionForumPayload = Partial<CreateDiscussionForumPayload>

/**
 *
 *
 * @export
 * @class DiscussionForumService
 */
@Injectable()
export class DiscussionForumService {

  courseId!: string| undefined;

  /**
   * Creates an instance of DiscussionForumService.
   * @param {HttpClientService} httpClientService
   * @param {RouteOperationService} routeOperationService
   * @memberof DiscussionForumService
   */
  constructor(private httpClientService: HttpClientService, private routeOperationService: RouteOperationService) {
    this.initCourseId();
  }

  /**
   *
   *
   * @return {*}  {Promise<void>}
   * @memberof DiscussionForumService
   */
  public async initCourseId(): Promise<void>{
    await this.routeOperationService.listen('courseId').subscribe((data)=>{
      this.courseId = data;
    });
  }
}
