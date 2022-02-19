/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ForumContentQnaThreadsStatisticsComponent } from './forum-content-qna-threads-statistics.component';
import { Observable, of } from 'rxjs';
import translations from '../../../../../assets/i18n/en.json';
import { DiscussionForumService } from '../../discussion-forum-services/discussion-forum.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { ForumEvaluateComponent } from '../../forum-evaluate/forum-evaluate.component';
import { DiscussionComponent } from '../../creation-and-manipulation/discussion/discussion.component';
import { StorageKey } from 'src/app/enums/storageKey';
import { ForumStatisticsComponent } from '../../forum-statistics/forum-statistics.component';
import { DialogService } from 'src/app/services/dialog.service';
import moment from 'moment';
class FakeLoader implements TranslateLoader {
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('ForumContentQnaThreadsStatisticsComponent', () => {
  let component: ForumContentQnaThreadsStatisticsComponent;
  let fixture: ComponentFixture<ForumContentQnaThreadsStatisticsComponent>;
  let discussionForumService: DiscussionForumService;
  let translate: TranslateService;
  let router: Router;
  let storageService: StorageService;
  let dialogService: DialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumContentQnaThreadsStatisticsComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader,
          }
        }),
        ToastrModule.forRoot(),
        SafePipeModule,
        RouterTestingModule.withRoutes(
          [{path: 'forum-evaluate/37bb3ef2-cf6b-4f35-8940-4f04308813a2', component: ForumEvaluateComponent},
            {path: 'manipulate/edit/discussion-forum/standard-disucssion-forum/37bb3ef2-cf6b-4f35-8940-4f04308813a2', component: DiscussionComponent},
            {path: 'forum-statistics/37bb3ef2-cf6b-4f35-8940-4f04308813a2', component: ForumStatisticsComponent}])
      ],
      providers: [
        DiscussionForumService,
        TranslateService,
        StorageService,
        DialogService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumContentQnaThreadsStatisticsComponent);
    component = fixture.componentInstance;
    discussionForumService = TestBed.inject(DiscussionForumService);
    dialogService = TestBed.inject(DialogService);
    translate = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    storageService = TestBed.inject(StorageService);
    storageService.set(StorageKey.USER_CURRENT_VIEW, "admin");
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should evaluate', () => {
    const activityId = "37bb3ef2-cf6b-4f35-8940-4f04308813a2";
    let widgetData = {status: 'published', level: "firstLevel"};
    component.widgetData = widgetData;
    spyOn(component, 'evaluate').and.callThrough();
    component.evaluate(activityId);
    expect(component.evaluate).toHaveBeenCalledWith("37bb3ef2-cf6b-4f35-8940-4f04308813a2");
    widgetData = {status: 'published', level: "secondLevel"};
    component.widgetData = widgetData;
    fixture.detectChanges();
    component.evaluate(activityId);
    expect(component.evaluate).toHaveBeenCalledWith("37bb3ef2-cf6b-4f35-8940-4f04308813a2");
  });

  it('should statistics', () => {
    const activityId = "37bb3ef2-cf6b-4f35-8940-4f04308813a2";
    let widgetData = {status: 'published', level: "firstLevel"};
    component.widgetData = widgetData;
    spyOn(component, 'statistics').and.callThrough();
    component.statistics(activityId);
    expect(component.statistics).toHaveBeenCalledWith("37bb3ef2-cf6b-4f35-8940-4f04308813a2");
    widgetData = {status: 'published', level: "secondLevel"};
    component.widgetData = widgetData;
    fixture.detectChanges();
    component.statistics(activityId);
    expect(component.statistics).toHaveBeenCalledWith("37bb3ef2-cf6b-4f35-8940-4f04308813a2");
  });

  it('should edit', () => {
    const activityId = "37bb3ef2-cf6b-4f35-8940-4f04308813a2";
    let widgetData = {status: 'published', level: "firstLevel"};
    component.widgetData = widgetData;
    spyOn(component, 'edit').and.callThrough();
    fixture.detectChanges();
    component.edit(activityId, "standard_discussion_forum");
    expect(component.edit).toHaveBeenCalledWith("37bb3ef2-cf6b-4f35-8940-4f04308813a2", "standard_discussion_forum");
    widgetData = {status: 'published', level: "secondLevel"};
    component.widgetData = widgetData;
    fixture.detectChanges();
    component.edit(activityId, "standard_discussion_forum");
    expect(component.edit).toHaveBeenCalledWith("37bb3ef2-cf6b-4f35-8940-4f04308813a2", "standard_discussion_forum");
  });

  it('should close toast', () => {
    spyOn(component, 'closeToast').and.callThrough();
    component.closeToast();
    expect(component.forumToast).toEqual(false);
  });

  it('should delete discussion forum', () => {
    const activityId = "04885893-d7c8-483a-a988-b6ab3c2cd0be";
    const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
    const parentElementId = "";
    const courseId = "1142";
    const type = "standard_discussion_forum";
    const widgetData = {threads: "10", replies: "50"};
    const translationKey = `discussionForums.forumList.deleteConsumedActivityConfirmation`;
    const res:any = {status: 200};
    component.widgetData = widgetData;
    spyOn(discussionForumService, "deleteForum").withArgs(courseId, activityId, parentElementId).and.resolveTo(res);
    spyOn(dialogService, 'showConfirmDialog').withArgs({title: { translationKey }}).and.resolveTo(true);
    spyOn(component, 'deleteForum').and.callThrough();
    fixture.detectChanges();
    component.deleteForum(activityId, event, parentElementId, type);
    expect(component.deleteForum).toHaveBeenCalled();
  });

  it('should delete discussion forum error', () => {
    const activityId = "04885893-d7c8-483a-a988-b6ab3c2cd0be";
    const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
    const parentElementId = "";
    const courseId = "1142";
    const type = "standard_discussion_forum";
    const translationKey = `discussionForums.forumList.deleteConsumedActivityConfirmation`;
    const expectedResult:any = function() {
      throw new TypeError("No course element was found for the provided element ID");
    };
    const widgetData = {threads: "10", replies: "50"};
    component.widgetData = widgetData;
    spyOn(discussionForumService, 'deleteForum').withArgs(courseId, activityId, parentElementId).and.resolveTo(expectedResult);
    spyOn(dialogService, 'showConfirmDialog').withArgs({title: { translationKey }}).and.resolveTo(true);
    spyOn(component, 'deleteForum').and.callThrough();
    fixture.detectChanges();
    discussionForumService.deleteForum(courseId, activityId, parentElementId);
    component.deleteForum(activityId, event, parentElementId, type);
    expect(component.deleteForum).toHaveBeenCalled;
    expect(expectedResult).toThrowError("No course element was found for the provided element ID");
  });

  it('should cancel deleting discussion forum', () => {
    const activityId = "04885893-d7c8-483a-a988-b6ab3c2cd0be";
    const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
    const parentElementId = "";
    const courseId = "1142";
    const type = "standard_discussion_forum";
    const translationKey = `discussionForums.forumList.deleteConsumedActivityConfirmation`;
    const expectedResult:any = function() {
      throw new TypeError("No course element was found for the provided element ID");
    };
    const widgetData = {threads: "10", replies: "50"};
    component.widgetData = widgetData;
    spyOn(discussionForumService, 'deleteForum').withArgs(courseId, activityId, parentElementId).and.resolveTo(expectedResult);
    spyOn(dialogService, 'showConfirmDialog').withArgs({title: { translationKey }}).and.resolveTo(false);
    spyOn(component, 'deleteForum').and.callThrough();
    fixture.detectChanges();
    discussionForumService.deleteForum(courseId, activityId, parentElementId);
    component.deleteForum(activityId, event, parentElementId, type);
    expect(component.deleteForum).toHaveBeenCalled;
  });

});
