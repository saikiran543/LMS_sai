/* eslint-disable max-lines-per-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { ResolutionKey } from './enums/resolutionKey';
import { ScreenSizeKey } from './enums/screenSizeKey';
import { StorageKey } from './enums/storageKey';
import { StorageService } from './services/storage.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let storageService: StorageService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        AppComponent
      ],
      providers: [TranslateService, StorageService]
    }).compileComponents();
    storageService = TestBed.inject(StorageService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'lms-portal'`, () => {
    expect(component.title).toEqual('lms-portal');
  });

  it('should call onResize', () => {
    component.onResize();
    if (window.innerWidth > ResolutionKey.XL_MONITOR) {
      expect(storageService.get(StorageKey.CURRENT_DEVICE)).toEqual(ScreenSizeKey.XL_MONITOR);
    } else if (window.innerWidth <= ResolutionKey.XL_MONITOR && window.innerWidth > ResolutionKey.WEB_APP) {
      expect(storageService.get(StorageKey.CURRENT_DEVICE)).toEqual(ScreenSizeKey.WEB_APP);
    } else if (window.innerWidth <= ResolutionKey.WEB_APP && window.innerWidth > ResolutionKey.TABLET) {
      expect(storageService.get(StorageKey.CURRENT_DEVICE)).toEqual(ScreenSizeKey.TABLET);
    } else if (window.innerWidth <= ResolutionKey.TABLET && window.innerWidth > 0) {
      expect(storageService.get(StorageKey.CURRENT_DEVICE)).toEqual(ScreenSizeKey.MOBILE);
    }
  });

  it('should call onResize', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onResize();
    if (window.innerWidth > ResolutionKey.XL_MONITOR) {
      expect(storageService.get(StorageKey.CURRENT_DEVICE)).toEqual(ScreenSizeKey.XL_MONITOR);
    } else if (window.innerWidth <= ResolutionKey.XL_MONITOR && window.innerWidth > ResolutionKey.WEB_APP) {
      expect(storageService.get(StorageKey.CURRENT_DEVICE)).toEqual(ScreenSizeKey.WEB_APP);
    } else if (window.innerWidth <= ResolutionKey.WEB_APP && window.innerWidth > ResolutionKey.TABLET) {
      expect(storageService.get(StorageKey.CURRENT_DEVICE)).toEqual(ScreenSizeKey.TABLET);
    } else if (window.innerWidth <= ResolutionKey.TABLET && window.innerWidth > 0) {
      expect(storageService.get(StorageKey.CURRENT_DEVICE)).toEqual(ScreenSizeKey.MOBILE);
    }
  });
});
