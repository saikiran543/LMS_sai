/* eslint-disable no-console */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationModalComponent } from './confirmation-modal.component';
import translations from '../../../../assets/i18n/en.json';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

// eslint-disable-next-line max-lines-per-function
describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      declarations: [ConfirmationModalComponent],
      providers: [
        TranslateService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    translate = TestBed.inject(TranslateService);
    translate.use('en');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initTexts: should set the values', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.modalConfig = {
      message: "confirmModal.text",
      confirmBtn: "confirmModal.confirmButton",
      cancelBtn: "confirmModal.cancelButton"
    };
    fixture.detectChanges();
    expect(compiled.querySelector('.confirm-text').textContent).toContain('Are you sure?');
    expect(compiled.querySelector('.confirm-yes').textContent).toContain(true);
    expect(compiled.querySelector('.confirm-no').textContent).toContain(false);
  });

  it('initTexts: with empty params', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.modalConfig = {
      message: "",
      confirmBtn: "",
      cancelBtn: ""
    };
    fixture.detectChanges();
    expect(compiled.querySelector('.confirm-text').textContent).toContain('');
    expect(compiled.querySelector('.confirm-yes').textContent).toContain('');
    expect(compiled.querySelector('.confirm-no').textContent).toContain('');
  });

  it('should validate the emit', () => {
    component.sendConfirmStatus();
    expect(component.confirmStatus.emit.call.length).toEqual(1);
  });

});
