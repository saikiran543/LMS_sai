import { Injectable } from '@angular/core';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { StorageKey } from 'src/app/enums/storageKey';
import { HttpClientService } from 'src/app/services/http-client.service';
import { StorageService } from 'src/app/services/storage.service';
import { firstValueFrom } from 'rxjs';

interface Progress {
  progress: number,
  lastAccessedPoint: string,
  timeSpent: number
}
@Injectable()
export class ContentPlayerService {

  constructor(private httpClientService: HttpClientService, private storageService: StorageService) { }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getElementDetail(courseId: string, elementId: string): Promise<any> {
    return await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/element-detail/${elementId}`, HttpMethod.GET, {});
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSignedUrl(s3FileName: string, originalFileName: string): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `content-store/download-url?fileName=${s3FileName}&originalFileName=${originalFileName}`, HttpMethod.GET, {});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getPreviousElement(courseId: string, elementId: string): Promise<any> {
    return await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/previous-element/${elementId}`, HttpMethod.GET, {});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getNextElement(courseId: string, elementId: string): Promise<any> {
    return await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/next-element/${elementId}`, HttpMethod.GET, {});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  async addHeadersInterceptor(serviceName: Service, apiPath: string, method: HttpMethod = HttpMethod.GET, payLoad: any, isAuthRequired = true): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers:any ={
      'user-current-view': this.storageService.get(StorageKey.USER_CURRENT_VIEW)
    };
    try{
      headers['doc-version']= this.storageService.get(StorageKey.DOC_VERSION);
    }catch(error){
      headers['doc-version']= await firstValueFrom(this.storageService.listen(StorageKey.DOC_VERSION));
    }
  
    return await this.httpClientService.getResponse(serviceName, apiPath, method, payLoad, isAuthRequired,headers);

  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async saveProgress(payload: Progress, courseId: string, elementId: string): Promise<any> {
    this.storageService.broadcastValue('updateProgress',{elementId: elementId, progress: payload.progress});
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `progress/${courseId}/elements/${elementId}/element-progress`, HttpMethod.PUT, payload);
  }
}
