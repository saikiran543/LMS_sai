/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { HttpClientService } from 'src/app/services/http-client.service';
import { QnaLeftPanelComponent } from './qna-left-panel/qna-left-panel.component';
import { QnaRightPanelComponent } from './qna-right-panel/qna-right-panel.component';
import translations from '../../../assets/i18n/en.json';
import { QuestionsAndAnswersComponent } from './questions-and-answers.component';
import { QuestionAnswerReplyModule } from '../shared/question-answer-reply/question-answer-reply.module';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TimesAgoPipeModule } from 'src/app/pipes/times-ago.pipe';
import { By } from '@angular/platform-browser';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('QuestionsAndAnswersComponent', () => {
  let component: QuestionsAndAnswersComponent;
  let fixture: ComponentFixture<QuestionsAndAnswersComponent>;
  let translate: TranslateService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        QuestionAnswerReplyModule,
        AngularSvgIconModule.forRoot(),
        InfiniteScrollModule,
        TimesAgoPipeModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      declarations: [ QuestionsAndAnswersComponent, QnaRightPanelComponent, QnaLeftPanelComponent ],
      providers: [HttpClientService, TranslateService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsAndAnswersComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load left and right panel', () => {
    const leftPanel = fixture.debugElement.query(By.directive(QnaLeftPanelComponent)).componentInstance;
    expect(leftPanel).toBeTruthy();
  });

  it('should call back function', () => {
    component.goBack();
    expect(component.isRightPaneActive).toBeFalse();
  });

  it('should check if the hiding the panel is working properly', () => {
    component.detectChanges();
    const compiled=fixture.debugElement.nativeElement;
    if (component.isMobileOrTablet && component.isRightPaneActive) {
      expect(compiled.querySelector('app-qna-left-panel')).toBeFalsy();
    } else {
      expect(compiled.querySelector('app-qna-left-panel')).toBeTruthy();
    }
  });

  it('should check the mobile header component', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.isMobileOrTablet = true;
    fixture.detectChanges();
    if (!component.isMobileOrTablet) {
      expect(compiled.querySelector('app-mobile-header')).toBeFalsy();
    } else {
      expect(compiled.querySelector('app-mobile-header')).toBeTruthy();
    }
  });
});
