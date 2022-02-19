/* eslint-disable max-lines-per-function */
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { StorageService } from 'src/app/services/storage.service';

import { UnitFolderComponent } from './unit-folder.component';

describe('UnitFolderComponent', () => {
  let component: UnitFolderComponent;
  let fixture: ComponentFixture<UnitFolderComponent>;
  let contentPlayerService: ContentPlayerService;
  let storageService: StorageService;

  let location: Location;

  const routes: Routes = [{
    path: '',
    component: UnitFolderComponent,
  }, {
    path: 'login',
    component: LoginLayoutComponent,
  }, {
    path: 'previous',
    component: UnitFolderComponent,
  }, {
    path: 'next',
    component: UnitFolderComponent,
  },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        MatTooltipModule,
      ],
      declarations: [UnitFolderComponent],
      providers: [
        ContentPlayerService
      ]
    })
      .compileComponents();
    location = TestBed.inject(Location);
    storageService = TestBed.inject(StorageService);
    contentPlayerService = TestBed.inject(ContentPlayerService);
    const spyGet = spyOn(storageService, 'get');
    const elementResponse = {
      "title": "Unit 5 - Mba",
      "elementId": "5b47b573-9fba-429b-8be0-01bda7fba464",
      "type": "Unit",
      "createdOn": "2021-10-08T06:10:51.310Z",
      "updatedOn": "2021-10-08T06:10:51.310Z",
      "status": "published",
      "publishedOn": "2021-10-14T06:52:08.870Z",
      "description": {
        "changingThisBreaksApplicationSecurity": "<p>na</p>"
      },
      "visibilityCriteria": false,
      "banner": "",
      "bannerFileName": "moon.jpg",
      "previousElement": {
        "title": "Test Folder001"
      },
      "nextElement": {
        "title": "unit after deployment edit"
      },
      "lastAccessedTime": null
    };
    await spyGet.withArgs(StorageKey.ELEMENT_DETAIL).and.returnValue(elementResponse);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to previous content', async () => {
    spyOn(contentPlayerService, 'getPreviousElement').withArgs(component.courseId, component.contentId).and.returnValue(Promise.resolve({
      body: {
        elementId: 'previous',
      }
    }));
    spyOn(component, 'getPreviousElement').and.callThrough();

    await component.getPreviousElement();
    fixture.detectChanges();

    expect(component.getPreviousElement).toHaveBeenCalled();
    expect(location.path()).toBe('/previous');
  });

  it('should navigate to next content', async () => {
    spyOn(contentPlayerService, 'getNextElement').withArgs(component.courseId, component.contentId).and.returnValue(Promise.resolve({
      body: {
        elementId: 'next',
      }
    }));
    spyOn(component, 'getNextElement').and.callThrough();
    await component.getNextElement();

    fixture.detectChanges();

    expect(component.getNextElement).toHaveBeenCalled();
    expect(location.path()).toBe('/next');
  });
});
