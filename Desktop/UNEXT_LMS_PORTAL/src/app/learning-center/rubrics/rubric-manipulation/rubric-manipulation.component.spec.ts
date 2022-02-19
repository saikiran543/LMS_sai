import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricManipulationComponent } from './rubric-manipulation.component';

describe('RubricManipulationComponent', () => {
  let component: RubricManipulationComponent;
  let fixture: ComponentFixture<RubricManipulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricManipulationComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricManipulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
