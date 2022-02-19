/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EditAnswerReplyComponent } from './edit-answer-reply.component';

describe('EditAnswerReplyComponent', () => {
  let component: EditAnswerReplyComponent;
  let fixture: ComponentFixture<EditAnswerReplyComponent>;
  let ngbModal: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAnswerReplyComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
    ngbModal = TestBed.inject(NgbModal);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAnswerReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check initial value of form', ()=> {
    component.params.answer = 'q1';
    component.ngOnInit();
    const replyFormGroup = component.editForm;
    const replyFormValues = {
      answer: 'q1',
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

  it('should submit', async () => {
    component.editForm.value.reply = 'updatedAnswer';
    spyOn(component.editedAnswer, 'emit').withArgs('updatedAnswer');
    spyOn(component, 'cancel');
    await component.onSubmit();
    expect(component.editedAnswer.emit).toHaveBeenCalledWith('updatedAnswer');
    expect(component.cancel).toHaveBeenCalled();
  });
});
