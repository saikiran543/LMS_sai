import { Injectable } from '@angular/core';
import { HttpClientService } from 'src/app/services/http-client.service';
import { Service } from 'src/app/enums/service';
import { HttpMethod } from 'src/app/enums/httpMethod';

@Injectable({
  providedIn: 'root'
})
export class CourseGamificationService {

  constructor(private httpClientService: HttpClientService){}

  async fetchCourseConfig(id: string): Promise<void> {
    const service = Service.COURSE_SERVICE;
    return this.httpClientService.getResponse(service, `progress/${id}`, HttpMethod.GET, true).then((res) => res.body);
  }

  async saveCourseConfig(id: string,payload = []): Promise<void> {
    const service = Service.COURSE_SERVICE;
    return this.httpClientService.getResponse(service, `progress/${id}`, HttpMethod.PUT, payload,true).then((res) => res.body);
  }

}
