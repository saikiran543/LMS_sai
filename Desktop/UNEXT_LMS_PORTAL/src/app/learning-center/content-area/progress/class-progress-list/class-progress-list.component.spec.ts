/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Observable, of } from 'rxjs';
import { ProgressOperations } from 'src/app/enums/progressOperations';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import translations from '../../../../../assets/i18n/en.json';
import { ContentAreaModule } from '../../content-area.module';
import { ProgressService } from '../service/progress.service';
import { ClassProgressListComponent } from './class-progress-list.component';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
describe('ClassProgressListComponent', () => {
  let component: ClassProgressListComponent;
  let fixture: ComponentFixture<ClassProgressListComponent>;
  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent },
    {
      path: 'content-area/list',
      loadChildren: () => import('../../content-area.module').then(module => module.ContentAreaModule)
    }
  ];
  let translate: TranslateService;
  let routeOperationService: RouteOperationService;
  let configuration: ConfigurationService;
  let progressService: ProgressService;
  const columns = [{prop: 's.No'}, {prop: 'learnerName'}, {prop: 'emailId'}, {prop: 'no.OfContentsAccessible'}, {prop: 'no.OfActivitiesAccessible'}, {prop: 'courseProgress %'}];
  const mockResult = {
    "totalStudents": 34,
    "lastUpdatedAt": "2022-02-07T05:14:52.103Z",
    "studentsProgress": [
      {
        "_id": "61fa80ad7bde3527f27afb78",
        "userId": "4904cd10-bd9c-4a6d-8cfb-6a08a7fba617",
        "progress": 0,
        "contentsAccessible": 4,
        "activitiesAccessible": 0,
        "userName": "brian",
        "emailId": "ujnh@gmail.com"
      },
      {
        "_id": "61fa80ab7bde3527f27afb15",
        "userId": "b8069fe8-ad3f-4772-81ab-f429f20470f6",
        "progress": 0,
        "contentsAccessible": 4,
        "activitiesAccessible": 0,
        "userName": "brian",
        "emailId": "gwfelu@gmail.com"
      },
      {
        "_id": "61fa80ad7bde3527f27afb88",
        "userId": "1aea5502-2e41-43ab-90da-a2c1e5943ab6",
        "progress": 0,
        "contentsAccessible": 4,
        "activitiesAccessible": 0,
        "userName": "charles",
        "emailId": "kjzx@gmail.com"
      }
    ]
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassProgressListComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes), NgxDatatableModule,
        AngularSvgIconModule.forRoot(),
        MatProgressBarModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        }), ContentAreaModule],
      providers: [RouteOperationService, ConfigurationService, ProgressService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    ClassProgressListComponent.prototype.ngOnInit = () => {};
    fixture = TestBed.createComponent(ClassProgressListComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    routeOperationService = TestBed.inject(RouteOperationService);
    configuration = TestBed.inject(ConfigurationService);
    progressService = TestBed.inject(ProgressService);
    translate.use('en');
    component.progressColumns = columns;
    component.rowsPerPage = 20;
    component.totalRecords = 30;
    component.rows = mockResult.studentsProgress;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should intialize on ngOnInit', () => {
    spyOn(routeOperationService, 'listenAllParams').and.returnValue(of({
      courseId: '1152'
    }));
    spyOn(configuration, 'getAttribute').and.resolveTo('capgemini');
    spyOn(progressService, 'sendMessageToBackEnd').and.resolveTo({
      body: {
        "totalStudents": 34,
        "lastUpdatedAt": "2022-02-07T05:14:52.103Z",
        "studentsProgress": [
          {
            "_id": "61fa80ad7bde3527f27afb78",
            "userId": "4904cd10-bd9c-4a6d-8cfb-6a08a7fba617",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "brian",
            "emailId": "ujnh@gmail.com"
          },
          {
            "_id": "61fa80ab7bde3527f27afb15",
            "userId": "b8069fe8-ad3f-4772-81ab-f429f20470f6",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "brian",
            "emailId": "gwfelu@gmail.com"
          },
          {
            "_id": "61fa80ad7bde3527f27afb88",
            "userId": "1aea5502-2e41-43ab-90da-a2c1e5943ab6",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "charles",
            "emailId": "kjzx@gmail.com"
          }
        ]
      }
    });
    component.loadDependencies();
    fixture.detectChanges();
    component.totalRecords = 30;
    expect(JSON.stringify(component.columns)).toBe(JSON.stringify(columns));
    expect(component.page.size).toBe(20);
  });
  it('should read the studentList', async() => {
    spyOn(progressService, 'sendMessageToBackEnd').and.resolveTo({
      body: {
        "totalStudents": 34,
        "lastUpdatedAt": "2022-02-07T05:14:52.103Z",
        "studentsProgress": [
          {
            "_id": "61fa80ad7bde3527f27afb78",
            "userId": "4904cd10-bd9c-4a6d-8cfb-6a08a7fba617",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "brian",
            "emailId": "ujnh@gmail.com"
          },
          {
            "_id": "61fa80ab7bde3527f27afb15",
            "userId": "b8069fe8-ad3f-4772-81ab-f429f20470f6",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "brian",
            "emailId": "gwfelu@gmail.com"
          },
          {
            "_id": "61fa80ad7bde3527f27afb88",
            "userId": "1aea5502-2e41-43ab-90da-a2c1e5943ab6",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "charles",
            "emailId": "kjzx@gmail.com"
          }
        ]
      }
    });
    component.totalRecords = 30;
    component.readStudentList();
    fixture.detectChanges();
    expect(JSON.stringify(component.rows)).toBe(JSON.stringify(mockResult.studentsProgress));
  });

  it("should route back on click back button", () => {
    component.clickEvent('back');
  });

  it("should modify the rows per page", () => {
    spyOn(progressService, 'sendMessageToBackEnd').and.resolveTo({
      body: {
        "totalStudents": 34,
        "lastUpdatedAt": "2022-02-07T05:14:52.103Z",
        "studentsProgress": [
          {
            "_id": "61fa80ad7bde3527f27afb78",
            "userId": "4904cd10-bd9c-4a6d-8cfb-6a08a7fba617",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "brian",
            "emailId": "ujnh@gmail.com"
          },
          {
            "_id": "61fa80ab7bde3527f27afb15",
            "userId": "b8069fe8-ad3f-4772-81ab-f429f20470f6",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "brian",
            "emailId": "gwfelu@gmail.com"
          },
          {
            "_id": "61fa80ad7bde3527f27afb88",
            "userId": "1aea5502-2e41-43ab-90da-a2c1e5943ab6",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "charles",
            "emailId": "kjzx@gmail.com"
          }
        ]
      }
    });
    component.totalRecords = 30;
    component.rowsPerPage = 20;
    component.modifyRecordsPerPage(ProgressOperations.PLUS);
    fixture.detectChanges();
    expect(component.rowsPerPage).toBe(30);
    expect(component.page.size).toBe(30);
    component.modifyRecordsPerPage(ProgressOperations.MINUS);
    expect(component.rowsPerPage).toBe(20);
    expect(component.page.size).toBe(20);
    expect(component.skipRecords).toBe(0);
    expect(component.page.pageNumber).toBe(0);
  });

  it('should set page on click page number', () => {
    spyOn(progressService, 'sendMessageToBackEnd').and.resolveTo({
      body: {
        "totalStudents": 34,
        "lastUpdatedAt": "2022-02-07T05:14:52.103Z",
        "studentsProgress": [
          {
            "_id": "61fa80ad7bde3527f27afb78",
            "userId": "4904cd10-bd9c-4a6d-8cfb-6a08a7fba617",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "brian",
            "emailId": "ujnh@gmail.com"
          },
          {
            "_id": "61fa80ab7bde3527f27afb15",
            "userId": "b8069fe8-ad3f-4772-81ab-f429f20470f6",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "brian",
            "emailId": "gwfelu@gmail.com"
          },
          {
            "_id": "61fa80ad7bde3527f27afb88",
            "userId": "1aea5502-2e41-43ab-90da-a2c1e5943ab6",
            "progress": 0,
            "contentsAccessible": 4,
            "activitiesAccessible": 0,
            "userName": "charles",
            "emailId": "kjzx@gmail.com"
          }
        ]
      }
    });
    component.totalRecords = 30;
    component.rowsPerPage = 20;
    const event = {
      "count": 34,
      "pageSize": 20,
      "limit": 20,
      "offset": 1
    };
    component.setPage(event);
    expect(component.skipRecords).toBe(20);
    expect(component.page.pageNumber).toBe(1);
  });

  it("should get class names", () => {
    let className;
    className = component.getClass(100);
    expect(className).toBe('progress-bar-green');
    className = component.getClass(60);
    expect(className).toBe('progress-bar-orange');
    className = component.getClass(40);
    expect(className).toBe('progress-bar-red');
  });
  it('should render UI', () => {
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('.content-title').textContent).toBeTruthy('Class Progress');
    expect(compiled.querySelector('.dropdown-toggle').textContent).toBeTruthy('Filter');
    expect(compiled.querySelector('.dropdown-item').textContent).toBe('option1');
    expect(compiled.querySelector('label').textContent).toBeTruthy('Records Per Page');
    expect(compiled.querySelector('.datatable-header-cell-label').textContent).toBe('S. No');
  });

  it('should display the Serial Number', () => {
    let serialNumber;
    component.rowsPerPage = 20;
    component.page.pageNumber = 0;
    serialNumber = component.getSerialNumber(0);
    expect(serialNumber).toBe('01');
    serialNumber = component.getSerialNumber(10);
    expect(serialNumber).toBe(11);
    component.page.pageNumber = 1;
    serialNumber = component.getSerialNumber(0);
    expect(serialNumber).toBe(21);
  });
});
