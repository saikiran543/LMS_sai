import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginLayoutComponent } from './login-layout.component';
import { ConfigurationService } from '../services/configuration.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import translations from '../../assets/i18n/en.json';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

// eslint-disable-next-line max-lines-per-function
describe('LoginLayoutComponent', () => {
  let component: LoginLayoutComponent;
  let fixture: ComponentFixture<LoginLayoutComponent>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginLayoutComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule, ToastrModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader,
            deps: [HttpClient]
          }
        })
      ],
      providers: [ConfigurationService, ToastrService],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    translate = TestBed.inject(TranslateService);
  });

  it('should create login layout', () => {
    expect(component).toBeTruthy();
  });

  // it('should return login layout configurations', async () => {
  //   const expectedOrgId: string | undefined = "capgemeni";
  //   const expectedResultLogin = {
  //     "headerText": "Welcome to Unext",
  //     "bannerImageUrl": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1418&q=80",
  //     "headerTextOnHover": "<On hover text for header>",
  //     "logoOnHover": "<On hover text for logo>",
  //     "bannerOnHover": "<On hover text for banner>",
  //     "apiBaseUrl": "https://edunxtdev01.unext.tech",
  //     "welcomeTextOnHover": "<On hover text for welcom text>",
  //     "logoImageUrl": "https://dummyimage.com/136x40/fa7305/ffffff.png&text=logo",
  //     "logoRedirectUrl": "<the redirect url>",
  //     "poweredByLogo": "true",
  //     "defaultHeaderText": "Welcome to your online learning environment. Wish you an amazing experience ahead !!",
  //     "defaultLogoImageUrl": "https://dummyimage.com/136x40/fa6f05/ffffff.png&text=default",
  //     "defaultLogoRedirectUrl": "https://www.google.com",
  //     "defaultLogoOnHover": "default on Hover Text for Logo"
  //   };
  //   spyOn(configuration, 'getAttribute').and.returnValue(of(expectedOrgId));
  //   const spyFetchConfigurationLogin = spyOn(configuration, 'fetchloginPageSettings');
  //   spyFetchConfigurationLogin.and.resolveTo(expectedResultLogin);
  //   await component.getLoginLayoutConfigs();
  //   expect(spyFetchConfigurationLogin).toHaveBeenCalled();
  // });

  it('should render header text, logo, banner, powered by logo, terms and conditions, copyright, and privacy policy ', () => {
    translate.use('en');
    const compiled = fixture.debugElement.nativeElement;
    const tempLoginConfiguration = {
      "headerText": "Welcome to Unext",
      "bannerImageUrl": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1418&q=80",
      "headerTextOnHover": "<On hover text for header>",
      "logoOnHover": "<On hover text for logo>",
      "bannerOnHover": "<On hover text for banner>",
      "apiBaseUrl": "https://edunxtdev01.unext.tech",
      "welcomeTextOnHover": "<On hover text for welcom text>",
      "logoImageUrl": "https://dummyimage.com/136x40/fa7305/ffffff.png&text=logo",
      "logoRedirectUrl": "<the redirect url>",
      "poweredByLogo": "true",
      "defaultHeaderText": "Welcome to your online learning environment. Wish you an amazing experience ahead !!",
      "defaultLogoImageUrl": "https://dummyimage.com/136x40/fa6f05/ffffff.png&text=default",
      "defaultLogoRedirectUrl": "https://www.google.com",
      "defaultLogoOnHover": "default on Hover Text for Logo"
    };
    component.loginConfiguration = tempLoginConfiguration;
    fixture.detectChanges();
    expect(compiled.querySelector('.login-header-text').textContent).toContain('Welcome to Unext');
    expect(compiled.querySelector('.login-logo a img').src).toContain('https://dummyimage.com/136x40/fa7305/ffffff.png&text=logo');
    expect(compiled.querySelector('.login-banner-image img').src).toContain('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1418&q=80');
    expect(fixture.debugElement.query(By.css('.powered-by-logo'))).toBeTruthy();
    expect(compiled.querySelector('.powered-by-logo img').src).toContain('assets/images/unext-logo.png');
    expect(compiled.querySelector('.terms').textContent).toContain('Terms and Conditions');
    expect(compiled.querySelector('.copyright').textContent).toContain('Copyright © UNext Learning');
    expect(compiled.querySelector('.privacy').textContent).toContain('Privacy Policy');
  });

});
