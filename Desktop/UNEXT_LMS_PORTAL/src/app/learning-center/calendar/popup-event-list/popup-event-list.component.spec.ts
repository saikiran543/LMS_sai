import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupEventListComponent } from './popup-event-list.component';

describe('PopupEventListComponent', () => {
  let component: PopupEventListComponent;
  let fixture: ComponentFixture<PopupEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupEventListComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
