/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import translations from '../../../../assets/i18n/en.json';
import { QnaRightPanelComponent } from './qna-right-panel.component';
import { HttpClientService } from 'src/app/services/http-client.service';
import { QuestionAnswerService, QuestionResponseForQnADashboard } from '../../course-services/question-answer.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DialogTypes } from 'src/app/enums/Dialog';
import { Dialog } from 'src/app/Models/Dialog';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Question } from '../../shared/question-answer-reply/question-thread/question-thread.component';
import { Location } from '@angular/common';
import { Routes } from '@angular/router';
import { ContentPlayerComponent } from '../../content-area/content-player/content-player.component';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
const routes: Routes =[ {
  path: 'content-area/list/content/:contentId', component: ContentPlayerComponent
}];
describe('QnaRightPanelComponent', () => {
  let component: QnaRightPanelComponent;
  let fixture: ComponentFixture<QnaRightPanelComponent>;
  let routeOperationService: RouteOperationService;
  let storageService : StorageService;
  let questionAnswerService : QuestionAnswerService;
  let dialogService : DialogService;
  let location: Location;
  @Component({
    selector: 'app-question-thread',
    template: '<p>Mocked Question Thread Component</p>'
  })
  class QuestionThreadComponent {
    @Input() question!: Question;
    @Input() theme?= '';
    @Input() pinned?= false;
    @Input() showEditDelete?= false;
    @Input() extended = false;
    @Input() filterAnswerByUserId?= '';
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        AngularSvgIconModule.forRoot(),
        InfiniteScrollModule,
        TimesAgoPipeModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      declarations: [ QnaRightPanelComponent, QuestionThreadComponent ],
      providers: [HttpClientService, TranslateService, QuestionAnswerService, RouteOperationService, StorageService, DialogService]
    })
      .compileComponents();
  });
  const questionData : QuestionResponseForQnADashboard = {
    "_id": "61c03c3963e926581c85dc87",
    "numOfUpvotes": 0,
    "numOfAnswers": 4,
    "isUpvoted": false,
    "description": "hello text",
    "courseId": "1142",
    "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
    "title": "Question 6",
    "createdBy": "1",
    "updatedBy": "1",
    "isContentDeleted": 'true',
    "contentTitle": "Relianec IRL Report Example",
    "contentType": "document",
    "questionId": "ce96c8bd-ab21-4fed-9344-cb12de25e843",
    "createdAt": "2021-12-20T08:18:01.675Z",
    "updatedAt": "2021-12-20T08:18:01.675Z",
    "isFollowing": true,
    "isPinned": true,
    "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
    "userName": "username1"
  };
  const dialogConfig: Dialog ={
    type: DialogTypes.WARNING,
    title: {
      translationKey: 'qna.question.contentDeleted'
    }
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(QnaRightPanelComponent);
    component = fixture.componentInstance;
    routeOperationService = TestBed.inject(RouteOperationService);
    storageService = TestBed.inject(StorageService);
    dialogService = TestBed.inject(DialogService);
    location = TestBed.inject(Location);
    questionAnswerService = TestBed.inject(QuestionAnswerService);
    const getQuestionSpy = spyOn(questionAnswerService, 'getQuestion');
    const openDialogSpy = spyOn(dialogService, 'showAlertDialog');
    openDialogSpy.withArgs(dialogConfig);

    getQuestionSpy.withArgs('ce96c8bd-ab21-4fed-9344-cb12de25e843').and.resolveTo(questionData);
    getQuestionSpy.and.resolveTo(questionData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load question component', async () => {
    spyOn(routeOperationService, 'listen').withArgs('questionId').and.returnValue(of('ce96c8bd-ab21-4fed-9344-cb12de25e843'));
    await component.fetchQuestion(component.questionId);
    fixture.detectChanges();
    expect(component.question).toBeTruthy();
    const questionComponent = fixture.debugElement.query(By.directive(QuestionThreadComponent)).componentInstance;
    expect(questionComponent).toBeTruthy();
  });
  it('should pin a question', async () => {
    const spyBroadCast = spyOn(storageService, 'broadcastValue');
    spyOn(routeOperationService, 'listen').withArgs('questionId').and.returnValue(of('ce96c8bd-ab21-4fed-9344-cb12de25e843'));
    await component.pinUnpinQuestion(component.questionId);
    fixture.detectChanges();
    expect(spyBroadCast).toHaveBeenCalled();
  });
  it('should not redirect to Content Player if content is deleted', async () => {
    const compiled = fixture.debugElement.nativeElement;
    spyOn(routeOperationService, 'listen').withArgs('questionId').and.returnValue(of('ce96c8bd-ab21-4fed-9344-cb12de25e843'));
    await component.fetchQuestion(component.questionId);
    const titleOfContent = compiled.querySelector('.main-notes-title');
    titleOfContent.click();
    fixture.detectChanges();
    expect(location.path()).not.toBe(`../../../content-area/list/content/${component.question?.elementId}/`);
  });
});
