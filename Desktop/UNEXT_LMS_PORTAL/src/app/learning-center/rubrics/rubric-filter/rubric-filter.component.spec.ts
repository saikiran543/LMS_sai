import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricFilterComponent } from './rubric-filter.component';

describe('RubricFilterComponent', () => {
  let component: RubricFilterComponent;
  let fixture: ComponentFixture<RubricFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricFilterComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
