/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import translations from '../../../../../assets/i18n/en.json';
import { TopBottomProgressListComponent } from './top-bottom-progress-list.component';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
describe('TopBottomProgressListComponent', () => {
  let component: TopBottomProgressListComponent;
  let fixture: ComponentFixture<TopBottomProgressListComponent>;
  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent },
    {
      path: 'progress-list-view',
      loadChildren: () => import('../progress.module').then(module => module.ProgressModule)
    }
  ];
  let routeOperationService: RouteOperationService;
  let translate: TranslateService;
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
      declarations: [ TopBottomProgressListComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      })],
      providers: [RouteOperationService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBottomProgressListComponent);
    component = fixture.componentInstance;
    routeOperationService = TestBed.inject(RouteOperationService);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    component.studentList = mockResult;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load list on ngOnInIt', async () => {
    spyOn(routeOperationService, 'listenParams').and.returnValue(of({
      courseId: '1152'
    }));
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.courseId).toBe('1152');
    component.studentList = mockResult;
    fixture.detectChanges();
  });

  it('should check the rendered UI', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.studentList = mockResult;
    fixture.detectChanges();
    expect(compiled.querySelector('.nav-link').textContent).toBeTruthy('Top 5');
    expect(compiled.querySelector('.nav-link').textContent).toBeTruthy('Bottom 5');
    expect(compiled.querySelector('.student-details').textContent).toBe('steven');
    expect(compiled.querySelector('h6').textContent).toBeTruthy('67');
    expect(compiled.querySelector('a').textContent).toBeTruthy('View All');
  });

  it('should check the click event', () => {
    component.clickEvent('top');
    expect(component.listType).toBe('top');
    component.clickEvent('bottom');
    expect(component.listType).toBe('bottom');
  });

  it('should route on click view all', () => {
    component.onClick();
  });
});
