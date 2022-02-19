import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerListingComponent } from './question-answer-listing.component';

describe('QuestionAnswerListingComponent', () => {
  let component: QuestionAnswerListingComponent;
  let fixture: ComponentFixture<QuestionAnswerListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionAnswerListingComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
