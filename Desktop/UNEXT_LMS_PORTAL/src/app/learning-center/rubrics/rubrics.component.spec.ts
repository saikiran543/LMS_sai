/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { RubricOperations } from 'src/app/enums/rubricOperations';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import translations from '../../../assets/i18n/en.json';
import { RubricsComponent } from './rubrics.component';
import { RubricsService } from './service/rubrics.service';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
describe('RubricsComponent', () => {
  let component: RubricsComponent;
  let fixture: ComponentFixture<RubricsComponent>;
  const routes: Routes = [{ path: '', component: LoginLayoutComponent },
    {
      path: '',
      component: RubricsComponent
    },
    {
      path: 'manipulate/:operation',
      loadChildren: ()=> import('../rubrics/rubric-manipulation/rubric-manipulation.module').then(module=>module.RubricManipulationModule),
    },
    {
      path: ':type',
      loadChildren: ()=> import('../rubrics/rubric-manipulation/rubric-manipulation.module').then(module=>module.RubricManipulationModule),
    },
    {
      path: 'preview/:rubricId',
      loadChildren: ()=> import('../rubrics/rubric-preview/rubric-preview.module').then(module=>module.RubricPreviewModule),
    },
    {
      path: ':rubricOperation/:type',
      loadChildren: ()=> import('../rubrics/rubric-selection/rubric-selection.module').then(module=>module.RubricSelectionModule),
    }
  ];
  let rubricService: RubricsService;
  let translate: TranslateService;
  let rubricData: any;
  let activeRoute: ActivatedRoute;
  let location: Location;
  const rubricId = '9c53e89d-cbde-473a-b532-65faa66fdc73';
  beforeEach(async () => {
    rubricData = {
      "rubrics": [
        {
          "_id": "61c46008f3c16f03811f016f",
          "criterias": [
            {
              "criteriaName": "JAVA",
              "weightage": "50",
              "levels": {
                "L3": {
                  "percentage": "30",
                  "description": "Java is a programming language and a platform. Java is a high level, robust, object-oriented and secure programming language. Java was developed by Sun Microsystems (which is now the subsidiary of Oracle) in the year 1995. James Gosling is known as the father of Java"
                },
                "L1": {
                  "percentage": "25",
                  "description": "OOPS"
                },
                "L2": {
                  "percentage": "20",
                  "description": "OOPS"
                },
                "L4": {
                  "percentage": "10",
                  "description": ""
                },
                "L5": {
                  "percentage": "5",
                  "description": ""
                },
                "L6": {
                  "percentage": "2",
                  "description": ""
                }
              }
            },
            {
              "criteriaName": "Grammer",
              "weightage": "50",
              "levels": {
                "L3": {
                  "percentage": "30",
                  "description": "Java is a programming language and a platform. Java is a high level, robust, object-oriented and secure programming language. Java was developed by Sun Microsystems (which is now the subsidiary of Oracle) in the year 1995. James Gosling is known as the father of Java"
                },
                "L1": {
                  "percentage": "25",
                  "description": "English"
                },
                "L2": {
                  "percentage": "20",
                  "description": "English"
                },
                "L4": {
                  "percentage": "10",
                  "description": ""
                },
                "L5": {
                  "percentage": "5",
                  "description": ""
                },
                "L6": {
                  "percentage": "2",
                  "description": ""
                }
              }
            }
          ],
          "levelNames": [
            {
              "L3": "level 03"
            },
            {
              "L1": "stage 01"
            },
            {
              "L2": "stage 02"
            },
            {
              "L4": "level 04"
            },
            {
              "L5": "level 05"
            },
            {
              "L6": "level 06"
            }
          ],
          "title": "Copy of New Rubric(5)",
          "status": "active",
          "scope": "course",
          "parentId": "1142",
          "isDeleted": false,
          "createdBy": "1",
          "updatedBy": "1",
          "createdOn": "2021-12-23T11:39:52.582Z",
          "updatedOn": "2021-12-23T11:39:52.582Z",
          "rubricId": "ebed35ba-c37b-48d6-87da-4807aaf73ef5",
          "creationDetail": {
            "createdBy": "username1",
            "createdOn": "2021-12-23T11:39:52.582Z"
          },
          "modificationDetail": {
            "modifiedBy": "username1",
            "modifiedOn": "2021-12-23T11:39:52.582Z"
          }
        },
        {
          "_id": "61c460669a8a25037d0a2bab",
          "criterias": [
            {
              "criteriaName": "JAVA",
              "weightage": "50",
              "levels": {
                "L3": {
                  "percentage": "30",
                  "description": "Java is a programming language and a platform. Java is a high level, robust, object-oriented and secure programming language. Java was developed by Sun Microsystems (which is now the subsidiary of Oracle) in the year 1995. James Gosling is known as the father of Java"
                },
                "L1": {
                  "percentage": "25",
                  "description": "OOPS"
                },
                "L2": {
                  "percentage": "20",
                  "description": "OOPS"
                },
                "L4": {
                  "percentage": "10",
                  "description": ""
                },
                "L5": {
                  "percentage": "5",
                  "description": ""
                },
                "L6": {
                  "percentage": "2",
                  "description": ""
                }
              }
            },
            {
              "criteriaName": "Grammer",
              "weightage": "50",
              "levels": {
                "L3": {
                  "percentage": "30",
                  "description": "Java is a programming language and a platform. Java is a high level, robust, object-oriented and secure programming language. Java was developed by Sun Microsystems (which is now the subsidiary of Oracle) in the year 1995. James Gosling is known as the father of Java"
                },
                "L1": {
                  "percentage": "25",
                  "description": "English"
                },
                "L2": {
                  "percentage": "20",
                  "description": "English"
                },
                "L4": {
                  "percentage": "10",
                  "description": ""
                },
                "L5": {
                  "percentage": "5",
                  "description": ""
                },
                "L6": {
                  "percentage": "2",
                  "description": ""
                }
              }
            }
          ],
          "levelNames": [
            {
              "L3": "level 03"
            },
            {
              "L1": "stage 01"
            },
            {
              "L2": "stage 02"
            },
            {
              "L4": "level 04"
            },
            {
              "L5": "level 05"
            },
            {
              "L6": "level 06"
            }
          ],
          "title": "Copy of New Rubric(6)",
          "status": "active",
          "scope": "course",
          "parentId": "1142",
          "isDeleted": false,
          "createdBy": "1",
          "updatedBy": "1",
          "createdOn": "2021-12-23T11:41:26.901Z",
          "updatedOn": "2021-12-23T11:41:26.901Z",
          "rubricId": "72d7f495-b621-4a30-b48e-c6f7b3598ab4",
          "creationDetail": {
            "createdBy": "username1",
            "createdOn": "2021-12-23T11:41:26.901Z"
          },
          "modificationDetail": {
            "modifiedBy": "username1",
            "modifiedOn": "2021-12-23T11:41:26.901Z"
          }
        },
        {
          "_id": "61c460b9520f830376df8335",
          "criterias": [
            {
              "criteriaName": "Untitled 01",
              "weightage": "100",
              "levels": {
                "L1": {
                  "percentage": "1",
                  "description": ""
                }
              }
            }
          ],
          "levelNames": [
            {
              "L1": "level 01"
            }
          ],
          "title": "Rubric 0000001",
          "status": "draft",
          "scope": "course",
          "parentId": "1142",
          "isDeleted": false,
          "createdBy": "1",
          "updatedBy": "1",
          "createdOn": "2021-12-23T11:42:49.982Z",
          "updatedOn": "2021-12-23T11:42:49.982Z",
          "rubricId": "2f97ab85-0027-4a52-adaa-abd55216a2a5",
          "creationDetail": {
            "createdBy": "username1",
            "createdOn": "2021-12-23T11:42:49.982Z"
          },
          "modificationDetail": {
            "modifiedBy": "username1",
            "modifiedOn": "2021-12-23T11:42:49.982Z"
          }
        },
        {
          "_id": "61c469559a8a25037d0a2ea4",
          "criterias": [
            {
              "criteriaName": "Untitled 01",
              "weightage": "50",
              "levels": {
                "L1": {
                  "percentage": "10",
                  "description": ""
                }
              }
            },
            {
              "criteriaName": "Untitled 02",
              "weightage": "50",
              "levels": {
                "L1": {
                  "percentage": "10",
                  "description": ""
                }
              }
            }
          ],
          "levelNames": [
            {
              "L1": "level 01"
            }
          ],
          "title": "Test as Draft",
          "status": "active",
          "scope": "course",
          "parentId": "1142",
          "isDeleted": false,
          "createdBy": "1",
          "updatedBy": "1",
          "createdOn": "2021-12-23T12:19:33.502Z",
          "updatedOn": "2021-12-27T11:11:56.041Z",
          "rubricId": "68d26d74-b0e0-4869-9091-55509496cfdb",
          "creationDetail": {
            "createdBy": "username1",
            "createdOn": "2021-12-23T12:19:33.502Z"
          },
          "modificationDetail": {
            "modifiedBy": "username1",
            "modifiedOn": "2021-12-27T11:11:56.041Z"
          }
        },
        {
          "_id": "61c46a98f3c16f03811f0410",
          "criterias": [
            {
              "criteriaName": "Untitled 01",
              "weightage": "50",
              "levels": {
                "L1": {
                  "percentage": "10",
                  "description": ""
                }
              }
            },
            {
              "criteriaName": "Untitled 02",
              "weightage": "50",
              "levels": {
                "L1": {
                  "percentage": "10",
                  "description": ""
                }
              }
            }
          ],
          "levelNames": [
            {
              "L1": "level 01"
            }
          ],
          "title": "test dr",
          "status": "active",
          "scope": "course",
          "parentId": "1142",
          "isDeleted": false,
          "createdBy": "1",
          "updatedBy": "1",
          "createdOn": "2021-12-23T12:24:56.871Z",
          "updatedOn": "2021-12-27T04:58:36.012Z",
          "rubricId": "6cd41b2e-9d15-44c2-9c6c-97d402f2d66b",
          "creationDetail": {
            "createdBy": "username1",
            "createdOn": "2021-12-23T12:24:56.871Z"
          },
          "modificationDetail": {
            "modifiedBy": "username1",
            "modifiedOn": "2021-12-27T04:58:36.012Z"
          }
        },
        {
          "_id": "61c46afdfbe66b037a479e45",
          "criterias": [
            {
              "criteriaName": "Untitled 01",
              "weightage": "50",
              "levels": {
                "L1": {
                  "percentage": "10",
                  "description": ""
                }
              }
            },
            {
              "criteriaName": "Untitled 02",
              "weightage": "50",
              "levels": {
                "L1": {
                  "percentage": "10",
                  "description": ""
                }
              }
            }
          ],
          "levelNames": [
            {
              "L1": "level 01"
            }
          ],
          "title": "ddsfdfd",
          "status": "draft",
          "scope": "course",
          "parentId": "1142",
          "isDeleted": false,
          "createdBy": "1",
          "updatedBy": "1",
          "createdOn": "2021-12-23T12:26:37.870Z",
          "updatedOn": "2021-12-23T12:31:24.533Z",
          "rubricId": "2c6f318f-0e9d-4a1f-b0e3-00bc79d0cfe9",
          "creationDetail": {
            "createdBy": "username1",
            "createdOn": "2021-12-23T12:26:37.870Z"
          },
          "modificationDetail": {
            "modifiedBy": "username1",
            "modifiedOn": "2021-12-23T12:31:24.533Z"
          }
        },
        {
          "_id": "61c5e04d0a46ea0379038932",
          "criterias": [
            {
              "criteriaName": "JAVA",
              "weightage": "50",
              "levels": {
                "L3": {
                  "percentage": "30",
                  "description": "Java is a programming language and a platform. Java is a high level, robust, object-oriented and secure programming language. Java was developed by Sun Microsystems (which is now the subsidiary of Oracle) in the year 1995. James Gosling is known as the father of Java"
                },
                "L1": {
                  "percentage": "25",
                  "description": "OOPS"
                },
                "L2": {
                  "percentage": "20",
                  "description": "OOPS"
                },
                "L4": {
                  "percentage": "10",
                  "description": ""
                },
                "L5": {
                  "percentage": "5",
                  "description": ""
                },
                "L6": {
                  "percentage": "2",
                  "description": ""
                }
              }
            },
            {
              "criteriaName": "Grammer",
              "weightage": "50",
              "levels": {
                "L3": {
                  "percentage": "30",
                  "description": "Java is a programming language and a platform. Java is a high level, robust, object-oriented and secure programming language. Java was developed by Sun Microsystems (which is now the subsidiary of Oracle) in the year 1995. James Gosling is known as the father of Java"
                },
                "L1": {
                  "percentage": "25",
                  "description": "English"
                },
                "L2": {
                  "percentage": "20",
                  "description": "English"
                },
                "L4": {
                  "percentage": "10",
                  "description": ""
                },
                "L5": {
                  "percentage": "5",
                  "description": ""
                },
                "L6": {
                  "percentage": "2",
                  "description": ""
                }
              }
            }
          ],
          "levelNames": [
            {
              "L3": "level 03"
            },
            {
              "L1": "stage 01"
            },
            {
              "L2": "stage 02"
            },
            {
              "L4": "level 04"
            },
            {
              "L5": "level 05"
            },
            {
              "L6": "level 06"
            }
          ],
          "title": "Copy of New Rubric(7)",
          "status": "active",
          "scope": "course",
          "parentId": "1142",
          "isDeleted": false,
          "createdBy": "1",
          "updatedBy": "1",
          "createdOn": "2021-12-24T14:59:25.820Z",
          "updatedOn": "2021-12-24T14:59:25.820Z",
          "rubricId": "3c39d095-e48e-4126-8bd7-046d0f6be873",
          "creationDetail": {
            "createdBy": "username1",
            "createdOn": "2021-12-24T14:59:25.820Z"
          },
          "modificationDetail": {
            "modifiedBy": "username1",
            "modifiedOn": "2021-12-24T14:59:25.820Z"
          }
        },
        {
          "_id": "61c5e05d0a46ea037903893b",
          "criterias": [
            {
              "criteriaName": "Untitled 01",
              "weightage": "50",
              "levels": {
                "L1": {
                  "percentage": "10",
                  "description": ""
                }
              }
            },
            {
              "criteriaName": "Untitled 02",
              "weightage": "50",
              "levels": {
                "L1": {
                  "percentage": "10",
                  "description": ""
                }
              }
            }
          ],
          "levelNames": [
            {
              "L1": "level 01"
            }
          ],
          "title": "Copy of ddsfdfd",
          "status": "active",
          "scope": "course",
          "parentId": "1142",
          "isDeleted": false,
          "createdBy": "1",
          "updatedBy": "1",
          "createdOn": "2021-12-24T14:59:41.992Z",
          "updatedOn": "2021-12-24T14:59:41.992Z",
          "rubricId": "1d50a688-b441-4750-ab23-77557113d7b3",
          "creationDetail": {
            "createdBy": "username1",
            "createdOn": "2021-12-24T14:59:41.992Z"
          },
          "modificationDetail": {
            "modifiedBy": "username1",
            "modifiedOn": "2021-12-24T14:59:41.992Z"
          }
        },
        {
          "_id": "61c5edb67d01d903803a4619",
          "criterias": [
            {
              "criteriaName": "Untitled 01",
              "weightage": "100",
              "levels": {
                "L1": {
                  "percentage": "10",
                  "description": ""
                }
              }
            }
          ],
          "levelNames": [
            {
              "L1": "level 01"
            }
          ],
          "title": "aaa",
          "status": "active",
          "scope": "course",
          "parentId": "1142",
          "isDeleted": false,
          "createdBy": "1",
          "updatedBy": "1",
          "createdOn": "2021-12-24T15:56:38.179Z",
          "updatedOn": "2021-12-24T21:27:02.192Z",
          "rubricId": "45b25324-6b9c-4018-a490-0b7aa1b0403c",
          "creationDetail": {
            "createdBy": "username1",
            "createdOn": "2021-12-24T15:56:38.179Z"
          },
          "modificationDetail": {
            "modifiedBy": "username1",
            "modifiedOn": "2021-12-24T21:27:02.192Z"
          }
        }
      ],
      "page": "1",
      "size": "20",
      "total": 29
    };
    await TestBed.configureTestingModule({
      declarations: [ RubricsComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      }), ToastrModule.forRoot({})],
      providers: [RubricsService]
    }).compileComponents();
    location = TestBed.inject(Location);
    rubricService = TestBed.inject(RubricsService);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    activeRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    RubricsComponent.prototype.ngOnInit = () => {};
    fixture = TestBed.createComponent(RubricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render OnInit', () => {
    component.ngOnInit();
  });
  it('should get rubrics data', async() => {
    spyOn(rubricService, 'sendMessageToBackEnd').and.resolveTo(
      {body: rubricData}
    );
    component.readRubrics();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.rows).toEqual(rubricData.rubrics);
    expect(component.totalRecords).toEqual(rubricData.total);
  });

  it('should render html', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content-title').textContent).toBeTruthy('Rubrics');
    expect(compiled.querySelector('.dropdown-toggle').textContent).toBeTruthy('Filter');
    expect(compiled.querySelector('.dropdown-item').textContent).toBeTruthy('Action');
    expect(compiled.querySelector('.dropdown-item').textContent).toBeTruthy('Another action');
    expect(compiled.querySelector('.dropdown-item').textContent).toBeTruthy('Something else here');
    expect(compiled.querySelector('.nav-link').textContent).toBeTruthy('Program Level');
    expect(compiled.querySelector('.nav-link').textContent).toBeTruthy('Course Level');
    expect(compiled.querySelector('p').textContent).toBeTruthy('Looks like there are no rubrics yet!');
    expect(compiled.querySelector('label').textContent).toBeTruthy('Rows per page');
  });
  it('should set context menu', () => {
    component.rubricLevelType = 'program';
    component.setContextMenuItems();
    component.rubricLevelType = 'course';
  });

  it('should click event', () => {
    spyOn(rubricService, 'sendMessageToBackEnd').and.resolveTo(
      {body: rubricData}
    );
    component.ClickEvent(RubricOperations.CREATE_RUBRIC);
    expect(location.back()).toEqual();
    component.rubricLevelType = RubricOperations.COURSE;
    component.ClickEvent(RubricOperations.COURSE_LEVEL);
    component.rubricLevelType = RubricOperations.PROGRAM;
    component.ClickEvent(RubricOperations.PROGRAM_LEVEL);
    component.ClickEvent(RubricOperations.RUBRIC_SELECTION);
    component.ClickEvent(RubricOperations.DELETE);
  });
  it('should route and read data', async () => {
    spyOn(rubricService, 'sendMessageToBackEnd').and.resolveTo(
      {body: rubricData}
    );
    component.rubricLevelType = 'program';
    component.onRouteAndReadData();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.rows).toEqual(rubricData.rubrics);
    expect(component.totalRecords).toEqual(rubricData.total);
    // eslint-disable-next-line require-atomic-updates
    component.rubricLevelType = 'course';
    component.onRouteAndReadData();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.rows).toEqual(rubricData.rubrics);
    expect(component.totalRecords).toEqual(rubricData.total);
  });

  it('should preview the data', () => {
    component.onClickView(rubricId);
    expect(location.back()).toEqual();
  });

  it('should modify the data', () => {
    spyOn(rubricService, 'sendMessageToBackEnd').and.resolveTo(
      {body: rubricData}
    );
    component.rowsPerPage = 15;
    component.modifyRecordsPerPage('plus');
    component.rowsPerPage = 10;
    component.modifyRecordsPerPage('minus');
  });
});
