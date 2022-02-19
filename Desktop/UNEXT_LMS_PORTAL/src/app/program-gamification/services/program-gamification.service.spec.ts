import { TestBed } from '@angular/core/testing';

import { ProgramGamificationService } from './program-gamification.service';

describe('ProgramGamificationService', () => {
  let service: ProgramGamificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramGamificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
