import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricPreviewComponent } from './rubric-preview.component';

describe('RubricPreviewComponent', () => {
  let component: RubricPreviewComponent;
  let fixture: ComponentFixture<RubricPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricPreviewComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
