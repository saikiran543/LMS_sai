import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import translations from '../../../assets/i18n/en.json';

import { ResetPasswordComponent } from './reset-password.component';
import { LoginLayoutComponent } from '../login-layout.component';
import { HttpClientService } from 'src/app/services/http-client.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';
import { ToastComponent } from 'src/app/toast/toast.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

// eslint-disable-next-line max-lines-per-function
describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let service: HttpClientService;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let location: Location;
  let translate: TranslateService;
  const routes: Routes = [

    { path: 'login', component: LoginLayoutComponent }

  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        ReactiveFormsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      declarations: [ResetPasswordComponent, ToastComponent],
      providers: [HttpClientService, TranslateService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    service = TestBed.inject(HttpClientService);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ui', () => {
    const compiled = fixture.debugElement.nativeElement;
    const enterNewPassword = compiled.querySelector('.forgot-card-title');
    expect(enterNewPassword.textContent).toContain('Enter New Password');
    const newPassword = compiled.querySelector('input[formControlName="newPassword"]');
    const confirmPassword = compiled.querySelector('input[formControlName="confirmPassword"]');
    expect(newPassword.placeholder).toContain('New Password');
    expect(confirmPassword.placeholder).toContain('Confirm Password');
    const submitButton = compiled.querySelector('button[type="submit"]');
    expect(submitButton.textContent).toContain('Submit');
    const cancelButton = compiled.querySelector('.cancel-btn');
    expect(cancelButton.textContent).toContain('Cancel');
  });

  it('shallow test the reset password form with valid inputs', () => {
    const compiled = fixture.debugElement.nativeElement;
    const newPassword = compiled.querySelector('input[formControlName="newPassword"]');
    const confirmPassword = compiled.querySelector('input[formControlName="confirmPassword"]');
    newPassword.value = 'Abcd1234!';
    confirmPassword.value = 'Abcd1234!';
    newPassword.dispatchEvent(new Event('input'));
    confirmPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(compiled.querySelector('.pasword-policy')).toBeNull();
    expect(compiled.querySelector('.pwd-doest-match')).toBeNull();
  });

  it('shallow test the reset password form with invalid inputs', () => {
    const compiled = fixture.debugElement.nativeElement;
    const newPassword = compiled.querySelector('input[formControlName="newPassword"]');
    const confirmPassword = compiled.querySelector('input[formControlName="confirmPassword"]');
    newPassword.value = 'abcd123';
    confirmPassword.value = 'Abcd';
    newPassword.dispatchEvent(new Event('input'));
    confirmPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(compiled.querySelector('.pasword-policy')).toBeTruthy();
    expect(compiled.querySelector('.pwd-doest-match')).toBeTruthy();
    newPassword.value = 'Abcd1234!';
    newPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(compiled.querySelector('.pasword-policy')).toBeNull();
    confirmPassword.value = 'Abcd1234!';
    confirmPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(compiled.querySelector('.pwd-doest-match')).toBeNull();
  });

  it('check the onsubmit function', async () => {
    const compiled = fixture.debugElement.nativeElement;
    spyOn(component, 'onSubmit').and.callThrough();
    const backendSpy = spyOn(service, 'getResponseAsObservable');
    const newPassword = compiled.querySelector('input[formControlName="newPassword"]');
    const confirmPassword = compiled.querySelector('input[formControlName="confirmPassword"]');
    newPassword.value = 'Abcd123';
    confirmPassword.value = 'Abcd1234';
    newPassword.dispatchEvent(new Event('input'));
    confirmPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.onSubmit();
    expect(backendSpy).not.toHaveBeenCalled();
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('check cancel button', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;
    const cancelButton = compiled.querySelector('button[class="cancel-btn"]');
    cancelButton.click();
    flush();
    expect(location.path()).toBe('/login');
  }));

  it('check status code for not 200', fakeAsync(async () => {
    const compiled = fixture.debugElement.nativeElement;
    const expectedResponce = { status: 202 };
    spyOn(component, 'onSubmit').and.callThrough();
    const backendSpy = spyOn(service, 'getResponseAsObservable');
    backendSpy.and.returnValue(of(expectedResponce));
    const newPassword = compiled.querySelector('input[formControlName="newPassword"]');
    const confirmPassword = compiled.querySelector('input[formControlName="confirmPassword"]');
    newPassword.value = 'Abcd123!';
    confirmPassword.value = 'Abcd1234!';
    newPassword.dispatchEvent(new Event('input'));
    confirmPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();
    expect(component.onSubmit).toHaveBeenCalled();
    fixture.detectChanges();
    const closeToast = compiled.querySelector('.toast-close-button');
    expect(closeToast).toBeFalsy();

  }));

  it('close success toast', fakeAsync(async () => {
    const compiled = fixture.debugElement.nativeElement;
    const expectedResponce = { status: 200 };
    spyOn(component, 'onSubmit').withArgs().and.callThrough();
    const backendSpy = spyOn(service, 'getResponseAsObservable');
    backendSpy.and.returnValue(of(expectedResponce));
    const newPassword = compiled.querySelector('input[formControlName="newPassword"]');
    const confirmPassword = compiled.querySelector('input[formControlName="confirmPassword"]');
    newPassword.value = 'Abcd123!';
    confirmPassword.value = 'Abcd1234!';
    newPassword.dispatchEvent(new Event('input'));
    confirmPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();
    flush();
    expect(component.onSubmit).toHaveBeenCalled();

  }));

  it('close 401 error toast', fakeAsync(async () => {
    const compiled = fixture.debugElement.nativeElement;
    const expectedResponce = { status: 401 };
    spyOn(component, 'onSubmit').withArgs().and.callThrough();
    spyOn(component, 'closeToast');
    const backendSpy = spyOn(service, 'getResponseAsObservable');
    backendSpy.and.callFake(() => {
      return throwError(expectedResponce);
    });
    const newPassword = compiled.querySelector('input[formControlName="newPassword"]');
    const confirmPassword = compiled.querySelector('input[formControlName="confirmPassword"]');
    newPassword.value = 'Abcd123!';
    confirmPassword.value = 'Abcd1234!';
    newPassword.dispatchEvent(new Event('input'));
    confirmPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.onSubmit();

    component.closeToast();
    fixture.detectChanges();
    flush();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.closeToast).toHaveBeenCalled();
  }));

  it('close 406 error toast', fakeAsync(async () => {
    const compiled = fixture.debugElement.nativeElement;
    const expectedResponce = { status: 406 };
    spyOn(component, 'onSubmit').and.callThrough();
    const backendSpy = spyOn(service, 'getResponseAsObservable');
    //backendSpy.and.throwError(expectedResponce);
    backendSpy.and.callFake(() => {
      return throwError(expectedResponce);
    });
    const newPassword = compiled.querySelector('input[formControlName="newPassword"]');
    const confirmPassword = compiled.querySelector('input[formControlName="confirmPassword"]');
    newPassword.value = 'Abcd123!';
    confirmPassword.value = 'Abcd1234!';
    newPassword.dispatchEvent(new Event('input'));
    confirmPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    component.onSubmit();
    fixture.detectChanges();
    flush();
    expect(component.onSubmit).toHaveBeenCalled();
  }));
});
