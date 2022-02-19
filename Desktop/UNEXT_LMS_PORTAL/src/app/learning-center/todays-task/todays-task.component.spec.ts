/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { StorageKey } from 'src/app/enums/storageKey';
import { StorageService } from 'src/app/services/storage.service';
import { TodaysTaskService } from './service/todays-task.service';
import translations from '../../../assets/i18n/en.json';

import { TodaysTaskComponent } from './todays-task.component';
import { Observable, of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { JWTService } from 'src/app/services/jwt.service';
import { CommonUtils } from 'src/app/utils/common-utils';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('TodaysTaskComponent', () => {
  let component: TodaysTaskComponent;
  let fixture: ComponentFixture<TodaysTaskComponent>;
  let storageService: StorageService;
  let translate: TranslateService;
  let todaysTaskService: TodaysTaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodaysTaskComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(
        [
          {path: 'todays-task', component: TodaysTaskComponent},
          {path: 'login', component: LoginLayoutComponent}

        ]), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      }), ToastrModule.forRoot({})],
      providers: [JWTService, CommonUtils, ToastrService, TodaysTaskService, StorageService, TranslateService]
    })
      .compileComponents();
    storageService = TestBed.inject(StorageService);
    storageService.set(StorageKey.USER_CURRENT_VIEW, 'admin');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaysTaskComponent);
    component = fixture.componentInstance;
    storageService = TestBed.inject(StorageService);
    translate = TestBed.inject(TranslateService);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    storageService.set(StorageKey.USER_CURRENT_VIEW, 'admin');
    todaysTaskService = TestBed.inject(TodaysTaskService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get pending tasks', async () => {
    const pendingTask = [{"eventname": "zXZXZ","eventDescription": "<p>ZXzX</p>","eventId": "4b521e15-73a8-414b-9700-df9e1a866dfa","eventType": "self-task","startDate": "2022-02-03T03:38:38.000Z","endDate": "2022-02-10T03:38:38.000Z"},{"eventname": "asdasdasasd","eventDescription": "<p>asdasd</p>","eventId": "687006ee-aaf2-489d-aac4-19e7f64c38fd","eventType": "self-task","startDate": "2022-02-02T15:44:17.815Z","endDate": "2022-02-26T03:44:17.000Z"},{"eventname": "STD 2","eventId": "b453d71a-5385-48f9-a7de-7e5b17ebba8f","eventType": "discussion-forum","startDate": "2022-02-02T07:01:38.939Z","endDate": "2022-02-24T07:01:38.000Z","totalStudents": 34,"gradedStudents": 0},{"eventname": "STD Sample Time picker","eventId": "97879fd0-8fc1-4036-a023-3f454208fa74","eventType": "discussion-forum","startDate": "2022-02-02T21:00:56.000Z","endDate": "2022-02-27T21:00:56.000Z","totalStudents": 34,"gradedStudents": 0}];
    const courseId = "1152";
    component.courseId = courseId;
    spyOn(todaysTaskService, 'getTodaysTasks').and.resolveTo(pendingTask);
    spyOn(component, 'getTodaysPendingTasks').and.callThrough();
    fixture.detectChanges();
    await component.ngOnInit();
    fixture.detectChanges();
    expect(component.getTodaysPendingTasks).toHaveBeenCalled();
    expect(component.todaysPendingTasks).toEqual(pendingTask);
  });

  it('should get completed tasks', async () => {
    const completedTask = [{"eventname": "Test 101","eventDescription": "<p>Test 101</p>","eventId": "8db62125-6b41-47ba-b449-9c943953bb23","eventType": "discussion-forum","startDate": "2022-02-01T13:10:00.092Z","endDate": "2022-02-23T01:10:00.000Z","totalStudents": 34,"gradedStudents": 3},{"eventname": "Standrad Discussion","eventDescription": "<p>Standrad Discussion</p>","eventId": "52c72c8e-f1db-4cd2-918b-752e734f494d","eventType": "discussion-forum","startDate": "2022-02-01T13:11:05.490Z","endDate": "2022-02-24T01:11:05.000Z","totalStudents": 34,"gradedStudents": 1}];
    const courseId = "1152";
    component.courseId = courseId;
    spyOn(todaysTaskService, 'getTodaysTasks').and.resolveTo(completedTask);
    spyOn(component, 'getTodaysPendingTasks').and.callThrough();
    fixture.detectChanges();
    await component.ngOnInit();
    fixture.detectChanges();
    expect(component.getTodaysPendingTasks).toHaveBeenCalled();
    expect(component.todaysPendingTasks).toEqual(completedTask);
  });

});
