/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { QuestionAnswerService } from 'src/app/learning-center/course-services/question-answer.service';

import { AskQuestionComponent } from './ask-question.component';

describe('AskQuestionComponent', () => {
  let component: AskQuestionComponent;
  let fixture: ComponentFixture<AskQuestionComponent>;
  let ngbModal: NgbModal;
  let questionAnswerService: QuestionAnswerService;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskQuestionComponent ],
      providers: [QuestionAnswerService,ToastrService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
    ngbModal = TestBed.inject(NgbModal);
    questionAnswerService = TestBed.inject(QuestionAnswerService);
    toastrService = TestBed.inject(ToastrService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AskQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check heading', () => {
    component.type = 'question';
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css('.modalInnerHeader'));
    expect(header.childNodes[0].nativeNode.textContent).toBe('Ask a Question');
  });

  it('should check initial value of form', ()=> {
    const replyFormGroup = component.questionForm;
    const replyFormValues = {
      title: '',
      description: '',
    };
    expect(replyFormGroup.value).toEqual(replyFormValues);
  });

  it('should call cancel', ()=> {
    spyOn(ngbModal, 'dismissAll');
    // trigger the click
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('.cancel-btn');
    button.dispatchEvent(new Event('click'));
    expect(ngbModal.dismissAll).toHaveBeenCalled();
  });

  it('should Throw an Error if Empty Forum is Submitted', async () =>{
    component.questionForm.value.title = '';
    await component.onSubmit();
    expect(toastrService.error.call.length).toEqual(1);
  });

  it('should submit', async () => {
    const expectedResponse = {
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
    component.questionForm.value.title = 'q50';
    component.questionForm.value.description = 'q50';
    spyOn(component.askedQuestion, 'emit').withArgs(expectedResponse);
    spyOn(component, 'cancel');
    spyOn(questionAnswerService, 'askQuestion').withArgs({title: 'q50', description: 'q50'}).and.resolveTo(expectedResponse);
    await component.onSubmit();
    expect(component.askedQuestion.emit).toHaveBeenCalledWith(expectedResponse);
    expect(component.cancel).toHaveBeenCalled();
  });
});
