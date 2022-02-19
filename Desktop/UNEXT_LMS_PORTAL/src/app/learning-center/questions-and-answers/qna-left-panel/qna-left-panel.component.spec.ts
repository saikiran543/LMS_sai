/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import { QuestionAnswerReplyModule } from '../../shared/question-answer-reply/question-answer-reply.module';
import translations from '../../../../assets/i18n/en.json';
import { QnaLeftPanelComponent } from './qna-left-panel.component';
import { HttpClientService } from 'src/app/services/http-client.service';
import { InfiniteScrollFilterAttributes, QuestionAnswerService } from '../../course-services/question-answer.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { Routes } from '@angular/router';
import { QnaRightPanelComponent } from '../qna-right-panel/qna-right-panel.component';
import { By } from '@angular/platform-browser';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
const routes: Routes = [
  { path: 'question/:questionId', component: QnaRightPanelComponent }
];

describe('QnaLeftPanelComponent', () => {
  let component: QnaLeftPanelComponent;
  let fixture: ComponentFixture<QnaLeftPanelComponent>;
  let translate: TranslateService;
  let routeOperationService: RouteOperationService;
  let storageService : StorageService;
  let questionAnswerService : QuestionAnswerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        QuestionAnswerReplyModule,
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
      declarations: [ QnaLeftPanelComponent, QnaRightPanelComponent ],
      providers: [HttpClientService, TranslateService, QuestionAnswerService, RouteOperationService, StorageService]
    })
      .compileComponents();
  });
  const expectedResponse : Array<any> = [
    {
      "_id": "61c03c3963e926581c85dc87",
      "numOfUpvotes": 0,
      "numOfAnswers": 4,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 6",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "ce96c8bd-ab21-4fed-9344-cb12de25e843",
      "createdAt": "2021-12-20T08:18:01.675Z",
      "updatedAt": "2021-12-20T08:18:01.675Z",
      "isFollowing": true,
      "isPinned": true,
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c03c3663e926581c85dc84",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 5",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "7a752033-64f1-4552-826a-4b956b88cf5a",
      "createdAt": "2021-12-20T08:17:58.494Z",
      "updatedAt": "2021-12-20T08:17:58.494Z",
      "isPinned": true,
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c03c2d63e926581c85dc7b",
      "numOfUpvotes": 1,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 2",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "4d6e4db2-aa20-4f10-b84b-cca36ec0e114",
      "createdAt": "2021-12-20T08:17:49.613Z",
      "updatedAt": "2021-12-20T08:17:49.613Z",
      "isUpvoted": true,
      "isFollowing": true,
      "isPinned": true,
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c1a7757f82170375ca7edf",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "8dcea767-b65d-4d4d-bf5f-a550bd44ea6a",
      "title": "Question testing for Deletion.",
      "description": "<p>Deleting the content</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "test doc",
      "contentType": "document",
      "questionId": "8a81ba97-d3e7-45bd-9924-1e6816ed0999",
      "createdAt": "2021-12-21T10:07:49.738Z",
      "updatedAt": "2021-12-21T10:07:49.738Z",
      "contentBreadCrumb": "This Content has been deleted.",
      "isContentDeleted": true,
      "userName": "username1"
    },
    {
      "_id": "61c19ea70b4e01037c055fa8",
      "numOfUpvotes": 0,
      "numOfAnswers": 1,
      "courseId": "1142",
      "elementId": "014aed8a-f8b0-4b1e-8f3c-7ac37353997c",
      "title": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "description": "<p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"><strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</strong></span></p><p><span style=\"background-color:hsl(0, 75%, 60%);\"><strong>Lorem Ipsum</strong></span><span style=\"background-color:hsl(0, 75%, 60%);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><span style=\"color:hsl(60, 75%, 60%);\"><strong>Lorem Ipsum</strong></span><span style=\"background-color:rgb(255,255,255);color:hsl(60, 75%, 60%);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Economics pdf ",
      "contentType": "document",
      "questionId": "8a6b401c-a762-404e-885c-83e78e678e01",
      "createdAt": "2021-12-21T09:30:15.444Z",
      "updatedAt": "2021-12-21T09:35:14.387Z",
      "verifiedAnswerId": "df85aedc-10be-45e0-87bf-23dc97f2cf92",
      "isFollowing": true,
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Economics pdf ",
      "userName": "username1"
    },
    {
      "_id": "61c19e860b4e01037c055fa3",
      "numOfUpvotes": 0,
      "numOfAnswers": 4,
      "courseId": "1142",
      "elementId": "014aed8a-f8b0-4b1e-8f3c-7ac37353997c",
      "title": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "description": "<p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Economics pdf ",
      "contentType": "document",
      "questionId": "5126b362-c8f6-4db4-8b7f-143a1eac949e",
      "createdAt": "2021-12-21T09:29:42.621Z",
      "updatedAt": "2021-12-21T09:29:42.621Z",
      "verifiedAnswerId": "98db0462-f7c4-4aea-9978-d1df8651a325",
      "isFollowing": true,
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Economics pdf ",
      "userName": "username1"
    },
    {
      "_id": "61c19e787f82170375ca7d1e",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "014aed8a-f8b0-4b1e-8f3c-7ac37353997c",
      "title": "Test Question for Economics pdf",
      "description": "<p><strong>Lorem Ipsum</strong><span style=\"background-color:rgb(255,255,255);color:rgb(0,0,0);font-size:14px;\"> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Economics pdf ",
      "contentType": "document",
      "questionId": "3dcb53a6-3fbe-4ff5-9be3-927bae4c7582",
      "createdAt": "2021-12-21T09:29:28.655Z",
      "updatedAt": "2021-12-21T09:29:28.655Z",
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Economics pdf ",
      "userName": "username1"
    },
    {
      "_id": "61c06928abb5174868e10ec3",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 14",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "956f652e-a761-435d-a73f-38bc72b43dfa",
      "createdAt": "2021-12-20T11:29:44.141Z",
      "updatedAt": "2021-12-20T11:29:44.141Z",
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c06924abb5174868e10ec0",
      "numOfUpvotes": 1,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 13",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "c9e97551-0a2b-42d8-a7f9-5aef0dc16262",
      "createdAt": "2021-12-20T11:29:40.797Z",
      "updatedAt": "2021-12-20T11:29:40.797Z",
      "isUpvoted": true,
      "isFollowing": true,
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c06921abb5174868e10ebd",
      "numOfUpvotes": 0,
      "numOfAnswers": 1,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 12",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "22095252-b15c-4b28-a12e-eec19252995b",
      "createdAt": "2021-12-20T11:29:37.931Z",
      "updatedAt": "2021-12-20T11:29:37.931Z",
      "verifiedAnswerId": "46eab92e-c4b6-4cc6-8254-4cd79b3e4258",
      "isFollowing": true,
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    }
  ];
  const lazyLoadedResponse : any = [
    {
      "_id": "61c0691eabb5174868e10eba",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 11",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "86805c6a-f52a-4acf-8598-4ac3b685ac83",
      "createdAt": "2021-12-20T11:29:34.524Z",
      "updatedAt": "2021-12-20T11:29:34.524Z",
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c0691aabb5174868e10eb7",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 10",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "fc77739d-fd4f-4f02-be85-ce86e62235d9",
      "createdAt": "2021-12-20T11:29:30.770Z",
      "updatedAt": "2021-12-20T11:29:30.770Z",
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c06916abb5174868e10eb4",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 9",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "79429487-3925-420f-bd66-af1159f1578b",
      "createdAt": "2021-12-20T11:29:26.557Z",
      "updatedAt": "2021-12-20T11:29:26.557Z",
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c06911abb5174868e10eb1",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 8",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "481fdc13-3e91-4ebd-af1f-82bb483f29a2",
      "createdAt": "2021-12-20T11:29:21.755Z",
      "updatedAt": "2021-12-20T11:29:21.755Z",
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c03ccf63e926581c85dcdf",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "cdcde99b-3c9c-4543-8c4e-83939aab2daa",
      "title": "Q 1",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "image1",
      "contentType": "image",
      "questionId": "543b1125-3bf9-4c10-a434-b27f7391636d",
      "createdAt": "2021-12-20T08:20:31.283Z",
      "updatedAt": "2021-12-20T08:20:31.283Z",
      "contentBreadCrumb": "This Content has been deleted.",
      "isContentDeleted": true,
      "userName": "username1"
    },
    {
      "_id": "61c03c3d63e926581c85dc8a",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 7",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "504468e5-e486-48fa-be0e-0350a2df7f84",
      "createdAt": "2021-12-20T08:18:05.150Z",
      "updatedAt": "2021-12-20T08:18:05.150Z",
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c03c3363e926581c85dc81",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 4",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "86c3412e-ee4c-4944-af61-087db7d9020f",
      "createdAt": "2021-12-20T08:17:55.478Z",
      "updatedAt": "2021-12-20T08:17:55.478Z",
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c03c3063e926581c85dc7e",
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 3",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "1e9f4882-3d99-463b-87a6-8de95153a418",
      "createdAt": "2021-12-20T08:17:52.392Z",
      "updatedAt": "2021-12-20T08:17:52.392Z",
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    },
    {
      "_id": "61c03c2763e926581c85dc78",
      "numOfUpvotes": 0,
      "numOfAnswers": 14,
      "courseId": "1142",
      "elementId": "4bbc5403-bcc3-4fd8-81e1-f3f530b59fe3",
      "title": "Question 1",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Relianec IRL Report Example",
      "contentType": "document",
      "questionId": "6c5bfaa0-53c7-4e0c-a751-8e13fd4d1df4",
      "createdAt": "2021-12-20T08:17:43.994Z",
      "updatedAt": "2021-12-20T08:17:43.994Z",
      "verifiedAnswerId": "f6d031ac-54cd-492f-a506-087a9b2ef310",
      "isFollowing": true,
      "contentBreadCrumb": "Week 1 - Introduction to Finance ...Relianec IRL Report Example",
      "userName": "username1"
    }
  ];
  const defaultFilterOptions: InfiniteScrollFilterAttributes = {
    limit: 10,
    skip: 0,
  };
  const lazyLoadedFilterOptions: InfiniteScrollFilterAttributes = {
    limit: 10,
    skip: 10,
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(QnaLeftPanelComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    routeOperationService = TestBed.inject(RouteOperationService);
    storageService = TestBed.inject(StorageService);
    questionAnswerService = TestBed.inject(QuestionAnswerService);
    const getQuestionSpy = spyOn(questionAnswerService, 'getQuestionsForQnaDashboard');
    getQuestionSpy.withArgs(defaultFilterOptions).and.resolveTo(expectedResponse);
    getQuestionSpy.withArgs(lazyLoadedFilterOptions).and.resolveTo(lazyLoadedResponse);
    translate.use('en');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load search tool bar', () => {
    const compiled = fixture.debugElement.nativeElement;
    const searchButton = compiled.querySelector('#qa-left-panel-search-btn');
    expect(searchButton).toBeTruthy();
  });
  it('should load the list of question', fakeAsync(async () => {
    await component.ngOnInit();
    tick(100);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const questionsListContainer = compiled.querySelectorAll('.qa-single-card');
    expect(questionsListContainer.length).toEqual(10);
  }));
  it('should pin a question', fakeAsync(async () => {
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    const pinSpy = spyOn(storageService, 'listen');
    pinSpy.withArgs('pinQuestion').and.returnValue(of('22095252-b15c-4b28-a12e-eec19252995b'));
    await component.ngOnInit();
    tick(100);
    fixture.detectChanges();
    const pinnedQuestions = compiled.querySelectorAll('.qa-pinned-icon');
    expect(pinnedQuestions.length).toEqual(4);

  }));
  it('should unPin a question', fakeAsync(async () => {
    spyOn(routeOperationService, 'listen').withArgs('questionId').and.returnValue(of('undefined'));
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    const pinSpy = spyOn(storageService, 'listen');
    pinSpy.withArgs('pinQuestion').and.returnValue(of('4d6e4db2-aa20-4f10-b84b-cca36ec0e114'));
    await component.ngOnInit();
    tick(100);
    fixture.detectChanges();
    const pinnedQuestions = compiled.querySelectorAll('.qa-pinned-icon');
    expect(pinnedQuestions.length).toEqual(2);
  }));
  it('should lazy load more questions', fakeAsync(async () => {
    spyOn(routeOperationService, 'listen').withArgs('questionId').and.returnValue(of('undefined'));
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    await component.ngOnInit();
    tick(100);
    fixture.detectChanges();
    component.onScrollDown();
    tick(100);
    fixture.detectChanges();
    const questionsListContainer = compiled.querySelectorAll('.qa-single-card');
    expect(questionsListContainer.length).toEqual(19);
  }));
  it('should not load more questions', fakeAsync(async () => {
    component.limitReached = true;
    const compiled = fixture.debugElement.nativeElement;
    component.onScrollDown();
    fixture.detectChanges();
    const questionsListContainer = compiled.querySelectorAll('.qa-single-card');
    expect(questionsListContainer.length).toEqual(0);
  }));

  it('should get the screenType', () => {
    component.getScreenType();
    expect(component.isMobileOrTablet).toBeUndefined();
  });

  it('should check the class is applied or not',async () => {
    component.pinnedQuestions = [{
      contentBreadCrumb: "Folder 1...title11d",
      contentTitle: "title11d",
      contentType: "image",
      courseId: "1152",
      createdAt: "2022-02-15T07:08:28.355Z",
      createdBy: "bd71a619-680c-487e-be03-677ffc0e96e2",
      description: "<p>If it works</p>",
      elementId: "b5020a3a-e59f-4920-ac00-6683dc8e9471",
      numOfAnswers: 0,
      numOfUpvotes: 1,
      questionId: "ce244f35-1ce6-4c1d-8e91-2f3a3b450c09",
      title: "If it works",
      updatedAt: "2022-02-15T07:08:28.355Z",
      updatedBy: "bd71a619-680c-487e-be03-677ffc0e96e2",
      userName: "robert",
      _id: "620b516cde01b01050e2fdad",
      isFollowing: true,
      isPinned: true,
      isUpvoted: true,
    }];
    component.activeQuestionId = "ce244f35-1ce6-4c1d-8e91-2f3a3b450c09";
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.debugElement.query(By.css('.qa-single-card')).classes['active']).toBeTrue();
  });
});
