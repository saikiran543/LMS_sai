/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { StorageService } from 'src/app/services/storage.service';
import { EpubComponent } from './epub.component';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';

describe('EpubComponent', () => {
  let component: EpubComponent;
  let fixture: ComponentFixture<EpubComponent>;
  let storageService: StorageService;
  let contentPlayerService: ContentPlayerService;
  let router: Router;

  const routes: Routes = [{ path: 'login', component: LoginLayoutComponent }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EpubComponent],
      imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule],
      providers: [ContentPlayerService, StorageService]
    })
      .compileComponents();
    storageService = TestBed.inject(StorageService);
    contentPlayerService = TestBed.inject(ContentPlayerService);
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
    fixture = TestBed.createComponent(EpubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router.initialNavigation();
    await component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
