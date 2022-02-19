/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { RubricsService } from '../service/rubrics.service';
import translations from '../../../../assets/i18n/en.json';
import { RubricsListViewComponent } from './rubrics-list-view.component';
import { ToastrModule } from 'ngx-toastr';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { Routes } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RubricOperations } from 'src/app/enums/rubricOperations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
export class MockNgbModalRefYes {
  componentInstance = {
    confirmStatus: of(true),
    params: {
      message: '',
      confirmBtn: '',
      cancelBtn: ''
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Promise<any> = new Promise((resolve) => resolve(true));
  close(): void {
    // mock function
  }
}
export class MockNgbModalRefNo {
  componentInstance = {
    confirmStatus: of(false),
    params: {
      message: '',
      confirmBtn: '',
      cancelBtn: ''
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Promise<any> = new Promise((resolve) => resolve(true));
  close(): void {
    // mock function
  }
}
describe('RubricsListViewComponent', () => {
  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent },
    { path: 'manipulate/:operation/:rubricId',
      loadChildren: ()=> import('../../rubrics/rubric-manipulation/rubric-manipulation.module').then(module=>module.RubricManipulationModule)
    },
    {
      path: 'preview/:rubricId',
      loadChildren: ()=> import('../../rubrics/rubric-preview/rubric-preview.module').then(module=>module.RubricPreviewModule),
    }
  ];
  let component: RubricsListViewComponent;
  let fixture: ComponentFixture<RubricsListViewComponent>;
  let rubricService: RubricsService;
  let dialogService: DialogService;
  let rubricListData: any;
  let translate: TranslateService;
  const mockModalRef: MockNgbModalRefYes = new MockNgbModalRefYes();
  const mockModalRefNo: MockNgbModalRefNo = new MockNgbModalRefNo();
  beforeEach(async () => {
    rubricListData = [
      {
        "_id": "61b2e01290284856206d4655",
        "criterias": [
          {
            "criteriaName": "Untitled 01",
            "weightage": "50",
            "levels": {
              "L1": {
                "percentage": "10",
                "description": ""
              },
              "L2": {
                "percentage": "20",
                "description": ""
              }
            }
          },
          {
            "criteriaName": "Untitled 02",
            "weightage": "50",
            "levels": {
              "L1": {
                "percentage": "30",
                "description": ""
              },
              "L2": {
                "percentage": "20",
                "description": ""
              }
            }
          }
        ],
        "levelNames": [
          {
            "L1": "level 01"
          },
          {
            "L2": "level 02"
          }
        ],
        "title": "Copy of test edit",
        "status": "draft",
        "scope": "course",
        "parentId": "1142",
        "isDeleted": false,
        "createdBy": "1",
        "updatedBy": "1",
        "createdOn": "2021-12-10T05:05:22.446Z",
        "updatedOn": "2021-12-27T05:30:25.243Z",
        "rubricId": "fe451300-7a1b-4196-a046-50ea88af0f12",
        "creationDetail": {
          "createdBy": "username1",
          "createdOn": "2021-12-10T05:05:22.446Z"
        },
        "modificationDetail": {
          "modifiedBy": "username1",
          "modifiedOn": "2021-12-27T05:30:25.243Z"
        }
      },
      {
        "_id": "61b2e05e90284856206d4670",
        "criterias": [
          {
            "criteriaName": "Grammer",
            "weightage": "50",
            "levels": {
              "L1": {
                "percentage": "10",
                "description": "English"
              },
              "L2": {
                "percentage": "20",
                "description": "English"
              }
            }
          },
          {
            "criteriaName": "JAVA",
            "weightage": "50",
            "levels": {
              "L1": {
                "percentage": "10",
                "description": "OOPS"
              },
              "L2": {
                "percentage": "20",
                "description": "OOPS"
              }
            }
          }
        ],
        "levelNames": [
          {
            "L1": "level 01"
          },
          {
            "L2": "level 02"
          }
        ],
        "title": "Copy of Copy of New Rubric",
        "status": "active",
        "scope": "course",
        "parentId": "1142",
        "isDeleted": false,
        "createdBy": "1",
        "updatedBy": "1",
        "createdOn": "2021-12-10T05:06:38.587Z",
        "updatedOn": "2021-12-10T05:06:38.587Z",
        "rubricId": "dddcea64-b22c-41d5-a0ea-b9473029f9bc",
        "creationDetail": {
          "createdBy": "username1",
          "createdOn": "2021-12-10T05:06:38.587Z"
        },
        "modificationDetail": {
          "modifiedBy": "username1",
          "modifiedOn": "2021-12-10T05:06:38.587Z"
        }
      }];
    await TestBed.configureTestingModule({
      declarations: [ RubricsListViewComponent, ConfirmationModalComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      }), ToastrModule.forRoot({}),
      NgxDatatableModule,
      MatRadioModule,
      ],
      providers: [ RubricsService, DialogService, TranslateService],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricsListViewComponent);
    component = fixture.componentInstance;
    rubricService = TestBed.inject(RubricsService);
    dialogService = TestBed.inject(DialogService);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    component.rows = rubricListData;
    component.rowsPerPage = 20;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render data table', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.datatable-header-cell-label').textContent).toBeTruthy('Title');
    expect(compiled.querySelector('.datatable-header-cell-label').textContent).toBeTruthy('Creation Detail');
    expect(compiled.querySelector('.datatable-header-cell-label').textContent).toBeTruthy('Modification Detail');
    expect(compiled.querySelector('.datatable-header-cell-label').textContent).toBeTruthy('Status');
  });

