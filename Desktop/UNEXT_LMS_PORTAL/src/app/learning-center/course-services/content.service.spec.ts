/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { ContentItemFlatNode, ContentItemNode } from 'src/app/model';
import { CommonService } from 'src/app/services/common.service';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { JWTService } from 'src/app/services/jwt.service';
import { StorageService } from 'src/app/services/storage.service';
import { LearningCenterComponent } from '../learning-center.component';
import { ContentService } from './content.service';

// eslint-disable-next-line max-lines-per-function
describe('ContentService', () => {
  let service: ContentService;
  let httpClient: HttpClientService;
  let storageService: StorageService;
  //let commonService: CommonService;
  let dialogService: DialogService;
  let jwtService : JWTService;
  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent },{ path: '', component: LearningCenterComponent }];
  let mockCourseJson : ContentItemNode[];
  let mockresult: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let unitNode: any;
  let sourceParent: ContentItemFlatNode;
  beforeEach(() => {
    mockresult = {
      allowDownload: false,
      contentStatus: "mandatory",
      contentType: "otherattachements",
      createdBy: "",
      createdOn: "2021-10-19T09:52:39.550Z",
      description: "",
      elementId: "72803382-7646-426d-814e-db0a5726cbc0",
      fileExtension: "docx",
      fileUrl: "",
      idealTime: 60,
      lastAccessedTime: "2021-10-21T11:29:43.997Z",
      nextElement: { title: 'unit-2' },
      offlineAccess: false,
      originalFileName: "sample.docx",
      previousElement: null,
      s3FileName: "c56c1569-1f43-486e-9d9a-da4be3af2f8c.docx",
      sendNotification: true,
      status: "published",
      title: "other attch test",
      type: "otherattachements",
      updatedBy: "",
      updatedOn: "2021-10-19T09:52:39.550Z",
      visibilityCriteria: false
    };
    mockCourseJson= [{
      "_id": "72803382-7646-426d-814e-db0a5726cbc0",
      "elementMetadata": {
        "createdOn": "2021-10-19T09:52:39.550Z",
        "updatedOn": "2021-10-19T09:52:39.550Z",
        "elementId": "72803382-7646-426d-814e-db0a5726cbc0",
        "contentType": "otherattachements",
        "description": "",
        "contentStatus": "mandatory",
        "allowDownload": false,
        "offlineAccess": false,
        "sendNotification": true,
        "idealTime": 60,
        "visibilityCriteria": false,
        "createdBy": "",
        "updatedBy": "",
        "fileUrl": "",
        "s3FileName": "c56c1569-1f43-486e-9d9a-da4be3af2f8c.docx",
        "originalFileName": "sample.docx",
        "fileExtension": "docx"
      },
      "elementId": "72803382-7646-426d-814e-db0a5726cbc0",
      "title": "other attch test",
      "name": "other attch test",
      "status": "published",
      "progress": 100,
      "idealTime": 60,
      "numberOfContent": 1,
      "completedContent": 1,
      "type": "otherattachements",
      "children": []
    },
    {
      "_id": "510e90e9-5292-4b1a-bd91-e1e32e21d9e5",
      "elementMetadata": {
        "createdOn": "2021-10-22T10:30:25.080Z",
        "updatedOn": "2021-10-22T10:30:25.080Z",
        "elementId": "510e90e9-5292-4b1a-bd91-e1e32e21d9e5",
        "contentType": "document",
        "description": "",
        "contentStatus": "mandatory",
        "allowDownload": true,
        "offlineAccess": false,
        "sendNotification": true,
        "idealTime": 340,
        "visibilityCriteria": true,
        "createdBy": "",
        "updatedBy": "",
        "fileUrl": "",
        "s3FileName": "f6552176-22d3-410f-82d5-bb2206a7fb86.pdf",
        "originalFileName": "GRE_Math_Review_2_Algebra.pdf",
        "fileExtension": "pdf"
      },
      "elementId": "510e90e9-5292-4b1a-bd91-e1e32e21d9e5",
      "title": "Mollit eius proident error aspernatur nihil qui est quia perspiciatis doloribus accusamus labore",
      "name": "Mollit eius proident error aspernatur nihil qui est quia perspiciatis doloribus accusamus labore",
      "status": "published",
      "progress": 1,
      "idealTime": 340,
      "numberOfContent": 1,
      "completedContent": 0,
      "type": "document",
      "children": []
    }];
    unitNode = {
      "title": "Unit 12",
      "elementId": "58f87c07-5e47-4670-a8b3-e88acfad7986",
      "type": "Unit",
      "status": "unpublished",
      "childElements": [],
      "progress": 0,
      "idealTime": 0,
      "numberOfContent": 1,
      "completedContent": 0,
      "elementMetadata": {
        "createdOn": "2021-10-26T11:32:12.211Z",
        "updatedOn": "2021-10-26T12:43:48.633Z",
        "elementId": "58f87c07-5e47-4670-a8b3-e88acfad7986",
        "description": null,
        "visibilityCriteria": false,
        "banner": "data:image/png;base64,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",
        "bannerFileName": "Screenshot_1.png"
      }
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes), TranslateModule.forRoot({})],
      //declarations: [ContentService],
      providers: [HttpClientService, StorageService, CommonService, DialogService, TranslateService]
    });
    service = TestBed.inject(ContentService);
    httpClient = TestBed.inject(HttpClientService);
    storageService = TestBed.inject(StorageService);
    //commonService = TestBed.inject(CommonService);
    mockCourseJson.push(unitNode);
    storageService.set('courseJson', mockCourseJson);
    dialogService = TestBed.inject(DialogService);
    jwtService = TestBed.inject(JWTService);
  });

  // afterEach(() => {
  //   jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  // });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getElementDetail', () => {
    spyOn(service, 'getElementDetail').and.callFake(() => Promise.resolve(
      {
        allowDownload: false,
        contentStatus: "mandatory",
        contentType: "otherattachements",
        createdBy: "",
        createdOn: "2021-10-19T09:52:39.550Z",
        description: "",
        elementId: "72803382-7646-426d-814e-db0a5726cbc0",
        fileExtension: "docx",
        fileUrl: "",
        idealTime: 60,
        lastAccessedTime: "2021-10-21T11:29:43.997Z",
        nextElement: { title: 'unit-2' },
        offlineAccess: false,
        originalFileName: "sample.docx",
        previousElement: null,
        s3FileName: "c56c1569-1f43-486e-9d9a-da4be3af2f8c.docx",
        sendNotification: true,
        status: "published",
        title: "other attch test",
        type: "otherattachements",
        updatedBy: "",
        updatedOn: "2021-10-19T09:52:39.550Z",
        visibilityCriteria: false
      }
    ));
    service.getElementDetail('1142', '58f87c07-5e47-4670-a8b3-e88acfad7986').then((res) => {
      expect(JSON.stringify(res)).toEqual(JSON.stringify(mockresult));
    });
    
  });

  it('should saveUnit', () => {
    const payload = {
      banner: "data:image/png;base64,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",
      bannerFileName: "Screenshot_1.png",
      courseId: "1142",
      description: null,
      status: null,
      title: "Unit 1",
      visibilityCriteria: false
    };
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.saveUnit(payload);
  });
  it('should update Unit', () => {
    const payload = {
      banner: "data:image/png;base64,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",
      bannerFileName: "Screenshot_1.png",
      courseId: "1142",
      description: null,
      status: null,
      title: "Unit 1",
      visibilityCriteria: false
    };
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.updateUnit('510e90e9-5292-4b1a-bd91-e1e32e21d9e5', payload);
  });

  it('should save folder', () => {
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    const payload = {
      courseId: "1142",
      description: null,
      parentElementId: null,
      status: null,
      title: "new Folder",
      visibilityCriteria: false
    };
    service.saveFolder('58f87c07-5e47-4670-a8b3-e88acfad7986',payload);
  });
  it('should update folder', () => {
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    const payload = {
      courseId: "1142",
      description: null,
      parentElementId: null,
      status: null,
      title: "new Folder",
      visibilityCriteria: false
    };
    service.updateFolder('510e90e9-5292-4b1a-bd91-e1e32e21d9e5', payload);
  });

  it('should get content details', () => {
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.getContentDetails('1142', false);
  });
  it('should get folder details', () => {
    const payload = {
      body: {
        childElements: [],
        createdOn: "2021-10-26T11:32:12.206Z",
        elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
        status: "unpublished",
        title: "Unit 1",
        type: "Unit",
        updatedOn: "2021-10-26T11:32:12.206Z",
        __v: 470
      },
      headers: {},
      ok: true,
      status: 200,
      statusText: "OK",
      type: 4,
      url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
    };
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.getFolderDetails('1142', '510e90e9-5292-4b1a-bd91-e1e32e21d9e5').then((result => {
      expect(JSON.stringify(result)).toEqual(JSON.stringify(payload.body));
    }));
  });
  
  it('should save content', () => {
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.saveContent(Service.CONTENT_SERVICE, 'course', HttpMethod.GET);
  });

  it('should build tree', () => {
    const node = {unitNode};
    service.buildFileTree(node,1);
  });
  
  it('should save content item', () => {
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    const payload = {
      courseId: "1142",
      description: null,
      parentElementId: null,
      status: null,
      title: "new Folder",
      visibilityCriteria: false
    };
    service.saveContentItem(payload, '510e90e9-5292-4b1a-bd91-e1e32e21d9e5');
    service.saveContentItem(payload);
  });

  it('should delete node', () => {
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.deleteNode(null, '510e90e9-5292-4b1a-bd91-e1e32e21d9e5', '1142');
  });

  it('should iterate Element And Do Operation ', () => {
    service.iterateElementAndDoOperation(mockCourseJson, (element:ContentItemNode)=>element['status']='unpublished');
  });

  it('should publish content', () => {
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.publish('1142', '510e90e9-5292-4b1a-bd91-e1e32e21d9e5', true);
  });

  it('should unpublish', () => {
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.unPublish('1142', '510e90e9-5292-4b1a-bd91-e1e32e21d9e5');
  });

  it('should publish all', () => {
    spyOn(dialogService, 'showConfirmDialog').and.callFake(() => Promise.resolve(
      true
    ));
    spyOn(jwtService, 'checkAuthentication').and.callFake(() => Promise.resolve(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlcm5hbWUiOiJ1c2VybmFtZTEiLCJyZWZyZXNoVG9rZW4iOiJyZjEiLCJlbWFpbElkIjoiYUBiLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYzNTgyOTc2OSwiZXhwIjoxNjM1ODMxNTY5fQ.9ILNWT0a2XIBoXFgI2kVIB0OAb58_10U-V4dAugsEDg"
    ));
    spyOn(httpClient, 'getResponse').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "published",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.publishAll('1142');
  });

  it('getContentElement', () => {
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.getContentElement('1142', '510e90e9-5292-4b1a-bd91-e1e32e21d9e5');
  });

  it('handleDrop', () => {
    service.handleDrop();
  });

  it('moveNode', () => {
    service.moveNode();
  });

  it('addHeadersInterceptor', () => {
    spyOn(httpClient, 'getResponse').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "published",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.addHeadersInterceptor(Service.COURSE_SERVICE, 'course-content/course/1142/true', HttpMethod.GET, '', true);
  });

  it('moveTo', () => {
    spyOn(service, 'addHeadersInterceptor').and.callFake(() => Promise.resolve(
      {
        body: {
          childElements: [],
          createdOn: "2021-10-26T11:32:12.206Z",
          elementId: "58f87c07-5e47-4670-a8b3-e88acfad7986",
          status: "unpublished",
          title: "Unit 1",
          type: "Unit",
          updatedOn: "2021-10-26T11:32:12.206Z",
          __v: 470
        },
        headers: {},
        ok: true,
        status: 200,
        statusText: "OK",
        type: 4,
        url: "https://edunxtdev01.unext.tech/api/courseservice/course-content/unit"
      }
    ));
    service.moveTo(mockCourseJson, 8, sourceParent, unitNode, '510e90e9-5292-4b1a-bd91-e1e32e21d9e5', '1142');
  });
});
