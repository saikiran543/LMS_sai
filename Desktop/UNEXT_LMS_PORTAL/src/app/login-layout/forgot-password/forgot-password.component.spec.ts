import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ForgotPasswordComponent } from './forgot-password.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginLayoutComponent } from '../login-layout.component';
import { By } from '@angular/platform-browser';
import { Router, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { throwError } from 'rxjs';
import { ToastContainerDirective, ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// eslint-disable-next-line max-lines-per-function
describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authenticate: AuthenticationService;
  let toastService: ToastrService;
  let translate: TranslateService;
  const routes: Routes = [

    { path: 'login', component: LoginLayoutComponent },
    { path: 'forgotpassword', component: ForgotPasswordComponent }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent, LoginLayoutComponent],
      imports: [TranslateModule.forRoot(), ToastrModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, RouterTestingModule.withRoutes(routes)
      ],
      providers: [ToastrService, ToastContainerDirective],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    authenticate = TestBed.inject(AuthenticationService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toastService = TestBed.inject(ToastrService);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create forgot password form', () => {
    expect(component).toBeTruthy();
  });

  it('should render lock icon, title, sub title, cancel and submit buttons', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.lock-icon img').src).toContain('assets/images/icons/icon-lock-and-key.svg');
    expect(compiled.querySelector('.forgot-card-title').textContent).toContain('login.forgotPassword.title');
    expect(compiled.querySelector('.forgot-card-subtitle').textContent).toContain('login.forgotPassword.subTitle');
    expect(compiled.querySelector('.cancel-btn').textContent).toContain('login.forgotPassword.button.cancel');
    expect(compiled.querySelector('.primary-btn').textContent).toContain('login.forgotPassword.button.submit');
  });

  it('should render username/email id input element', () => {
    const compiled = fixture.debugElement.nativeElement;
    const usernameoremail = compiled.querySelector('input[id="usernameoremail"]');
    expect(usernameoremail).toBeTruthy();
  });

  it('should test form validity', () => {
    const form = component.forgotpasswordForm;
    expect(form.valid).toBeFalsy();
    const usernameoremail = form.controls.usernameoremail;
    usernameoremail.setValue('test@mail.com');
    expect(form.valid).toBeTruthy();
  });

  it('should test input validity', () => {
    const form = component.forgotpasswordForm;
    const usernameoremailInput = form.controls.usernameoremail;
    expect(usernameoremailInput.valid).toBeFalsy();
    usernameoremailInput.setValue('test@mail.com');
    expect(usernameoremailInput.valid).toBeTruthy();
  });

  it('should test input for specific errors', () => {
    const form = component.forgotpasswordForm;
    const usernameoremailInput = form.controls.usernameoremail;
    expect(usernameoremailInput.errors?.required).toBeTruthy();
    usernameoremailInput.setValue('test@mail.com');
    expect(usernameoremailInput.errors).toBeNull();
  });

  it('should run submit function once submit button is clicked', fakeAsync(() => {
    const form = component.forgotpasswordForm;
    const usernameoremailInput = form.controls.usernameoremail;
    usernameoremailInput.setValue('test@mail.com');
    const onClickMock = spyOn(component, 'forgotPassword');
    fixture.detectChanges();
    const forgotPasswordButton = fixture.debugElement.nativeElement.querySelector('.pwd-action-btn .primary-btn');
    forgotPasswordButton.click();
    tick();
    expect(onClickMock).toHaveBeenCalled();
  }));

  it('should go to login page when clicking cancel button', async(inject([Router, Location], (router: Router, location: Location) => {
    fixture.debugElement.query(By.css('.login-link')).nativeElement.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual('/login');
    });
  })));

  it('shallow test the forgot password form with valid input', async () => {
    const expectedResult = { body: { Message: "Sucessfully sent Reset link to your email" } };
    const compiled = fixture.debugElement.nativeElement;
    const forgotPassword = compiled.querySelector('input[formControlName="usernameoremail"]');
    forgotPassword.value = 'username1';
    forgotPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(compiled.querySelector('login-failed')).toBeNull();
    // eslint-disable-next-line require-atomic-updates
    spyOn(authenticate, "forgotPassword").and.resolveTo(expectedResult);
    spyOn(TestBed.get(ToastrService), 'error');
    await component.forgotPassword();
    fixture.detectChanges();
    expect(component.toastr).toBeTruthy;
  });

  it('shallow test the forgot password form with invalid input', async () => {
    const expectedSuccessResult = { body: { Message: "Sucessfully sent Reset link to your email" } };
    const compiled = fixture.debugElement.nativeElement;
    const forgotPassword = compiled.querySelector('input[formControlName="usernameoremail"]');
    forgotPassword.value = 'username';
    forgotPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(compiled.querySelector('.login-success-toast')).toBeNull();
    forgotPassword.value = '';
    forgotPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await component.forgotPassword();
    fixture.detectChanges();
    expect(component.forgotPasswordErrorResponse).toBeTruthy;
    forgotPassword.value = 'username1';
    forgotPassword.dispatchEvent(new Event('input'));
    const spyForgotpassword = spyOn(authenticate, "forgotPassword");
    spyForgotpassword.and.resolveTo(expectedSuccessResult);
    await component.forgotPassword();
    fixture.detectChanges();
    expect(compiled.querySelector('login-failed')).toBeNull();
  });

  it('status should return 200 when API is returning success message', fakeAsync(async () => {
    const compiled = fixture.debugElement.nativeElement;
    const expectedResponce = { status: 200 };
    spyOn(component, 'forgotPassword').and.callThrough();
    const backendSpy = spyOn(authenticate, 'forgotPassword');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    backendSpy.and.callFake((): any => {
      return throwError(expectedResponce);
    });
    const usernameoremail = compiled.querySelector('input[formControlName="usernameoremail"]');
    usernameoremail.value = 'username';
    usernameoremail.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    compiled.querySelector('.primary-btn').click();
    fixture.detectChanges();
    expect(component.forgotPassword).toHaveBeenCalled();
  }));

  it('status should return 401 when API throws an error', fakeAsync(async () => {
    const compiled = fixture.debugElement.nativeElement;
    const expectedResponce = { status: 401 };
    spyOn(component, 'forgotPassword').and.callThrough();
    const backendSpy = spyOn(authenticate, 'forgotPassword');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    backendSpy.and.callFake((): any => {
      return throwError(expectedResponce);
    });
    const usernameoremail = compiled.querySelector('input[formControlName="usernameoremail"]');
    usernameoremail.value = 'username';
    usernameoremail.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    compiled.querySelector('.primary-btn').click();
    fixture.detectChanges();
    expect(component.forgotPassword).toHaveBeenCalled();
  }));
  it('toaster should close when click close icon', fakeAsync(async () => {
    spyOn(component, 'closeToast').and.callThrough();
    component.closeToast();
    fixture.detectChanges();
    expect(component.closeToast).toHaveBeenCalled();
  }));
});
