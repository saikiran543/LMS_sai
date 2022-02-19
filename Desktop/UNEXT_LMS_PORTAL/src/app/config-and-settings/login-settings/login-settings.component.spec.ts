import { ToastrModule, ToastrService } from 'ngx-toastr';
/* eslint-disable max-lines-per-function */
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { LoginSettingsComponent } from './login-settings.component';
import translations from '../../../assets/i18n/en.json';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWTService } from 'src/app/services/jwt.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginSettingService } from 'src/app/services/login.setting.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

export class MockNgbModalRef {
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

describe('LoginSettingsComponent', () => {
  let component: LoginSettingsComponent;
  let fixture: ComponentFixture<LoginSettingsComponent>;
  let translate: TranslateService;
  let service: LoginSettingService;
  let modalService: NgbModal;
  const mockModalRef: MockNgbModalRef = new MockNgbModalRef();
  const mockModalRefNo: MockNgbModalRefNo = new MockNgbModalRefNo();
  let toastrService: ToastrService;
  const expectedResult = {
    apiBaseUrl: "https://edunxtdev01.unext.tech",
    bannerHash: "7233c3cd4ed761e65247daa1115ab34ee4965c501126b908148cbac8a14be663",
    bannerImageUrl: "https://edunxtdev01.unext.tech/api/configservice/domainconfiguration/imagecontent/loginBannerImageContent?orgId=capgemini&hash=70f34bbf9edfe2857ebf916023c4ef3926c0ac5ad0257792295fa4d6a39fc565",
    bannerOnHover: "Test banner on hover",
    brandingBannerHorizontalImageHash: "8011599481619e57a07de0316899f05766f985c866511008fb3850cdd967dd8e",
    brandingBannerHorizontalSplitImageHash: "c3e49f28afcd420ccaef4086a18747a96ebc593c0a059614e58abb0afbab09a5",
    brandingBannerVerticalImageHash: "c54d024ae499baf0f46ac7c6e4c267385e0eba971261106e95eae99a40370d8a",
    forgotPasswordBannerImageHash: "24211ce2a57701104e55b50dc105ec7d951a89ab8af21abe71a3ec5fa5399462",
    headerTextOnHover: "Welcome to unext edit",
    loginBannerImageHash: {
      default: true,
      value: "70f34bbf9edfe2857ebf916023c4ef3926c0ac5ad0257792295fa4d6a39fc565"
    },
    logoBannerImageHash: "eb255e47f169ea5d3ef6dbad6a03871d5d7986120e6c7fc7d7965dde1ab3e251",
    logoHash: "121dd371bc7030ce2fd63bdb8ef945276960e179bd979ded718aa8ca6d7e355d",
    logoImageHash: {
      default: true,
      value: "0ba181ec166934ba9386d381b6f6e3d576ac60b309a70cd956cad7f50519b782"
    },
    logoImageUrl: "https://edunxtdev01.unext.tech/api/configservice/domainconfiguration/imagecontent/logoImageContent?orgId=capgemini&hash=0ba181ec166934ba9386d381b6f6e3d576ac60b309a70cd956cad7f50519b782",
    logoOnHover: "http://unext.comm",
    logoRedirectUrl: "http://unext.com",
    orgId: "capgemini",
    poweredByLogo: true,
    ssoText: "SSO edit",
    supportText: "Support text",
    welcomeText: "To UNext Learning Portal edit",
    welcomeTextOnHover: "To UNext Learning Portal",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
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
        LoginSettingsComponent,
        FileUploadComponent
      ],
      providers: [
        TranslateService,
        JWTService,
        NgbActiveModal,
        LoginSettingService,
        NgbModal
      ]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(LoginSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    service = TestBed.inject(LoginSettingService);
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
    expect(compiled.querySelector('.login-header').textContent).toContain('Header');
    expect(compiled.querySelector('.login-logo-url').textContent).toContain('Logo Click URL');
    expect(compiled.querySelector('.logo-welcome-text').textContent).toContain('Welcome Text');
    expect(compiled.querySelector('.login-sso-text').textContent).toContain('SSO Text');
    expect(compiled.querySelector('.login-support-text').textContent).toContain('Support Text');
    expect(compiled.querySelector('.login-display-logo').textContent).toContain('Display UNext Logo');
    expect(compiled.querySelector('.login-clear-button').textContent).toContain('Clear Changes');
    expect(compiled.querySelector('.login-preview-button').textContent).toContain('Preview');
    expect(compiled.querySelector('.preview-msg-note').textContent).toContain('You have to preview the page to publish. Click on the Preview button below if you want to publish the changes');
  });

  it('should render input elements', async () => {
    const compiled = fixture.debugElement.nativeElement;
    const header = compiled.querySelector('input[name="header"]');
    const logoUrl = compiled.querySelector('input[name="logoUrl"]');
    const welcomeText = compiled.querySelector('input[name="welcomeText"]');
    const ssoText = compiled.querySelector('input[name="ssoText"]');
    const supportText = compiled.querySelector('input[name="supportText"]');
    const displayLogo = compiled.querySelector('input[name="displayLogo"]');
    expect(header).toBeTruthy();
    expect(logoUrl).toBeTruthy();
    expect(welcomeText).toBeTruthy();
    expect(ssoText).toBeTruthy();
    expect(supportText).toBeTruthy();
    expect(displayLogo).toBeTruthy();
    expectedResult.logoImageHash.default = false;
    expectedResult.loginBannerImageHash.default = false;
    await component.ngOnInit();
  });

  it('Form validation errors test', async () => {
    const header = component.form.controls['header'];
    const logoUrl = component.form.controls['logoUrl'];
    const welcomeText = component.form.controls['welcomeText'];
    const ssoText = component.form.controls['welcomeText'];
    const supportText = component.form.controls['welcomeText'];

    header.setValue("");
    logoUrl.setValue("");
    welcomeText.setValue("");
    fixture.detectChanges();

    expect(header.valid).toBeFalsy();
    expect(logoUrl.valid).toBeFalsy();
    expect(welcomeText.valid).toBeFalsy();

    let headerErrors = header.errors || {};
    let logoUrlErrors = header.errors || {};
    let welcomeTextErrors = header.errors || {};
    let ssoTextErrors = header.errors || {};
    let supportTextErrors = header.errors || {};

    expect(headerErrors['required']).toBeTruthy();
    expect(logoUrlErrors['required']).toBeTruthy();
    expect(welcomeTextErrors['required']).toBeTruthy();

    header.setValue("asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf ");
    logoUrl.setValue("sample text");
    welcomeText.setValue("asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf ");
    ssoText.setValue("asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf ");
    supportText.setValue("asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf ");
    fixture.detectChanges();
    headerErrors = header.errors || {};
    logoUrlErrors = logoUrl.errors || {};
    welcomeTextErrors = welcomeText.errors || {};
    ssoTextErrors = ssoText.errors || {};
    supportTextErrors = supportText.errors || {};
    expect(headerErrors['maxlength']).toBeTruthy();
    expect(logoUrlErrors['pattern']).toBeTruthy();
    expect(welcomeTextErrors['maxlength']).toBeTruthy();
    expect(ssoTextErrors['maxlength']).toBeTruthy();
    expect(supportTextErrors['maxlength']).toBeTruthy();
  });

  it("logoFileSaveHandler: should return false", async () => {
    expect(component.logoFileSaveHandler({ cropped: '', original: '' })).toBeFalsy();
  });

  it("logoFileSaveHandler: should return true", async () => {
    const params = { cropped: 'sampleBase64Text', original: 'sampleBase64TextOriginal' };
    expect(component.logoFileSaveHandler(params)).toBeTruthy();
    expect(component.logoImageSrc).toEqual(params.cropped);
    expect(component.croppedLogo).toEqual(params.cropped);
    expect(component.logoOriginalImageSrc).toEqual(params.original);
    expect(component.showLogoUpload).toBeFalsy();
    expect(component.showEditLogo).toBeTruthy();
    expect(component.logoSavedImage).toEqual('');
  });

  it("bannerFileSaveHandler: should return false", async () => {
    expect(component.bannerFileSaveHandler({ cropped: '', original: '' })).toBeFalsy();
  });

  it("bannerFileSaveHandler: should return true", async () => {
    const params = { cropped: 'sampleBase64Text', original: 'sampleBase64TextOriginal' };
    expect(component.bannerFileSaveHandler(params)).toBeTruthy();
    expect(component.bannerImageSrc).toEqual(params.cropped);
    expect(component.croppedBanner).toEqual(params.cropped);
    expect(component.bannerOriginalImageSrc).toEqual(params.original);
    expect(component.showBannerUpload).toBeFalsy();
    expect(component.showEditBanner).toBeTruthy();
    expect(component.bannerSavedImage).toEqual('');
  });

  it("login settings form: should return actual character left", fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;

    const header = component.form.controls['header'];
    const welcomeText = component.form.controls['welcomeText'];
    const ssoText = component.form.controls['ssoText'];
    const supportText = component.form.controls['supportText'];

    header.setValue("");
    welcomeText.setValue("");
    ssoText.setValue("");
    supportText.setValue("");
    tick();
    fixture.detectChanges();

    expect(compiled.querySelector('.header-text-count').textContent).toContain('Max of ' + component.headerTextLengthMax + ' Characters');
    expect(compiled.querySelector('.welcome-text-count').textContent).toContain('Max of ' + component.welcomeTextLengthMax + ' Characters');
    expect(compiled.querySelector('.sso-text-count').textContent).toContain('Max of ' + component.ssoTextLengthMax + ' Characters');
    expect(compiled.querySelector('.support-text-count').textContent).toContain('Max of ' + component.supportTextLengthMax + ' Characters');

    const text = "hello";
    header.setValue(text);
    welcomeText.setValue(text);
    ssoText.setValue(text);
    supportText.setValue(text);
    tick();
    fixture.detectChanges();

    expect(compiled.querySelector('.header-text-count').textContent).toContain((component.headerTextLengthMax - header.value.length) + ' Characters Left');
    expect(compiled.querySelector('.welcome-text-count').textContent).toContain((component.welcomeTextLengthMax - welcomeText.value.length) + ' Characters Left');
    expect(compiled.querySelector('.sso-text-count').textContent).toContain((component.ssoTextLengthMax - ssoText.value.length) + ' Characters Left');
    expect(compiled.querySelector('.support-text-count').textContent).toContain((component.supportTextLengthMax - supportText.value.length) + ' Characters Left');
  }));

  it("showPreview: should check set value", async () => {
    const header = component.form.controls['header'];
    header.setValue("Header Text");
    fixture.detectChanges();
    component.croppedLogo = 'base64Data';
    component.croppedBanner = 'base64Data';
    spyOn(service, 'set');
    await component.showPreview();
    spyOn(service, 'get').and.returnValue("Header Text");
    expect(service.get("headerText")).toEqual("Header Text");
    expect(component.showPreviewComponent).toBeTruthy();
    component.croppedLogo = '';
    component.croppedBanner = '';
    component.form.controls['ssoText'].setValue("");
    component.form.controls['supportText'].setValue("");
    component.form.controls['displayLogo'].setValue(true);
    fixture.detectChanges();
    await component.showPreview();
  });

  it("showPreview: should show error", async () => {
    const header = component.form.controls['header'];
    header.setValue("");
    fixture.detectChanges();
    await component.showPreview();
    expect(toastrService.error.call.length).toEqual(1);
  });

  it("editLogoImage: should be validated", async () => {
    const base64 = "TestBase64String";
    component.logoOriginalImageSrc = base64;
    component.editLogoImage();
    expect(component.logoSavedImage).toEqual(base64);
  });

  it("editBannerImage: should be validated", async () => {
    const base64 = "TestBase64String";
    component.bannerOriginalImageSrc = base64;
    component.editBannerImage();
    expect(component.bannerSavedImage).toEqual(base64);
  });

  it("uploadNewLogo: should be validated", async () => {
    component.uploadNewBanner();
    expect(component.showBannerUpload).toBeTruthy();
  });

  it("clearChangesConfirm: should be validated Yes", async () => {
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

  it("saveSettings success: should be validated", fakeAsync(() => {
    spyOn(service, 'updateImage').and.resolveTo(true);
    spyOn(service, 'publish').and.resolveTo(true);
    component.saveSettings('back');
    expect(component.showPreviewComponent).toBeFalsy();
    component.reloadPage = () => {
      //empty reload
    };
    component.croppedLogo = 'base64, SampleBase64';
    component.croppedBanner = 'base64, SampleBase64';
    component.saveSettings('publish');
    expect(component.showPreviewComponent).toBeFalsy();

    expect(toastrService.success.call.length).toEqual(1);
    component.saveCalled = true;
    component.saveSettings('publish');
    flush();
  }));

  it("saveSettings success: should be validated", fakeAsync(() => {
    spyOn(service, 'updateImage').and.resolveTo(true);
    spyOn(service, 'publish').and.resolveTo(true);
    component.croppedLogo = 'base64, SampleBase64';
    component.croppedBanner = 'base64, SampleBase64';
    component.reloadPage = () => {
      //empty reload
    };
    component.saveSettings('publish');
    expect(component.showPreviewComponent).toBeFalsy();

    expect(toastrService.success.call.length).toEqual(1);
    flush();
  }));

  it("saveSettings failed: should be validated", async () => {
    spyOn(service, 'publish').and.resolveTo(false);
    await component.saveSettings('publish');
    expect(toastrService.error.call.length).toEqual(1);
  });

  it("logoDeleteConfirm: should be validated Yes", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(service, 'deleteImage').and.resolveTo(true);
    component.reloadPage = () => {
      //empty reload
    };
    component.logoDeleteConfirm();
    expect(component.reloadPage.call.length).toEqual(1);
    expect(mockModalRef.close.call.length).toEqual(1);
  });

  it("logoDeleteConfirm: should be validated Yes false result", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(service, 'deleteImage').and.resolveTo(false);
    component.logoDeleteConfirm();
    expect(mockModalRef.close.call.length).toEqual(1);
  });

  it("logoDeleteConfirm: should be validated selected logo delete", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(service, 'deleteImage').and.resolveTo(true);
    component.croppedLogo = 'base64image';
    component.initialLogo = 'initialBase64';
    component.reloadPage = () => {
      //empty reload
    };
    component.logoDeleteConfirm();
    expect(component.croppedLogo).toEqual('');
    expect(component.logoImageSrc).toEqual(component.initialLogo);
    expect(component.showLogoUpload).toBeTruthy();
  });

  it("logoDeleteConfirm: should be validated No", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRefNo as any);
    component.logoDeleteConfirm();
    expect(mockModalRef.close.call.length).toEqual(1);
  });

  it("bannerDeleteConfirm: should be validated Yes", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(service, 'deleteImage').and.resolveTo(true);
    component.reloadPage = () => {
      //empty reload
    };
    component.bannerDeleteConfirm();
    expect(component.reloadPage.call.length).toEqual(1);
    expect(mockModalRef.close.call.length).toEqual(1);
  });

  it("bannerDeleteConfirm: should be validated Yes false result", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(service, 'deleteImage').and.resolveTo(false);
    component.bannerDeleteConfirm();
    expect(mockModalRef.close.call.length).toEqual(1);
  });

  it("bannerDeleteConfirm: should be validated No", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRefNo as any);
    component.bannerDeleteConfirm();
    expect(mockModalRef.close.call.length).toEqual(1);
  });

  it("bannerDeleteConfirm: should be validated selected banner delete", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(service, 'deleteImage').and.resolveTo(true);
    component.croppedBanner = 'base64image';
    component.initialBanner = 'initialBase64';
    component.reloadPage = () => {
      //empty reload
    };
    component.bannerDeleteConfirm();
    expect(component.croppedBanner).toEqual('');
    expect(component.bannerImageSrc).toEqual(component.initialBanner);
    expect(component.showBannerUpload).toBeTruthy();
  });

  it("uploadNewLogo: should be validated", () => {
    component.uploadNewLogo();
    expect(component.showLogoUpload).toBeTruthy();
  });

  it("closeToast: should be validated", () => {
    component.closeToast();
    expect(component.validationToast).toBeFalsy();
    expect(component.publishFailToast).toBeFalsy();
    expect(component.publishSuccessToast).toBeFalsy();
  });

});
