import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingSettingsComponent } from './branding-settings.component';
import translations from '../../../assets/i18n/en.json';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal, NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { JWTService } from 'src/app/services/jwt.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrandingSettingService } from 'src/app/services/branding.setting.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
export class MockNgbModalRefYes {
  componentInstance = {
    confirmStatus: of(true),
    params: {
      message: '',
      confirmBtn: '',
      cancelBtn: ''
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Promise<any> = new Promise((resolve) => resolve(true));

  close(): void {
    // mock function
  }
}

export class MockNgbModalRefNo {
  componentInstance = {
    confirmStatus: of(false),
    params: {
      message: '',
      confirmBtn: '',
      cancelBtn: ''
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Promise<any> = new Promise((resolve) => resolve(true));

  close(): void {
    // mock function
  }
}

// eslint-disable-next-line max-lines-per-function
describe('BrandingSettingsComponent', () => {
  let component: BrandingSettingsComponent;
  let fixture: ComponentFixture<BrandingSettingsComponent>;
  let translate: TranslateService;
  let service: BrandingSettingService;
  let modalService: NgbModal;
  const mockModalRef: MockNgbModalRefYes = new MockNgbModalRefYes();
  const mockModalRefNo: MockNgbModalRefNo = new MockNgbModalRefNo();
  let toastrService: ToastrService;

  const expectedResult = {
    orgId: 'capgemini',
    announcementMessage: 'new alert',
    announcementStatus: false,
    backgroundImageUrl: 'test.com',
    bannerType: 'vertical',
    greetingsText: "You will enter into your personalized learning world now..",
    headerText: "Hello, ",
    horizontalBanner: 'assets/images/icons/card-layout-img.png',
    horizontalSplitBanner: 'assets/images/icons/horizontal-layout-img.png',
    poweredByUnextLogo: true,
    profilePic: 'assets/images/icons/icon-profile-avatar.png',
    screenDuration: '5',
    verticalBanner: 'assets/images/icons/vertical-layout-img.png',
    brandingBannerVerticalImage: 'abcd/api/configservice/domainconfiguration/imagecontent/brandingBannerVerticalImageContent?orgId=capgemini&hash=d3b12179f96f602fe3c879a92810526a7f4b0abce499d0bf22d6bacdf48f3c9f',
    brandingBannerHorizontalImage: 'abcd/api/configservice/domainconfiguration/imagecontent/brandingBannerHorizontalImageContent?orgId=capgemini&hash=d3b12179f96f60r435gsdgsd9a92810526a7f4b0abce499d0bf22d6bacdf48f3c9f',
    brandingBannerHorizontalSplitImage: 'abcd/api/configservice/domainconfiguration/imagecontent/brandingBannerHorizontalSplitImageContent?orgId=capgemini&hash=sdf345hfdgsdff5gsdgsd9a92810526a7f4b0abce499d0bf22d6bacdf48f3c9f',
    brandingBannerVerticalImageHash: {
      default: true,
      value: 'd3b12179f96f602fe3c879a92810526a7f4b0abce499d0bf22d6bacdf48f3c9f'
    },
    brandingBannerHorizontalImageHash: {
      default: true,
      value: 'd3b12179f96f60r435gsdgsd9a92810526a7f4b0abce499d0bf22d6bacdf48f3c9f'
    },
    brandingBannerHorizontalSplitImageHash: {
      default: true,
      value: 'sdf345hfdgsdff5gsdgsd9a92810526a7f4b0abce499d0bf22d6bacdf48f3c9f'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgbNavModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })],
      declarations: [
        BrandingSettingsComponent,
        FileUploadComponent
      ],
      providers: [
        TranslateService,
        JWTService,
        NgbActiveModal
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(BrandingSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    service = TestBed.inject(BrandingSettingService);
    modalService = TestBed.inject(NgbModal);
    toastrService = TestBed.inject(ToastrService);

    spyOn(service, 'initializeData');
    const spyGetWholeConfiguration = spyOn(service, 'getWholeConfiguration');

    spyGetWholeConfiguration.and.returnValue(expectedResult);
    await component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render expected html', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.for-web').textContent).toContain('For Web');
    expect(compiled.querySelector('.web-title').textContent).toContain('Banner Type');
    expect(compiled.querySelector('.web-vertical').textContent).toContain('Branding - Vertical');
    expect(compiled.querySelector('.web-horizontal').textContent).toContain('Branding - Horizontal');
    expect(compiled.querySelector('.web-horizontal-split').textContent).toContain('Branding - Horizontal Split');
    expect(compiled.querySelector('.web-header-text').textContent).toContain('Header Text');
    expect(compiled.querySelector('.web-greetings-text').textContent).toContain('Greetings Text');
    expect(compiled.querySelector('.web-screen-duration-title').textContent).toContain('Screen Duration');
    expect(compiled.querySelector('.web-announcement').textContent).toContain('Announcement');
    expect(compiled.querySelector('.web-display-logo').textContent).toContain('Display UNext Logo');
    expect(compiled.querySelector('.web-note').textContent).toContain('Note');
    expect(compiled.querySelector('.web-note-text').textContent).toContain('You have to preview the page to publish. Click on the Preview button below if you want to publish the changes');
    expect(compiled.querySelector('.web-clear-button').textContent).toContain('Clear Changes');
  });

  it('should render input elements', async () => {
    const compiled = fixture.debugElement.nativeElement;
    expectedResult.announcementStatus = true;
    expectedResult.brandingBannerVerticalImageHash.default = false;
    expectedResult.brandingBannerHorizontalImageHash.default = false;
    expectedResult.brandingBannerHorizontalSplitImageHash.default = false;
    await component.ngOnInit();
    const bannerType = compiled.querySelector('input[name="bannerType"]');
    const header = compiled.querySelector('input[name="header"]');
    const greetings = compiled.querySelector('input[name="greetings"]');
    const screenDuration = compiled.querySelector('select[name="screenDuration"]');
    const announcementActive = compiled.querySelector('input[name="announcementActive"]');
    const announcement = compiled.querySelector('input[name="announcement"]');
    const displayLogo = compiled.querySelector('input[name="displayLogo"]');
    expect(bannerType).toBeTruthy();
    expect(header).toBeTruthy();
    expect(greetings).toBeTruthy();
    expect(screenDuration).toBeTruthy();
    expect(announcementActive).toBeTruthy();
    expect(announcement).toBeTruthy();
    expect(displayLogo).toBeTruthy();
  });

  // eslint-disable-next-line max-lines-per-function
  it('Web form validation errors test', () => {
    const bannerType = component.form.controls['bannerType'];
    const header = component.form.controls['header'];
    const screenDuration = component.form.controls['screenDuration'];
    const greetings = component.form.controls['greetings'];
    const announcementActive = component.form.controls['announcementActive'];
    const announcement = component.form.controls['announcement'];

    bannerType.setValue("");
    header.setValue("");
    screenDuration.setValue("");
    greetings.setValue("");
    announcementActive.setValue(false);
    announcement.setValue("");
    fixture.detectChanges();

    expect(bannerType.valid).toBeFalsy();
    expect(header.valid).toBeFalsy();
    expect(screenDuration.valid).toBeFalsy();
    expect(greetings.valid).toBeFalsy();

    const bannerTypeErrors = bannerType.errors || {};
    let headerErrors = header.errors || {};
    const screenDurationErrors = screenDuration.errors || {};
    let greetingsErrors = greetings.errors || {};

    expect(bannerTypeErrors['required']).toBeTruthy();
    expect(headerErrors['required']).toBeTruthy();
    expect(screenDurationErrors['required']).toBeTruthy();
    expect(greetingsErrors['required']).toBeTruthy();

    header.setValue("asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf ");
    greetings.setValue("asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf ");
    fixture.detectChanges();
    headerErrors = header.errors || {};
    greetingsErrors = greetings.errors || {};
    expect(headerErrors['maxlength']).toBeTruthy();
    expect(greetingsErrors['maxlength']).toBeTruthy();
  });

  it('getWebBrandingImageUrl: should return proper values', () => {
    component.formInitialValues = expectedResult;
    expect(component.getWebBrandingImageUrl('vertical')).toEqual(expectedResult.brandingBannerVerticalImage);
    expect(component.getWebBrandingImageUrl('horizontal')).toEqual(expectedResult.brandingBannerHorizontalImage);
    expect(component.getWebBrandingImageUrl('horizontalSplit')).toEqual(expectedResult.brandingBannerHorizontalSplitImage);
    expect(component.getWebBrandingImageUrl('wrong')).toEqual('');
  });

  it('setWebBannerDimension: should set proper values', async () => {
    const bannerType = component.form.controls['bannerType'];
    bannerType.setValue("");
    fixture.detectChanges();

    bannerType.setValue("vertical");
    fixture.detectChanges();
    expect(component.brandingWebWidth).toEqual(component.brandingVerticalWidth);
    expect(component.brandingWebHeight).toEqual(component.brandingVerticalHeight);

    expectedResult.bannerType = 'horizontal';
    await component.ngOnInit();
    bannerType.setValue("horizontal");
    fixture.detectChanges();
    expect(component.brandingWebWidth).toEqual(component.brandingHorizontalWidth);
    expect(component.brandingWebHeight).toEqual(component.brandingHorizontalHeight);

    expectedResult.bannerType = 'horizontalSplit';
    await component.ngOnInit();
    bannerType.setValue("horizontalSplit");
    fixture.detectChanges();
    expect(component.brandingWebWidth).toEqual(component.brandingHorizontalSplitWidth);
    expect(component.brandingWebHeight).toEqual(component.brandingHorizontalSplitHeight);
  });

  // it('setMobBannerDimension: should set proper values', () => {
  //   const bannerType = component.mobForm.controls['mobBannerType'];
  //   bannerType.setValue("");
  //   fixture.detectChanges();

  //   bannerType.setValue("fullScreen");
  //   fixture.detectChanges();
  //   expect(component.brandingMobWidth).toEqual(component.webBrandingFullWidth);
  //   expect(component.brandingMobHeight).toEqual(component.webBrandingFullHeight);

  //   bannerType.setValue("horizontalSplit");
  //   fixture.detectChanges();
  //   expect(component.brandingMobWidth).toEqual(component.webBrandingHorizontalSplitWidth);
  //   expect(component.brandingMobHeight).toEqual(component.webBrandingHorizontalSplitHeight);
  // });

  it('brandingImageSaveHandler: Should be valid on empty', () => {
    const event = {
      "cropped": "",
      "original": ""
    };
    component.brandingImageSaveHandler(event);
    expect(component.bannerSavedImage).toEqual('');
    expect(component.brandingImageSrc).not.toEqual('');
  });

  it('mobBrandingImageSaveHandler: Should be valid on empty', () => {
    const event = {
      "cropped": "",
      "original": ""
    };
    component.mobBrandingImageSaveHandler(event);
    expect(component.mobBannerSavedImage).toEqual('');
    expect(component.mobBrandingImageSrc).toEqual('');
    expect(component.showMobBrandingUpload).toBeFalsy();
  });

  it('brandingImageSaveHandler: Should be valid with data', () => {
    const event = {
      "cropped": "sampleBase64",
      "original": "sampleBase64"
    };
    component.brandingImageSaveHandler(event);
    expect(component.brandingImageSrc).toEqual(event.cropped);
    expect(component.bannerCroppedImage).toEqual(event.cropped);
    expect(component.brandingOriginalImageSrc).toEqual(event.original);
    expect(component.showBrandingUpload).toBeFalsy();
    expect(component.showWebEditBranding).toBeTruthy();
    expect(component.bannerSavedImage).toEqual('');
  });

  it("branding web form: should return actual character left", () => {
    const compiled = fixture.debugElement.nativeElement;

    const header = component.form.controls['header'];
    const greeting = component.form.controls['greetings'];
    const announcementActive = component.form.controls['announcementActive'];
    const announcement = component.form.controls['announcement'];
    const mobAnnouncementActive = component.mobForm.controls['mobAnnouncementActive'];

    header.setValue("");
    greeting.setValue("");
    announcementActive.setValue(true);
    mobAnnouncementActive.setValue(true);
    announcement.setValue("");
    fixture.detectChanges();

    expect(compiled.querySelector('.web-header-count').textContent).toContain('Max of ' + component.headerLengthMax + ' Characters');
    expect(compiled.querySelector('.web-greeting-count').textContent).toContain('Max of ' + component.greetingsLengthMax + ' Characters');
    expect(compiled.querySelector('.web-announcement-count').textContent).toContain('Max of ' + component.announcementLengthMax + ' Characters');

    const text = "hello";
    header.setValue(text);
    greeting.setValue(text);
    announcement.setValue(text);
    fixture.detectChanges();

    expect(compiled.querySelector('.web-header-count').textContent).toContain((component.headerLengthMax - header.value.length) + ' Characters Left');
    expect(compiled.querySelector('.web-greeting-count').textContent).toContain((component.greetingsLengthMax - greeting.value.length) + ' Characters Left');
    expect(compiled.querySelector('.web-announcement-count').textContent).toContain((component.announcementLengthMax - announcement.value.length) + ' Characters Left');
  });

  it("webBannerDeleteConfirm: should be valid", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(service, 'deleteImage').and.resolveTo(true);
    component.reloadPage = () => {
      //empty reload
    };
    component.webBannerDeleteConfirm();
    mockModalRef.componentInstance.confirmStatus.subscribe(val => {
      expect(val).toEqual(true);
      expect(mockModalRef.close.call.length).toEqual(1);
    });
  });

  it("webBannerDeleteConfirm: should be validated selected logo delete", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(service, 'deleteImage').and.resolveTo(true);
    component.bannerCroppedImage = 'base64image';
    component.reloadPage = () => {
      //empty reload
    };
    component.imageSaveType = 'brandingBannerVerticalImage';
    component.webBannerDeleteConfirm();
    expect(component.bannerCroppedImage).toEqual('');
    expect(component.showBrandingUpload).toBeTruthy();
  });

