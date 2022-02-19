/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { NotesService } from 'src/app/learning-center/course-services/notes.service';
import { SafePipeModule } from 'src/app/pipes/safe.pipe';
import { StorageService } from 'src/app/services/storage.service';
import translations from '../../../../../assets/i18n/en.json';
import { NotesLeftPaneComponent } from './notes-left-pane.component';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);

describe('NotesLeftPaneComponent', () => {
  let component: NotesLeftPaneComponent;
  let fixture: ComponentFixture<NotesLeftPaneComponent>;
  let notesService: NotesService;
  let storageService: StorageService;
  let router: Router;
  const allNotesRes:any = { body: [
    {
      _id: "616fd24e29c8c3037056bb08",
      courseId: "666",
      elementId: "8a57fd78-4d37-46a3-8bc4-5aec970e28cd",
      description: "<p>image note</p>",
      userId: "1",
      contentType: "image",
      isPinned: true,
      createdOn: "2021-10-20T08:24:46.729Z",
      updatedOn: "2021-10-20T08:24:46.730Z",
      noteId: "a87fb164-1455-442e-85d6-193fcb8b6868",
      title: "This Content has been deleted."
    },
    {
      _id: "616fd27bc29d930377f4c2d5",
      courseId: "666",
      elementId: "335aadc6-8109-43c5-85c9-367cb1292530",
      notesPositionInContent: "1/2",
      description: "<p>pdf 1</p>",
      userId: "1",
      contentType: "document",
      isPinned: false,
      createdOn: "2021-10-20T08:25:31.339Z",
      updatedOn: "2021-10-20T08:25:31.339Z",
      noteId: "a7b30db4-657f-438a-91f3-53552d012d26",
      title: "This Content has been deleted."
    }
  ]};

  const allNotesWithoutPinnedRes = { body: [
    {
      _id: "616fd24e29c8c3037056bb08",
      courseId: "666",
      elementId: "8a57fd78-4d37-46a3-8bc4-5aec970e28cd",
      description: "<p>image note</p>",
      userId: "1",
      contentType: "image",
      isPinned: false,
      createdOn: "2021-10-20T08:24:46.729Z",
      updatedOn: "2021-10-20T08:24:46.730Z",
      noteId: "a87fb164-1455-442e-85d6-193fcb8b6868",
      title: "This Content has been deleted."
    },
    {
      _id: "616fd27bc29d930377f4c2d5",
      courseId: "666",
      elementId: "335aadc6-8109-43c5-85c9-367cb1292530",
      notesPositionInContent: "1/2",
      description: "<p>pdf 1</p>",
      userId: "1",
      contentType: "document",
      isPinned: false,
      createdOn: "2021-10-20T08:25:31.339Z",
      updatedOn: "2021-10-20T08:25:31.339Z",
      noteId: "a7b30db4-657f-438a-91f3-53552d012d26",
      title: "This Content has been deleted."
    }
  ]};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SafePipeModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      })],
      declarations: [ NotesLeftPaneComponent ],
      providers: [NotesService, StorageService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesLeftPaneComponent);
    component = fixture.componentInstance;
    notesService = TestBed.inject(NotesService);
    storageService = TestBed.inject(StorageService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initializeNotes', fakeAsync(async () => {
    component.courseId = '777';
    spyOn(notesService, 'getAllNotes').withArgs(component.courseId).and.resolveTo(allNotesRes);
    spyOn(component, 'initializeNotes').and.callThrough();
    await component.initializeNotes();
    flush();
  }));

  it('should update left panel on note selected', fakeAsync(async () => {
    component.courseId = '777';
    let noteId = 'a87fb164-1455-442e-85d6-193fcb8b6868';
    spyOn(notesService, 'getAllNotes').and.callFake((courseId)=>{
      if(courseId === '777') {
        return Promise.resolve(allNotesRes);
      } else if(courseId === '888') {
        return Promise.resolve(allNotesWithoutPinnedRes);
      }
      return Promise.resolve({ body: []});
    });
    spyOn(router, 'navigate').and.resolveTo(true);
    spyOn(notesService, 'setNotesState').and.callThrough();
    notesService.setNotesState(noteId);
    flush();

    component.courseId = '888';
    noteId = 'a7b30db4-657f-438a-91f3-53552d012d26';
    notesService.setNotesState(noteId);
    flush();

    component.courseId = '999';
    noteId = 'a7b30db4-657f-438a-91f3-53552d012d26';
    notesService.setNotesState(noteId);
    flush();
  }));

  it('should update left panel on modification of relative notes', fakeAsync(async ()=>{
    component.courseId = '777';
    let noteId = 'a87fb164-1455-442e-85d6-193fcb8b6868';
    spyOn(storageService, 'get').and.callFake((key)=>{
      if(key === 'pinnedNotes') {
        return [allNotesRes.body[0]];
      } else if(key === 'unPinnedNotes') {
        return [allNotesRes.body[1]];
      }
      return [];
    });
    spyOn(notesService, 'setNotesStateFromRelative').and.callThrough();
    notesService.setNotesStateFromRelative(noteId);

    noteId = 'a7b30db4-657f-438a-91f3-53552d012d26';
    notesService.setNotesStateFromRelative(noteId);
  }));

  it('should call unPin', fakeAsync(async ()=>{
    const noteId = 'a87fb164-1455-442e-85d6-193fcb8b6868';
    const pin = true;
    spyOn(notesService,'pinUnpin' ).and.returnValue(Promise.resolve({ status: 200 }));
    spyOn(component, 'unPin').and.callThrough();
    component.unPin(noteId, pin, event);
  }));

  it('should refresh pinned and unpinned notes', fakeAsync(async() => {
    spyOn(component, 'refreshPinnedUnpinnedArray').and.callThrough();
    component.refreshPinnedUnpinnedArray();
    expect(component.refreshPinnedUnpinnedArray).toHaveBeenCalled();
    flush();
  }));

  it('should return notes in chronological order', fakeAsync(async() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allNotes:any = [
      {
        _id: "616fd24e29c8c3037056bb08",
        courseId: "666",
        elementId: "8a57fd78-4d37-46a3-8bc4-5aec970e28cd",
        description: "<p>image note</p>",
        userId: "1",
        contentType: "image",
        isPinned: true,
        createdOn: "2021-10-20T08:24:46.729Z",
        updatedOn: "2021-10-20T08:24:46.730Z",
        noteId: "a87fb164-1455-442e-85d6-193fcb8b6868",
        title: "This Content has been deleted."
      },
      {
        _id: "616fd27bc29d930377f4c2d5",
        courseId: "666",
        elementId: "335aadc6-8109-43c5-85c9-367cb1292530",
        notesPositionInContent: "1/2",
        description: "<p>pdf 1</p>",
        userId: "1",
        contentType: "document",
        isPinned: false,
        createdOn: "2021-10-20T08:25:31.339Z",
        updatedOn: "2021-10-20T08:25:31.339Z",
        noteId: "a7b30db4-657f-438a-91f3-53552d012d26",
        title: "This Content has been deleted."
      },
           
    ];
    spyOn(component, 'chronologicalOrder').withArgs(allNotes).and.callThrough();
    component.chronologicalOrder(allNotes);
    expect(component.chronologicalOrder).toHaveBeenCalled();
    flush();
  }));
  
  it('should load active note', fakeAsync(async() => {
    spyOn(component, 'loadNote').withArgs("616fd27bc29d930377f4c2d5").and.callThrough();
    component.loadNote("616fd27bc29d930377f4c2d5");
    expect(component.loadNote).toHaveBeenCalled();
    flush();
  }));

  it('should load specific clicked note', fakeAsync(async() => {
    const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
    spyOn(component, 'clickNote').withArgs("616fd27bc29d930377f4c2d5", event).and.callThrough();
    spyOn(router, 'navigate').and.resolveTo(true);
    component.clickNote("616fd27bc29d930377f4c2d5", event);
    expect(component.clickNote).toHaveBeenCalled();
    flush();
  }));

  it('should remove from the pinned items', fakeAsync(async() => {
    const res = {};
    spyOn(notesService, "pinUnpin").withArgs("616fd27bc29d930377f4c2d5", true).and.callFake(() =>
      Promise.resolve(res));
    spyOn(component, 'unPin').withArgs("616fd27bc29d930377f4c2d5", true, '');
    fixture.whenStable().then(() => {
      // expect(component.allNotes).toEqual(allNotes);
    });
    component.unPin("616fd27bc29d930377f4c2d5", true, '');
    fixture.detectChanges();
    expect(component.unPin).toHaveBeenCalled();
    flush();
  }));

  it('should get the screenType', () => {
    component.getScreenType();
    expect(component.isMobileOrTablet).toBeUndefined();
  });

  it('should check the class is applied or not',async () => {
    component.pinnedNotes = [{
      contentType: "scorm",
      courseId: "1152",
      createdOn: "2022-02-09T04:30:50.333Z",
      description: "<p>eee</p>",
      elementId: "d2af6f7b-433d-4b72-b575-6f2db75968c3",
      isPinned: false,
      noteId: "cbee486f-0fdd-4a28-a7d3-fb3445ffc50f",
      title: "This Content has been deleted.",
      updatedOn: "2022-02-09T04:30:50.333Z",
      userId: "2",
      _id: "6203437a83f1f20388b92341"
    }];
    component.currentNoteId = "cbee486f-0fdd-4a28-a7d3-fb3445ffc50f";
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.debugElement.query(By.css('.note')).classes['active']).toBeTrue();
  });
});
