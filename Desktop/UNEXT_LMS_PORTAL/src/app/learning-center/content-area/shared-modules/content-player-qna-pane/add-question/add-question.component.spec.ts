/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { QuestionAnswerService } from 'src/app/learning-center/course-services/question-answer.service';

import { AddQuestionComponent } from './add-question.component';
import translations from '../../../../../../assets/i18n/en.json';
import { Observable, of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

describe('AddQuestionComponent', () => {
  let component: AddQuestionComponent;
  let fixture: ComponentFixture<AddQuestionComponent>;
  let questionAnswerService: QuestionAnswerService;
  let toastService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQuestionComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          },
          defaultLanguage: 'en'
        })
      ],
      providers: [QuestionAnswerService, TranslateService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    AddQuestionComponent.prototype.ngOnInit = () => {};
    fixture = TestBed.createComponent(AddQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    questionAnswerService = TestBed.inject(QuestionAnswerService);
    toastService = TestBed.inject(ToastrService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the default characters left', (done) => {
    component['setDefaultCharLength']();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('.char-count').textContent).toBe('Max of 250 Characters');
      done();
    });
  });

  it('should update the characters left when text is updated', (done) => {
    component['setDefaultCharLength']();
    component['setCharacterLeftText']('new');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('.char-count').textContent).toBe('497 Characters Left');
      done();
    });
  });

  it('should submit the question and should throw a success message', async () => {
    const askQuestionResponse = {
      "numOfUpvotes": 0,
      "numOfAnswers": 0,
      "_id": "61c2fdb79e44233510effb57",
      "courseId": "12345",
      "elementId": "5ef6375e-9542-4bfd-be02-c550f70dfcf0",
      "title": "q31",
      "description": "<p>q31</p>",
      "createdBy": "1",
      "updatedBy": "1",
      "contentTitle": "Content 1",
      "contentType": "pdf",
      "questionId": "713785bd-46f7-4217-9557-12b8de8fa2ef",
      "createdAt": "2021-12-22T10:28:07.138Z",
      "updatedAt": "2021-12-22T10:28:07.138Z"
    };
    spyOn(questionAnswerService, 'askQuestion').and.resolveTo(askQuestionResponse);
    const toastSpy = spyOn(toastService, 'success');
    component.onSubmit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(toastSpy).toHaveBeenCalledOnceWith('Question Posted Successfully');
  });
});
