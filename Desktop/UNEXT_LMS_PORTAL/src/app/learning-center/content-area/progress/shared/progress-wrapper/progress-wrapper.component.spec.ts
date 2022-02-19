/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of, Observable } from 'rxjs';
import { ProgressOperations } from 'src/app/enums/progressOperations';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { ProgressService } from '../../service/progress.service';
import translations from '../../../../../../assets/i18n/en.json';
import { ProgressWrapperComponent } from './progress-wrapper.component';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { Routes } from '@angular/router';
import { ChartComponent } from '../../chart/chart.component';
import { TopBottomProgressListComponent } from '../../top-bottom-progress-list/top-bottom-progress-list.component';
import { FilterComponent } from '../../filter/filter.component';
import { HeaderComponent } from '../../../shared-modules/header/header.component';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
describe('ProgressWrapperComponent', () => {
  let component: ProgressWrapperComponent;
  let fixture: ComponentFixture<ProgressWrapperComponent>;
  let storageService: StorageService;
  let progressService: ProgressService;
  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent }];
  const mockResult = [{
    "_id": "61fa80aa7bde3527f27afaab",
    "userId": "ed0114f9-7d1c-4112-bb2d-8cc30f06ba31",
    "progress": 67,
    "userName": "steven",
    "emailId": "hohlrgn@gmail.com"
  },
  {
    "_id": "61fa7fd37bde3527f27adbde",
    "userId": "2",
    "progress": 50,
    "userName": "demostudent01",
    "emailId": "username2@gmail.com"
  },
  {
    "_id": "61fa80aa7bde3527f27afa9a",
    "userId": "54d655d0-64d9-4c6e-83a1-1bc6c2178b58",
    "progress": 34,
    "userName": "joseph",
    "emailId": "tnn@gmail.com"
  },
  {
    "_id": "61fa80ab7bde3527f27afafa",
    "userId": "ef82c5ef-b542-44e6-9221-86cc17a02da0",
    "progress": 34,
    "userName": "richard",
    "emailId": "yvbrv@gmail.com"
  },
  {
    "_id": "61fa80b27bde3527f27afd45",
    "userId": "2478175b-1bfc-4e6a-9246-5a8717198ecd",
    "progress": 0,
    "userName": "mark",
    "emailId": "tskh@gmail.com"
  }];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressWrapperComponent, HeaderComponent, ChartComponent, TopBottomProgressListComponent, FilterComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      })],
      providers: [StorageService, ProgressService, RouteOperationService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    ProgressWrapperComponent.prototype.ngOnInit = () => {};
    HeaderComponent.prototype.ngOnInit = () => {};
    fixture = TestBed.createComponent(ProgressWrapperComponent);
    component = fixture.componentInstance;
    storageService = TestBed.inject(StorageService);
    progressService = TestBed.inject(ProgressService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should intialize ngOnInIt', () => {
    spyOn(storageService, 'get').and.returnValue('student');
    spyOn(component, 'getProgress');
    spyOn(component, 'getTopAndBottomList');
    component.type = ProgressOperations._CLASS_PROGRESS;
    component.loadDependencies();
    fixture.detectChanges();
    component.type = '';
    component.loadDependencies();
    fixture.detectChanges();
  });
  it('should intialize', () => {
    component.type = ProgressOperations._CLASS_PROGRESS;
    component.view = 'admin';
  });

  it('should get class average', async () => {
    spyOn(progressService, 'sendMessageToBackEnd').and.resolveTo(
      {
        body: {
          "progress": 14
        }
      }
    );
    component.getClassAverage();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.progressValue).toBe(14);
    component.view = 'student';
    component.classProgressValue = 30;
    component.getClassAverage();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.progressValue).toBe(30);
    expect(component.classProgressValue).toBe(14);
  });

  it('should get student average', async () => {
    spyOn(progressService, 'sendMessageToBackEnd').and.resolveTo(
      {
        body: {
          "progress": 65
        }
      }
    );
    component.getStudentAverage();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.classProgressValue).toBe(65);
  });

  it('should get class average  and student average', async () => {
    spyOn(progressService, 'sendMessageToBackEnd').and.resolveTo(
      {
        body: {
          "progress": 14
        }
      }
    );
    spyOn(component, 'getClassAverage');
    spyOn(component, 'getStudentAverage');
    component.view = 'student';
    component.getProgress();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should update the text in UI', () => {
    component.progressValue = 40;
    component.classProgressValue = 30;
    component.updateProgress();
    expect(component.isMyProgressLess).toBeFalsy;
    component.progressValue = 30;
    component.classProgressValue = 40;
    component.updateProgress();
    expect(component.isMyProgressLess).toBeTruthy;
  });

  it('should get top list and bottom list', async () => {
    spyOn(progressService, 'sendMessageToBackEnd').and.resolveTo(
      {
        body: {
          "totalStudents": "NA",
          "lastUpdatedAt": "NA",
          "studentsProgress": [
            {
              "_id": "61fa80aa7bde3527f27afaab",
              "userId": "ed0114f9-7d1c-4112-bb2d-8cc30f06ba31",
              "progress": 67,
              "userName": "steven",
              "emailId": "hohlrgn@gmail.com"
            },
            {
              "_id": "61fa7fd37bde3527f27adbde",
              "userId": "2",
              "progress": 50,
              "userName": "demostudent01",
              "emailId": "username2@gmail.com"
            },
            {
              "_id": "61fa80aa7bde3527f27afa9a",
              "userId": "54d655d0-64d9-4c6e-83a1-1bc6c2178b58",
              "progress": 34,
              "userName": "joseph",
              "emailId": "tnn@gmail.com"
            },
            {
              "_id": "61fa80ab7bde3527f27afafa",
              "userId": "ef82c5ef-b542-44e6-9221-86cc17a02da0",
              "progress": 34,
              "userName": "richard",
              "emailId": "yvbrv@gmail.com"
            },
            {
              "_id": "61fa80b27bde3527f27afd45",
              "userId": "2478175b-1bfc-4e6a-9246-5a8717198ecd",
              "progress": 0,
              "userName": "mark",
              "emailId": "tskh@gmail.com"
            }
          ]
        }
      }
    );
    component.getTopAndBottomList();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(JSON.stringify(component.studentList)).toBe(JSON.stringify(mockResult));
  });

  it('should read top and bottom lists', async () => {
    spyOn(progressService, 'sendMessageToBackEnd').and.resolveTo({
      body: {
        "totalStudents": "NA",
        "lastUpdatedAt": "NA",
        "studentsProgress": [
          {
            "_id": "61fa80aa7bde3527f27afaab",
            "userId": "ed0114f9-7d1c-4112-bb2d-8cc30f06ba31",
            "progress": 67,
            "userName": "steven",
            "emailId": "hohlrgn@gmail.com"
          },
          {
            "_id": "61fa7fd37bde3527f27adbde",
            "userId": "2",
            "progress": 50,
            "userName": "demostudent01",
            "emailId": "username2@gmail.com"
          },
          {
            "_id": "61fa80aa7bde3527f27afa9a",
            "userId": "54d655d0-64d9-4c6e-83a1-1bc6c2178b58",
            "progress": 34,
            "userName": "joseph",
            "emailId": "tnn@gmail.com"
          },
          {
            "_id": "61fa80ab7bde3527f27afafa",
            "userId": "ef82c5ef-b542-44e6-9221-86cc17a02da0",
            "progress": 34,
            "userName": "richard",
            "emailId": "yvbrv@gmail.com"
          },
          {
            "_id": "61fa80b27bde3527f27afd45",
            "userId": "2478175b-1bfc-4e6a-9246-5a8717198ecd",
            "progress": 0,
            "userName": "mark",
            "emailId": "tskh@gmail.com"
          }
        ]
      }
    });
    component.onClick('top');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(JSON.stringify(component.studentList)).toBe(JSON.stringify(mockResult));
  });
});
