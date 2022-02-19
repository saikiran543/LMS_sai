/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { StorageKey } from 'src/app/enums/storageKey';
import { HttpClientService } from 'src/app/services/http-client.service';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TodaysTaskService {

  constructor(private httpClient: HttpClientService, private storageService: StorageService) { }

  async getTodaysTasks(courseId: string, start:string,end:string, taskStatus: string){
    const headers = {
      'user-current-view': this.storageService.get(StorageKey.USER_CURRENT_VIEW)};
    const todaysTask = await this.httpClient.getResponse(Service.COURSE_SERVICE, `todays-tasks?courseId=${courseId}&startDate=${start}&endDate=${end}&taskStatus=${taskStatus}`, HttpMethod.GET, "", true, headers);
    return todaysTask.body;
  }
}
