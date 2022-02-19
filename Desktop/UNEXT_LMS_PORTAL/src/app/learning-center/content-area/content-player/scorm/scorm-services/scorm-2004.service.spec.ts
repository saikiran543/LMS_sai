import { TestBed } from '@angular/core/testing';

import { Scorm2004Service } from './scorm-2004.service';

describe('Scorm2004Service', () => {
  let service: Scorm2004Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Scorm2004Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
