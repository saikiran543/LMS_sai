import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScormComponent } from './scorm.component';

describe('ScormComponent', () => {
  let component: ScormComponent;
  let fixture: ComponentFixture<ScormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScormComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
