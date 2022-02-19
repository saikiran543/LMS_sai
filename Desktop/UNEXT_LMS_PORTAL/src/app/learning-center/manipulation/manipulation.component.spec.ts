import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManipulationComponent } from './manipulation.component';

describe('ManipulationComponent', () => {
  let component: ManipulationComponent;
  let fixture: ComponentFixture<ManipulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManipulationComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManipulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
