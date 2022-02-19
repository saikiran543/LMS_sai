/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { NotesComponent } from './notes.component';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [NotesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call back function', () => {
    component.goBack();
    expect(component.isRightPaneActive).toBeFalse();
  });

  it('should check if the hiding the panel is working properly', () => {
    component.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    if (component.isMobileOrTablet && component.isRightPaneActive) {
      expect(compiled.querySelector('app-notes-left-pane')).toBeFalsy();
    } else {
      expect(compiled.querySelector('app-notes-left-pane')).toBeTruthy();
    }
  });

  it('should check if right panel is visible', () => {
    const compiled = fixture.debugElement.nativeElement;
    if (!component.isRightPaneActive) {
      expect(compiled.querySelector('app-notes-right-pane')).toBeFalsy();
    } else {
      expect(compiled.querySelector('app-notes-right-pane')).toBeTruthy();
    }
  });

  it('should check the mobile header component', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.isMobileOrTablet = true;
    fixture.detectChanges();
    if (!component.isMobileOrTablet) {
      expect(compiled.querySelector('app-mobile-header')).toBeFalsy();
    } else {
      expect(compiled.querySelector('app-mobile-header')).toBeTruthy();
    }
  });
});
