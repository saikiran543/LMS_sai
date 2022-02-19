import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyCourseViewComponent } from './faculty-course-view.component';

describe('FacultyCourseViewComponent', () => {
  let component: FacultyCourseViewComponent;
  let fixture: ComponentFixture<FacultyCourseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacultyCourseViewComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyCourseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
