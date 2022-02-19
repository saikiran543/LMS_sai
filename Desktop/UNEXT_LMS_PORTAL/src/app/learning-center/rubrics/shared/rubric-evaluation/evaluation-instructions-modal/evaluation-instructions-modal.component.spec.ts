import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationInstructionsModalComponent } from './evaluation-instructions-modal.component';

describe('EvaluationInstructionsModalComponent', () => {
  let component: EvaluationInstructionsModalComponent;
  let fixture: ComponentFixture<EvaluationInstructionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationInstructionsModalComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationInstructionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
