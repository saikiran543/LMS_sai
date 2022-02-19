import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumInfoPopupComponent } from './forum-info-popup.component';

describe('ForumInfoPopupComponent', () => {
  let component: ForumInfoPopupComponent;
  let fixture: ComponentFixture<ForumInfoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumInfoPopupComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
