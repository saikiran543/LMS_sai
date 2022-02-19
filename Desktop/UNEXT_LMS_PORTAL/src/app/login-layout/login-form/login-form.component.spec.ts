import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
/* eslint-disable max-lines-per-function */
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrandingComponent } from 'src/app/branding/branding.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ConfigurationService } from 'src/app/services/configuration.service';

import { LoginFormComponent } from './login-form.component';
import { Observable, of } from 'rxjs';
import translations from '../../../assets/i18n/en.json';
import { Constants } from 'src/app/constants/Constants';
import { LoginSettingService } from 'src/app/services/login.setting.service';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let loginSettingService: LoginSettingService;
  let authenticationService: AuthenticationService;
  let fixture: ComponentFixture<LoginFormComponent>;
  let translate: TranslateService;

  const expectedResult = {
    welcomeText: "To UNext Learning Portal"
  };
  const routes: Routes = [
    { path: 'branding', component: BrandingComponent },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      })],
      declarations: [LoginFormComponent, BrandingComponent],
      providers: [ConfigurationService, AuthenticationService, TranslateService]
    })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    loginSettingService = TestBed.inject(LoginSettingService);
    authenticationService = TestBed.inject(AuthenticationService);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    spyOn(loginSettingService, 'getWholeConfiguration').and.returnValue(expectedResult);
    await component.getLoginFormConfigs();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render expected html', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.login-card-title').textContent).toContain('Welcome!');
    expect(compiled.querySelector('img').src).toContain('/assets/images/icons/icon-handwave.svg');
    expect(compiled.querySelector('.login-card-subtitle').textContent).toContain(expectedResult.welcomeText);
    expect(compiled.querySelector('.password-icon>img').src).toContain('assets/images/icons/icon-eye.svg');
    expect(compiled.querySelector('.layout .layout-justify-space-between>a').textContent).toContain('Forgot password?');
    expect(compiled.querySelector('.custom-control-label').textContent).toContain('Remember Me');
    expect(compiled.querySelector('.contact-tech-support').textContent).toContain('If you have any issues with login');
  });

  it('should render input elements', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const username = compiled.querySelector('input[name="username"]');
    const password = compiled.querySelector('input[name="password"]');
    expect(username).toBeTruthy();
    expect(password).toBeTruthy();
  });

  it('should test form validity', () => {
    const form = component.signIn;
    expect(form.valid).toBeFalsy();
    const nameInput = form.controls.username;
    const passwordInput = form.controls.password;
    nameInput.setValue('User123');
    passwordInput.setValue('Password123');
    expect(form.valid).toBeTruthy();
  });

  it('should execute submit function once it is clicked', fakeAsync(() => {
    const form = component.signIn;
    const nameInput = form.controls.username;
    const passwordInput = form.controls.password;
    nameInput.setValue('User123');
    passwordInput.setValue('Password123');
    const onClickMock = spyOn(component, 'onSubmit');
    fixture.detectChanges();
    const loginButton = fixture.debugElement.nativeElement.querySelector('.login-btn');
    loginButton.click();
    tick();
    expect(onClickMock).toHaveBeenCalled();
  }));

  it('should not check authentication if event called from toastr', fakeAsync(async () => {
    const form = component.signIn;
    const nameInput = form.controls.username;
    const passwordInput = form.controls.password;
    nameInput.setValue('User123');
    passwordInput.setValue('Password123');
    const event = {
      submitter: {
        classList: [
          Constants.TOASTR_CLOSE_CSS
        ]
      }
    };
    spyOn(component, 'onSubmit').withArgs(event).and.callThrough();
    const spyLogin = spyOn(authenticationService, 'login');
    await component.onSubmit(event);
    expect(spyLogin).not.toHaveBeenCalled();
    spyLogin.and.resolveTo(false);
    await component.onSubmit(event);
  }));

  it('should not show invalid password toastr if status is not 401', fakeAsync(async () => {
    const form = component.signIn;
    const nameInput = form.controls.username;
    const passwordInput = form.controls.password;
    nameInput.setValue('User123');
    passwordInput.setValue('Password123');
    const event = {
      submitter: {
        classList: [
          ''
        ]
      }
    };
    spyOn(component, 'onSubmit').withArgs(event).and.callThrough();
    await component.onSubmit(event);
    expect(component.inValidCredentialToast).toBeUndefined();
  }));

  it('should nevigate to branding page if user authentication successed', async () => {
    const form = component.signIn;
    const nameInput = form.controls.username;
    const passwordInput = form.controls.password;
    nameInput.setValue('User123');
    passwordInput.setValue('Password123');
    spyOn(authenticationService, "login").and.resolveTo(true);
    const event = {
      submitter: {
        classList: [
          ''
        ]
      }
    };
    await component.onSubmit(event);
    fixture.detectChanges();
    const location = TestBed.inject(Location);
    expect(location.path()).toBe('/branding');
  });

  it('should stay login page if user authentication failed', async () => {
    const form = component.signIn;
    const nameInput = form.controls.username;
    const passwordInput = form.controls.password;
    nameInput.setValue('User123');
    passwordInput.setValue('Password123');
    spyOn(authenticationService, "login");
    const event = {
      submitter: {
        classList: [
          ''
        ]
      }
    };
    spyOn(component, 'onSubmit').withArgs(event).and.callThrough();
    await component.onSubmit(event);
    const location = TestBed.inject(Location);
    expect(location.path()).toBe('');
  });

  it('should stay login page if user authentication failed', async () => {
    const form = component.signIn;
    const nameInput = form.controls.username;
    const passwordInput = form.controls.password;
    nameInput.setValue('User123');
    passwordInput.setValue('Password123');
    spyOn(authenticationService, "login");
    const event = {
      submitter: {
        classList: [
          ''
        ]
      }
    };
    spyOn(component, 'onSubmit').withArgs(event).and.callThrough();
    await component.onSubmit(event);
    const location = TestBed.inject(Location);
    expect(location.path()).toBe('');
  });

  it('should show and hide the password based on eye button click', fakeAsync(() => {
    const form = component.signIn;
    const nameInput = form.controls.username;
    const passwordInput = form.controls.password;
    nameInput.setValue('User123');
    passwordInput.setValue('Password123');
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('input[name="password"]').type).toEqual('password');
    const showHideButton = fixture.debugElement.nativeElement.querySelector('.password-icon');
    expect(component.showPassword).toBeUndefined();
    showHideButton.click();
    fixture.detectChanges();
    expect(component.showPassword).toBeTrue();
    expect(compiled.querySelector('input[name="password"]').type).toEqual('text');
  }));

  it('should close the toast', fakeAsync(() => {
    component.closeToast();
    fixture.detectChanges();
    expect(component.inValidCredentialToast).toBeFalse();
  }));

});
