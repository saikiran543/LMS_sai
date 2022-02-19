/* eslint-disable max-lines-per-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogService } from 'src/app/services/dialog.service';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { StorageService } from 'src/app/services/storage.service';
import { ChecklistDatabase } from '../list.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { StudentCourseViewComponent } from './student-course-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContentService } from 'src/app/learning-center/course-services/content.service';
import { ContentItemFlatNode, ContentItemNode } from 'src/app/model';
import { Routes } from '@angular/router';
import { Location } from '@angular/common';
import { LearningCenterComponent } from 'src/app/learning-center/learning-center.component';
import { CommonService } from 'src/app/services/common.service';
import { MatTreeModule } from '@angular/material/tree';
import { TimePipe } from 'src/app/pipes/time.pipe';
import { Observable, of } from 'rxjs';
import translations from '../../../../../assets/i18n/en.json';
class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
describe('StudentCourseViewComponent', () => {
  let component: StudentCourseViewComponent;
  let fixture: ComponentFixture<StudentCourseViewComponent>;
  let storageService: StorageService;
  const routes: Routes = [{ path: '', component: LearningCenterComponent }, {
    path: 'content/:id',
    loadChildren: () => import('../../content-player/content-player.module').then(module => module.ContentPlayerModule)
  }];
  let location: Location;
  let translate: TranslateService;
  let contentService: ContentService;
  let commonService: CommonService;
  let mockCourseJson: ContentItemNode[];
  const node: ContentItemFlatNode = {
    _id: '9557efbf-5b04-402c-9e21-337331e17699',
    name: 'unit1',
    level: 0,
    status: 'published',
    expandable: false,
    type: 'folder',
    progress: 0,
    title: 'unit1',
    elementId: '9557efbf-5b04-402c-9e21-337331e17699'
  };

  beforeEach(async () => {
    mockCourseJson = [{
      "_id": "246b60ae-fef4-4098-bcd9-6417388dceb3",
      "elementMetadata": {
        "createdOn": "2021-10-14T11:20:59.369Z",
        "updatedOn": "2021-10-14T11:20:59.369Z",
        "elementId": "246b60ae-fef4-4098-bcd9-6417388dceb3",
        "description": "<p>unit-2</p>",
        "visibilityCriteria": false,
        "banner": "",
        "bannerFileName": "IMG_20210920_120545.jpg"
      },
      "elementId": "246b60ae-fef4-4098-bcd9-6417388dceb3",
      "title": "unit-2",
      "name": "unit-2",
      "createdOn": new Date("2021-10-21T07:14:07.746Z"),
      "status": "published",
      "progress": 50,
      "idealTime": 431,
      "numberOfContent": 2,
      "completedContent": 1,
      "type": "unit",
      "children": []
    }];

    await TestBed.configureTestingModule({
      declarations: [StudentCourseViewComponent, TimePipe],
      providers: [TranslateService, ContentService, ToastrService, StorageService, DialogService, LeftNavService, ChecklistDatabase],
      imports: [HttpClientTestingModule, MatTreeModule, RouterTestingModule.withRoutes(routes), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      }), ToastrModule.forRoot({})]
    })
      .compileComponents();
    storageService = TestBed.inject(StorageService);
    location = TestBed.inject(Location);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    contentService = TestBed.inject(ContentService);
    commonService = TestBed.inject(CommonService);
    storageService.set('courseJson', mockCourseJson);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCourseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should transform to flat node', () => {
    const mockNode = {
      "_id": "246b60ae-fef4-4098-bcd9-6417388dceb3",
      "elementMetadata": {
        "createdOn": "2021-10-14T11:20:59.369Z",
        "updatedOn": "2021-10-14T11:20:59.369Z",
        "elementId": "246b60ae-fef4-4098-bcd9-6417388dceb3",
        "description": "<p>unit-2</p>",
        "visibilityCriteria": false,
        "banner": "",
        "bannerFileName": "IMG_20210920_120545.jpg"
      },
      "elementId": "246b60ae-fef4-4098-bcd9-6417388dceb3",
      "title": "unit-2",
      "childElements": [],
      "name": "unit-2",
      "createdOn": new Date("2021-10-21T07:14:07.746Z"),
      "status": "published",
      "progress": 50,
      "idealTime": 431,
      "numberOfContent": 2,
      "completedContent": 1,
      "type": "unit",
      "children": []
    };
    const responceMock = '{"_id":"246b60ae-fef4-4098-bcd9-6417388dceb3","name":"unit-2","level":1,"type":"unit","progress":50,"idealTime":431,"numberOfContent":2,"completedContent":1,"expandable":false}';
    const result = component.transformer(mockNode,1);
    expect(JSON.stringify(result)).toEqual(responceMock);
  });

  it('should get node type', () => {
    const nodeType: ContentItemFlatNode = {
      _id: '9557efbf-5b04-402c-9e21-337331e17699',
      name: 'unit1',
      level: 0,
      status: 'published',
      expandable: false,
      type: 'folder',
      progress: 0,
      title: 'unit1',
      elementId: '9557efbf-5b04-402c-9e21-337331e17699'
    };
    const result = component.isFolder(nodeType);
    expect(result).toBe('folder');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open content player', () => {
    component.clickNode(node);
    expect(location.path()).toBe("");
  });

  it('display Context Menu Item', () => {
    let result;
    result = component.displayContextMenuItem("download", node);
    expect(result).toBe(false);
    node.type = "unit";
    result = component.displayContextMenuItem("download", node);
    expect(result).toBe(false);
    result = component.displayContextMenuItem("bookmark", node);
    expect(result).toBe(true);
  });

  it('get Mandatory', () => {
    component.getMandatory();
  });

  it('apply styles', () => {
    const result = JSON.stringify(component.applyStyles(node));
    expect(result).toBe('{"padding-left":"0px"}');
  });

  it('Should render html', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.tree-header-column').textContent).toContain('Title');
    expect(compiled.querySelector('.progress-header').textContent).toContain('Progress');
    expect(compiled.querySelector('.ideal-time-header').textContent).toContain('Ideal Time');
  });

  it('should download the content', async () => {
    const compiled = fixture.debugElement.nativeElement;
    spyOn(commonService, 'getSignedUrl').and.callFake(() => Promise.resolve({
      body: {
        url: ''
      }
    }));
    spyOn(contentService, 'getElementDetail').and.callFake(() => Promise.resolve(
      {
        body: {
          allowDownload: false,
          contentStatus: "mandatory",
          contentType: "otherattachements",
          createdBy: "",
          createdOn: "2021-10-19T09:52:39.550Z",
          description: "",
          elementId: "72803382-7646-426d-814e-db0a5726cbc0",
          fileExtension: "docx",
          fileUrl: "",
          idealTime: 60,
          lastAccessedTime: "2021-10-21T11:29:43.997Z",
          nextElement: { title: 'unit-2' },
          offlineAccess: false,
          originalFileName: "sample.docx",
          previousElement: null,
          s3FileName: "c56c1569-1f43-486e-9d9a-da4be3af2f8c.docx",
          sendNotification: true,
          status: "published",
          title: "other attch test",
          type: "otherattachements",
          updatedBy: "",
          updatedOn: "2021-10-19T09:52:39.550Z",
          visibilityCriteria: false
        }
      }));
    const windowSpy = spyOn(window, 'open');
    await component.treeOperations("download", node);
    expect(windowSpy).toHaveBeenCalledWith('');
    expect(compiled.querySelector('.checklist-leaf-node').textContent).toContain('unit-2');
    expect(compiled.querySelector('.completed').textContent).toContain('50% Completed');
    expect(compiled.querySelector('.progress-status').textContent).toContain('1 / 2');
    expect(compiled.querySelector('.ideal-time').textContent).toContain('7 Hr 11 Min');
    await component.treeOperations('bookmark', node);
    await component.treeOperations('', node);
  });

  it('should get level', () => {
    const result = component.getLevel(node);
    expect(result).toBe(0);
  });

  it('Should get node isExpanded or not', () => {
    let result = component.isExpandable(node);
    expect(result).toBe(false);
    node.expandable = true;
    result = component.isExpandable(node);
    expect(result).toBeTruthy;
  });

  it('should get children', () => {
    const newNode: ContentItemNode = {
      "_id": "246b60ae-fef4-4098-bcd9-6417388dceb3",
      "elementMetadata": {
        "createdOn": "2021-10-14T11:20:59.369Z",
        "updatedOn": "2021-10-14T11:20:59.369Z",
        "elementId": "246b60ae-fef4-4098-bcd9-6417388dceb3",
        "description": "<p>unit-2</p>",
        "visibilityCriteria": false,
        "banner": "",
        "bannerFileName": "IMG_20210920_120545.jpg"
      },
      "elementId": "246b60ae-fef4-4098-bcd9-6417388dceb3",
      "title": "unit-2",
      "name": "unit-2",
      "createdOn": new Date("2021-10-21T07:14:07.746Z"),
      "status": "published",
      "progress": 50,
      "idealTime": 431,
      "numberOfContent": 2,
      "completedContent": 1,
      "type": "unit",
      "children": [{
        "_id": "14ebe56b-75f7-4477-a79c-940d92246099",
        "elementMetadata": {
          "createdOn": "2021-10-18T15:46:28.670Z",
          "updatedOn": "2021-10-18T15:46:28.670Z",
          "elementId": "14ebe56b-75f7-4477-a79c-940d92246099",
          "contentType": "document",
          "description": "<p>PDF file</p>",
          "contentStatus": "mandatory",
          "allowDownload": false,
          "offlineAccess": false,
          "sendNotification": false,
          "idealTime": 129,
          "visibilityCriteria": true,
          "createdBy": "",
          "updatedBy": "",
          "fileUrl": "",
          "s3FileName": "032b9313-2507-4101-9255-e13033184296.pdf",
          "originalFileName": "sample.pdf",
          "fileExtension": "pdf"
        },
        "elementId": "14ebe56b-75f7-4477-a79c-940d92246099",
        "title": "Testing pdf",
        "name": "Testing pdf",
        "createdOn": new Date("2021-10-21T07:48:48.340Z"),
        "status": "published",
        "progress": 25,
        "idealTime": 129,
        "numberOfContent": 1,
        "completedContent": 0,
        "type": "document",
        "children": []
      }]
    };
    const result : ContentItemNode[] = component.getChildren(newNode);
    expect(result).toBe(newNode.children);
  });

  it('Has No Content', () => {
    const result = component.hasNoContent(1,node);
    expect(result).toBeFalsy();
  });

  it('descendants All Selected', () => {
    const result = component.descendantsAllSelected(node);
    expect(result).toBeTruthy;
  });

  it('descendants Partially Selected', () => {
    const result = component.descendantsPartiallySelected(node);
    expect(result).toBeFalsy;
  });

  it('todo Items Selection Toggle', () => {
    component.todoItemSelectionToggle(node);
  });
});