import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { HttpClientService } from './http-client.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  rubricEvaluationSave = new Subject();
  constructor(private httpClientService: HttpClientService, private storageService: StorageService) {

  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSignedUploadUrl(fileName: string, contentType: string): Promise<any> {
    const signedUrlData = await this.httpClientService.getResponseAsObservable(Service.COURSE_SERVICE, `content-store/upload-url?fileName=${fileName}&contentType=${contentType}`, HttpMethod.GET, {}, true).toPromise();
    return signedUrlData;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSignedDownloadUrl(fileName: string): Promise<any> {
    const signedUrlData = await this.httpClientService.getResponseAsObservable(Service.COURSE_SERVICE, `aws-s3/signed-url-for-download/${fileName}`, HttpMethod.GET, {}, true).toPromise();
    return signedUrlData;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSignedUrl(s3FileName: string, originalFileName: string): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `content-store/download-url?fileName=${s3FileName}&originalFileName=${originalFileName}`, HttpMethod.GET, {});
  }

}
