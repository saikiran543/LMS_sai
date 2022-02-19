import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricEvaluationComponent } from './rubric-evaluation.component';

describe('RubricEvaluationComponent', () => {
  let component: RubricEvaluationComponent;
  let fixture: ComponentFixture<RubricEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricEvaluationComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
