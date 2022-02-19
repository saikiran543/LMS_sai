/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { StorageKey } from 'src/app/enums/storageKey';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { HttpClientService } from 'src/app/services/http-client.service';
import { StorageService } from 'src/app/services/storage.service';

import { QuestionAnswerService } from './question-answer.service';

describe('QuestionAnswerService', () => {
  let service: QuestionAnswerService;
  let httpClientService: HttpClientService;
  let storageService: StorageService;

  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent }];
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientService, StorageService],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes)],
    });
    service = TestBed.inject(QuestionAnswerService);
    httpClientService = TestBed.inject(HttpClientService);
    storageService = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get question', async () => {
    service.courseId = '1142';
    const expectedResponse = {
      "_id": "61c40284a8d6d0036f7b7617",
      "numOfUpvotes": 0,
      "numOfAnswers": 1,
      "courseId": "1142",
      "elementId": "4d5f73cd-eb39-4e2a-a75b-774d57de92d2",
      "title": "sample question1",
      "description": "<p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since</span></p>",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "jhgdasf",
      "contentType": "standard_discussion_forum",
      "questionId": "2e5cf15c-5a47-413d-b5fd-c51e15d65afb",
      "createdAt": "2021-12-23T05:00:52.127Z",
      "updatedAt": "2021-12-23T05:00:52.127Z",
      "verifiedAnswerId": "456c0331-ab69-445f-9be7-3192d7d8cb8b",
      "isFollowing": true,
      "contentBreadCrumb": "Unit 2 Deferred revenue...jhgdasf",
      "userName": "username1"
    };
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/questions/2e5cf15c-5a47-413d-b5fd-c51e15d65afb?courseId=1142`, HttpMethod.GET, {}).and.resolveTo(expectedResponse);
    const questionResponse = await service.getQuestion('2e5cf15c-5a47-413d-b5fd-c51e15d65afb');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(questionResponse).toEqual(expectedResponse as any);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/questions/2e5cf15c-5a47-413d-b5fd-c51e15d65afb?courseId=1142`, HttpMethod.GET, {});
  });

  it('should call get questions', async () => {
    const expectedResponse = {
      "totalQuestion": 10,
      "questions": [
        {
          "_id": "61a452c6c889187a8850bec0",
          "numOfUpvotes": 1,
          "numOfAnswers": 4,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q10",
          "description": "q10",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "28eb39d0-dd30-4e62-a3be-327c79ede292",
          "createdAt": "2021-11-29T04:10:46.221Z",
          "updatedAt": "2021-11-29T04:10:46.221Z",
          "verifiedAnswerId": "d9a3427e-e551-48f7-8f9d-71519fcc93eb",
          "isFollowing": true,
          "userName": "username1"
        },
        {
          "_id": "61a0d13e68a7dc1e9063c8e0",
          "numOfUpvotes": 1,
          "numOfAnswers": 2,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q9",
          "description": "q9",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "6225086e-f943-4609-9606-dacc1bb3baad",
          "createdAt": "2021-11-26T12:21:18.363Z",
          "updatedAt": "2021-11-26T12:21:18.363Z",
          "userName": "username1"
        },
        {
          "_id": "61a0d13868a7dc1e9063c8de",
          "numOfUpvotes": 0,
          "numOfAnswers": 7,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q8",
          "description": "q8",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "8738017b-53aa-4ca3-8278-f82c1a72bef6",
          "createdAt": "2021-11-26T12:21:12.228Z",
          "updatedAt": "2021-11-26T12:21:12.228Z",
          "verifiedAnswerId": "ee5594b3-7eb4-403d-92b0-7f2d096a01cf",
          "userName": "username1"
        },
        {
          "_id": "61a0d13168a7dc1e9063c8dc",
          "numOfUpvotes": 0,
          "numOfAnswers": 26,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q7",
          "description": "q7",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
          "createdAt": "2021-11-26T12:21:05.735Z",
          "updatedAt": "2021-11-26T12:21:05.735Z",
          "verifiedAnswerId": "89af90ed-e908-463a-8264-9219d1ec1400",
          "userName": "username1"
        },
        {
          "_id": "61a0d12b68a7dc1e9063c8da",
          "numOfUpvotes": 0,
          "numOfAnswers": 0,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q6",
          "description": "q6",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "cd89d433-4667-4341-b92e-45ef24dc6f0a",
          "createdAt": "2021-11-26T12:20:59.594Z",
          "updatedAt": "2021-11-26T12:20:59.594Z",
          "userName": "username1"
        },
        {
          "_id": "61a0d12468a7dc1e9063c8d8",
          "numOfUpvotes": 0,
          "numOfAnswers": 0,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q5",
          "description": "q5",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "510f70b9-ae50-408a-aa44-8af55cfa7253",
          "createdAt": "2021-11-26T12:20:52.516Z",
          "updatedAt": "2021-11-26T12:20:52.516Z",
          "userName": "username1"
        },
        {
          "_id": "61a0d11e68a7dc1e9063c8d6",
          "numOfUpvotes": 0,
          "numOfAnswers": 0,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q4",
          "description": "q4",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "ff1c5ee8-c2e8-4e76-916b-4d5af7435c79",
          "createdAt": "2021-11-26T12:20:46.214Z",
          "updatedAt": "2021-11-26T12:20:46.214Z",
          "userName": "username1"
        },
        {
          "_id": "61a0d11768a7dc1e9063c8d4",
          "numOfUpvotes": 0,
          "numOfAnswers": 0,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q3",
          "description": "q3",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "427e7108-6038-46b3-871a-c410bd92793b",
          "createdAt": "2021-11-26T12:20:39.899Z",
          "updatedAt": "2021-11-26T12:20:39.899Z",
          "userName": "username1"
        },
        {
          "_id": "61a0d11168a7dc1e9063c8d2",
          "numOfUpvotes": 0,
          "numOfAnswers": 0,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q2",
          "description": "q2",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "f15232a2-a062-4e0d-bd24-f272a3468ad6",
          "createdAt": "2021-11-26T12:20:33.936Z",
          "updatedAt": "2021-11-26T12:20:33.936Z",
          "userName": "username1"
        },
        {
          "_id": "61a0ccc3c8d0984b40ccdc6d",
          "numOfUpvotes": 0,
          "numOfAnswers": 9,
          "courseId": "12345",
          "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
          "title": "q1",
          "description": "q1",
          "createdBy": "1",
          "updatedBy": "1",
          "questionId": "f5985c1c-8343-421a-b06f-37737daef5f6",
          "createdAt": "2021-11-26T12:02:11.282Z",
          "updatedAt": "2021-11-26T12:02:11.282Z",
          "verifiedAnswerId": "ba2be617-8fdf-4e3e-89d7-f1c118262d1d",
          "userName": "username1"
        }
      ]
    };
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/questions?elementId=5ef6375e-9542-4bfd-be02-c550f70dfcf0&limit=15&skip=0`, HttpMethod.GET, {}).and.resolveTo({ body: expectedResponse });
    const questionResponse = await service.getQuestions('5ef6375e-9542-4bfd-be02-c550f70dfcf0');
    expect(questionResponse).toEqual(expectedResponse);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/questions?elementId=5ef6375e-9542-4bfd-be02-c550f70dfcf0&limit=15&skip=0`, HttpMethod.GET, {});
  });

  it('should call get answers', async () => {
    const expectedResponse = [
      {
        "_id": "61af3d017aafe574c871706b",
        "firstLevelAnswerId": null,
        "parentAnswerId": null,
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>a15</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "89af90ed-e908-463a-8264-9219d1ec1400",
        "createdAt": "2021-12-07T10:52:49.222Z",
        "updatedAt": "2021-12-07T10:52:49.222Z",
        "verifiedAt": "2021-12-07T10:52:49.314Z",
        "verifiedBy": "1",
        "userName": "username1"
      },
      {
        "_id": "61adc6af7aafe574c8716393",
        "firstLevelAnswerId": null,
        "parentAnswerId": null,
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>a10</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "aac4065c-aa1b-4b6b-af97-60b9c937feef",
        "createdAt": "2021-12-06T08:15:43.932Z",
        "updatedAt": "2021-12-06T08:15:43.932Z",
        "userName": "username1"
      },
      {
        "_id": "61adc6fb7aafe574c87163b5",
        "firstLevelAnswerId": null,
        "parentAnswerId": null,
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>a11</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "3ef34b12-b068-4c47-b40b-fcd328c3f4b6",
        "createdAt": "2021-12-06T08:16:59.453Z",
        "updatedAt": "2021-12-06T08:16:59.453Z",
        "userName": "username1"
      },
      {
        "_id": "61adc7af7aafe574c8716414",
        "firstLevelAnswerId": null,
        "parentAnswerId": null,
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>a13</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "ad36abe8-5245-4da5-b2f6-48839d4f6e39",
        "createdAt": "2021-12-06T08:19:59.879Z",
        "updatedAt": "2021-12-06T08:19:59.879Z",
        "userName": "username1"
      },
      {
        "_id": "61adc8367aafe574c871642a",
        "firstLevelAnswerId": null,
        "parentAnswerId": null,
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>a14</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "ecfab1ff-f5e4-4206-82ab-9758f113e12e",
        "createdAt": "2021-12-06T08:22:14.102Z",
        "updatedAt": "2021-12-06T08:22:14.102Z",
        "userName": "username1"
      }
    ];
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/answers?questionId=ba1fbf02-4b16-4678-9558-ae21af05b478&limit=5&skip=0`, HttpMethod.GET, {}).and.resolveTo({ body: expectedResponse });
    const answerResponse = await service.getAnswers('ba1fbf02-4b16-4678-9558-ae21af05b478', 5, 0);
    expect(answerResponse).toEqual(expectedResponse);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/answers?questionId=ba1fbf02-4b16-4678-9558-ae21af05b478&limit=5&skip=0`, HttpMethod.GET, {});
  });

  it('should call get answers to get child answers', async () => {
    const expectedResponse = [
      {
        "_id": "61ade8a37aafe574c87167fc",
        "firstLevelAnswerId": "16ad27c6-6692-4d58-b92e-ac4b351bd060",
        "parentAnswerId": "16ad27c6-6692-4d58-b92e-ac4b351bd060",
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>r1</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "1210a9c6-9707-4f1a-a741-185011bf1372",
        "createdAt": "2021-12-06T10:40:35.882Z",
        "updatedAt": "2021-12-06T10:40:35.882Z",
        "userName": "username1"
      },
      {
        "_id": "61ade8af7aafe574c8716802",
        "firstLevelAnswerId": "16ad27c6-6692-4d58-b92e-ac4b351bd060",
        "parentAnswerId": "16ad27c6-6692-4d58-b92e-ac4b351bd060",
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>r2</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "f1d21824-40cd-4818-801f-07969c29cd89",
        "createdAt": "2021-12-06T10:40:47.635Z",
        "updatedAt": "2021-12-06T10:40:47.635Z",
        "userName": "username1"
      },
      {
        "_id": "61adf0037aafe574c87169b8",
        "firstLevelAnswerId": "16ad27c6-6692-4d58-b92e-ac4b351bd060",
        "parentAnswerId": "16ad27c6-6692-4d58-b92e-ac4b351bd060",
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>3</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "d5ddd907-f721-4a0b-9ef9-92f514d54fbb",
        "createdAt": "2021-12-06T11:12:03.555Z",
        "updatedAt": "2021-12-06T11:12:03.555Z",
        "userName": "username1"
      },
      {
        "_id": "61adf0097aafe574c87169be",
        "firstLevelAnswerId": "16ad27c6-6692-4d58-b92e-ac4b351bd060",
        "parentAnswerId": "16ad27c6-6692-4d58-b92e-ac4b351bd060",
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>4</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "735f148b-8c67-4f38-9840-a5d5fa9719f5",
        "createdAt": "2021-12-06T11:12:09.927Z",
        "updatedAt": "2021-12-06T11:12:09.927Z",
        "userName": "username1"
      },
      {
        "_id": "61adf00f7aafe574c87169c4",
        "firstLevelAnswerId": "16ad27c6-6692-4d58-b92e-ac4b351bd060",
        "parentAnswerId": "16ad27c6-6692-4d58-b92e-ac4b351bd060",
        "numOfReplies": 0,
        "numOfUpvotes": 0,
        "questionId": "ba1fbf02-4b16-4678-9558-ae21af05b478",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "answer": "<p>5</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "answerId": "cf56347f-94b5-490e-9a6b-e9c02e1a4d18",
        "createdAt": "2021-12-06T11:12:15.353Z",
        "updatedAt": "2021-12-06T11:12:15.353Z",
        "userName": "username1"
      }
    ];
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/answers?questionId=ba1fbf02-4b16-4678-9558-ae21af05b478&firstLevelAnswerId=16ad27c6-6692-4d58-b92e-ac4b351bd060&limit=5&skip=0`, HttpMethod.GET, {}).and.resolveTo({ body: expectedResponse });
    const answerResponse = await service.getAnswers('ba1fbf02-4b16-4678-9558-ae21af05b478', 5, 0, '16ad27c6-6692-4d58-b92e-ac4b351bd060');
    expect(answerResponse).toEqual(expectedResponse);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/answers?questionId=ba1fbf02-4b16-4678-9558-ae21af05b478&firstLevelAnswerId=16ad27c6-6692-4d58-b92e-ac4b351bd060&limit=5&skip=0`, HttpMethod.GET, {});
  });

  it('should call give reply', async () => {
    const expectedResponse = {
      "firstLevelAnswerId": "",
      "parentAnswerId": null,
      "numOfReplies": 0,
      "numOfUpvotes": 0,
      "_id": "61b18b36008c327eec5df7c5",
      "questionId": "28eb39d0-dd30-4e62-a3be-327c79ede292",
      "elementId": "d15d5e39-cbca-4c2e-9ad1-8534b0c109ca",
      "answer": "r1-r1-r2-a2",
      "createdBy": "f0f94b10-e312-412a-8cf2-18a7040bd9dd",
      "updatedBy": "f0f94b10-e312-412a-8cf2-18a7040bd9dd",
      "answerId": "ce587900-ff9c-4bbf-a0dd-a4320ec18d30",
      "createdAt": "2021-12-09T04:51:02.417Z",
      "updatedAt": "2021-12-09T04:51:02.417Z"
    };
    const payLoad = {
      "questionId": "28eb39d0-dd30-4e62-a3be-327c79ede292",
      "elementId": "d15d5e39-cbca-4c2e-9ad1-8534b0c109ca",
      "answer": "r1-r1-r2-a2",
      "firstLevelAnswerId": ""
    };
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/answers`, HttpMethod.POST, payLoad).and.resolveTo({ body: expectedResponse });
    const answerResponse = await service.giveReply(payLoad);
    expect(answerResponse.body).toEqual(expectedResponse);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/answers`, HttpMethod.POST, payLoad);
  });

  it('should call ask question', async () => {
    service.courseId = '12345';
    // storageService.set(StorageKey.ELEMENT_ID, "5ef6375e-9542-4bfd-be02-c550f70dfcf0");
    const expectedResponse = {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://localhost:3035/api/courseservice/qna/questions",
      "ok": true,
      "type": 4,
      "body": {
        "numOfUpvotes": 0,
        "numOfAnswers": 0,
        "_id": "61c40e74854f740df83dea3a",
        "courseId": "12345",
        "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
        "title": "q50",
        "description": "<p>q50</p>",
        "createdBy": "1",
        "updatedBy": "1",
        "contentTitle": "Content 1",
        "contentType": "pdf",
        "questionId": "0e25ef24-3f3f-4365-b5ac-883959cf7256",
        "createdAt": "2021-12-23T05:51:48.020Z",
        "updatedAt": "2021-12-23T05:51:48.020Z"
      }
    };
    const payLoad = {
      title: "q50",
      description: "q50",
      courseId: '12345',
      elementId: '5ef6375e-9542-4bfd-be02-c550f70dfcf0'
    };
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/questions`, HttpMethod.POST, payLoad).and.resolveTo(expectedResponse);
    spyOn(storageService, 'get').withArgs(StorageKey.ELEMENT_ID).and.returnValue("5ef6375e-9542-4bfd-be02-c550f70dfcf0");
    const answerResponse = await service.askQuestion(payLoad);
    expect(answerResponse).toEqual(expectedResponse.body);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/questions`, HttpMethod.POST, payLoad);
    expect(storageService.get).toHaveBeenCalledWith(StorageKey.ELEMENT_ID);
  });

  it('should call update answer', async () => {
    const expectedResponse = {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://localhost:3035/api/courseservice/qna/answers/40a345df-897b-4725-bf31-9020ec80dcac",
      "ok": true,
      "type": 4,
      "body": {
        "status": "success"
      }
    };
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/answers/40a345df-897b-4725-bf31-9020ec80dcac`, HttpMethod.PUT, {answer: 'updated'}).and.resolveTo(expectedResponse);
    const answerResponse = await service.updateAnswer("40a345df-897b-4725-bf31-9020ec80dcac", 'updated');
    expect(answerResponse).toEqual(expectedResponse);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/answers/40a345df-897b-4725-bf31-9020ec80dcac`, HttpMethod.PUT, {answer: 'updated'});
  });

  it('should call vote', async () => {
    const expectedResponse = {
      "status": "success"
    };
    const payLoad = {
      "interactionType": "removePin",
      "objectType": "question"
    };
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/user-interactions/28eb39d0-dd30-4e62-a3be-327c79ede292`, HttpMethod.PUT, payLoad).and.resolveTo({ body: expectedResponse });
    const answerResponse = await service.vote('28eb39d0-dd30-4e62-a3be-327c79ede292', payLoad);
    expect(answerResponse.body).toEqual(expectedResponse);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/user-interactions/28eb39d0-dd30-4e62-a3be-327c79ede292`, HttpMethod.PUT, payLoad);
  });

  it('should call delete question', async () => {
    const expectedResponse = {
      "status": "success"
    };
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/questions/6225086e-f943-4609-9606-dacc1bb3baad`, HttpMethod.DELETE, {}).and.resolveTo({ body: expectedResponse });
    const answerResponse = await service.deleteQuestion('6225086e-f943-4609-9606-dacc1bb3baad');
    expect(answerResponse.body).toEqual(expectedResponse);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/questions/6225086e-f943-4609-9606-dacc1bb3baad`, HttpMethod.DELETE, {});
  });

  it('should call delete answer', async () => {
    const expectedResponse = {
      "status": "success"
    };
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/answers/89af90ed-e908-463a-8264-9219d1ec1400`, HttpMethod.DELETE, {}).and.resolveTo({ body: expectedResponse });
    const answerResponse = await service.deleteAnswer('89af90ed-e908-463a-8264-9219d1ec1400');
    expect(answerResponse.body).toEqual(expectedResponse);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/answers/89af90ed-e908-463a-8264-9219d1ec1400`, HttpMethod.DELETE, {});
  });

  it('should call toggle verify', async () => {
    const expectedResponse = {
      "status": "success"
    };
    const payLoad = {
      "verified": true
    };
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/answers/d9a3427e-e551-48f7-8f9d-71519fcc93eb`, HttpMethod.PUT, payLoad).and.resolveTo({ body: expectedResponse });
    const answerResponse = await service.toggleVerifyAnswer('d9a3427e-e551-48f7-8f9d-71519fcc93eb', payLoad);
    expect(answerResponse.body).toEqual(expectedResponse);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/answers/d9a3427e-e551-48f7-8f9d-71519fcc93eb`, HttpMethod.PUT, payLoad);
  });

  it('should call update question', async () => {
    const expectedResponse = {
      "headers": {
        "normalizedNames": {},
        "lazyUpdate": null
      },
      "status": 200,
      "statusText": "OK",
      "url": "http://localhost:3035/api/courseservice/qna/questions/0e25ef24-3f3f-4365-b5ac-883959cf7256",
      "ok": true,
      "type": 4,
      "body": {
        "status": "success"
      }
    };
    const question = {
      title: 'q',
      description: 'q'
    };
    spyOn(httpClientService, 'getResponse').withArgs(Service.COURSE_SERVICE, `qna/questions/0e25ef24-3f3f-4365-b5ac-883959cf7256`, HttpMethod.PUT, question).and.resolveTo(expectedResponse);
    const response = await service.updateQuestion('0e25ef24-3f3f-4365-b5ac-883959cf7256', question);
    expect(response).toEqual(expectedResponse);
    expect(httpClientService.getResponse).toHaveBeenCalledWith(Service.COURSE_SERVICE, `qna/questions/0e25ef24-3f3f-4365-b5ac-883959cf7256`, HttpMethod.PUT, question);
  });
});
