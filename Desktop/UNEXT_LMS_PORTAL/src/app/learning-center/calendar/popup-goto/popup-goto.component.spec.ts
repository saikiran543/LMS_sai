import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupGotoComponent } from './popup-goto.component';

describe('PopupGotoComponent', () => {
  let component: PopupGotoComponent;
  let fixture: ComponentFixture<PopupGotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupGotoComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupGotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
