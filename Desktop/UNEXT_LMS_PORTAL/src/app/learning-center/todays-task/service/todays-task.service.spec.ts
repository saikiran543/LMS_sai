/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageKey } from 'src/app/enums/storageKey';
import { HttpClientService } from 'src/app/services/http-client.service';
import { StorageService } from 'src/app/services/storage.service';

import { TodaysTaskService } from './todays-task.service';

describe('TodaysTaskService', () => {
  let service: TodaysTaskService;
  let httpClient: HttpClientService;
  let storageService: StorageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientService, StorageService],
      imports: [RouterTestingModule, HttpClientTestingModule]
    });
    service = TestBed.inject(TodaysTaskService);
    httpClient = TestBed.inject(HttpClientService);
    storageService = TestBed.inject(StorageService);
    storageService.set(StorageKey.USER_CURRENT_VIEW, 'admin');

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return pending tasks', () => {
    const pendingTask = [{"eventname": "zXZXZ","eventDescription": "<p>ZXzX</p>","eventId": "4b521e15-73a8-414b-9700-df9e1a866dfa","eventType": "self-task","startDate": "2022-02-03T03:38:38.000Z","endDate": "2022-02-10T03:38:38.000Z"},{"eventname": "asdasdasasd","eventDescription": "<p>asdasd</p>","eventId": "687006ee-aaf2-489d-aac4-19e7f64c38fd","eventType": "self-task","startDate": "2022-02-02T15:44:17.815Z","endDate": "2022-02-26T03:44:17.000Z"},{"eventname": "STD 2","eventId": "b453d71a-5385-48f9-a7de-7e5b17ebba8f","eventType": "discussion-forum","startDate": "2022-02-02T07:01:38.939Z","endDate": "2022-02-24T07:01:38.000Z","totalStudents": 34,"gradedStudents": 0},{"eventname": "STD Sample Time picker","eventId": "97879fd0-8fc1-4036-a023-3f454208fa74","eventType": "discussion-forum","startDate": "2022-02-02T21:00:56.000Z","endDate": "2022-02-27T21:00:56.000Z","totalStudents": 34,"gradedStudents": 0}];
    spyOn(httpClient, 'getResponse').and.resolveTo(pendingTask);
    spyOn(service, 'getTodaysTasks').and.callThrough();
    service.getTodaysTasks('1142', "2022-02-04T06:32:03.647Z", "pending");
    expect(service.getTodaysTasks).toHaveBeenCalled();
  });

  it('should return completed tasks', () => {
    const completedTask = [{"eventname": "Test 101","eventDescription": "<p>Test 101</p>","eventId": "8db62125-6b41-47ba-b449-9c943953bb23","eventType": "discussion-forum","startDate": "2022-02-01T13:10:00.092Z","endDate": "2022-02-23T01:10:00.000Z","totalStudents": 34,"gradedStudents": 3},{"eventname": "Standrad Discussion","eventDescription": "<p>Standrad Discussion</p>","eventId": "52c72c8e-f1db-4cd2-918b-752e734f494d","eventType": "discussion-forum","startDate": "2022-02-01T13:11:05.490Z","endDate": "2022-02-24T01:11:05.000Z","totalStudents": 34,"gradedStudents": 1}];
    spyOn(httpClient, 'getResponse').and.resolveTo(completedTask);
    spyOn(service, 'getTodaysTasks').and.callThrough();
    service.getTodaysTasks('1142', "2022-02-04T06:32:03.647Z", "completed");
    expect(service.getTodaysTasks).toHaveBeenCalled();
  });
  
});
