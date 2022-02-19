import { TestBed } from '@angular/core/testing';

import { RubricsService } from './rubrics.service';

describe('RubricsService', () => {
  let service: RubricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RubricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
