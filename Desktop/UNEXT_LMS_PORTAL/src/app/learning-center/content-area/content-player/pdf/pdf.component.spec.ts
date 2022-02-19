/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { StorageService } from 'src/app/services/storage.service';
import { Location } from '@angular/common';

import { PdfComponent } from './pdf.component';

describe('PdfComponent', () => {
  let component: PdfComponent;
  let fixture: ComponentFixture<PdfComponent>;
  let storageService: StorageService;
  let contentPlayerService: ContentPlayerService;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PdfComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ContentPlayerService, StorageService]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    storageService = TestBed.inject(StorageService);
    location = TestBed.inject(Location);
    contentPlayerService = TestBed.inject(ContentPlayerService);
    const response = {
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
      },
      "lastAccessedTime": "2021-10-18T05:58:21.617Z"
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
    fixture = TestBed.createComponent(PdfComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
    await component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggleToWidth', () => {
    component.toggleToWidth();
    expect(component.fitToWidth).toBeTruthy();
  });

  it('should call zoom function', () => {
    component.zoom('positive');
    expect(component.zoomValue).toEqual(110);
    component.zoom('negative');
    expect(component.zoomValue).toEqual(100);
  });

  it('should call rotate', () => {
    component.rotate();
    component.count = 1;
    expect(component.rotationValue).toBe(90);
    component.rotate();
    component.count = 2;
    expect(component.rotationValue).toBe(180);
    component.rotate();
    component.count = 3;
    expect(component.rotationValue).toBe(270);
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
        "elementId": "73ee8cab-4471-4b68-80ad-7ed74413861d",
        "type": "epub",
        "title": "Atomic Habits",
        "status": "published",
        "createdOn": "2021-10-07T11:18:32.616Z",
        "createdBy": "",
        "updatedOn": "2021-10-07T11:18:32.616Z",
        "updatedBy": "",
        "contentType": "epub",
        "description": "<p>Learn and Build Atomic Habits</p>",
        "contentStatus": "mandatory",
        "allowDownload": false,
        "offlineAccess": false,
        "sendNotification": false,
        "idealTime": 255,
        "visibilityCriteria": false,
        "fileUrl": "",
        "s3FileName": "865a1b17-c07b-4818-a7d0-349979485fe1.epub",
        "originalFileName": "Atomic Habits Tiny Changes, Remarkable Results by James Clear (z-lib.org).epub",
        "fileExtension": "epub",
        "previousElement": {
          "title": "Epub sample file"
        },
        "nextElement": {
          "title": "Pdf"
        }
      }
    }));
    await component.getNextElement();
    expect(location.path()).toBe('/');
  });
});
