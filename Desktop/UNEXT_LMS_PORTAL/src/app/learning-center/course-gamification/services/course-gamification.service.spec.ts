import { TestBed } from '@angular/core/testing';

import { CourseGamificationService } from './course-gamification.service';

describe('CourseGamificationService', () => {
  let service: CourseGamificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseGamificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
