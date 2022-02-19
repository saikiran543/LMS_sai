import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardListViewComponent } from './leaderboard-list-view.component';

describe('LeaderboardListViewComponent', () => {
  let component: LeaderboardListViewComponent;
  let fixture: ComponentFixture<LeaderboardListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaderboardListViewComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
