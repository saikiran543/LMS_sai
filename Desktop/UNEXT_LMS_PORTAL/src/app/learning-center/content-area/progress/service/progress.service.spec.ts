import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { HttpClientService } from 'src/app/services/http-client.service';

import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let service: ProgressService;
  let httpClientService: HttpClientService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(ProgressService);
    httpClientService = TestBed.inject(HttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call backend api', async () => {
    const expectedResult = {
      "totalStudents": "NA",
      "lastUpdatedAt": "NA",
      "studentsProgress": [
        {
          "_id": "61fb76477bde3527f2954b26",
          "userId": "2",
          "progress": 100,
          "userName": "demostudent01",
          "emailId": "username2@gmail.com"
        },
        {
          "_id": "61fb68bf7bde3527f293b0ac",
          "userId": "1",
          "progress": 34,
          "userName": "username1",
          "emailId": "username2@gmail.com"
        }
      ]
    };
    spyOn(httpClientService, 'getResponse').and.returnValue(Promise.resolve(expectedResult));
    service.sendMessageToBackEnd(Service.COURSE_SERVICE, `progress/${1152}/class-progress?performerRanking=top&limit=${5}&skip=${0}`, HttpMethod.GET, '{}', true);
    const response = await httpClientService.getResponse(Service.COURSE_SERVICE, `progress/${1152}/class-progress?performerRanking=top&limit=${5}&skip=${0}`, HttpMethod.GET, '{}', true);
    expect(response).toBe(expectedResult);
  });
});
