import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressrecorderComponent } from './expressrecorder.component';

describe('ExpressrecorderComponent', () => {
  let component: ExpressrecorderComponent;
  let fixture: ComponentFixture<ExpressrecorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressrecorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressrecorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
