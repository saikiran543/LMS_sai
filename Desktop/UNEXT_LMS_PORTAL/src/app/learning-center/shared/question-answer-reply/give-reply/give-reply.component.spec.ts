/* eslint-disable max-lines-per-function */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveReplyComponent } from './give-reply.component';

describe('GiveReplyComponent', () => {
  let component: GiveReplyComponent;
  let fixture: ComponentFixture<GiveReplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiveReplyComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check initial value of form', ()=> {
    const replyFormGroup = component.replyForm;
    const replyFormValues = {
      reply: ''
    };
    expect(replyFormGroup.value).toEqual(replyFormValues);
  });

  it('should call cancel', ()=> {
    spyOn(component.close, 'emit');
 
    // trigger the click
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('.cancel-btn');
    button.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should submit', () => {
    spyOn(component.reply, 'emit');
    component.replyForm.value.reply = 'hello';
    component.onSubmit();
    fixture.detectChanges();
    expect(component.reply.emit).toHaveBeenCalledWith('hello');
  });
});
