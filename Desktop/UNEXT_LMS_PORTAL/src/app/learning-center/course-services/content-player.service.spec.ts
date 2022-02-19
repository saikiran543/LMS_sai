import { TestBed } from '@angular/core/testing';

import { ContentPlayerService } from './content-player.service';

describe('ContentPlayerService', () => {
  let service: ContentPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
