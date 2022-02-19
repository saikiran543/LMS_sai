import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricSelectionComponent } from './rubric-selection.component';

describe('RubricSelectionComponent', () => {
  let component: RubricSelectionComponent;
  let fixture: ComponentFixture<RubricSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricSelectionComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
