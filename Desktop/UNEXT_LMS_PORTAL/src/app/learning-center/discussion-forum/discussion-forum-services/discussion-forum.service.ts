/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ForumType } from 'src/app/enums/forumType';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { StorageKey } from 'src/app/enums/storageKey';
import { HttpClientService } from 'src/app/services/http-client.service';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class DiscussionForumService {

  constructor(private httpClient: HttpClientService, private storageService: StorageService) { }

  async getDiscussionForums(courseId: any, discussionType: any, skip: any, limit: any) {
    const discussionForums = await this.httpClient.getResponse(Service.COURSE_SERVICE, `discussion-forum/discussion-forum-activities?courseId=${courseId}&discussionForumCategory=${discussionType}&skip=${skip}&limit=${limit}`, HttpMethod.GET, {});
    return discussionForums.body;
  }
  async getDiscussionForumsPaginated(courseId: any, discussionType: any, page: any = 1, limit: any) {
    const discussionForums = await this.httpClient.getResponse(Service.COURSE_SERVICE, `discussion-forum/discussion-forum-activities?courseId=${courseId}&discussionForumCategory=${discussionType}&currentPage=${page}&limit=${limit}`, HttpMethod.GET, {});
    return discussionForums.body;
  }

  async getDiscussionForumsPaginatedSort(courseId: any, discussionType: any, page: any = 1, limit: any, sortBy: any) {
    const discussionForums = await this.httpClient.getResponse(Service.COURSE_SERVICE, `discussion-forum/discussion-forum-activities?courseId=${courseId}&discussionForumCategory=${discussionType}&currentPage=${page}&limit=${limit}&sortBy=${sortBy}`, HttpMethod.GET, {});
    return discussionForums.body;
  }

  async studentActivityResult(activityId: any, courseId: any, paginationConfig: {
    limit: number,
    pageNo: number,
  } | null = null, sortConfig: {
    sortBy: string | null,
    sortOrder: 'asc' | 'desc'
  } = {
    sortBy: null,
    sortOrder: 'asc',
  }) {
    const queryParam= new URLSearchParams({
      activityId,
      courseId,
    });
    if(paginationConfig) {
      queryParam.set('currentPage', String(paginationConfig.pageNo));
      queryParam.set('limit', String(paginationConfig.limit));
    }
    if(sortConfig.sortBy) {
      queryParam.set('sortBy', sortConfig.sortBy);
      queryParam.set('sortOrder', sortConfig.sortOrder);
    }
    const studentActivity = await this.httpClient.getResponse(Service.COURSE_SERVICE, `discussion-forum/student-activity-results?${queryParam.toString()}`, HttpMethod.GET, {});
    return studentActivity.body;
  }

  async studentActivityResultByUserId(activityId: any, userId: any, courseId: any) {
    const studentActivity = await this.httpClient.getResponse(Service.COURSE_SERVICE, `discussion-forum/student-activity-results/${userId}?activityId=${activityId}&courseId=${courseId}`, HttpMethod.GET, {});
    return studentActivity.body;
  }

  async forumDetail(activityId: any, courseId: any) {
    const forumDetail = await this.httpClient.getResponse(Service.COURSE_SERVICE, `discussion-forum/discussion-forum-activities/${activityId}?courseId=${courseId}`, HttpMethod.GET, {});
    return forumDetail.body;
  }

  async relatedContents(courseId: any, activityId: any, discussionType: ForumType, paginationConfig?: {
    limit: number,
    pageNo: number,
  }, sortConfig?: {
    sortBy: string | null,
    sortOrder: 'asc' | 'desc'
  }) {
    const queryParam= new URLSearchParams({
      activityId,
      courseId,
      discussionForumCategory: discussionType,
    });
    if(paginationConfig) {
      queryParam.set('currentPage', String(paginationConfig.pageNo));
      queryParam.set('limit', String(paginationConfig.limit));
    }
    if(sortConfig?.sortBy) {
      queryParam.set('sortBy', sortConfig.sortBy);
      queryParam.set('sortOrder', sortConfig.sortOrder);
    }
    const relatedContents = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `discussion-forum/doubtclarification-course-contents?${queryParam.toString()}`, HttpMethod.GET, {});
    return relatedContents.body;
  }

  async specificContentDoubts(courseId: any, activityId: any, discussionType: any, elementId: any) {
    const relatedContents = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `discussion-forum/doubtclarification-course-contents/${elementId}?courseId=${courseId}&activityId=${activityId}&discussionForumCategory=${discussionType}`, HttpMethod.GET, {});
    return relatedContents.body;
  }

  async getDoubtclarificationSort(courseId: any, activityId: any, discussionType: any, sortType: any) {
    const discussionForums = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `discussion-forum/doubtclarification-course-contents?courseId=${courseId}&activityId=${activityId}&discussionForumCategory=${discussionType}&sortBy=${sortType}`, HttpMethod.GET, {});
    return discussionForums.body;
  }

  async deleteForum(courseId: any, activityId: any, parentElementId: any): Promise<string> {
    const payLoad = { "parentElementId": parentElementId };
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `discussion-forum/discussion-forum-activities/${activityId}?courseId=${courseId}`, HttpMethod.DELETE, payLoad, true);
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }

  async createBookmarkByElementId(elementId: string, courseId: string): Promise<boolean> {
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `bookmarks`, HttpMethod.POST, {elementId,courseId}, true);
    return response;
  }

  async deleteBookmark(elementId: string, courseId: string): Promise<boolean> {
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `bookmarks/${elementId}`, HttpMethod.DELETE, {}, true);
    return response;
  }

  async getThreadsByUser(elementId: any, userId: any, limit: any, skip: any, threadsParticipated = false): Promise<any> {
    const question = await this.httpClient.getResponse(Service.COURSE_SERVICE, `qna/questions?elementId=${elementId}&userId=${userId}&limit=${limit}&skip=${skip}${threadsParticipated ? '&getParticipatedThreads=true' : ''}`, HttpMethod.GET, {}, true);
    return question.body;
  }

  async getParticipationByUser(limit: any, skipQuestions: any, skipAnswers: any, userId: any, elementId: any) {
    const studentActivity = await this.httpClient.getResponse(Service.COURSE_SERVICE, `qna/usersQnA?limit=${limit}&skipQuestions=${skipQuestions}&skipAnswers=${skipAnswers}&userId=${userId}&elementId=${elementId}`, HttpMethod.GET, {});
    return studentActivity.body;
  }

  async getQuestions(elementId: string, limit: any, skip: any): Promise<any> {
    const question = await this.httpClient.getResponse(Service.COURSE_SERVICE, `qna/questions?elementId=${elementId}&limit=${limit}&skip=${skip}`, HttpMethod.GET, {});
    return question.body;
  }

  async publishGradeFeedback(payLoad: any, activityId: string, type: string){
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `discussion-forum/student-activity-results/publish/?type=${type}&activityId=${activityId}`, HttpMethod.PUT, payLoad, true);
    return response;
  }

  async unpublishFeedback(payLoad: any, activityId: string, type: string){
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `discussion-forum/student-activity-results/unpublish/?type=${type}&activityId=${activityId}`, HttpMethod.PUT, payLoad, true);
    return response;
  }

  async addHeadersInterceptor(serviceName: Service, apiPath: string, method: HttpMethod = HttpMethod.GET, payLoad: any, isAuthRequired = true): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers: any = {
      'user-current-view': this.storageService.get(StorageKey.USER_CURRENT_VIEW)
    };
    try {
      headers['doc-version'] = this.storageService.get(StorageKey.DOC_VERSION);
      // eslint-disable-next-line no-empty
    } catch (error) {
    }
    return await this.httpClient.getResponse(serviceName, apiPath, method, payLoad, isAuthRequired, headers);
  }
  // eslint-disable-next-line max-params
  async sendMessageToBackEnd(serviceName: Service, apiPath: string, method:
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    HttpMethod, payLoad: any, isAuthRequired?: boolean, headers?: any): Promise<any> {
    return await this.httpClient.getResponse(serviceName, apiPath, method, payLoad, isAuthRequired, headers);
  }
}