  it("webBannerDeleteConfirm: should be validated selected logo delete No", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRefNo as any);
    component.bannerCroppedImage = 'base64image';
    component.webBannerDeleteConfirm();
    expect(mockModalRef.close.call.length).toEqual(1);
  });

  it("webBannerDeleteConfirm: should be validated selected logo delete", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(service, 'deleteImage').and.resolveTo(true);
    component.bannerCroppedImage = 'base64image';
    component.reloadPage = () => {
      //empty reload
    };
    component.imageSaveType = 'brandingBannerHorizontalImage';
    component.webBannerDeleteConfirm();
    expect(component.bannerCroppedImage).toEqual('');
    expect(component.showBrandingUpload).toBeTruthy();
  });

  it("webBannerDeleteConfirm: should be validated selected logo delete", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(service, 'deleteImage').and.resolveTo(true);
    component.bannerCroppedImage = 'base64image';
    component.reloadPage = () => {
      //empty reload
    };
    component.imageSaveType = 'brandingBannerHorizontalSplitImage';
    component.webBannerDeleteConfirm();
    expect(component.bannerCroppedImage).toEqual('');
    expect(component.showBrandingUpload).toBeTruthy();
  });

  it("editWebBannerImage: Should be valid", () => {
    const base64 = "sampleBase64";
    component.brandingOriginalImageSrc = base64;
    component.editWebBannerImage();
    expect(component.bannerSavedImage).toEqual(component.brandingOriginalImageSrc);
  });

  it("uploadNewWebBannerImage: Should be valid", () => {
    component.uploadNewWebBannerImage();
    expect(component.showBrandingUpload).toBeTruthy();
  });

  it("showPreview: should check set value", async () => {
    const header = component.form.controls['header'];
    header.setValue("Header Text");
    fixture.detectChanges();
    spyOn(service, 'set');
    component.bannerCroppedImage = 'base64Image';
    component.form.controls['announcementActive'].setValue(false);
    fixture.detectChanges();
    await component.showPreview();
    // eslint-disable-next-line require-atomic-updates
    component.bannerCroppedImage = '';
    component.form.controls['announcementActive'].setValue(true);
    fixture.detectChanges();
    await component.showPreview();
    spyOn(service, 'get').and.returnValue("Header Text");
    expect(service.get("headerText")).toEqual("Header Text");
    expect(component.showPreviewComponent).toBeTruthy();

  });

  it("showPreview: should show toastr on error", async () => {
    const header = component.form.controls['header'];
    header.setValue("");
    await component.showPreview();
    expect(toastrService.error.call.length).toEqual(1);
  });

  it("saveSettings back button: should be validated", async () => {
    await component.saveSettings('back');
    expect(component.showPreviewComponent).toBeFalsy();
  });

  it("saveSettings success: should be validated", async () => {
    spyOn(service, 'updateImage').and.resolveTo(true);
    spyOn(service, 'publish').and.resolveTo(true);
    component.bannerCroppedImage = 'base64, SampleBase64';
    component.reloadPage = () => {
      //empty reload
    };
    await component.saveSettings('publish');
    expect(component.showPreviewComponent).toBeFalsy();
    expect(toastrService.success.call.length).toEqual(1);
    component.bannerCroppedImage = '';
    await component.saveSettings('publish');
  });

  it("saveSettings failed: should be validated", async () => {
    spyOn(service, 'updateImage').and.resolveTo(true);
    spyOn(service, 'publish').and.resolveTo(false);
    component.bannerCroppedImage = 'base64, SampleBase64';
    component.reloadPage = () => {
      //empty reload
    };
    await component.saveSettings('publish');
    expect(component.showPreviewComponent).toBeFalsy();
    expect(toastrService.error.call.length).toEqual(1);
    component.saveCalled = true;
    await component.saveSettings('publish');
  });

  it("clearChangesConfirm: should be validated", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    component.clearChangesConfirm();
    mockModalRef.componentInstance.confirmStatus.subscribe(() => {
      expect(mockModalRef.close.call.length).toEqual(1);
    });
  });

  it("clearChangesConfirm: should be validated No", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRefNo as any);
    component.clearChangesConfirm();
    mockModalRef.componentInstance.confirmStatus.subscribe(() => {
      expect(mockModalRef.close.call.length).toEqual(1);
    });
  });

  it("closeToast: should be validated", () => {
    component.closeToast();
    expect(component.validationToast).toBeFalsy();
    expect(component.publishFailToast).toBeFalsy();
    expect(component.publishSuccessToast).toBeFalsy();
  });

  // it('Web form validation errors test', fakeAsync(() => {
  //   const compiled = fixture.debugElement.nativeElement;
  //   const forMob = compiled.querySelector('.for-web');
  //   forMob.click();
  //   tick();
  //   const bannerType = component.mobForm.controls['mobBannerType'];
  //   const header = component.mobForm.controls['mobHeader'];
  //   const screenDuration = component.mobForm.controls['mobScreenDuration'];
  //   const greetings = component.mobForm.controls['mobGreetings'];
  //   const announcementActive = component.mobForm.controls['mobAnnouncementActive'];
  //   const announcement = component.mobForm.controls['mobAnnouncement'];

  //   bannerType.setValue("");
  //   header.setValue("");
  //   screenDuration.setValue("");
  //   greetings.setValue("");
  //   announcementActive.setValue(false);
  //   announcement.setValue("");
  //   fixture.detectChanges();
  //   expect(compiled.querySelector('.mob-announcement-text').disabled).toBeTruthy();

  //   announcementActive.setValue(true);
  //   fixture.detectChanges();
  //   expect(compiled.querySelector('.mob-announcement-text').disabled).toBeFalsy();

  //   expect(bannerType.valid).toBeFalsy();
  //   expect(header.valid).toBeFalsy();
  //   expect(screenDuration.valid).toBeFalsy();
  //   expect(greetings.valid).toBeFalsy();

  //   const bannerTypeErrors = bannerType.errors || {};
  //   let headerErrors = header.errors || {};
  //   const screenDurationErrors = screenDuration.errors || {};
  //   let greetingsErrors = greetings.errors || {};

  //   expect(bannerTypeErrors['required']).toBeTruthy();
  //   expect(headerErrors['required']).toBeTruthy();
  //   expect(screenDurationErrors['required']).toBeTruthy();
  //   expect(greetingsErrors['required']).toBeTruthy();

  //   header.setValue("asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf ");
  //   greetings.setValue("asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf ");
  //   fixture.detectChanges();
  //   headerErrors = header.errors || {};
  //   greetingsErrors = greetings.errors || {};
  //   expect(headerErrors['maxlength']).toBeTruthy();
  //   expect(greetingsErrors['maxlength']).toBeTruthy();
  // }));

  // check enable and disable on check box toggle

});
