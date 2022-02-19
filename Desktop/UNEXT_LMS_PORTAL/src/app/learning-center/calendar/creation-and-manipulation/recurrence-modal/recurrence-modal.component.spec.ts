import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrenceModalComponent } from './recurrence-modal.component';

describe('RecurrenceModalComponent', () => {
  let component: RecurrenceModalComponent;
  let fixture: ComponentFixture<RecurrenceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecurrenceModalComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurrenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
