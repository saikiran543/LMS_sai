/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EditQuestionThreadComponent } from './edit-question-thread.component';

describe('EditQuestionThreadComponent', () => {
  let component: EditQuestionThreadComponent;
  let fixture: ComponentFixture<EditQuestionThreadComponent>;
  let ngbModal: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditQuestionThreadComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
    ngbModal = TestBed.inject(NgbModal);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuestionThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check initial value of form', ()=> {
    component.params.title = 'q1';
    component.params.description = 'q1';
    component.ngOnInit();
    const replyFormGroup = component.editForm;
    const replyFormValues = {
      title: 'q1',
      description: 'q1',
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
    component.editForm.value.title = 'q50';
    component.editForm.value.description = 'q50';
    spyOn(component.editedQuestion, 'emit').withArgs({title: 'q50', description: 'q50'});
    spyOn(component, 'cancel');
    await component.onSubmit();
    expect(component.editedQuestion.emit).toHaveBeenCalledWith({title: 'q50', description: 'q50'});
    expect(component.cancel).toHaveBeenCalled();
  });
});
