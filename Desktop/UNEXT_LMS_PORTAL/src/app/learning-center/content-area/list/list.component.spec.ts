/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';

import { ChecklistDatabase, ListComponent } from './list.component';
import { ContentItemNode } from 'src/app/model';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let storageService: StorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [RouterTestingModule],
      providers: [StorageService]
    })
      .compileComponents();
    storageService = TestBed.inject(StorageService);
    const spyGet = spyOn(storageService, 'get');
    spyGet.withArgs(StorageKey.USER_CURRENT_VIEW).and.returnValue('admin');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the view', () => {
    component.initializeView();
    expect(component.view).toBe('admin');
  });

  it('should call show preview', () => {
    component['showPreview'](); // testing private method
    expect(component.isPreview).toBeFalsy();
  });
});

describe('ChecklistDatabase', () => {
  let service: ChecklistDatabase;

  let storageService: StorageService;

  let mockCourseJson: ContentItemNode[];

  beforeEach(() => {
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

    TestBed.configureTestingModule({
      providers: [ChecklistDatabase, StorageService],
    });
    service = TestBed.inject(ChecklistDatabase);
    storageService = TestBed.inject(StorageService);
    storageService.set('courseJson', mockCourseJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize the data', () => {
    expect(service.data).toEqual(mockCourseJson);
  });

  it('should insert a child to a parent content node', () => {
    const alteredCourseJson: ContentItemNode[] = [{
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
    const parentNode = {
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
        "childElements": [],
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
    const contentToBeInserted: ContentItemNode = {
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
    };

    service.insertItem(parentNode, contentToBeInserted);

    expect(service.data).toEqual(alteredCourseJson);
  });

  it(`should insert a child to a parent content node, when children doesn't exist`, () => {
    const alteredCourseJson: ContentItemNode[] = [{
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
    const parentNode = {
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
    };
    const contentToBeInserted: ContentItemNode = {
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
    };

    service.insertItem(parentNode, contentToBeInserted);

    expect(service.data).toEqual(alteredCourseJson);
  });

  it('should update the name for a node', () => {
    const alteredCourseJson = [{
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
    }];

    const nodeToBeUpdated = {
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

    service.updateItem(nodeToBeUpdated, 'new unit');

    expect(service.data).toEqual(alteredCourseJson);
  });

  it('should delete an item, with no child nodes', () => {
    const expectedResult: ContentItemNode[] = [];

    const nodeToBeDeleted: ContentItemNode = mockCourseJson[0];

    service.dataChange.next(mockCourseJson);
    
    service.deleteItem(nodeToBeDeleted);

    expect(service.data).toEqual(expectedResult);
  });

  it('should delete an item, with child nodes', () => {
    const expectedResult: ContentItemNode[] = [{...mockCourseJson[0]}];

    const nodeToBeDeleted: ContentItemNode = {
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
    };

    mockCourseJson[0].children.push({
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
    });

    service.dataChange.next(mockCourseJson);

    service.deleteItem(nodeToBeDeleted);

    expect(service.data).toEqual(expectedResult);
  });

  it(`should return parent node when it doesn't exists`, () => {
    const parentNode = {
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
        "childElements": [],
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
    
    const childNode = parentNode.children[0];

    const getParentResponse = service.getParent(parentNode, childNode);

    expect(getParentResponse).toEqual(parentNode);
  });

  it(`should return parent node when it exists`, () => {
    const parentNode = {
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
        "childElements": [],
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
    
    const childNode = parentNode.children[0];

    const getParentResponse = service.getParent(parentNode, childNode);

    expect(getParentResponse).toEqual(parentNode);
  });

  it(`should return null when parent node doesn't exist`, () => {
    const parentNode = {
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
      "children": [],
    };

    const childNode = {
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
      "childElements": [],
      "name": "Testing pdf",
      "createdOn": new Date("2021-10-21T07:48:48.340Z"),
      "status": "published",
      "progress": 25,
      "idealTime": 129,
      "numberOfContent": 1,
      "completedContent": 0,
      "type": "document",
      "children": []
    };
  
    const getParentResponse = service.getParent(parentNode, childNode);

    expect(getParentResponse).toEqual(null);
  });

  it('should return the corresponding parent as per the node', () => {
    const allNodes = [{
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
      "title": "unit-1",
      "childElements": [],
      "name": "unit-1",
      "createdOn": new Date("2021-10-21T07:14:07.746Z"),
      "status": "published",
      "progress": 50,
      "idealTime": 431,
      "numberOfContent": 2,
      "completedContent": 1,
      "type": "unit",
      "children": [],
    }, {
      "_id": "146b60ae-fef4-4098-bcd9-6417388dcebe",
      "elementMetadata": {
        "createdOn": "2021-10-14T11:20:59.369Z",
        "updatedOn": "2021-10-14T11:20:59.369Z",
        "elementId": "246b60ae-fef4-4098-bcd9-6417388dcebe",
        "description": "<p>unit-2</p>",
        "visibilityCriteria": false,
        "banner": "",
        "bannerFileName": "IMG_20210920_120545.jpg"
      },
      "elementId": "146b60ae-fef4-4098-bcd9-6417388dcebe",
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
        "childElements": [],
        "name": "Testing pdf",
        "createdOn": new Date("2021-10-21T07:48:48.340Z"),
        "status": "published",
        "progress": 25,
        "idealTime": 129,
        "numberOfContent": 1,
        "completedContent": 0,
        "type": "document",
        "children": []
      }],
    }];

    service.dataChange.next(allNodes);

    const correspondingParent = service.getParentFromNodes(allNodes[1].children[0]);

    expect(correspondingParent).toEqual(allNodes[1]);
  });

  it('should insert item above the target element, when the target has no parent', () => {
    const allNodes: ContentItemNode[]= [{
      "_id": "146b60ae-fef4-4098-bcd9-6417388dcebe",
      "elementMetadata": {
        "createdOn": "2021-10-14T11:20:59.369Z",
        "updatedOn": "2021-10-14T11:20:59.369Z",
        "elementId": "246b60ae-fef4-4098-bcd9-6417388dcebe",
        "description": "<p>unit-2</p>",
        "visibilityCriteria": false,
        "banner": "",
        "bannerFileName": "IMG_20210920_120545.jpg"
      },
      "elementId": "146b60ae-fef4-4098-bcd9-6417388dcebe",
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
        "title": "Testing pdf - 1",
        "name": "Testing pdf - 1",
        "createdOn": new Date("2021-10-21T07:48:48.340Z"),
        "status": "published",
        "progress": 25,
        "idealTime": 129,
        "numberOfContent": 1,
        "completedContent": 0,
        "type": "document",
        "children": []
      }],
    }];
    service.dataChange.next(allNodes);
    const nodeToBeInserted: ContentItemNode = {
      "_id": "24ebe56b-75f7-4477-a79c-940d92246099",
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
    };

    const targetElement = {...allNodes[0]};
  
    service.insertItemAbove(targetElement, nodeToBeInserted);

    allNodes.splice(allNodes.indexOf(targetElement), 0, nodeToBeInserted);

    expect(service.data).toEqual(allNodes);
  });

  it('should insert item above the target element, when the target has parent', () => {
    const allNodes: ContentItemNode[]= [{
      "_id": "146b60ae-fef4-4098-bcd9-6417388dcebe",
      "elementMetadata": {
        "createdOn": "2021-10-14T11:20:59.369Z",
        "updatedOn": "2021-10-14T11:20:59.369Z",
        "elementId": "246b60ae-fef4-4098-bcd9-6417388dcebe",
        "description": "<p>unit-2</p>",
        "visibilityCriteria": false,
        "banner": "",
        "bannerFileName": "IMG_20210920_120545.jpg"
      },
      "elementId": "146b60ae-fef4-4098-bcd9-6417388dcebe",
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
        "title": "Testing pdf - 1",
        "name": "Testing pdf - 1",
        "createdOn": new Date("2021-10-21T07:48:48.340Z"),
        "status": "published",
        "progress": 25,
        "idealTime": 129,
        "numberOfContent": 1,
        "completedContent": 0,
        "type": "document",
        "children": []
      }],
    }];
    service.dataChange.next(allNodes);
    const nodeToBeInserted: ContentItemNode = {
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
      "title": "Testing pdf - 1",
      "name": "Testing pdf - 1",
      "createdOn": new Date("2021-10-21T07:48:48.340Z"),
      "status": "published",
      "progress": 25,
      "idealTime": 129,
      "numberOfContent": 1,
      "completedContent": 0,
      "type": "document",
      "children": []
    };

    const targetElement = allNodes[0].children[0];
  
    service.insertItemAbove(targetElement, nodeToBeInserted);

    allNodes.splice(allNodes.indexOf(targetElement), 0, nodeToBeInserted);

    expect(service.data).toEqual(allNodes);
  });

  it('should insert item below the target element, when the target has no parent', () => {
    const allNodes: ContentItemNode[]= [{
      "_id": "146b60ae-fef4-4098-bcd9-6417388dcebe",
      "elementMetadata": {
        "createdOn": "2021-10-14T11:20:59.369Z",
        "updatedOn": "2021-10-14T11:20:59.369Z",
        "elementId": "246b60ae-fef4-4098-bcd9-6417388dcebe",
        "description": "<p>unit-2</p>",
        "visibilityCriteria": false,
        "banner": "",
        "bannerFileName": "IMG_20210920_120545.jpg"
      },
      "elementId": "146b60ae-fef4-4098-bcd9-6417388dcebe",
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
        "title": "Testing pdf - 1",
        "name": "Testing pdf - 1",
        "createdOn": new Date("2021-10-21T07:48:48.340Z"),
        "status": "published",
        "progress": 25,
        "idealTime": 129,
        "numberOfContent": 1,
        "completedContent": 0,
        "type": "document",
        "children": []
      }],
    }];
    service.dataChange.next(allNodes);
    const nodeToBeInserted: ContentItemNode = {
      "_id": "24ebe56b-75f7-4477-a79c-940d92246099",
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
    };

    const targetElement = allNodes[0].children[0];
  
    service.insertItemBelow(targetElement, nodeToBeInserted);

    allNodes.splice(allNodes.indexOf(targetElement)+ 1, 0, nodeToBeInserted);

    expect(service.data).toEqual(allNodes);
  });

  it('should insert item below the target element, when the target has parent', () => {
    const allNodes: ContentItemNode[]= [{
      "_id": "146b60ae-fef4-4098-bcd9-6417388dcebe",
      "elementMetadata": {
        "createdOn": "2021-10-14T11:20:59.369Z",
        "updatedOn": "2021-10-14T11:20:59.369Z",
        "elementId": "246b60ae-fef4-4098-bcd9-6417388dcebe",
        "description": "<p>unit-2</p>",
        "visibilityCriteria": false,
        "banner": "",
        "bannerFileName": "IMG_20210920_120545.jpg"
      },
      "elementId": "146b60ae-fef4-4098-bcd9-6417388dcebe",
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
        "title": "Testing pdf - 1",
        "name": "Testing pdf - 1",
        "createdOn": new Date("2021-10-21T07:48:48.340Z"),
        "status": "published",
        "progress": 25,
        "idealTime": 129,
        "numberOfContent": 1,
        "completedContent": 0,
        "type": "document",
        "children": []
      }],
    }];
    service.dataChange.next(allNodes);
    const nodeToBeInserted: ContentItemNode = {
      "_id": "24ebe56b-75f7-4477-a79c-940d92246099",
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
    };

    const targetElement = {...allNodes[0]};
  
    service.insertItemBelow(targetElement, nodeToBeInserted);

    allNodes.splice(allNodes.indexOf(targetElement)+ 1, 0, nodeToBeInserted);

    expect(service.data).toEqual(allNodes);
  });

  it('should copy paste an item', () => {
    const allNodes: ContentItemNode[] = [{
      "_id": "8dd7c200-b704-42c9-8839-ca87f7a5065e",
      "elementId": "8dd7c200-b704-42c9-8839-ca87f7a5065e",
      "name": "Test Folder",
      "type": "folder",
      "createdOn": new Date("2021-10-21T10:47:44.336Z"),
      "status": "published",
      "children": [],
      "progress": 0,
      'title': 'Test Folder',
    }];

    service.dataChange.next(allNodes);

    const target = allNodes[0];

    const itemToBeMoved: ContentItemNode = {
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
      "createdOn": new Date("2021-10-21T10:47:32.460Z"),
      "status": "published",
      "progress": 50,
      "idealTime": 129,
      "numberOfContent": 1,
      "completedContent": 0,
      "type": "document",
      "children": [{
        "_id": "14ebe56b-75f7-4477-a79c-940d92246099",
        "elementId": '8dd7c200-b704-42c9-8839-ca87f7a5065e',
        "name": "Testing pdf",
        "type": "document",
        "createdOn": new Date("2021-10-21T10:47:32.460Z"),
        "status": "published",
        "title": 'Test Folder 1',
        "progress": 0,
        "children": []
      }]
    };

    const newItemChildNode = new ContentItemNode();
    newItemChildNode._id = itemToBeMoved._id;
    newItemChildNode.name = itemToBeMoved.name;
    newItemChildNode.type = itemToBeMoved.type;
    newItemChildNode.createdOn = itemToBeMoved.createdOn;
    newItemChildNode.status = itemToBeMoved.status;
    newItemChildNode.children = [];

    const newItem = new ContentItemNode();
    newItem._id = itemToBeMoved._id;
    newItem.name = itemToBeMoved.name;
    newItem.type = itemToBeMoved.type;
    newItem.createdOn = itemToBeMoved.createdOn;
    newItem.status = itemToBeMoved.status;
    newItem.children = [newItemChildNode];

    const expectedResult: ContentItemNode[] = [{
      "_id": "8dd7c200-b704-42c9-8839-ca87f7a5065e",
      "elementId": '8dd7c200-b704-42c9-8839-ca87f7a5065e',
      "name": "Test Folder",
      "title": "Test Folder",
      "type": "folder",
      "progress": 0,
      "createdOn": new Date("2021-10-21T10:47:44.336Z"),
      "status": "published",
      "children": [newItem]
    }];
    
    service.copyPasteItem(itemToBeMoved, target);

    expect(service.data).toEqual(expectedResult);
  });

  it('should copy paste an item above', () => {
    const allNodes: ContentItemNode[] = [{
      "_id": "8dd7c200-b704-42c9-8839-ca87f7a5065e",
      "elementId": "8dd7c200-b704-42c9-8839-ca87f7a5065e",
      "name": "Test Folder",
      "type": "folder",
      "createdOn": new Date("2021-10-21T10:47:44.336Z"),
      "status": "published",
      "children": [],
      "progress": 0,
      'title': 'Test Folder',
    }];

    service.dataChange.next(allNodes);

    const target = allNodes[0];

    const itemToBeMoved: ContentItemNode = {
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
      "createdOn": new Date("2021-10-21T10:47:32.460Z"),
      "status": "published",
      "progress": 50,
      "idealTime": 129,
      "numberOfContent": 1,
      "completedContent": 0,
      "type": "document",
      "children": [{
        "_id": "14ebe56b-75f7-4477-a79c-940d92246099",
        "elementId": '8dd7c200-b704-42c9-8839-ca87f7a5065e',
        "name": "Testing pdf",
        "type": "document",
        "createdOn": new Date("2021-10-21T10:47:32.460Z"),
        "status": "published",
        "title": 'Test Folder 1',
        "progress": 0,
        "children": []
      }]
    };

    const newItemChildNode = new ContentItemNode();
    newItemChildNode._id = itemToBeMoved._id;
    newItemChildNode.name = itemToBeMoved.name;
    newItemChildNode.type = itemToBeMoved.type;
    newItemChildNode.createdOn = itemToBeMoved.createdOn;
    newItemChildNode.status = itemToBeMoved.status;
    newItemChildNode.children = [];

    const newItem = new ContentItemNode();
    newItem._id = itemToBeMoved._id;
    newItem.name = itemToBeMoved.name;
    newItem.type = itemToBeMoved.type;
    newItem.createdOn = itemToBeMoved.createdOn;
    newItem.status = itemToBeMoved.status;
    newItem.children = [newItemChildNode];

    const expectedResult: ContentItemNode[] = [newItem, {
      "_id": "8dd7c200-b704-42c9-8839-ca87f7a5065e",
      "elementId": '8dd7c200-b704-42c9-8839-ca87f7a5065e',
      "name": "Test Folder",
      "title": "Test Folder",
      "type": "folder",
      "progress": 0,
      "createdOn": new Date("2021-10-21T10:47:44.336Z"),
      "status": "published",
      "children": []
    }];
    
    service.copyPasteItemAbove(itemToBeMoved, target);

    expect(service.data).toEqual(expectedResult);
  });

  it('should copy paste an item below', () => {
    const allNodes: ContentItemNode[] = [{
      "_id": "8dd7c200-b704-42c9-8839-ca87f7a5065e",
      "elementId": "8dd7c200-b704-42c9-8839-ca87f7a5065e",
      "name": "Test Folder",
      "type": "folder",
      "createdOn": new Date("2021-10-21T10:47:44.336Z"),
      "status": "published",
      "children": [],
      "progress": 0,
      'title': 'Test Folder',
    }];

    service.dataChange.next(allNodes);

    const target = allNodes[0];

    const itemToBeMoved: ContentItemNode = {
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
      "createdOn": new Date("2021-10-21T10:47:32.460Z"),
      "status": "published",
      "progress": 50,
      "idealTime": 129,
      "numberOfContent": 1,
      "completedContent": 0,
      "type": "document",
      "children": [{
        "_id": "14ebe56b-75f7-4477-a79c-940d92246099",
        "elementId": '8dd7c200-b704-42c9-8839-ca87f7a5065e',
        "name": "Testing pdf",
        "type": "document",
        "createdOn": new Date("2021-10-21T10:47:32.460Z"),
        "status": "published",
        "title": 'Test Folder 1',
        "progress": 0,
        "children": []
      }]
    };

    const newItemChildNode = new ContentItemNode();
    newItemChildNode._id = itemToBeMoved._id;
    newItemChildNode.name = itemToBeMoved.name;
    newItemChildNode.type = itemToBeMoved.type;
    newItemChildNode.createdOn = itemToBeMoved.createdOn;
    newItemChildNode.status = itemToBeMoved.status;
    newItemChildNode.children = [];

    const newItem = new ContentItemNode();
    newItem._id = itemToBeMoved._id;
    newItem.name = itemToBeMoved.name;
    newItem.type = itemToBeMoved.type;
    newItem.createdOn = itemToBeMoved.createdOn;
    newItem.status = itemToBeMoved.status;
    newItem.children = [newItemChildNode];

    const expectedResult: ContentItemNode[] = [{
      "_id": "8dd7c200-b704-42c9-8839-ca87f7a5065e",
      "elementId": '8dd7c200-b704-42c9-8839-ca87f7a5065e',
      "name": "Test Folder",
      "title": "Test Folder",
      "type": "folder",
      "progress": 0,
      "createdOn": new Date("2021-10-21T10:47:44.336Z"),
      "status": "published",
      "children": []
    }, newItem];
    
    service.copyPasteItemBelow(itemToBeMoved, target);

    expect(service.data).toEqual(expectedResult);
  });

  it('should refresh the tree', () => {
    service.data[0].name = 'changed';
    
    service.refreshTree();

    const alteredData = [...service.data];
    
    alteredData[0].name = 'name';

    expect(service.data).toEqual(alteredData);
  });
});