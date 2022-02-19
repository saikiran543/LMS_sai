import { TestBed } from '@angular/core/testing';
import { DiscussionForumService } from './discussion-forum.service';

describe('', () => {
  let service: DiscussionForumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscussionForumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
