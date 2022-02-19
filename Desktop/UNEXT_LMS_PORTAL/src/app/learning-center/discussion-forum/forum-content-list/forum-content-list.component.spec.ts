/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ForumContentListComponent } from './forum-content-list.component';

import translations from '../../../../assets/i18n/en.json';
import { ToastrModule } from 'ngx-toastr';
import { SortPipe } from 'src/app/pipes/sort.pipe';
import { ContentService } from '../../course-services/content.service';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { JWTService } from 'src/app/services/jwt.service';
import { CommonUtils } from 'src/app/utils/common-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientService } from 'src/app/services/http-client.service';
import { DiscussionForumService } from '../../course-services/discussion-forum.service';
import { ManipulationComponent } from '../../manipulation/manipulation.component';
import { ForumDetailComponent } from '../forum-detail/forum-detail.component';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
describe('ForumListComponent', () => {
  let component: ForumContentListComponent;
  let fixture: ComponentFixture<ForumContentListComponent>;
  let contentService: ContentService;
  let storageService: StorageService;
  let translate: TranslateService;
  let httpClient: HttpClientService;
  let router: Router;
  let jwtService: JWTService;
  let activatedRoute: ActivatedRoute;
  const data = {
    "paginatedDiscussionElements": [
      {
        "elementId": "7e32639a-8027-4e57-ba31-98f0843ce499",
        "type": "discussion_forum",
        "subType": "standard_discussion_forum",
        "title": "standard 1",
        "status": "unpublished",
        "createdOn": "2021-12-15T12:29:48.351Z",
        "createdBy": "1",
        "updatedOn": "2021-12-15T12:29:48.351Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61b9dfbc8b87435138a8974c",
            "isGradable": true,
            "learningObjectives": [
              "string"
            ],
            "emailNotification": true,
            "tags": [
              "string"
            ],
            "title": "standard 1",
            "description": "standard 1",
            "courseId": "1000",
            "startDate": "2021-11-23T05:56:46.062Z",
            "endDate": "2021-12-23T05:56:46.062Z",
            "rubricId": "string",
            "maxMarks": 100,
            "passMarks": 45,
            "visibilityCriteria": true,
            "activityStatus": "mandatory",
            "fileName": "filename1.ppt",
            "originalFileName": "filename.ppt",
            "parentElementId": "1000",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "7e32639a-8027-4e57-ba31-98f0843ce499",
            "createdAt": "2021-12-15T12:29:48.517Z",
            "updatedAt": "2021-12-15T12:29:48.517Z"
          }
        ],
        "breadcrumbTitle": "",
        "qnAmetaData": {
          "totalQuestions": 0,
          "totalAnswers": 0,
          "updatedAt": null,
          "updatedBy": null
        }
      }],
    "paginationInfo": {
      "totalItems": 30,
      "currentPage": 1,
      "pageSize": 5,
      "totalPages": 6,
      "startPage": 1,
      "endPage": 6,
      "startIndex": 0,
      "endIndex": 4,
      "pages": [
        1,
        2,
        3,
        4,
        5,
        6
      ]
    },
    "__v": 1353
  };
  const allDoubtData = {
    "paginatedDiscussionElements": [
      {
        "elementId": "6698a64c-91ea-467a-b379-3e45ea7ec95c",
        "type": "discussion_forum",
        "subType": "doubt_clarification_forum",
        "title": "doubt 1",
        "status": "published",
        "createdOn": "2021-12-16T10:36:59.441Z",
        "createdBy": "1",
        "updatedOn": "2021-12-16T10:36:59.441Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61bb16cc8b6091587cc18988",
            "isGradable": true,
            "learningObjectives": [
              "string"
            ],
            "emailNotification": true,
            "tags": [
              "string"
            ],
            "title": "doubt 1",
            "description": "doubt 1",
            "courseId": "1000",
            "startDate": "2021-11-23T05:56:46.062Z",
            "endDate": "2021-12-23T05:56:46.062Z",
            "rubricId": "9c53e89d-cbde-473a-b532-65faa66fdc73",
            "maxMarks": 100,
            "passMarks": 45,
            "visibilityCriteria": true,
            "activityStatus": "mandatory",
            "fileName": "filename1.ppt",
            "originalFileName": "filename.ppt",
            "parentElementId": "1000",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "6698a64c-91ea-467a-b379-3e45ea7ec95c",
            "createdAt": "2021-12-16T10:37:00.300Z",
            "updatedAt": "2021-12-16T10:37:00.300Z"
          }
        ],
        "breadcrumbTitle": "",
        "qnAmetaData": {
          "totalQuestions": 9,
          "totalAnswers": 4,
          "updatedAt": "2021-12-20T12:15:42.446Z",
          "updatedBy": "1"
        }
      },
      {
        "elementId": "42e13690-0cd0-4210-adca-ada3070c248a",
        "type": "discussion_forum",
        "subType": "doubt_clarification_forum",
        "title": "doubt 2",
        "status": "unpublished",
        "createdOn": "2021-12-16T14:17:40.629Z",
        "createdBy": "1",
        "updatedOn": "2021-12-16T14:17:40.629Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61bb4a8542c9bb2f1cbd6dc8",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [
              "string"
            ],
            "title": "doubt 2",
            "description": "string",
            "courseId": "1000",
            "startDate": "2021-12-01T09:47:41.016Z",
            "endDate": "2021-12-01T09:48:42.016Z",
            "rubricId": "string",
            "maxMarks": 200,
            "passMarks": 20,
            "visibilityCriteria": true,
            "activityStatus": "optional",
            "fileName": "string",
            "originalFileName": "string",
            "parentElementId": "5b1898a5-07bf-4cce-94d6-8ff8fddf93ba",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "42e13690-0cd0-4210-adca-ada3070c248a",
            "createdAt": "2021-12-16T14:17:41.461Z",
            "updatedAt": "2021-12-16T14:17:41.461Z"
          }
        ],
        "breadcrumbTitle": "/folder01",
        "qnAmetaData": {
          "totalQuestions": 0,
          "totalAnswers": 0,
          "updatedAt": null,
          "updatedBy": null
        }
      },
      {
        "elementId": "6745a45f-570c-4ffc-ad81-0cf77461c4b0",
        "type": "discussion_forum",
        "subType": "doubt_clarification_forum",
        "title": "Create",
        "status": "published",
        "createdOn": "2021-12-17T10:28:54.316Z",
        "createdBy": "1",
        "updatedOn": "2021-12-17T10:28:54.316Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61bc66667d7d295fe471c596",
            "isGradable": false,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [],
            "courseId": "1000",
            "parentElementId": "5b1898a5-07bf-4cce-94d6-8ff8fddf93ba",
            "title": "Create",
            "description": "<p>desc</p>",
            "visibilityCriteria": true,
            "activityStatus": "mandatory",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "6745a45f-570c-4ffc-ad81-0cf77461c4b0",
            "createdAt": "2021-12-17T10:28:54.964Z",
            "updatedAt": "2021-12-17T10:28:54.964Z"
          }
        ],
        "breadcrumbTitle": "/folder01",
        "qnAmetaData": {
          "totalQuestions": 0,
          "totalAnswers": 0,
          "updatedAt": null,
          "updatedBy": null
        }
      },
      {
        "elementId": "0554e543-09ad-4407-bd8a-eeb54daf6937",
        "type": "discussion_forum",
        "subType": "doubt_clarification_forum",
        "title": "DBT title",
        "status": "published",
        "createdOn": "2021-12-17T12:07:18.296Z",
        "createdBy": "1",
        "updatedOn": "2021-12-17T12:07:18.296Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61bc7d767d7d295fe471c762",
            "isGradable": false,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [],
            "courseId": "1000",
            "parentElementId": "5b1898a5-07bf-4cce-94d6-8ff8fddf93ba",
            "title": "DBT title",
            "description": "<p>des</p>",
            "visibilityCriteria": false,
            "activityStatus": "mandatory",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "0554e543-09ad-4407-bd8a-eeb54daf6937",
            "createdAt": "2021-12-17T12:07:18.558Z",
            "updatedAt": "2021-12-17T12:07:18.558Z"
          }
        ],
        "breadcrumbTitle": "/folder01",
        "qnAmetaData": {
          "totalQuestions": 0,
          "totalAnswers": 0,
          "updatedAt": null,
          "updatedBy": null
        }
      },
      {
        "elementId": "68f97bd1-1f2c-4078-8155-5d80b158fe72",
        "type": "discussion_forum",
        "subType": "doubt_clarification_forum",
        "title": "DBT ADM",
        "status": "unpublished",
        "createdOn": "2021-12-16T16:08:32.969Z",
        "createdBy": "1",
        "updatedOn": "2021-12-16T16:08:32.969Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61bb64818e3f1c4a9880890a",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [
              "string"
            ],
            "title": "DBT ADM",
            "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "courseId": "1000",
            "startDate": "2021-11-23T05:56:46.062Z",
            "endDate": "2021-12-23T05:56:46.062Z",
            "rubricId": "string",
            "maxMarks": 100,
            "passMarks": 45,
            "visibilityCriteria": true,
            "activityStatus": "mandatory",
            "fileName": "filename1.ppt",
            "originalFileName": "filename.ppt",
            "parentElementId": "1000",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "68f97bd1-1f2c-4078-8155-5d80b158fe72",
            "createdAt": "2021-12-16T16:08:33.234Z",
            "updatedAt": "2021-12-16T16:08:33.234Z"
          }
        ],
        "breadcrumbTitle": "",
        "qnAmetaData": {
          "totalQuestions": 9,
          "totalAnswers": 4,
          "updatedAt": "2021-12-20T12:15:42.446Z",
          "updatedBy": "1"
        }
      },
      {
        "elementId": "d4676ecb-af6d-41aa-8151-6a652915a600",
        "type": "discussion_forum",
        "subType": "doubt_clarification_forum",
        "title": "DBT ADM draft4",
        "status": "draft",
        "createdOn": "2021-12-20T17:06:11.458Z",
        "createdBy": "1",
        "updatedOn": "2021-12-20T17:06:11.458Z",
        "updatedBy": "1",
        "childElements": [],
        "activitymetadata": [
          {
            "_id": "61c0b803657bda13ccb44fa3",
            "isGradable": true,
            "learningObjectives": [],
            "emailNotification": true,
            "tags": [
              "string"
            ],
            "title": "DBT ADM draft4",
            "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "courseId": "1000",
            "startDate": "2021-11-23T05:56:46.062Z",
            "endDate": "2021-12-23T05:56:46.062Z",
            "rubricId": "string",
            "maxMarks": 100,
            "passMarks": 45,
            "visibilityCriteria": true,
            "activityStatus": "mandatory",
            "fileName": "filename1.ppt",
            "originalFileName": "filename.ppt",
            "parentElementId": "1000",
            "createdBy": "1",
            "updatedBy": "1",
            "activityId": "d4676ecb-af6d-41aa-8151-6a652915a600",
            "createdAt": "2021-12-20T17:06:11.690Z",
            "updatedAt": "2021-12-20T17:06:11.690Z"
          }
        ],
        "breadcrumbTitle": "",
        "qnAmetaData": {
          "totalQuestions": 9,
          "totalAnswers": 4,
          "updatedAt": "2021-12-20T12:15:42.446Z",
          "updatedBy": "1"
        }
      }
    ],
    "paginationInfo": {
      "totalItems": 30,
      "currentPage": 1,
      "pageSize": 5,
      "totalPages": 6,
      "startPage": 1,
      "endPage": 6,
      "startIndex": 0,
      "endIndex": 4,
      "pages": [
        1,
        2,
        3,
        4,
        5,
        6
      ]
    },
    "__v": 1353
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForumContentListComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        }),
        ToastrModule.forRoot(),
        RouterTestingModule.withRoutes(
          [
            {path: 'discussion-forums/standard_discussion_forum', component: ForumContentListComponent},
            {path: 'manipulate/create/discussion-forum/doubt/new', component: ManipulationComponent},
            {path: 'forum-detail/7e32639a-8027-4e57-ba31-98f0843ce499', component: ForumDetailComponent},
            {path: 'login', component: LoginLayoutComponent}

          ])
      ],
      providers: [
        SortPipe,
        JWTService,
        CommonUtils,
        TranslateService,
        DiscussionForumService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumContentListComponent);
    component = fixture.componentInstance;

    contentService = TestBed.inject(ContentService);
    storageService = TestBed.inject(StorageService);
    translate = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    translate = TestBed.inject(TranslateService);
    jwtService = TestBed.inject(JWTService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    translate.use('en');
    httpClient = TestBed.inject(HttpClientService);
    storageService.set(StorageKey.USER_CURRENT_VIEW, 'admin');
    spyOn(storageService, 'get').and.callFake((val) => {
      if (val === StorageKey.COURSE_JSON) {
        return [];
      } else if (val === StorageKey.DOC_VERSION) {
        return 100;
      } else if (val === StorageKey.DISCUSSION_FORUM_ACTIVE_TAB) {
        return 'doubt';
      }
      return 'admin';
    });
    spyOn(router, 'navigate').and.resolveTo(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete discussion', async () => {
    const res = {
      id: "04885893-d7c8-483a-a988-b6ab3c2cd0be",
      type: "standard_discussion_forum"
    };
    const routerParams = {forumType: "standard_discussion_forum"};
    component.routerParams = routerParams;
    component.discussionData = data;
    component.allDiscussionData = data;
    fixture.detectChanges();
    const msg = "Forum Deleted Successfully";
    spyOn(component, 'deleteEventHandler').and.callThrough();
    await component.deleteEventHandler(res);
    fixture.detectChanges();
    expect(component.toastMessage).toEqual(msg);
  });

  it('should call more', () => {
    const forum = {
      isTextFullHeight: false
    };
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    const event = { stopPropagation: () => { } };
    spyOn(component, 'moreContent').and.callThrough();
    component.moreContent(forum, event);
    fixture.detectChanges();
    expect(forum.isTextFullHeight).toEqual(true);
  });

  it('should delete doubt discussion', () => {
    const res = {
      "id": "0554e543-09ad-4407-bd8a-eeb54daf6937",
      "type": "doubt_clarification_forum"
    };
    component.allDiscussionData = allDoubtData;
    fixture.detectChanges();
    spyOn(translate, 'get').and.callFake((key) => {
      return of(key);
    });
    spyOn(component, 'deleteEventHandler').and.callThrough();
    component.deleteEventHandler(res);
    fixture.detectChanges();
  });

  it('should call forumDetail', async () => {
    const from = 'doubt';
    const forum = data.paginatedDiscussionElements[0];
    spyOn(component, 'forumDetail').and.callThrough();
    await component.forumDetail(forum, from);
  });

  it('should call openActiveTab', () => {
    component.allDiscussionData = data;
    const routerParams = {forumType: "doubt_clarification_forum"};
    component.routerParams = routerParams;
    fixture.detectChanges();
    spyOn(component, 'openActiveTab').and.callThrough();
    fixture.detectChanges();
    component.openActiveTab();
    expect(component.openActiveTab).toHaveBeenCalled();
  });

  it('should call toggleForum', () => {
    component.allDiscussionData = data;
    let path = "standard_discussion_forum";
    fixture.detectChanges();
    spyOn(component, 'toggleForum').and.callThrough();
    fixture.detectChanges();
    component.toggleForum(path);
    expect(component.toggleForum).toHaveBeenCalled();
    path = "doubt_clarification_forum";
    fixture.detectChanges();
    component.toggleForum(path);
    expect(component.toggleForum).toHaveBeenCalled();
  });

  it('should call sortForum', () => {
    component.allDiscussionData = data;
    let forumType = "standard_discussion_forum";
    const sortType = "newest";
    const page = 1;
    let routerParams = {forumType: "standard_discussion_forum"};
    const paginationConfig = {
      id: 'loadStandardDiscussionPagination',
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: 5
    };
    component.routerParams = routerParams;
    component.paginationConfig = paginationConfig;
    component.discussionData = data;
    spyOn(component, 'sortForum').and.callThrough();
    component.sortForum(sortType, page, forumType);
    expect(component.sortForum).toHaveBeenCalled();
    component.allDiscussionData = data;
    forumType = "doubt_clarification_forum";
    const paginationConfigForDoubtClarification = {
      id: 'loadDoubtDiscussionPagination',
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: 5
    };
    routerParams = {forumType: "doubt_clarification_forum"};
    component.routerParams = routerParams;
    component.paginationConfigForDoubtClarification = paginationConfigForDoubtClarification;
    component.sortForum(sortType, page, forumType);
    expect(component.sortForum).toHaveBeenCalled();
  });

  it('should call createForum', () => {
    const type = 'doubt';
    spyOn(component, 'createForum').and.callThrough();
    component.createForum(type);
  });

  it('should close Toast', () => {
    component.closeToast();
    expect(component.forumToast).toBeFalse();
    expect(component.closeToast).toHaveBeenCalled;
  });

  it('should getPage for standard discussion forum', () => {
    activatedRoute.snapshot.queryParams.sortType = "newest";
    spyOn(component, 'getPage').and.callThrough();
    component.getPage(1, "standard_discussion_forum");
    expect(component.getPage).toHaveBeenCalled;
  });

  it('should getPage for doubt clarification forum', () => {
    const routerParams = {forumType: "standard_discussion_forum"};
    component.routerParams = routerParams;
    component.discussionData = '';
    component.allDiscussionData = '';
    activatedRoute.snapshot.queryParams.sortType = "newest";
    fixture.detectChanges();
    spyOn(component, 'getPage').and.callThrough();
    component.getPage(1, "standard_discussion_forum");
    expect(component.getPage).toHaveBeenCalled;
  });

  it('should call modifyRecordsPerPage', fakeAsync(async () => {
    let type = 'plus';
    let forumType = 'standard_discussion_forum';
    component.paginationConfig.itemsPerPage = 5;
    spyOn(httpClient, 'getResponse').and.resolveTo({ body: data });
    spyOn(component, 'modifyRecordsPerPage').and.callThrough();
    fixture.detectChanges();
    await component.modifyRecordsPerPage(type, forumType);
    tick();
    expect(component.modifyRecordsPerPage).toHaveBeenCalled;
    expect(component.paginationConfig.itemsPerPage).toEqual(10);
    flush();
    type = 'minus';
    forumType = 'doubt_clarification_forum';
    component.paginationConfig.itemsPerPage = 10;
    fixture.detectChanges();
    await component.modifyRecordsPerPage(type, forumType);
    tick();
    expect(component.paginationConfig.itemsPerPage).toEqual(5);
    expect(component.modifyRecordsPerPage).toHaveBeenCalled;
    flush();
  }));

  it('should call modifyRecordsPerPageForDoubt', fakeAsync(async () => {
    let type = 'plus';
    let forumType = 'doubt_clarification_forum';
    component.paginationConfig.itemsPerPage = 5;
    spyOn(httpClient, 'getResponse').and.resolveTo({ body: data });
    spyOn(component, 'modifyRecordsPerPageForDoubt').and.callThrough();
    fixture.detectChanges();
    await component.modifyRecordsPerPageForDoubt(type, forumType);
    tick();
    expect(component.modifyRecordsPerPageForDoubt).toHaveBeenCalled;
    expect(component.paginationConfig.itemsPerPage).toEqual(5);
    flush();
    type = 'minus';
    forumType = 'doubt_clarification_forum';
    component.paginationConfig.itemsPerPage = 10;
    fixture.detectChanges();
    await component.modifyRecordsPerPageForDoubt(type, forumType);
    tick();
    expect(component.paginationConfig.itemsPerPage).toEqual(10);
    expect(component.modifyRecordsPerPageForDoubt).toHaveBeenCalled;
    flush();
  }));

});
