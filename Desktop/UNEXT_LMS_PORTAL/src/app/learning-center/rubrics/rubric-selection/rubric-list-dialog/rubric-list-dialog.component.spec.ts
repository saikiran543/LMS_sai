import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricListDialogComponent } from './rubric-list-dialog.component';

describe('RubricListDialogComponent', () => {
  let component: RubricListDialogComponent;
  let fixture: ComponentFixture<RubricListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricListDialogComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
