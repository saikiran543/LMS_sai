import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningOutcomeListViewComponent } from './learning-outcome-list-view.component';

describe('LearningOutcomeListViewComponent', () => {
  let component: LearningOutcomeListViewComponent;
  let fixture: ComponentFixture<LearningOutcomeListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningOutcomeListViewComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningOutcomeListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
