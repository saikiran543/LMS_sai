/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { StorageKey } from 'src/app/enums/storageKey';
import { HttpClientService } from 'src/app/services/http-client.service';
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private httpClientService: HttpClientService, private storageService: StorageService) { }

  closeRecurrencePopup = new Subject<any>();

  async saveSelfTask(payLoad: any): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `self-tasks`, HttpMethod.POST, payLoad, true);
  }
  async updateSelfTask(selfTaskId: string,payLoad: any): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `self-tasks/${selfTaskId}`, HttpMethod.PUT, payLoad, true);
  }
  async getSelfTask(selfTaskId: string): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `self-tasks/${selfTaskId}`, HttpMethod.GET, {}, true);
  }
  async deleteSelfTask(selfTaskId: string): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `self-tasks/${selfTaskId}`, HttpMethod.DELETE, {}, true);
  }
  async fetchCalendarEvents(courseId: any, startDate: any, endDate: any, eventType: any): Promise<any> {
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE, `calendar-events?courseId=${courseId}&startDate=${startDate}&endDate=${endDate}&eventType=${eventType}`, HttpMethod.GET, {}, true, {'user-current-view': this.storageService.get(StorageKey.USER_CURRENT_VIEW) });
  }
}