  it('should contextMenuClick', () => {
    component.rubricLevelType = RubricOperations.COURSE;
    spyOn(rubricService, 'sendMessageToBackEnd');
    component.contextMenuClick(RubricOperations.COPY, rubricListData[0]);
    mockModalRef.componentInstance.confirmStatus.subscribe(val => {
      expect(val).toEqual(true);
      expect(mockModalRef.close.call.length).toEqual(1);
    });
    mockModalRefNo.componentInstance.confirmStatus.subscribe(val => {
      expect(val).toEqual(false);
      expect(mockModalRef.close.call.length).toEqual(1);
    });
  });

  it('should editRubric', () => {
    component.contextMenuClick(RubricOperations.EDIT, rubricListData[0]);
  });

  it('should deleteRubric', () => {
    spyOn(rubricService, 'sendMessageToBackEnd');
    component.contextMenuClick(RubricOperations.DELETE, rubricListData[0]);
    mockModalRef.componentInstance.confirmStatus.subscribe(val => {
      expect(val).toEqual(true);
      expect(mockModalRef.close.call.length).toEqual(1);
    });
    mockModalRefNo.componentInstance.confirmStatus.subscribe(val => {
      expect(val).toEqual(false);
      expect(mockModalRef.close.call.length).toEqual(1);
    });
  });

  it('should active', () => {
    component.onActivate({type: RubricOperations.CLICK}, rubricListData[0]);
  });

  it('should select row', () => {
    component.selectRow({}, rubricListData[0]);
  });

  it('should select page', async () => {
    spyOn(rubricService, 'sendMessageToBackEnd').and.resolveTo({
      body: {
        rubrics: rubricListData,
        page: "1",
        size: "20",
        total: 2
      },
      ok: true,
      status: 200
    });
    const pageInfo: any = {offset: 1};
    component.setPage(pageInfo);
    fixture.detectChanges();
    fixture.whenStable();
    expect(component.page.totalElements).toEqual(0);
  });

  it('should onClickView', () => {
    component.onClickView(rubricListData[0]);
  });

  it('should getClassNameRubricStatus', () => {
    const value = component.getClassNameRubricStatus(RubricOperations.ACTIVE);
    expect(value).toEqual(RubricOperations.ACTIVE_STATE);
    const ddt = component.getClassNameRubricStatus(RubricOperations.DRAFT);
    expect(ddt).toEqual(RubricOperations.DRAFT_STATE);
    const returnedData = component.getClassNameRubricStatus(RubricOperations.USE_STATE);
    expect(returnedData).toEqual(RubricOperations.USE_STATE);
  });
});
