/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { StorageService } from 'src/app/services/storage.service';
import { Location } from '@angular/common';

import { WeblinkComponent } from './weblink.component';

describe('WeblinkComponent', () => {
  let component: WeblinkComponent;
  let fixture: ComponentFixture<WeblinkComponent>;
  let storageService: StorageService;
  let contentPlayerService: ContentPlayerService;
  let location: Location;
  let router: Router;

  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeblinkComponent],
      imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule],
      providers: [ContentPlayerService, StorageService]
    })
      .compileComponents();
    storageService = TestBed.inject(StorageService);
    contentPlayerService = TestBed.inject(ContentPlayerService);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    const response = {
      "elementId": "a76658f7-44c6-4ce7-959f-682ed54af8ec",
      "type": "image",
      "title": "t1",
      "status": "unpublished",
      "createdOn": "2021-10-14T07:40:00.364Z",
      "createdBy": "",
      "updatedOn": "2021-10-14T07:40:00.364Z",
      "updatedBy": "",
      "contentType": "image",
      "description": "",
      "contentStatus": "mandatory",
      "allowDownload": false,
      "offlineAccess": false,
      "sendNotification": false,
      "idealTime": 5,
      "visibilityCriteria": false,
      "fileUrl": "",
      "s3FileName": "10f7e831-7095-449a-aa53-b2908f48bf57.jpg",
      "originalFileName": "moon.jpg",
      "fileExtension": "jpg",
      "previousElement": {
        "title": "Pdf"
      },
      "nextElement": {
        "title": "Test Folder001"
      },
      "lastAccessedTime": "2021-10-18T07:34:50.608Z"
    };
    const spyGet = spyOn(storageService, 'get');
    await spyGet.withArgs(StorageKey.ELEMENT_DETAIL).and.returnValue(response);
    spyOn(contentPlayerService, 'getSignedUrl').and.callFake(() => Promise.resolve({
      body: {
        url: 'https://edunew-filerepo.s3.ap-southeast-1.amazonaws.com/edunxtdev01/fe3840e2-b514-4868-8168-ea6ae4f6380c.jpg?AWSAccessKeyId=AKIAZNC7VU4PSHWYU3HL&Expires=1634192601&Signature=iAXmQUvcO5OTD3wJtNBHKlETp%2Bc%3D&response-content-disposition=attachment%3B%20filename%3Dmoon.jpg'
      }

    }));
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(WeblinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router.initialNavigation();
    await component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showHideToolBar as false', fakeAsync(() => {
    component.showHideToolBars(false);
    tick(3000);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.showHeaderFooter).toBeFalsy();
    });
  }));

  it('should call showHideToolBar as true', () => {
    component.showHideToolBars(true);
    expect(component.showHeaderFooter).toBeTruthy();
  });

  it('should navigate to previous content', async () => {
    component.courseId = '090';
    component.contentId = '805bf43b-963b-4c0b-b32b-519f72616804';
    spyOn(contentPlayerService, 'getPreviousElement').withArgs(component.courseId, component.contentId).and.returnValue(Promise.resolve({
      body: {
        "elementId": "6c937cdf-20ef-4bb0-8226-f94a1388ca48",
        "type": "document",
        "title": "Pdf",
        "status": "published",
        "createdOn": "2021-10-07T03:51:38.149Z",
        "createdBy": "",
        "updatedOn": "2021-10-07T03:51:38.149Z",
        "updatedBy": "",
        "contentType": "document",
        "description": "",
        "contentStatus": "mandatory",
        "allowDownload": false,
        "offlineAccess": false,
        "sendNotification": false,
        "idealTime": 316,
        "visibilityCriteria": false,
        "fileUrl": "",
        "s3FileName": "a6b36e84-6ddf-40d7-9397-d81daf5633b1.pdf",
        "originalFileName": "pdfTest.pdf",
        "fileExtension": "pdf",
        "previousElement": {
          "title": "Atomic Habits"
        },
        "nextElement": {
          "title": "t1"
        }
      }
    }));
    await component.getPreviousElement();
    expect(location.path()).toBe('/');
  });

  it('should navigate to next content', async () => {
    component.courseId = '090';
    component.contentId = '805bf43b-963b-4c0b-b32b-519f72616804';
    spyOn(contentPlayerService, 'getNextElement').withArgs(component.courseId, component.contentId).and.returnValue(Promise.resolve({
      body: {
        "elementId": "a8ea28dd-2dad-4356-a686-d3fe7ae0e15b",
        "type": "Folder",
        "title": "Test Folder001",
        "status": "unpublished",
        "createdOn": "2021-10-14T12:30:03.022Z",
        "createdBy": "",
        "updatedOn": "2021-10-14T12:30:03.022Z",
        "updatedBy": "",
        "description": "<p>Test Folder001</p>",
        "visibilityCriteria": false,
        "previousElement": {
          "title": "t1"
        },
        "nextElement": {
          "title": "Unit 5 - Mba"
        }
      }
    }));
    await component.getNextElement();
    expect(location.path()).toBe('/');
  });
});
