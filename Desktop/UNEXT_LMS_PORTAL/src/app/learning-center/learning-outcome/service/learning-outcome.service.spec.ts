import { TestBed } from '@angular/core/testing';

import { LearningOutcomeService } from './learning-outcome.service';

describe('LearningOutcomeService', () => {
  let service: LearningOutcomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningOutcomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
