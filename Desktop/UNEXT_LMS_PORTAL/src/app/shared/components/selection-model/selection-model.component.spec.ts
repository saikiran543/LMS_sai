import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionModelComponent } from './selection-model.component';

describe('SelectionModelComponent', () => {
  let component: SelectionModelComponent;
  let fixture: ComponentFixture<SelectionModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionModelComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
