import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumStatisticsComponent } from './forum-statistics.component';

describe('ForumStatisticsComponent', () => {
  let component: ForumStatisticsComponent;
  let fixture: ComponentFixture<ForumStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumStatisticsComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
