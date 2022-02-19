/* eslint-disable max-lines-per-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import translations from '../../../../assets/i18n/en.json';
import { PreviewLayoutComponent } from './preview-layout.component';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}
describe('PreviewLayoutComponent', () => {
  let component: PreviewLayoutComponent;
  let fixture: ComponentFixture<PreviewLayoutComponent>;
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
      declarations: [PreviewLayoutComponent],
      providers: [TranslateService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewLayoutComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render expected ui element', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('.cancel-btn').textContent).toEqual('Back');
    expect(compiled.querySelector('.primary-btn').textContent).toEqual('Publish');
    expect(compiled.querySelector('.note').textContent).toEqual('Note: This is a preview of your changes. Are you sure you want to publish these changes?');
    expect(compiled.querySelector('.note>span').textContent).toEqual('Note:');
    component.type = 'login';
    fixture.detectChanges();
    expect(compiled.querySelector('app-branding')).toBeNull();
    expect(compiled.querySelector('app-login-layout')).toBeTruthy();
    component.type = 'branding';
    fixture.detectChanges();
    expect(compiled.querySelector('app-branding')).toBeTruthy();
    expect(compiled.querySelector('app-login-layout')).toBeNull();
  });

  it('should return expected event', () => {
    const compiled = fixture.debugElement.nativeElement;
    const backButton = compiled.querySelector('.cancel-btn');
    component.previewEvent.pipe(take(1)).subscribe(data => {
      expect(data).toEqual('back');
    });
    backButton.click();
    fixture.detectChanges();

    const publishButton = compiled.querySelector('.primary-btn');
    component.previewEvent.pipe(take(1)).subscribe(data => {
      expect(data).toEqual('publish');
    });
    publishButton.click();
    fixture.detectChanges();

  });
});
