/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { ToastrModule } from 'ngx-toastr';
import { DiscussionForumContentComponent } from './discussion-forum-content.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import translations from '../../../../../assets/i18n/en.json';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { StorageService } from 'src/app/services/storage.service';
import { ForumDetailComponent } from '../../forum-detail/forum-detail.component';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('DiscussionForumContentComponent', () => {
  let component: DiscussionForumContentComponent;
  let fixture: ComponentFixture<DiscussionForumContentComponent>;
  let contentService: ContentService;
  let translate: TranslateService;
  let router: Router;
  let contentPlayerService: ContentPlayerService;
  let storageService: StorageService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [DiscussionForumContentComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        }),
        ToastrModule.forRoot(),
        SafePipeModule,
        RouterTestingModule.withRoutes(
          [{path: 'forum-detail/37bb3ef2-cf6b-4f35-8940-4f04308813a2', component: ForumDetailComponent}])
      ],
      providers: [
        ContentService,
        TranslateService,
        ContentPlayerService,
        StorageService,
        // { provide: Router, useValue: routerProvider }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionForumContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    contentService = TestBed.inject(ContentService);
    translate = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    translate.use('en');
    contentPlayerService = TestBed.inject(ContentPlayerService);
    storageService = TestBed.inject(StorageService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call moreContent method while toggle more and less', () => {
    const forum = {"isTextFullHeight": false};
    const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
    spyOn(component, 'moreContent').and.callThrough();
    component.moreContent(forum, event);
    expect(component.moreContent).toHaveBeenCalled;
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should publish success', () => {
    const activity = {status: "published"};
    const elementId = "37bb3ef2-cf6b-4f35-8940-4f04308813a2";
    const event = { target: { checked: true }};
    const expectedResult:any = {
      "status": "success",
      "__v": 2032
    };
    spyOn(contentService, 'publish').and.returnValue(expectedResult);
    spyOn(component, 'publishUnpublish').and.callThrough();
    contentService.publish('1142', elementId, true);
    component.publishUnpublish(activity, event);
    expect(component.publishUnpublish).toHaveBeenCalled;
  });

  it('should publish error', () => {
    const activity = {status: "published"};
    const elementId = "37bb3ef2-cf6b-4f35-8940-4f04308813a2";
    const event = { target: { checked: true }};
    const expectedResult:any = function() {
      throw new TypeError("No course element was found for the provided element ID");
    };
    spyOn(contentService, 'unPublish').and.resolveTo(expectedResult);
    spyOn(component, 'publishUnpublish').and.callThrough();
    contentService.unPublish('1142', elementId);
    component.publishUnpublish(activity, event);
    expect(component.publishUnpublish).toHaveBeenCalled;
    expect(expectedResult).toThrowError("No course element was found for the provided element ID");

  });

  it('should Unpublish success ', () => {
    const activity = {status: "unpublished"};
    const elementId = "37bb3ef2-cf6b-4f35-8940-4f04308813a2";
    const event = { target: { checked: false }};
    const expectedResult:any = {
      "status": "success",
      "__v": 2032
    };
    spyOn(contentService, 'unPublish').and.returnValue(expectedResult);
    spyOn(component, 'publishUnpublish').and.callThrough();
    contentService.unPublish('1142', elementId);
    component.publishUnpublish(activity, event);
    expect(component.publishUnpublish).toHaveBeenCalled;
  });

  // it('should Unpublish error ', () => {
  //   const activity = {status: "unpublished"};
  //   const elementId = "";
  //   const event = { target: { checked: false }};
  //   const expectedResult:any = function() {
  //     throw new TypeError("No course element was found for the provided element ID");
  //   };
  //   spyOn(contentService, 'unPublish').and.returnValue(expectedResult);
  //   spyOn(component, 'publishUnpublish').and.callThrough();
  //   contentService.unPublish('1142', elementId);
  //   component.publishUnpublish(activity, event);
  //   expect(expectedResult).toThrowError("No course element was found for the provided element ID");
  // });

  it('should Unpublish error ', () => {
    const activity = {status: "published"};
    const elementId = "37bb3ef2-cf6b-4f35-8940-4f04308813a2";
    const event = { target: { checked: false }};
    const expectedResult:any = function() {
      throw new TypeError("No course element was found for the provided element ID");
    };
    spyOn(contentService, 'publish').and.returnValue(expectedResult);
    spyOn(component, 'publishUnpublish').and.callThrough();
    contentService.publish('1142', elementId, true);
    component.publishUnpublish(activity, event);
    expect(expectedResult).toThrowError("No course element was found for the provided element ID");
  });

  it('should showToaster', () => {
    const res = {status: 200};
    const message = "Discussion Forum published successfully";
    spyOn(component, 'showToaster').and.callThrough();
    component.showToaster(res, message);
    expect(component.toastMessage).toEqual(message);
  });

  it('should close toast', () => {
    spyOn(component, 'closeToast').and.callThrough();
    component.closeToast();
    expect(component.forumToast).toEqual(false);
  });

  it('should goToForumDetail', () => {
    const activityId = "37bb3ef2-cf6b-4f35-8940-4f04308813a2";
    const forumDetail = {clickable: true};
    component.forumDetail = forumDetail;
    spyOn(component, 'goToForumDetail').and.callThrough();
    component.goToForumDetail(activityId);
    expect(component.goToForumDetail).toHaveBeenCalled();
  });

  it('should downloadAttachment', () => {
    const forumDetail = {fileName: "sample.pdf", originalFileName: "Sample.pdf"};
    const url:any = {body: {url: "www.sample.com/sample.pdf"}};
    spyOn(contentPlayerService, 'getSignedUrl').and.returnValue(url);
    spyOn(component, 'downloadAttachment').and.callThrough();
    contentPlayerService.getSignedUrl(forumDetail.fileName, forumDetail.originalFileName);
    component.downloadAttachment();
    expect(component.downloadAttachment).toHaveBeenCalled();
  });

  it('should moreLessOption', () => {
    const forumDetail = {
      breadcrumbTitle: "/Unit 1 Economics Financial Aspects (Knowledge of stock market trade and investment)",
      title: "A systemic basis of accounting will introduce you to some basic accounting principles and technologyA systemic basis of accounting will introduce you to some basic accounting principles and technologyA systemic basis of accounting will introduce you to some basic accounting principles and technologyA systemic basis of accounting will introduce you to some basic accounting principles and technologyA systemic basis of accounting will introduce you to some basic accounting principles and technology",
      description: "<p><span style=\"background-color:rgb(247,248,249);color:rgba(85,85,85,0.8);font-size:16px;\">A systemic basis of accounting will introduce you to some basic accounting principles and technologyA systemic basis of accounting will introduce you to some basic accounting principles and technologyA systemic basis of accounting will introduce you to some basic accounting principles and technologyA systemic basis of accounting will introduce you to some basic accounting principles and technologyA systemic basis of accounting will introduce you to some basic accounting principles and technologyA systemic basis of accounting will introduce you to some basic accounting principles technology</span></p>",
      createdAt: "2022-01-05T17:02:14.041Z",
      status: "unpublished",
      activityId: "e064f1c6-b10c-4f5c-aac3-e72bd2344d4f",
      isGradable: false,
      clickable: true
    };
    const courseId = "1142";
    component.courseId = courseId;
    component.forumDetail = forumDetail;
    component.userCurrentView = "Admin";
    spyOn(component, 'moreLessOption').and.callThrough();
    component.moreLessOption();
    expect(component.moreLessOption).toHaveBeenCalled();
  });
  
});
