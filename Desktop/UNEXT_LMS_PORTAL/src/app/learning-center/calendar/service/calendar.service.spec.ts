/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageKey } from 'src/app/enums/storageKey';
import { HttpClientService } from 'src/app/services/http-client.service';
import { StorageService } from 'src/app/services/storage.service';

import { CalendarService } from './calendar.service';

describe('CalendarService', () => {
  let service: CalendarService;
  let httpClient: HttpClientService;
  let storageService: StorageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientService, StorageService],
      imports: [RouterTestingModule, HttpClientTestingModule]
    });
    service = TestBed.inject(CalendarService);
    httpClient = TestBed.inject(HttpClientService);
    storageService = TestBed.inject(StorageService);
    storageService.set(StorageKey.USER_CURRENT_VIEW, 'admin');

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch Calendar Events', () => {
    const Calendarvents = [{ "eventname": "zXZXZ", "eventDescription": "<p>ZXzX</p>", "eventId": "4b521e15-73a8-414b-9700-df9e1a866dfa", "eventType": "self-task", "startDate": "2022-02-03T03:38:38.000Z", "endDate": "2022-02-10T03:38:38.000Z" }, { "eventname": "asdasdasasd", "eventDescription": "<p>asdasd</p>", "eventId": "687006ee-aaf2-489d-aac4-19e7f64c38fd", "eventType": "self-task", "startDate": "2022-02-02T15:44:17.815Z", "endDate": "2022-02-26T03:44:17.000Z" }, { "eventname": "STD 2", "eventId": "b453d71a-5385-48f9-a7de-7e5b17ebba8f", "eventType": "discussion-forum", "startDate": "2022-02-02T07:01:38.939Z", "endDate": "2022-02-24T07:01:38.000Z", "totalStudents": 34, "gradedStudents": 0 }, { "eventname": "STD Sample Time picker", "eventId": "97879fd0-8fc1-4036-a023-3f454208fa74", "eventType": "discussion-forum", "startDate": "2022-02-02T21:00:56.000Z", "endDate": "2022-02-27T21:00:56.000Z", "totalStudents": 34, "gradedStudents": 0 }];
    spyOn(httpClient, 'getResponse').and.resolveTo(Calendarvents);
    spyOn(service, 'fetchCalendarEvents').and.callThrough();
    service.fetchCalendarEvents('1142', "2022-02-04T06:32:03.647Z", "2022-02-03T03:38:38.000Z", "self-task");
    expect(service.fetchCalendarEvents).toHaveBeenCalled();
  });

  it('should get self task', () => {
    const selfTask = [{ "eventname": "zXZXZ", "eventDescription": "<p>ZXzX</p>", "eventId": "4b521e15-73a8-414b-9700-df9e1a866dfa", "eventType": "self-task", "startDate": "2022-02-03T03:38:38.000Z", "endDate": "2022-02-10T03:38:38.000Z" }, { "eventname": "asdasdasasd", "eventDescription": "<p>asdasd</p>", "eventId": "687006ee-aaf2-489d-aac4-19e7f64c38fd", "eventType": "self-task", "startDate": "2022-02-02T15:44:17.815Z", "endDate": "2022-02-26T03:44:17.000Z" }];
    spyOn(httpClient, 'getResponse').and.resolveTo(selfTask);
    spyOn(service, 'getSelfTask').and.callThrough();
    service.getSelfTask("4b521e15-73a8-414b-9700-df9e1a866dfa");
    expect(service.getSelfTask).toHaveBeenCalled();
  });

  it('should update Self Task', () => {
    const payload = { "title": "aaaa", "description": "<p>aa</p>", "recurrence": "Daily", "reminderInMinutes": 15, "allDay": true, "startDate": "2022-02-09T18:30:00.000Z", "endDate": "2022-02-18T05:37:59.000Z", "rrule": { "dtstart": "2022-02-10T02:17:39.515Z", "until": "2022-02-10T03:17:39.516Z", "freq": 3, "interval": 1 } };
    spyOn(httpClient, 'getResponse').and.resolveTo(payload);
    spyOn(service, 'updateSelfTask').and.callThrough();
    service.updateSelfTask("53fce24a-6bfa-40a9-b31e-3226a724c897", payload);
    expect(service.updateSelfTask).toHaveBeenCalled();
  });

  it('should save Self Task', () => {
    const payload = { "title": "aaaa", "description": "<p>aa</p>", "recurrence": "Daily", "reminderInMinutes": 15, "allDay": true, "startDate": "2022-02-09T18:30:00.000Z", "endDate": "2022-02-18T05:37:59.000Z", "rrule": { "dtstart": "2022-02-10T02:17:39.515Z", "until": "2022-02-10T03:17:39.516Z", "freq": 3, "interval": 1 } };
    spyOn(httpClient, 'getResponse').and.resolveTo(payload);
    spyOn(service, 'saveSelfTask').and.callThrough();
    service.saveSelfTask(payload);
    expect(service.saveSelfTask).toHaveBeenCalled();
  });

  it('should delete Self Task', (done) => {
    const payload = { "title": "aaaa", "description": "<p>aa</p>", "recurrence": "Daily", "reminderInMinutes": 15, "allDay": true, "startDate": "2022-02-09T18:30:00.000Z", "endDate": "2022-02-18T05:37:59.000Z", "rrule": { "dtstart": "2022-02-10T02:17:39.515Z", "until": "2022-02-10T03:17:39.516Z", "freq": 3, "interval": 1 } };
    spyOn(httpClient, 'getResponse').and.resolveTo(payload);
    spyOn(service, 'deleteSelfTask').and.callThrough();
    service.deleteSelfTask("53fce24a-6bfa-40a9-b31e-3226a724c897");
    expect(service.deleteSelfTask).toHaveBeenCalled();
    done();
  });

});
