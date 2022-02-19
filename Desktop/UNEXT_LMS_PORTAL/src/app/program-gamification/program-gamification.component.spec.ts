import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramGamificationComponent } from './program-gamification.component';

describe('ProgramGamificationComponent', () => {
  let component: ProgramGamificationComponent;
  let fixture: ComponentFixture<ProgramGamificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgramGamificationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramGamificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
