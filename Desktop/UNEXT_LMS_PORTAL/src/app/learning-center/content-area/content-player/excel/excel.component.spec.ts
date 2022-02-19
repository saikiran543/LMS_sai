/* eslint-disable max-lines-per-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ExcelComponent } from './excel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { TranslateService } from '@ngx-translate/core';

//import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
//import translations from './../../../../../assets/i18n/en.json';
//import { Observable, of } from 'rxjs';
//import { ReactiveFormsModule } from '@angular/forms';
//import { ToastContainerDirective, ToastrModule, ToastrService } from 'ngx-toastr';
//import { NgxDocViewerModule } from 'ngx-doc-viewer';
//import { NotesRightPaneComponent } from 'src/app/learning-center/content-area/notes/notes-right-pane/notes-right-pane.component';
//import { NotesModule } from '../../notes/notes.module';
//import { MatTooltipModule } from '@angular/material/tooltip';
//import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
//import { Location } from '@angular/common';

/*class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}*/

describe('ExcelComponent', () => {
  let component: ExcelComponent;
  let fixture: ComponentFixture<ExcelComponent>;
  let contentPlayerService: ContentPlayerService;
  let storageService: StorageService;
  //let location: Location;
  let router: Router;
  //let translateService: TranslateService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExcelComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ContentPlayerService, StorageService, TranslateService]
    })
      .compileComponents();
    router = TestBed.inject(Router);
    storageService = TestBed.inject(StorageService);
    //location = TestBed.inject(Location);
    contentPlayerService = TestBed.inject(ContentPlayerService);
    //translateService = TestBed.inject(TranslateService);

    const response = {
      "elementId": "6c937cdf-20ef-4bb0-8226-f94a1388ca48",
      "type": "document",
      "title": "excel",
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
      "s3FileName": "a6b36e84-6ddf-40d7-9397-d81daf5633b1.xls",
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
    fixture = TestBed.createComponent(ExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router.initialNavigation();
    await component.ngOnInit();
  });

  it('should create', () => {
    component.elementData = {'title': "test", 's3FileName': 'rtestestes'};
    expect(component).toBeTruthy();
  });
});
