import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricStructureComponent } from './rubric-structure.component';

describe('RubricStructureComponent', () => {
  let component: RubricStructureComponent;
  let fixture: ComponentFixture<RubricStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricStructureComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
