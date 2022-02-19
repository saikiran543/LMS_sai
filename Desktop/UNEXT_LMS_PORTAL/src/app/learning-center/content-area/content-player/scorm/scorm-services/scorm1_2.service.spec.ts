import { TestBed } from '@angular/core/testing';

import { Scorm1_2Service } from './scorm1_2.service';

describe('Scorm1_2Service', () => {
  let service: Scorm1_2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Scorm1_2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
