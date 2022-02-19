import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricAttachComponent } from './rubric-attach.component';

describe('RubricAttachComponent', () => {
  let component: RubricAttachComponent;
  let fixture: ComponentFixture<RubricAttachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricAttachComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricAttachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
