import { TestBed } from '@angular/core/testing';

import { RouteOperationService } from './route-operation.service';

describe('RouteOperationService', () => {
  let service: RouteOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
