/* eslint-disable no-console */
/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { ContentItemFlatNode, ContentItemNode } from 'src/app/model';
import { HttpClientService } from 'src/app/services/http-client.service';
import { StorageService } from 'src/app/services/storage.service';
import { CommonService } from 'src/app/services/common.service';
import { Observable } from 'rxjs';
import { CommonUtils } from 'src/app/utils/common-utils';
import { DialogService } from 'src/app/services/dialog.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { ElementStatuses } from 'src/app/enums/ElementStatuses';
import { ContentType } from 'src/app/enums/contentType';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CreateDiscussionForumPayload, EditDiscussionForumPayload } from './discussion-forum.service';
import { ForumType } from 'src/app/enums/forumType';
export interface IBookmark {
  id: string,
  elementId: string,
  createdOn: Date,
  userId: string,
  courseId: string,
  contentType: ContentType,
  subContentType?: ForumType,
  title: string,
  breadcrum: string,
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  progress!: number;
  constructor(
    private httpClientService: HttpClientService,
    private storageService: StorageService,
    private commonService: CommonService,
    private dialogService: DialogService,
    private toastService: ToastrService,
    private translate: TranslateService
  ) {
    this.getMessageTranslations();
    this.listenStorageService();
  }

  folder = {
    "courseId": "",
    "parentElementId": "",
    "data": ""
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messagesTranslations: any = {
    publishAll: 'admin.facultyCourseView.treeOperationsSuccess.publishAll',
    courseCompleted: 'admin.facultyCourseView.resumeOperations.courseCompleted',
    successMessage: 'contentBuilder.unit.successMessage',
    updatedSuccess: 'contentBuilder.unit.updatedSuccess',
    folderSuccessMessage: 'contentBuilder.folder.successMessage',
    folderUpdateMessage: 'contentBuilder.folder.updatedSuccess'
  }

  listenStorageService(): void{
    this.storageService.listen('updateCourseElement').subscribe(data=>{
      this.updateElementInTree(data.elementId,data.payload);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getElementDetail(courseId: any, elementId: any) {
    return await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/element-detail/${elementId}`, HttpMethod.GET, true);

  }

  async getElementDetailsForMoreInfo(courseId: string, elementId: string) {
    const responce = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/element-detail/${elementId}`, HttpMethod.GET, true);
    return responce;

  }
  async getMessageTranslations(){
    for (const key in this.messagesTranslations) {
      if (Object.prototype.hasOwnProperty.call(this.messagesTranslations, key)) {
        this.messagesTranslations[key] = await this.translate.get(this.messagesTranslations[key]).toPromise();
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async saveUnit(payLoad: any): Promise<any> {
    payLoad.status = ElementStatuses.UNPUBLISHED;
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, 'course-content/unit', HttpMethod.POST, payLoad, true);
    response.status === 200 ? this.injectElementIntoTree(payLoad.courseId, response) : '';
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateUnit(elementId: any, payLoad: any): Promise<any> {
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/unit/${elementId}`, HttpMethod.PUT, payLoad, true);
    response.status === 200 ? this.updateElementInTree(elementId, payLoad) : '';
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async saveFolder(parentElementId: any, payLoad: any): Promise<any> {
    payLoad.status = ElementStatuses.UNPUBLISHED;
    payLoad.parentElementId = parentElementId;
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, 'course-content/folder', HttpMethod.POST, payLoad, true);
    response.status === 200 ? this.injectElementIntoTree(parentElementId, response) : '';
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateFolder(elementId: any, payLoad: any): Promise<any> {
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/folder/${elementId}`, HttpMethod.PUT, payLoad, true);
    response.status === 200 ? this.updateElementInTree(elementId, payLoad) : '';
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async saveContent(serviceName: Service, apiPath: string, method: HttpMethod, payLoad: any = {}): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response = await this.addHeadersInterceptor(serviceName, apiPath, method, payLoad, true);
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getContentDetails(courseId: string, expanded: boolean) {
    this.storageService.set(StorageKey.COURSE_JSON,[]);
    const payLoad = {};
    const courseContents = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/course/${courseId}/${expanded}`, HttpMethod.GET, payLoad, true);
    this.storageService.set(StorageKey.DOC_VERSION, courseContents.body.__v.toString());
    const courseJson = this.buildFileTree(courseContents.body.childElements, 0);
    this.storageService.set(StorageKey.COURSE_JSON, courseJson);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  buildFileTree(obj: any, level: number): ContentItemNode[] {
    return Object.keys(obj).reduce<ContentItemNode[]>((accumulator, key) => {
     
      const value = obj[key];
      const node = new ContentItemNode();
      node._id = value.elementId;
      node.elementMetadata = value.elementMetadata;
      node.elementId = value.elementId;
      node.name = value.title;
      node.createdOn = value.createdOn;
      node.status = value.status;
      node.progress = value.progress;
      node.idealTime = value.idealTime;
      node.numberOfContent = value.numberOfContent;
      node.completedContent = value.completedContent;
      node.isBookMarked = value.isBookMarked;
      node.contentStatus = value.elementMetadata.contentStatus;
      node.unPublishedContent = value.unPublishedContent ? value.unPublishedContent : false;
      node.isLearningObjectiveLinked = value.elementMetadata?.isLearningObjectiveLinked || false;
      node.type = value.type.toLowerCase();
      if (value !== null) {
        if (typeof value === 'object' && value.childElements) {
          node.children = this.buildFileTree(value.childElements, level + 1);
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getFolderDetails(courseId: string, elementId: string) {
    const payLoad = {};
    const childElements = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/children/${courseId}/${elementId}`, HttpMethod.GET, payLoad, true);
    return childElements.body;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  async saveContentItem(data: any, elementId = ""): Promise<any> {
    let result;
    if (elementId) {
      result = await this.saveContent(Service.COURSE_SERVICE, `course-content/content/${elementId}`, HttpMethod.PUT, data);
      result.status === 200 ? this.updateElementInTree(elementId, data) : '';
    } else {
      result = await this.saveContent(Service.COURSE_SERVICE, 'course-content/content', HttpMethod.POST, data);
      result.status === 200 ? this.injectElementIntoTree(data.parentElementId, result) : '';
    }
    if (result.status === 200) {
      return result;
    }
    return null;
  }

  async moveNode(): Promise<string> {
    // return await this.httpClientService.getResponse(Service.COURSE_SERVICE, ``, HttpMethod.PUT, {});
    return 'modeNode';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types,max-params
  async moveTo(data: any, index: number, sourceParent: ContentItemFlatNode, parent: ContentItemFlatNode, elementId: string, courseId: string): Promise<string> {
    this.storageService.set(StorageKey.COURSE_JSON, data);
    const body = {
      sourceParentElementId: sourceParent ? sourceParent._id : courseId,
      targetParentElementId: parent ? parent._id : courseId,
      index: JSON.stringify(index)
    };
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/${elementId}/drag-and-drop`, HttpMethod.PUT, body);
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }

  async handleDrop(): Promise<string> {
    // return await this.httpClientService.getResponse(Service.COURSE_SERVICE, ``, HttpMethod.PUT, {});
    return 'handleDrop';
  }

  async deleteNode(sourceParent: ContentItemFlatNode | null, elementId: string, courseId: string): Promise<string> {
    const payLoad = {
      'parentElementId': sourceParent ? sourceParent._id : courseId
    };
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/${elementId}`, HttpMethod.DELETE, payLoad, true);
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  async getContentElement(courseId: string, elementId: string): Promise<any> {
    const payLoad = {};
    const courseContents = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/element-detail/${elementId}`, HttpMethod.GET, payLoad, true);
    return courseContents.body;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  uploadFile(file: any): Observable<any> {
    return new Observable(subscriber => {
      const type = encodeURIComponent(file?.type);
      const commonUtils = new CommonUtils();
      const uuid = commonUtils.getUuid();
      const fileExtension = file.name.split('.').pop();
      const fileName = uuid + '.' + fileExtension;
      this.commonService.getSignedUploadUrl(fileName, type)
        .then(signedUrlData => {
          const signedUrl = signedUrlData.body.url;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.httpClientService.getFileUploadResponse(signedUrl, file).subscribe(async (event: HttpEvent<any>) => {
            switch (event.type) {
              // If the file is uploading, then send the upload progress percentage
              case HttpEventType.UploadProgress:
                if (event.total) {
                  this.progress = Math.round(event.loaded / event.total * 100);
                  const res = {
                    status: 'uploading',
                    progress: this.progress
                  };
                  subscriber.next(res);
                }
                break;
              // If upload completed, then send the file details
              case HttpEventType.Response: {
                const res = {
                  status: 'uploaded',
                  s3FileName: fileName,
                  originalFileName: file.name,
                  fileExtension: fileExtension,
                };
                subscriber.next(res);
                break;
              }
            }
          });
        });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private injectElementIntoTree(parentElementId: string, response: any) {
    const courseJson = this.storageService.get(StorageKey.COURSE_JSON);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const parentnode = this.locateElement(parentElementId, courseJson)!;
    const newNode: ContentItemNode = {
      elementId: response.body.elementId,
      title: response.body.title,
      _id: response.body.elementId,
      name: response.body.title,
      children: [],
      type: response.body.type.toLowerCase(),
      status: response.body.status,
      createdOn: response.body.createdOn,
      progress: 0
    };
    parentnode ? parentnode.children.push(newNode) : courseJson.push(newNode);
    this.storageService.set(StorageKey.COURSE_JSON, courseJson);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private updateElementInTree(elementId: string, payload: any) {
    const courseJson = this.storageService.get(StorageKey.COURSE_JSON);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion
    const element: any = this.locateElement(elementId, courseJson)!;
    if(payload.title && payload.name !== payload.title) {
      payload.name = payload.title;
    }
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        element[key] = payload[key];
      }
    }
    this.storageService.set(StorageKey.COURSE_JSON, courseJson);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  locateElement(eleId: string, elementArray: any): ContentItemNode | null {
    for (const element of elementArray) {
      if (element._id === eleId) {
        return element;
      } else if (element.children && element.children.length > 0) {
        const elemFoundInChild = this.locateElement(
          eleId,
          element.children
        );
        if (elemFoundInChild) {
          return elemFoundInChild;
        }
      }
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iterateElementAndDoOperation(elementArray: ContentItemNode[], func: any): void {
    for (const element of elementArray) {
      func(element);
      if (element.children && element.children.length > 0) {
        this.iterateElementAndDoOperation(element.children, func);
      }
    }
  }

  async publish(courseId: string, elementId: string, individual: boolean) {
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/${elementId}/publish?individual=${individual}`, HttpMethod.PUT, {}, true);
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }

  async unPublish(courseId: string, elementId: string) {
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/${elementId}/unpublish`, HttpMethod.PUT, {}, true);
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }
  async publishAll(courseId: string) {

    const confirmation = await this.dialogService.showConfirmDialog({ title: { translationKey: "admin.facultyCourseView.treeOperationWarnings.publishAll" } });
    if (confirmation) {
      const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/publish`, HttpMethod.PUT, {}, true);
      if (response.status === 200) {
        this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
        const courseJson = this.storageService.get(StorageKey.COURSE_JSON);
        this.iterateElementAndDoOperation(courseJson, (element: ContentItemNode) => {
          if (element.status !== 'draft') {
            element['status'] = ElementStatuses.PUBLISHED;
          }
        });
        this.storageService.set(StorageKey.COURSE_JSON, courseJson);
        this.showSuccessToast(`${this.messagesTranslations.publishAll}`);
      }

    }
  }

  async resume(courseId: string) {

    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/resume`, HttpMethod.GET, {}, true);
    if (response.status === 200) {
      if(response.body.elementId){return response.body.elementId;}
     
    }else if(response.status === 204){
      this.showSuccessToast(`${this.messagesTranslations.courseCompleted}`);
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  showSuccessToast(message: string) {
    this.toastService.success(message, '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    return await this.httpClientService.getResponse(serviceName, apiPath, method, payLoad, isAuthRequired, headers);
  }

  // bookmark service

  async fetchAllBookmarks(courseId: string): Promise<IBookmark[]> {
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `bookmarks?courseId=${courseId}`, HttpMethod.GET, true);
    return response.body;
  }

  async createBookmark(payload: {
    courseId: string,
    elementId: string,
  }): Promise<boolean> {
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `bookmarks`, HttpMethod.POST, payload, true);
    this.showSuccessToast('Bookmark Addded Successfully');
    try {
      this.updateElementInTree(payload.elementId, {isBookMarked: true});
    } catch (err) {
      console.log(err);
    }
    return !!response;
  }

  async deleteBookmark(elementId: string, itemName: string): Promise<boolean> {
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `bookmarks/${elementId}`, HttpMethod.DELETE, {}, true);
    this.showSuccessToast(`${itemName} unbookmarked successfully`);
    try {
      this.updateElementInTree(elementId, {isBookMarked: false});
    } catch (err) {
      console.log(err);
    }
    return !!response;
  }

  public fetchActivityContent(courseId: string, elementId: string): Promise<ActivityContent> {
    return this.addHeadersInterceptor(Service.COURSE_SERVICE, `discussion-forum/discussion-forum-activities/${elementId}?courseId=${courseId}`, HttpMethod.GET, true).then((res) => res.body);
  }

  public async createDiscussionForum(payload: CreateDiscussionForumPayload): Promise<void> {
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `discussion-forum/discussion-forum-activities`, HttpMethod.POST, payload);
    const elementIntoTreePayload = {
      body: {
        ...response.body.element,
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    response.status === 200 ? this.injectElementIntoTree(payload.parentElementId!, elementIntoTreePayload) : '';
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }

  public async editDiscussionForum(elementId: string, payload: EditDiscussionForumPayload): Promise<void> {
    const response = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `discussion-forum/discussion-forum-activities/${elementId}`, HttpMethod.PUT, payload);
    this.storageService.set(StorageKey.DOC_VERSION, response.body.__v.toString());
    return response;
  }

  public async getLearningObjectives(elementId: string) {
    return await this.addHeadersInterceptor(Service.COURSE_SERVICE, `learning-objectives-mappings?elementId=${elementId}`, HttpMethod.GET, true);
  }
}

export interface ActivityMetadata {
  activityId: string;
  activityStatus: string;
  courseId: string;
  createdBy: string;
  description?: string;
  emailNotification: boolean;
  fileName?: string;
  isGradable: boolean;
  lastAccessedBy?: string;
  learningObjectives: string[]
  maxMarks?: number
  originalFileName?: string;
  passMarks?: number;
  rubricId?: string;
  startDate?: string;
  endDate?: string;
  tags: string[];
  title: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  visibilityCriteria: boolean;
  _id: string;
}
export interface ActivityContent {
  activitymetadata: ActivityMetadata[];
  breadcrumbTitle?: string[]
  qnAmetaData?: {
    totalQuestions: number,
    totalAnswers: number,
    updatedAt: string,
    updatedBy: string,
  }
  childElements?: [];
  createdBy: string;
  createdOn: string;
  elementId: string;
  status: string;
  title: string;
  type: string;
  subType?: string;
  updatedBy: string;
  updatedOn: string;
}
