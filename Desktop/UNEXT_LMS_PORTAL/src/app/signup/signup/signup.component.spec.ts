import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { Routes } from '@angular/router';
import { LoginLayoutComponent } from '../../login-layout/login-layout.component';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import translations from '../../../assets/i18n/en.json';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

// eslint-disable-next-line max-lines-per-function
describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let location: Location;
  const routes: Routes = [
    { path: 'login', component: LoginLayoutComponent },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader,
            deps: [HttpClient]
          }
        })],
      declarations: [SignupComponent, LoginLayoutComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    location = TestBed.inject(Location);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test if passwords match and the errors displayed', () => {
    const compiled = fixture.debugElement.nativeElement;
    const form = component.signupForm;
    expect(form.valid).toBeFalsy();
    const username = form.controls.username;
    const email = form.controls.email;
    const password = form.controls.password;
    const reEnterPasswordInput = form.controls.reEnterPassword;
    username.setValue('User123');
    email.setValue('email123@gmail.com');
    password.setValue('Password123');
    reEnterPasswordInput.setValue('Password123');
    expect(form.valid).toBeTruthy();
    fixture.detectChanges();
    expect(compiled.querySelector('.passMatchError')).toBeNull();
    expect(compiled.querySelector('.passMatchSuccess')).toBeTruthy();
    reEnterPasswordInput.setValue('Password1234');
    expect(form.valid).toBeFalsy();
    fixture.detectChanges();
    expect(compiled.querySelector('.passMatchError')).toBeTruthy();
    expect(compiled.querySelector('.passMatchSuccess')).toBeNull();
    fixture.detectChanges();
  });

  it('test onSubmit functionality', async () => {
    await component.onSubmit();
    expect(location.path()).toBe('/login');
  });

  it('test goToLogin functionality', async () => {
    await component.goToLogin();
    expect(location.path()).toBe('/login');
  });
});
