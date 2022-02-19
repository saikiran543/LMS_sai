/* eslint-disable max-lines-per-function */
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed} from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StorageKey } from 'src/app/enums/storageKey';
import { ContentPlayerService } from 'src/app/learning-center/course-services/content-player.service';
import { LoginLayoutComponent } from 'src/app/login-layout/login-layout.component';
import { StorageService } from 'src/app/services/storage.service';
import { OtherAttachementsComponent } from './other-attachements.component';

describe('OtherAttachementsComponent', () => {
  let component: OtherAttachementsComponent;
  let fixture: ComponentFixture<OtherAttachementsComponent>;
  let contentPlayerService: ContentPlayerService;
  let storageService: StorageService;

  let location: Location;

  const routes: Routes = [{
    path: '',
    component: OtherAttachementsComponent,
  }, {
    path: 'login',
    component: LoginLayoutComponent,
  }, {
    path: 'previous',
    component: OtherAttachementsComponent,
  }, {
    path: 'next',
    component: OtherAttachementsComponent,
  },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
      ],
      declarations: [OtherAttachementsComponent],
      providers: [
        ContentPlayerService
      ]
    })
      .compileComponents();
      
    location = TestBed.inject(Location);
    storageService = TestBed.inject(StorageService);
    contentPlayerService = TestBed.inject(ContentPlayerService);
    const spyGet = spyOn(storageService, 'get');
    const elementResponse = { "elementId": "73ee8cab-4471-4b68-80ad-7ed74413861d", "type": "epub", "title": "Atomic Habits", "status": "published", "createdOn": "2021-10-07T11:18:32.627Z", "createdBy": "", "updatedOn": "2021-10-07T11:18:32.627Z", "updatedBy": "", "$__": { "strictMode": true, "selected": {}, "getters": {}, "_id": "615ed788f796210366df84ba", "wasPopulated": false, "activePaths": { "paths": { "createdOn": "init", "updatedOn": "init", "_id": "init", "elementId": "init", "contentType": "init", "description": "init", "contentStatus": "init", "allowDownload": "init", "offlineAccess": "init", "sendNotification": "init", "idealTime": "init", "visibilityCriteria": "init", "createdBy": "init", "updatedBy": "init", "fileUrl": "init", "s3FileName": "init", "originalFileName": "init","fileExtension": "init", "__v": "init"}, "states": { "ignore": {}, "default": {}, "init": { "_id": true, "createdOn": true, "updatedOn": true, "elementId": true, "contentType": true, "description": true, "contentStatus": true, "allowDownload": true, "offlineAccess": true, "sendNotification": true, "idealTime": true, "visibilityCriteria": true, "createdBy": true, "updatedBy": true, "fileUrl": true, "s3FileName": true, "originalFileName": true, "fileExtension": true, "__v": true }, "modify": {}, "require": {}}, "stateNames": ["require","modify","init","default","ignore"]}, "pathsToScopes": {}, "cachedRequired": {}, "session": null, "$setCalled": {}, "emitter": { "_events": {}, "_eventsCount": 0, "_maxListeners": 0}, "$options": { "skipId": true, "isNew": false, "willInit": true, "defaults": true}}, "isNew": false, "$locals": {}, "$op": null, "_doc": { "createdOn": "2021-10-07T11:18:32.616Z", "updatedOn": "2021-10-07T11:18:32.616Z", "_id": "615ed788f796210366df84ba", "elementId": "73ee8cab-4471-4b68-80ad-7ed74413861d", "contentType": "epub", "description": "<p>Learn and Build Atomic Habits</p>", "contentStatus": "mandatory", "allowDownload": false, "offlineAccess": false, "sendNotification": false, "idealTime": 255, "visibilityCriteria": false, "createdBy": "", "updatedBy": "", "fileUrl": "", "s3FileName": "865a1b17-c07b-4818-a7d0-349979485fe1.epub", "originalFileName": "Atomic Habits Tiny Changes, Remarkable Results by James Clear (z-lib.org).epub", "fileExtension": "epub", "__v": 0 }, "$init": true, "previousElement": { "title": "Epub sample file" }, "nextElement": { "title": "Test fonts"}};
    await spyGet.withArgs(StorageKey.ELEMENT_DETAIL).and.resolveTo(elementResponse);
  });

  beforeEach(async() => {
    fixture = TestBed.createComponent(OtherAttachementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await component.ngOnInit();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should show toolbar on hover', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('.content-player-content').dispatchEvent(new MouseEvent('mouseover'));
    expect(component.showHeaderFooter).toBe(true);
  });

  it('show hide toolbar on mouse out', () => {
    jasmine.clock().install();
    const compiled = fixture.debugElement.nativeElement;

    compiled.querySelector('.content-player-content').dispatchEvent(new MouseEvent('mouseout'));
    jasmine.clock().tick(4000);

    expect(component.showHeaderFooter).toBe(false);
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

  it('should download the content', async () => {
    spyOn(contentPlayerService, 'getSignedUrl').and.callFake(() => Promise.resolve({
      body: {
        url: ''
      }
    }));
    const windowSpy = spyOn(window, 'open');

    await component.downloadFile();

    expect(windowSpy).toHaveBeenCalledWith('');
  });
});
