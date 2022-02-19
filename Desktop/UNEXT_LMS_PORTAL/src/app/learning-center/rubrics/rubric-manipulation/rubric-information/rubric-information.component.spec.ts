import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricInformationComponent } from './rubric-information.component';

describe('RubricInformationComponent', () => {
  let component: RubricInformationComponent;
  let fixture: ComponentFixture<RubricInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RubricInformationComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
