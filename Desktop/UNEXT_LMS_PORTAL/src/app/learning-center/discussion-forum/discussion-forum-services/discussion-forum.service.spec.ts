/* eslint-disable max-lines-per-function */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { DiscussionForumService } from './discussion-forum.service';
import { StorageService } from 'src/app/services/storage.service';

describe('DiscussionForumService', () => {
  let service: DiscussionForumService;
  let httpClient: HttpClientService;
  let mockresult: unknown;
  beforeEach(() => {
    mockresult = {
      "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
      "type": "doubt_clarification_forum",
      "title": "Unit one - doubt clarification",
      "status": "published",
      "createdOn": "2021-12-23T15:12:19.237Z",
      "createdBy": "1",
      "updatedOn": "2021-12-23T15:12:19.237Z",
      "updatedBy": "1",
      "childElements": [],
      "activitymetadata": [
        {
          "_id": "61c491d3b0c2c403731c9d53",
          "isGradable": true,
          "learningObjectives": [],
          "emailNotification": true,
          "tags": [],
          "courseId": "1142",
          "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
          "title": "Unit one - doubt clarification",
          "description": "<p>Unit one - doubt clarification</p>",
          "rubricId": "61b2e03290284856206d4660",
          "maxMarks": 100,
          "passMarks": 45,
          "startDate": "2021-12-23T03:11:37.000Z",
          "endDate": "2021-12-24T03:11:37.000Z",
          "visibilityCriteria": false,
          "activityStatus": "mandatory",
          "createdBy": "1",
          "updatedBy": "1",
          "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
          "createdAt": "2021-12-23T15:12:19.263Z",
          "updatedAt": "2021-12-23T15:12:19.263Z"
        }],
      "breadcrumbTitle": "/Unit 2 Deferred revenue",
      "qnAmetaData": {
        "totalQuestions": 4,
        "totalAnswers": 23,
        "updatedAt": "2021-12-24T06:15:20.728Z",
        "updatedBy": "demostudent"
      }};
    TestBed.configureTestingModule({
      providers: [HttpClientService, StorageService],
      imports: [RouterTestingModule, HttpClientTestingModule]
    });
    service = TestBed.inject(DiscussionForumService);
    httpClient = TestBed.inject(HttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get DiscussionForums', (done) => {
    spyOn(service, 'getDiscussionForums').and.callFake(() => Promise.resolve(
      {
        "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
        "type": "doubt_clarification_forum",
        "title": "Unit one - doubt clarification",
        "status": "published",
        "createdOn": "2021-12-23T15:12:19.237Z",
        "createdBy": "1",
        "updatedOn": "2021-12-23T15:12:19.237Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61c491d3b0c2c403731c9d53",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [],
            "courseId": "1142",
            "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
            "title": "Unit one - doubt clarification",
            "description": "<p>Unit one - doubt clarification</p>",
            "rubricId": "61b2e03290284856206d4660",
            "maxMarks": 100,
            "passMarks": 45,
            "startDate": "2021-12-23T03:11:37.000Z",
            "endDate": "2021-12-24T03:11:37.000Z",
            "visibilityCriteria": false,
            "activityStatus": "mandatory",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
            "createdAt": "2021-12-23T15:12:19.263Z",
            "updatedAt": "2021-12-23T15:12:19.263Z"
          }],
        "breadcrumbTitle": "/Unit 2 Deferred revenue",
        "qnAmetaData": {
          "totalQuestions": 4,
          "totalAnswers": 23,
          "updatedAt": "2021-12-24T06:15:20.728Z",
          "updatedBy": "demostudent"
        }}));
    service.getDiscussionForums('1142', "doubt_clarification_forum", 0, 1000).then((res) => {
      expect(JSON.stringify(res)).toEqual(JSON.stringify(mockresult));
      done();
    });
  });

  it('should get Paginated DiscussionForums', (done) => {
    spyOn(service, 'getDiscussionForumsPaginated').and.callFake(() => Promise.resolve(
      {
        "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
        "type": "doubt_clarification_forum",
        "title": "Unit one - doubt clarification",
        "status": "published",
        "createdOn": "2021-12-23T15:12:19.237Z",
        "createdBy": "1",
        "updatedOn": "2021-12-23T15:12:19.237Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61c491d3b0c2c403731c9d53",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [],
            "courseId": "1142",
            "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
            "title": "Unit one - doubt clarification",
            "description": "<p>Unit one - doubt clarification</p>",
            "rubricId": "61b2e03290284856206d4660",
            "maxMarks": 100,
            "passMarks": 45,
            "startDate": "2021-12-23T03:11:37.000Z",
            "endDate": "2021-12-24T03:11:37.000Z",
            "visibilityCriteria": false,
            "activityStatus": "mandatory",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
            "createdAt": "2021-12-23T15:12:19.263Z",
            "updatedAt": "2021-12-23T15:12:19.263Z"
          }],
        "breadcrumbTitle": "/Unit 2 Deferred revenue",
        "qnAmetaData": {
          "totalQuestions": 4,
          "totalAnswers": 23,
          "updatedAt": "2021-12-24T06:15:20.728Z",
          "updatedBy": "demostudent"
        }}));
    service.getDiscussionForumsPaginated('1142', "doubt_clarification_forum", 1, 1000).then((res) => {
      expect(JSON.stringify(res)).toEqual(JSON.stringify(mockresult));
      done();
    });
  });

  it('should Evaluate forum', (done) => {
    spyOn(service, 'forumDetail').and.callFake(() => Promise.resolve(
      {
        "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
        "type": "doubt_clarification_forum",
        "title": "Unit one - doubt clarification",
        "status": "published",
        "createdOn": "2021-12-23T15:12:19.237Z",
        "createdBy": "1",
        "updatedOn": "2021-12-23T15:12:19.237Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61c491d3b0c2c403731c9d53",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [],
            "courseId": "1142",
            "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
            "title": "Unit one - doubt clarification",
            "description": "<p>Unit one - doubt clarification</p>",
            "rubricId": "61b2e03290284856206d4660",
            "maxMarks": 100,
            "passMarks": 45,
            "startDate": "2021-12-23T03:11:37.000Z",
            "endDate": "2021-12-24T03:11:37.000Z",
            "visibilityCriteria": false,
            "activityStatus": "mandatory",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
            "createdAt": "2021-12-23T15:12:19.263Z",
            "updatedAt": "2021-12-23T15:12:19.263Z"
          }],
        "breadcrumbTitle": "/Unit 2 Deferred revenue",
        "qnAmetaData": {
          "totalQuestions": 4,
          "totalAnswers": 23,
          "updatedAt": "2021-12-24T06:15:20.728Z",
          "updatedBy": "demostudent"
        }}));
    service.forumDetail("aa3f480a-19de-4a3e-a7ac-64f28ee8dcbd", "1142").then((res) => {
      expect(JSON.stringify(res)).toEqual(JSON.stringify(mockresult));
      done();
    });
  });

  it('should student Activity Result', (done) => {
    spyOn(service, 'studentActivityResult').and.callFake(() => Promise.resolve(
      {
        "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
        "type": "doubt_clarification_forum",
        "title": "Unit one - doubt clarification",
        "status": "published",
        "createdOn": "2021-12-23T15:12:19.237Z",
        "createdBy": "1",
        "updatedOn": "2021-12-23T15:12:19.237Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61c491d3b0c2c403731c9d53",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [],
            "courseId": "1142",
            "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
            "title": "Unit one - doubt clarification",
            "description": "<p>Unit one - doubt clarification</p>",
            "rubricId": "61b2e03290284856206d4660",
            "maxMarks": 100,
            "passMarks": 45,
            "startDate": "2021-12-23T03:11:37.000Z",
            "endDate": "2021-12-24T03:11:37.000Z",
            "visibilityCriteria": false,
            "activityStatus": "mandatory",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
            "createdAt": "2021-12-23T15:12:19.263Z",
            "updatedAt": "2021-12-23T15:12:19.263Z"
          }],
        "breadcrumbTitle": "/Unit 2 Deferred revenue",
        "qnAmetaData": {
          "totalQuestions": 4,
          "totalAnswers": 23,
          "updatedAt": "2021-12-24T06:15:20.728Z",
          "updatedBy": "demostudent"
        }}));
    service.studentActivityResult("aa3f480a-19de-4a3e-a7ac-64f28ee8dcbd", "1142",{
      limit: 5,
      pageNo: 1,
    }).then((res) => {
      expect(JSON.stringify(res)).toEqual(JSON.stringify(mockresult));
      done();
    });
  });

  it('should student Activity Result by userId', (done) => {
    spyOn(service, 'studentActivityResultByUserId').and.callFake(() => Promise.resolve(
      {
        "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
        "type": "doubt_clarification_forum",
        "title": "Unit one - doubt clarification",
        "status": "published",
        "createdOn": "2021-12-23T15:12:19.237Z",
        "createdBy": "1",
        "updatedOn": "2021-12-23T15:12:19.237Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61c491d3b0c2c403731c9d53",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [],
            "courseId": "1142",
            "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
            "title": "Unit one - doubt clarification",
            "description": "<p>Unit one - doubt clarification</p>",
            "rubricId": "61b2e03290284856206d4660",
            "maxMarks": 100,
            "passMarks": 45,
            "startDate": "2021-12-23T03:11:37.000Z",
            "endDate": "2021-12-24T03:11:37.000Z",
            "visibilityCriteria": false,
            "activityStatus": "mandatory",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
            "createdAt": "2021-12-23T15:12:19.263Z",
            "updatedAt": "2021-12-23T15:12:19.263Z"
          }],
        "breadcrumbTitle": "/Unit 2 Deferred revenue",
        "qnAmetaData": {
          "totalQuestions": 4,
          "totalAnswers": 23,
          "updatedAt": "2021-12-24T06:15:20.728Z",
          "updatedBy": "demostudent"
        }}));
    service.studentActivityResultByUserId("aa3f480a-19de-4a3e-a7ac-64f28ee8dcbd", 1, "1142").then((res) => {
      expect(JSON.stringify(res)).toEqual(JSON.stringify(mockresult));
      done();
    });
  });

  it('should delete forum', () => {
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
          "type": "doubt_clarification_forum",
          "title": "Unit one - doubt clarification",
          "status": "published",
          "createdOn": "2021-12-23T15:12:19.237Z",
          "createdBy": "1",
          "updatedOn": "2021-12-23T15:12:19.237Z",
          "updatedBy": "1",
          "childElements": [],
          "activitymetadata": [
            {
              "_id": "61c491d3b0c2c403731c9d53",
              "isGradable": true,
              "learningObjectives": [],
              "emailNotification": true,
              "tags": [],
              "courseId": "1142",
              "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
              "title": "Unit one - doubt clarification",
              "description": "<p>Unit one - doubt clarification</p>",
              "rubricId": "61b2e03290284856206d4660",
              "maxMarks": 100,
              "passMarks": 45,
              "startDate": "2021-12-23T03:11:37.000Z",
              "endDate": "2021-12-24T03:11:37.000Z",
              "visibilityCriteria": false,
              "activityStatus": "mandatory",
              "createdBy": "1",
              "updatedBy": "1",
              "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
              "createdAt": "2021-12-23T15:12:19.263Z",
              "updatedAt": "2021-12-23T15:12:19.263Z"
            }],
          "breadcrumbTitle": "/Unit 2 Deferred revenue",
          "qnAmetaData": {
            "totalQuestions": 4,
            "totalAnswers": 23,
            "updatedAt": "2021-12-24T06:15:20.728Z",
            "updatedBy": "demostudent"
          }},
        headers: {},
        ok: true, status: 200, statusText: "OK", type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }));
    service.deleteForum('1142', '510e90e9-5292-4b1a-bd91-e1e32e21d9e5', '1142');
  });

  it('addHeadersInterceptor', () => {
    spyOn(httpClient, 'getResponse').and.callFake(() => Promise.resolve(
      {
        body: {
          "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
          "type": "doubt_clarification_forum",
          "title": "Unit one - doubt clarification",
          "status": "published",
          "createdOn": "2021-12-23T15:12:19.237Z",
          "createdBy": "1",
          "updatedOn": "2021-12-23T15:12:19.237Z",
          "updatedBy": "1",
          "childElements": [],
          "activitymetadata": [
            {
              "_id": "61c491d3b0c2c403731c9d53",
              "isGradable": true,
              "learningObjectives": [],
              "emailNotification": true,
              "tags": [],
              "courseId": "1142",
              "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
              "title": "Unit one - doubt clarification",
              "description": "<p>Unit one - doubt clarification</p>",
              "rubricId": "61b2e03290284856206d4660",
              "maxMarks": 100,
              "passMarks": 45,
              "startDate": "2021-12-23T03:11:37.000Z",
              "endDate": "2021-12-24T03:11:37.000Z",
              "visibilityCriteria": false,
              "activityStatus": "mandatory",
              "createdBy": "1",
              "updatedBy": "1",
              "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
              "createdAt": "2021-12-23T15:12:19.263Z",
              "updatedAt": "2021-12-23T15:12:19.263Z"
            }],
          "breadcrumbTitle": "/Unit 2 Deferred revenue",
          "qnAmetaData": {
            "totalQuestions": 4,
            "totalAnswers": 23,
            "updatedAt": "2021-12-24T06:15:20.728Z",
            "updatedBy": "demostudent"
          }},
        headers: {},
        ok: true, status: 200, statusText: "OK", type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }));
    service.addHeadersInterceptor(Service.COURSE_SERVICE, 'course-content/course/1142/true', HttpMethod.GET, '1142', true);
  });

  it('should related Contents', (done) => {
    spyOn(service, 'relatedContents').and.callFake(() => Promise.resolve(
      {
        "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
        "type": "doubt_clarification_forum",
        "title": "Unit one - doubt clarification",
        "status": "published",
        "createdOn": "2021-12-23T15:12:19.237Z",
        "createdBy": "1",
        "updatedOn": "2021-12-23T15:12:19.237Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61c491d3b0c2c403731c9d53",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [],
            "courseId": "1142",
            "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
            "title": "Unit one - doubt clarification",
            "description": "<p>Unit one - doubt clarification</p>",
            "rubricId": "61b2e03290284856206d4660",
            "maxMarks": 100,
            "passMarks": 45,
            "startDate": "2021-12-23T03:11:37.000Z",
            "endDate": "2021-12-24T03:11:37.000Z",
            "visibilityCriteria": false,
            "activityStatus": "mandatory",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
            "createdAt": "2021-12-23T15:12:19.263Z",
            "updatedAt": "2021-12-23T15:12:19.263Z"
          }],
        "breadcrumbTitle": "/Unit 2 Deferred revenue",
        "qnAmetaData": {
          "totalQuestions": 4,
          "totalAnswers": 23,
          "updatedAt": "2021-12-24T06:15:20.728Z",
          "updatedBy": "demostudent"
        }}));
    service.relatedContents("1142", "aa3f480a-19de-4a3e-a7ac-64f28ee8dcbd", "doubt_clarification_forum").then((res) => {
      expect(JSON.stringify(res)).toEqual(JSON.stringify(mockresult));
      done();
    });
  });

  it('should specific Content Doubts', (done) => {
    spyOn(service, 'specificContentDoubts').and.callFake(() => Promise.resolve(
      {
        "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
        "type": "doubt_clarification_forum",
        "title": "Unit one - doubt clarification",
        "status": "published",
        "createdOn": "2021-12-23T15:12:19.237Z",
        "createdBy": "1",
        "updatedOn": "2021-12-23T15:12:19.237Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61c491d3b0c2c403731c9d53",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [],
            "courseId": "1142",
            "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
            "title": "Unit one - doubt clarification",
            "description": "<p>Unit one - doubt clarification</p>",
            "rubricId": "61b2e03290284856206d4660",
            "maxMarks": 100,
            "passMarks": 45,
            "startDate": "2021-12-23T03:11:37.000Z",
            "endDate": "2021-12-24T03:11:37.000Z",
            "visibilityCriteria": false,
            "activityStatus": "mandatory",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
            "createdAt": "2021-12-23T15:12:19.263Z",
            "updatedAt": "2021-12-23T15:12:19.263Z"
          }],
        "breadcrumbTitle": "/Unit 2 Deferred revenue",
        "qnAmetaData": {
          "totalQuestions": 4,
          "totalAnswers": 23,
          "updatedAt": "2021-12-24T06:15:20.728Z",
          "updatedBy": "demostudent"
        }}));
    service.specificContentDoubts("1142", "aa3f480a-19de-4a3e-a7ac-64f28ee8dcbd", "doubt_clarification_forum", "304a04d7-5012-407f-8e48-fa8e9653577e").then((res) => {
      expect(JSON.stringify(res)).toEqual(JSON.stringify(mockresult));
      done();
    });
  });

  it('should forum Detail', (done) => {
    spyOn(service, 'forumDetail').and.callFake(() => Promise.resolve(
      {
        "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
        "type": "doubt_clarification_forum",
        "title": "Unit one - doubt clarification",
        "status": "published",
        "createdOn": "2021-12-23T15:12:19.237Z",
        "createdBy": "1",
        "updatedOn": "2021-12-23T15:12:19.237Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61c491d3b0c2c403731c9d53",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [],
            "courseId": "1142",
            "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
            "title": "Unit one - doubt clarification",
            "description": "<p>Unit one - doubt clarification</p>",
            "rubricId": "61b2e03290284856206d4660",
            "maxMarks": 100,
            "passMarks": 45,
            "startDate": "2021-12-23T03:11:37.000Z",
            "endDate": "2021-12-24T03:11:37.000Z",
            "visibilityCriteria": false,
            "activityStatus": "mandatory",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
            "createdAt": "2021-12-23T15:12:19.263Z",
            "updatedAt": "2021-12-23T15:12:19.263Z"
          }],
        "breadcrumbTitle": "/Unit 2 Deferred revenue",
        "qnAmetaData": {
          "totalQuestions": 4,
          "totalAnswers": 23,
          "updatedAt": "2021-12-24T06:15:20.728Z",
          "updatedBy": "demostudent"
        }}));
    service.forumDetail("aa3f480a-19de-4a3e-a7ac-64f28ee8dcbd", "1142").then((res) => {
      expect(JSON.stringify(res)).toEqual(JSON.stringify(mockresult));
      done();
    });
  });

  it('should get Threads By User', (done) => {
    spyOn(service, 'getThreadsByUser').and.callFake(() => Promise.resolve(
      {
        "elementId": "304a04d7-5012-407f-8e48-fa8e9653577e",
        "type": "doubt_clarification_forum",
        "title": "Unit one - doubt clarification",
        "status": "published",
        "createdOn": "2021-12-23T15:12:19.237Z",
        "createdBy": "1",
        "updatedOn": "2021-12-23T15:12:19.237Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61c491d3b0c2c403731c9d53",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [],
            "courseId": "1142",
            "parentElementId": "5771d9af-6a23-4695-96d0-c2037504ca18",
            "title": "Unit one - doubt clarification",
            "description": "<p>Unit one - doubt clarification</p>",
            "rubricId": "61b2e03290284856206d4660",
            "maxMarks": 100,
            "passMarks": 45,
            "startDate": "2021-12-23T03:11:37.000Z",
            "endDate": "2021-12-24T03:11:37.000Z",
            "visibilityCriteria": false,
            "activityStatus": "mandatory",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "304a04d7-5012-407f-8e48-fa8e9653577e",
            "createdAt": "2021-12-23T15:12:19.263Z",
            "updatedAt": "2021-12-23T15:12:19.263Z"
          }],
        "breadcrumbTitle": "/Unit 2 Deferred revenue",
        "qnAmetaData": {
          "totalQuestions": 4,
          "totalAnswers": 23,
          "updatedAt": "2021-12-24T06:15:20.728Z",
          "updatedBy": "demostudent"
        }}));
    service.getThreadsByUser("304a04d7-5012-407f-8e48-fa8e9653577e", 1, 0, 1000).then((res) => {
      expect(JSON.stringify(res)).toEqual(JSON.stringify(mockresult));
      done();
    });
  });

});
