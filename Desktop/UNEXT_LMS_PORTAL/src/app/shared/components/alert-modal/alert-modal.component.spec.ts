import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertModalComponent } from './alert-modal.component';

import translations from '../../../../assets/i18n/en.json';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

// eslint-disable-next-line max-lines-per-function
describe('AlertModalComponent', () => {
  let component: AlertModalComponent;
  let fixture: ComponentFixture<AlertModalComponent>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertModalComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      providers: [
        TranslateService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    translate = TestBed.inject(TranslateService);
    translate.use('en');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initProperties: should set the properties for success', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.initProperties();
    fixture.detectChanges();
    expect(compiled.querySelector('.alert-text').textContent).toContain('Success message');
    expect(compiled.querySelector('.confirm-btn').textContent).toContain('Ok');
    expect(component.statusIcon).toEqual('success.svg');
    expect(component.buttonClass).toEqual('yes-btn');
  });

  it('initProperties: should set the properties for error', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.initProperties();
    fixture.detectChanges();
    expect(compiled.querySelector('.alert-text').textContent).toContain('Error message');
    expect(compiled.querySelector('.confirm-btn').textContent).toContain('Ok');
    expect(component.statusIcon).toEqual('icon-warning-red.svg');
    expect(component.buttonClass).toEqual('no-btn');
  });

  it('initProperties: should set the properties for warning', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.initProperties();
    fixture.detectChanges();
    expect(compiled.querySelector('.alert-text').textContent).toContain('Warning message');
    expect(compiled.querySelector('.confirm-btn').textContent).toContain('Ok');
    expect(component.statusIcon).toEqual('icon-warning-orange.svg');
    expect(component.buttonClass).toEqual('no-btn');
  });

  it('Should emit value on click on Ok button', () => {
    const buttonElement = fixture.debugElement.query(By.css('.confirm-btn'));
    buttonElement.triggerEventHandler('click', null);
    expect(component.sendConfirmStatus.call.length).toEqual(1);
    expect(component.confirmStatus.emit.call.length).toEqual(1);
  });
});
