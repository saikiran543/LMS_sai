import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLearningObjectiveComponent } from './add-learning-objective.component';

describe('AddLearningObjectiveComponent', () => {
  let component: AddLearningObjectiveComponent;
  let fixture: ComponentFixture<AddLearningObjectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLearningObjectiveComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLearningObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
