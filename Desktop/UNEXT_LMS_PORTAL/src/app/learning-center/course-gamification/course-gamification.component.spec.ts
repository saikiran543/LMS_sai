import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseGamificationComponent } from './course-gamification.component';

describe('CourseGamificationComponent', () => {
  let component: CourseGamificationComponent;
  let fixture: ComponentFixture<CourseGamificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseGamificationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseGamificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
