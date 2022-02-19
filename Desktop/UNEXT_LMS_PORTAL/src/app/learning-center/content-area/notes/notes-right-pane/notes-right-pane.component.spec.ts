/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable max-lines */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastContainerDirective, ToastrModule, ToastrService } from 'ngx-toastr';
import { Observable, of, throwError } from 'rxjs';
import { StorageKey } from 'src/app/enums/storageKey';
import { NotesService } from 'src/app/learning-center/course-services/notes.service';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { DialogService } from 'src/app/services/dialog.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import translations from '../../../../../assets/i18n/en.json';
import { CourseComponent } from '../../content-area.component';
import { NotesLeftPaneComponent } from '../notes-left-pane/notes-left-pane.component';
import { NotesRightPaneComponent } from './notes-right-pane.component';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTranslation(): Observable<any> {
    return of(translations);
  }
}

const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);

export class MockNgbModalRefYes {
  componentInstance = {
    confirmStatus: of(true),
    params: {
      message: '',
      confirmBtn: '',
      cancelBtn: ''
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Promise<any> = new Promise((resolve) => resolve(true));

  close(): void {
    // mock function
  }
}

describe('NotesRightPaneComponent', () => {
  let component: NotesRightPaneComponent;
  let fixture: ComponentFixture<NotesRightPaneComponent>;
  let notesService: NotesService;
  let notesLeftPaneComponent: NotesLeftPaneComponent;
  let toastService: ToastrService;
  let storageService: StorageService;
  let dialogService: DialogService;
  let router: Router;
  const mockModalRef: MockNgbModalRefYes = new MockNgbModalRefYes();
  let modalService: NgbModal;
  let routeOperationService: RouteOperationService;
  const routes : Routes= [
    {path: 'learning-center/1142/content-area/list/content/fe94023a-7896-451b-9c0a-9ee6488ae87b/excel?leftMenu=true&id=learning-center&courseDropDown=true&toc=true', component: CourseComponent}
  ];

  const allNotes: any = { body: [
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
    {
      _id: "61979e06007b720370265b45",
      courseId: "666",
      elementId: "fe94023a-7896-451b-9c0a-9ee6488ae87b",
      description: "HTML Notes tes",
      userId: "1",
      contentType: "html",
      isPinned: false,
      createdOn: "2021-11-19T12:52:22.759Z",
      updatedOn: "2021-11-19T13:06:01.432Z",
      noteId: "d51f8ac9-3294-47be-9c28-df5c008eaa58",
      title: "This Content has been deleted."
    },
    {
      _id: "61979e3cf7a69f037733ea00",
      courseId: "666",
      elementId: "fe94023a-7896-451b-9c0a-9ee6488ae87b",
      notesPositionInContent: "",
      description: "Edit Create notes",
      userId: "1",
      contentType: "html",
      isPinned: true,
      createdOn: "2021-11-19T12:53:16.763Z",
      updatedOn: "2021-11-23T05:56:46.062Z",
      noteId: "17183e21-4835-495d-80a4-d24a466a4679",
      title: "This Content has been deleted."
    }
  ]};

  const relatedNotes = {body: [
    {
      _id: "61979e06007b720370265b45",
      courseId: "666",
      elementId: "fe94023a-7896-451b-9c0a-9ee6488ae87b",
      description: "HTML Notes tes",
      userId: "1",
      contentType: "html",
      isPinned: false,
      createdOn: "2021-11-19T12:52:22.759Z",
      updatedOn: "2021-11-19T13:06:01.432Z",
      noteId: "d51f8ac9-3294-47be-9c28-df5c008eaa58",
      title: "This Content has been deleted."
    },
    {
      _id: "61979e3cf7a69f037733ea00",
      courseId: "666",
      elementId: "fe94023a-7896-451b-9c0a-9ee6488ae87b",
      notesPositionInContent: "",
      description: "Edit Create notes",
      userId: "1",
      contentType: "html",
      isPinned: true,
      createdOn: "2021-11-19T12:53:16.763Z",
      updatedOn: "2021-11-23T05:56:46.062Z",
      noteId: "17183e21-4835-495d-80a4-d24a466a4679",
      title: "This Content has been deleted."
    }
  ]};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: FakeLoader
        }
      }), ToastrModule.forRoot()],
      declarations: [NotesRightPaneComponent, SafePipe],
      providers: [NotesService, NotesLeftPaneComponent, ToastrService, ToastContainerDirective, StorageService, RouteOperationService]
    });
  });

  beforeEach( () => {
    fixture = TestBed.createComponent(NotesRightPaneComponent);
    component = fixture.componentInstance;
    notesService = TestBed.inject(NotesService);
    notesLeftPaneComponent = TestBed.inject(NotesLeftPaneComponent);
    toastService = TestBed.inject(ToastrService);
    router = TestBed.inject(Router);
    storageService = TestBed.inject(StorageService);
    dialogService = TestBed.inject(DialogService);
    modalService = TestBed.inject(NgbModal);
    routeOperationService = TestBed.inject(RouteOperationService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load note on ngInit', fakeAsync(async () => {
    const noteId = "17183e21-4835-495d-80a4-d24a466a4679";
    component.courseId = "666";
    component.configurationOfNotes.contentPlayerView = false;
    spyOn(router, 'navigate').and.resolveTo(true);
    spyOn(routeOperationService, 'listen').withArgs('noteId').and.returnValue(of(noteId));

    spyOn(notesService, 'getAllNotes').withArgs(component.courseId).and.returnValue(Promise.resolve(allNotes));
    spyOn(notesService, 'getNotesByElementId').and.returnValue(Promise.resolve(relatedNotes));
    await component.ngOnInit();
    fixture.detectChanges();
    flush();
  }));

  it('should load note if note has valid id', fakeAsync(async () => {
    const noteId = "17183e21-4835-495d-80a4-d24a466a4679";
    component.courseId = "666";
    spyOn(router, 'navigate').and.resolveTo(true);
    spyOn(notesService,'getAllNotes').withArgs(component.courseId).and.returnValue(Promise.resolve(allNotes));
    spyOn(notesService, 'getNotesByElementId').and.returnValue(Promise.resolve(relatedNotes));
    notesService.noteEmitter.next(noteId);
    fixture.detectChanges();
    flush();
  }));

  it('should pin note', fakeAsync(async () => {
    let noteId = "17183e21-4835-495d-80a4-d24a466a4679";
    let from = 'active';
    component.courseId = "666";

    spyOn(notesService,'getAllNotes').withArgs(component.courseId).and.returnValue(Promise.resolve(allNotes));
    spyOn(notesService, 'getNotesByElementId').and.returnValue(Promise.resolve(relatedNotes));
    spyOn(component, 'getAllNotes').and.callThrough();
    spyOn(router, 'navigate').and.resolveTo(true);
    spyOn(notesService, 'pinUnpin').and.callFake((noteId, pin)=>{
      if(noteId === '17183e21-4835-495d-80a4-d24a466a4679'){
        return Promise.resolve({status: 200});
      } else if(noteId === 'd51f8ac9-3294-47be-9c28-df5c008eaa58'){
        return Promise.resolve({status: 200});
      }
      return Promise.resolve({status: 401});

    });
    await component.getAllNotes();
    spyOn(storageService, 'get').and.callFake((key)=>{
      if(key === 'pinnedNotes') {
        return [allNotes.body[0], allNotes.body[3]];
      } else if(key === 'unPinnedNotes') {
        return [allNotes.body[1], allNotes.body[2]];
      }
      return [];
    });
    spyOn(component, 'pin').and.callThrough();
    component.pin(noteId, event, from);
    fixture.detectChanges();
    flush();
    noteId = "17183e21-4835-495d-80a4-d24a466a4679";
    from = 'related';
    component.pin(noteId, event, from);
    fixture.detectChanges();
    flush();
    noteId = "d51f8ac9-3294-47be-9c28-df5c008eaa58";
    from = 'active';
    component.pin(noteId, event, from);
    fixture.detectChanges();
    flush();
    noteId = "d51f8ac9-3294-47be-9c28-df5c008eaa58";
    from = 'related';
    component.pin(noteId, event, from);
    fixture.detectChanges();
    flush();
    noteId = "a87fb164-1455-442e-85d6-193fcb8b6868";
    from = 'active';
    component.pin(noteId, event, from);
    flush();
    noteId = "a7b30db4-657f-438a-91f3-53552d012d26";
    from = 'active';
    component.pin(noteId, event, from);
    fixture.detectChanges();
    flush();
  }));

  it('should delete the note which have relative notes', fakeAsync(async () => {
    const note = {
      _id: "61979e3cf7a69f037733ea00",
      courseId: "666",
      elementId: "fe94023a-7896-451b-9c0a-9ee6488ae87b",
      notesPositionInContent: "",
      description: "Edit Create notes",
      userId: "1",
      contentType: "html",
      isPinned: true,
      createdOn: "2021-11-19T12:53:16.763Z",
      updatedOn: "2021-11-23T05:56:46.062Z",
      noteId: "17183e21-4835-495d-80a4-d24a466a4679",
      title: "This Content has been deleted."
    };
    let from = 'active';
    component.courseId = "666";

    spyOn(notesService,'getAllNotes').withArgs(component.courseId).and.returnValue(Promise.resolve(allNotes));
    spyOn(component, 'getAllNotes').and.callThrough();
    spyOn(router, 'navigate').and.resolveTo(true);
    await component.getAllNotes();
    spyOn(notesService, 'getNotesByElementId').and.returnValue(Promise.resolve(relatedNotes));
    spyOn(notesService, 'deleteNote').and.callFake((noteId)=>{
      if(noteId === '17183e21-4835-495d-80a4-d24a466a4679'){
        return Promise.resolve({status: 200});
      }
      return Promise.resolve({status: 401});
    });
  
    spyOn(dialogService, 'showConfirmDialog').and.returnValue(Promise.resolve(true));
    spyOn(component, 'deleteNote').and.callThrough();
    component.deleteNote(note, event, from);
    flush();
    
    from = 'related';
    component.deleteNote(note, event, from);
    flush();
  }));

  it('should delete the note which do not have relative notes', fakeAsync(async () => {
    const note = {
      _id: "61979e3cf7a69f037733ea00",
      courseId: "1142",
      elementId: "fe94023a-7896-451b-9c0a-9ee6488ae87b",
      notesPositionInContent: "",
      description: "Edit Create notes",
      userId: "1",
      contentType: "html",
      isPinned: true,
      createdOn: "2021-11-19T12:53:16.763Z",
      updatedOn: "2021-11-23T05:56:46.062Z",
      noteId: "17183e21-4835-495d-80a4-d24a466a4679",
      title: "This Content has been deleted."
    };
    const from = 'active';
    component.courseId = "666";

    spyOn(notesService,'getAllNotes').withArgs(component.courseId).and.returnValue(Promise.resolve(allNotes));
    spyOn(component, 'getAllNotes').and.callThrough();
    spyOn(router, 'navigate').and.resolveTo(true);
    await component.getAllNotes();
    spyOn(notesService, 'getNotesByElementId').and.returnValue(Promise.resolve({body: []}));
    spyOn(notesService, 'deleteNote').and.callFake((noteId)=>{
      if(noteId === '17183e21-4835-495d-80a4-d24a466a4679'){
        return Promise.resolve({status: 200});
      }
      return Promise.resolve({status: 401});
    });
  
    spyOn(dialogService, 'showConfirmDialog').and.returnValue(Promise.resolve(true));
    spyOn(component, 'deleteNote').and.callThrough();
    component.deleteNote(note, event, from);
    flush();
  }));

  it('should not delete the note', fakeAsync(async () => {
    const note = {
      _id: "61979e3cf7a69f037733ea00",
      courseId: "666",
      elementId: "fe94023a-7896-451b-9c0a-9ee6488ae87b",
      notesPositionInContent: "",
      description: "Edit Create notes",
      userId: "1",
      contentType: "html",
      isPinned: true,
      createdOn: "2021-11-19T12:53:16.763Z",
      updatedOn: "2021-11-23T05:56:46.062Z",
      noteId: "d51f8ac9-3294-47be-9c28-df5c008eaa58",
      title: "This Content has been deleted."
    };
    const from = 'active';
    component.courseId = "666";
    spyOn(notesService,'getAllNotes').withArgs(component.courseId).and.returnValue(Promise.resolve(allNotes));
    spyOn(component, 'getAllNotes').and.callThrough();
    spyOn(router, 'navigate').and.resolveTo(true);
    await component.getAllNotes();
    spyOn(notesService, 'getNotesByElementId').and.returnValue(Promise.resolve({body: []}));
    spyOn(notesService, 'deleteNote').and.callFake((noteId)=>{
      if(noteId === '17183e21-4835-495d-80a4-d24a466a4679'){
        return Promise.resolve({status: 200});
      }
      return Promise.resolve({status: 401});
    });
  
    spyOn(dialogService, 'showConfirmDialog').and.returnValue(Promise.resolve(true));
    spyOn(component, 'deleteNote').and.callThrough();
    component.deleteNote(note, event, from);
    fixture.detectChanges();
    flush();
  }));

  it('should return all notes for notes dashboard', fakeAsync(async () => {
    const allNotes: any = [
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
    component.courseId = "666";
    component.allNotes = allNotes;
    component.currentNoteId = "a87fb164-1455-442e-85d6-193fcb8b6868";
    component.currentNote.contentType ='image';
    spyOn(notesService, "getAllNotes").withArgs("666").and.resolveTo(allNotes);
    spyOn(component, 'getAllNotes');

    component.getAllNotes();
    tick(1000);
    fixture.detectChanges();
    expect(component.getAllNotes).toHaveBeenCalled();
    expect(component.allNotes).toEqual(allNotes);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.parent-content-type-icon').src).toContain('http://localhost:9876/assets/images/icons/content-builder/icon-image-hover.svg');
    flush();
  }));

  it('should contentTypeNotes image', fakeAsync(async () => {
    const allNotes: any = [
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
      {
        _id: "616fd27bc29d930377f4c2d8",
        courseId: "666",
        elementId: "335aadc6-8109-43c5-85c9-367cb1292531",
        notesPositionInContent: "1/2",
        description: "<p>Audio</p>",
        userId: "1",
        contentType: "audio",
        isPinned: false,
        createdOn: "2021-10-20T08:25:31.339Z",
        updatedOn: "2021-10-20T08:25:31.339Z",
        noteId: "a7b30db4-657f-438a-91f3-53552d012d26",
        title: "This Content has been deleted."
      }

    ];
    component.courseId = "666";
    component.allNotes = allNotes;
    component.relatedNotes = allNotes;
    component.notePositionInContent = "1/2";
    const noteDetail = {
      "elementId": "8a57fd78-4d37-46a3-8bc4-5aec970e28cd",
      "type": "document",
      "title": "Relianec IRL Report Example",
      "status": "unpublished",
      "createdOn": "2021-11-22T06:40:48.963Z",
      "createdBy": "",
      "updatedOn": "2021-11-22T06:40:48.963Z",
      "updatedBy": "",
      "publishedOn": "2021-11-23T10:26:45.922Z",
      "contentType": "document",
      "description": {
        "changingThisBreaksApplicationSecurity": ""
      },
      "contentStatus": "mandatory",
      "allowDownload": false,
      "offlineAccess": false,
      "sendNotification": true,
      "idealTime": 496,
      "visibilityCriteria": false,
      "fileUrl": "",
      "s3FileName": "64e9a8e0-64f0-4cb1-b3d0-33c2f1eb0fc0.pdf",
      "originalFileName": "Reliance_IR 2020 (FULL) Single Page.pdf",
      "fileExtension": "pdf",
      "previousElement": {
        "title": "Week 1 - Introduction to Finance "
      },
      "nextElement": {
        "title": "Topic 1 Disciplinary Perspectives on Accounting Specialized Knowledge of varied accounting topics and techniques"
      },
      "isBookMarked": true,
      "lastAccessedTime": "2021-12-21T10:54:06.641Z"
    };
    storageService.set(StorageKey.ELEMENT_DETAIL, noteDetail);
    spyOn(component, 'contentTypeNotes').and.callThrough();
    component.contentTypeNotes();
    fixture.detectChanges();
    expect(component.contentTypeNotes).toHaveBeenCalled();
    flush();
  }));

  it('should load limited notes if content type is pdf using notePositionInContent', fakeAsync(async () => {
    const allNotes: any = [
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
        _id: "616fd27bc29d930377f4c2d8",
        courseId: "666",
        elementId: "335aadc6-8109-43c5-85c9-367cb1292531",
        notesPositionInContent: "1/2",
        description: "<p>Audio</p>",
        userId: "1",
        contentType: "audio",
        isPinned: false,
        createdOn: "2021-10-20T08:25:31.339Z",
        updatedOn: "2021-10-20T08:25:31.339Z",
        noteId: "a7b30db4-657f-438a-91f3-53552d012d26",
        title: "This Content has been deleted."
      }

    ];
    component.courseId = "666";
    component.allNotes = allNotes;
    component.relatedNotes = allNotes;
    component.notePositionInContent = "1/2";
    const noteDetail = {
      "elementId": "335aadc6-8109-43c5-85c9-367cb1292530",
      "type": "document",
      "title": "Relianec IRL Report Example",
      "status": "unpublished",
      "createdOn": "2021-11-22T06:40:48.963Z",
      "createdBy": "",
      "updatedOn": "2021-11-22T06:40:48.963Z",
      "updatedBy": "",
      "publishedOn": "2021-11-23T10:26:45.922Z",
      "contentType": "document",
      "description": {
        "changingThisBreaksApplicationSecurity": ""
      },
      "contentStatus": "mandatory",
      "allowDownload": false,
      "offlineAccess": false,
      "sendNotification": true,
      "idealTime": 496,
      "visibilityCriteria": false,
      "fileUrl": "",
      "s3FileName": "64e9a8e0-64f0-4cb1-b3d0-33c2f1eb0fc0.pdf",
      "originalFileName": "Reliance_IR 2020 (FULL) Single Page.pdf",
      "fileExtension": "pdf",
      "previousElement": {
        "title": "Week 1 - Introduction to Finance "
      },
      "nextElement": {
        "title": "Topic 1 Disciplinary Perspectives on Accounting Specialized Knowledge of varied accounting topics and techniques"
      },
      "isBookMarked": true,
      "lastAccessedTime": "2021-12-21T10:54:06.641Z"
    };
    storageService.set(StorageKey.ELEMENT_DETAIL, noteDetail);
    spyOn(component, 'contentTypeNotes').and.callThrough();
    component.contentTypeNotes();
    fixture.detectChanges();
    expect(component.contentTypeNotes).toHaveBeenCalled();
    flush();
  }));

  it('should load all notes if notePositionInContent is not available', fakeAsync(async () => {
    const allNotes: any = [
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
        _id: "616fd27bc29d930377f4c2d8",
        courseId: "666",
        elementId: "335aadc6-8109-43c5-85c9-367cb1292531",
        notesPositionInContent: "1/2",
        description: "<p>Audio</p>",
        userId: "1",
        contentType: "audio",
        isPinned: false,
        createdOn: "2021-10-20T08:25:31.339Z",
        updatedOn: "2021-10-20T08:25:31.339Z",
        noteId: "a7b30db4-657f-438a-91f3-53552d012d26",
        title: "This Content has been deleted."
      }

    ];
    component.courseId = "666";
    component.allNotes = allNotes;
    component.relatedNotes = allNotes;
    component.notePositionInContent = "123";
    const noteDetail = {
      "elementId": "335aadc6-8109-43c5-85c9-367cb1292530",
      "type": "document",
      "title": "Relianec IRL Report Example",
      "status": "unpublished",
      "createdOn": "2021-11-22T06:40:48.963Z",
      "createdBy": "",
      "updatedOn": "2021-11-22T06:40:48.963Z",
      "updatedBy": "",
      "publishedOn": "2021-11-23T10:26:45.922Z",
      "contentType": "document",
      "description": {
        "changingThisBreaksApplicationSecurity": ""
      },
      "contentStatus": "mandatory",
      "allowDownload": false,
      "offlineAccess": false,
      "sendNotification": true,
      "idealTime": 496,
      "visibilityCriteria": false,
      "fileUrl": "",
      "s3FileName": "64e9a8e0-64f0-4cb1-b3d0-33c2f1eb0fc0.pdf",
      "originalFileName": "Reliance_IR 2020 (FULL) Single Page.pdf",
      "fileExtension": "pdf",
      "previousElement": {
        "title": "Week 1 - Introduction to Finance "
      },
      "nextElement": {
        "title": "Topic 1 Disciplinary Perspectives on Accounting Specialized Knowledge of varied accounting topics and techniques"
      },
      "isBookMarked": true,
      "lastAccessedTime": "2021-12-21T10:54:06.641Z"
    };
    storageService.set(StorageKey.ELEMENT_DETAIL, noteDetail);
    spyOn(component, 'contentTypeNotes').and.callThrough();
    component.contentTypeNotes();
    fixture.detectChanges();
    expect(component.contentTypeNotes).toHaveBeenCalled();
    flush();
  }));

  it('should load notes for other content types', fakeAsync(async () => {
    const allNotes: any = [
      {
        _id: "616fd27bc29d930377f4c2d8",
        courseId: "666",
        elementId: "335aadc6-8109-43c5-85c9-367cb1292531",
        notesPositionInContent: "1/2",
        description: "<p>Audio</p>",
        userId: "1",
        contentType: "audio",
        isPinned: false,
        createdOn: "2021-10-20T08:25:31.339Z",
        updatedOn: "2021-10-20T08:25:31.339Z",
        noteId: "a7b30db4-657f-438a-91f3-53552d012d26",
        title: "This Content has been deleted."
      },
      {
        _id: "616fd24e29c8c3037056bb08",
        courseId: "666",
        elementId: "335aadc6-8109-43c5-85c9-367cb1292531",
        description: "<p>image note</p>",
        userId: "1",
        contentType: "image",
        isPinned: true,
        createdOn: "2021-10-20T08:24:46.729Z",
        updatedOn: "2021-10-20T08:24:46.730Z",
        noteId: "a87fb164-1455-442e-85d6-193fcb8b6868",
        title: "This Content has been deleted."
      }

    ];
    component.courseId = "666";
    component.allNotes = allNotes;
    component.relatedNotes = [];
    const noteDetail = {
      "elementId": "335aadc6-8109-43c5-85c9-367cb1292531",
      "type": "document",
      "title": "Relianec IRL Report Example",
      "status": "unpublished",
      "createdOn": "2021-11-22T06:40:48.963Z",
      "createdBy": "",
      "updatedOn": "2021-11-22T06:40:48.963Z",
      "updatedBy": "",
      "publishedOn": "2021-11-23T10:26:45.922Z",
      "contentType": "document",
      "description": {
        "changingThisBreaksApplicationSecurity": ""
      },
      "contentStatus": "mandatory",
      "allowDownload": false,
      "offlineAccess": false,
      "sendNotification": true,
      "idealTime": 496,
      "visibilityCriteria": false,
      "fileUrl": "",
      "s3FileName": "64e9a8e0-64f0-4cb1-b3d0-33c2f1eb0fc0.pdf",
      "originalFileName": "Reliance_IR 2020 (FULL) Single Page.pdf",
      "fileExtension": "pdf",
      "previousElement": {
        "title": "Week 1 - Introduction to Finance "
      },
      "nextElement": {
        "title": "Topic 1 Disciplinary Perspectives on Accounting Specialized Knowledge of varied accounting topics and techniques"
      },
      "isBookMarked": true,
      "lastAccessedTime": "2021-12-21T10:54:06.641Z"
    };
    storageService.set(StorageKey.ELEMENT_DETAIL, noteDetail);
    spyOn(component, 'contentTypeNotes').and.callThrough();
    component.contentTypeNotes();
    tick(1000);
    fixture.detectChanges();
    expect(component.contentTypeNotes).toHaveBeenCalled();
    flush();
  }));

  xit('Checking related notes empty state', fakeAsync(async () => {
    const allNotes: any = [];
    component.courseId = "666";
    component.allNotes = allNotes;
    component.relatedNotes = allNotes;
    spyOn(component, 'contentTypeNotes').and.callThrough();

    component.contentTypeNotes();
    fixture.detectChanges();
    expect(component.contentTypeNotes).toHaveBeenCalled();
    flush();
  }));

  it('Message translations', fakeAsync(async () => {
    spyOn(component, 'getMessageTranslations').and.callThrough();
    component.getMessageTranslations();
    fixture.detectChanges();
    expect(component.getMessageTranslations).toHaveBeenCalled();
    flush();
  }));

  it('should return notes in chronological order', fakeAsync(async () => {
    const allNotes: any = [
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

  it('should loadCurrentNote for child level content note', fakeAsync(async () => {
    const allNotes: any = [
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
        title: "Pdf title... Parent note title"
      },
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
        _id: "616fd27bc29d930377f4c2d8",
        courseId: "666",
        elementId: "335aadc6-8109-43c5-85c9-367cb1292531",
        notesPositionInContent: "1/2",
        description: "<p>Audio</p>",
        userId: "1",
        contentType: "audio",
        isPinned: false,
        createdOn: "2021-10-20T08:25:31.339Z",
        updatedOn: "2021-10-20T08:25:31.339Z",
        noteId: "a7b30db4-657f-438a-91f3-53552d012dk6",
        title: "This Content has been deleted."
      }

    ];
    component.courseId = "666";
    component.allNotes = allNotes;
    component.relatedNotes = allNotes;
    component.currentNoteId = "a7b30db4-657f-438a-91f3-53552d012d26";
    spyOn(component, 'loadCurrentNote').and.callThrough();

    component.loadCurrentNote();
    tick();
    fixture.detectChanges();
    expect(component.loadCurrentNote).toHaveBeenCalled();
    flush();
  }));

  it('should loadCurrentNote for parent level content note', fakeAsync(async () => {
    const allNotes: any = [
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
        title: "Pdf title"
      },
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
        _id: "616fd27bc29d930377f4c2d8",
        courseId: "666",
        elementId: "335aadc6-8109-43c5-85c9-367cb1292531",
        notesPositionInContent: "1/2",
        description: "<p>Audio</p>",
        userId: "1",
        contentType: "audio",
        isPinned: false,
        createdOn: "2021-10-20T08:25:31.339Z",
        updatedOn: "2021-10-20T08:25:31.339Z",
        noteId: "a7b30db4-657f-438a-91f3-53552d012dk6",
        title: "This Content has been deleted."
      }

    ];
    component.courseId = "666";
    component.allNotes = allNotes;
    component.relatedNotes = allNotes;
    component.currentNoteId = "a7b30db4-657f-438a-91f3-53552d012d26";
    spyOn(component, 'loadCurrentNote').and.callThrough();
    tick();
    component.loadCurrentNote();
    fixture.detectChanges();
    expect(component.loadCurrentNote).toHaveBeenCalled();
    flush();
  }));

  it('should load related notes based on element', fakeAsync(async () => {
    const relatedNotes: any = [
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
        title: "Pdf title"
      },
      {
        _id: "616fd24e29c8c3037056bb08",
        courseId: "666",
        elementId: "335aadc6-8109-43c5-85c9-367cb1292530",
        description: "<p>pdf 1</p>",
        userId: "1",
        contentType: "document",
        isPinned: true,
        createdOn: "2021-10-20T08:24:46.729Z",
        updatedOn: "2021-10-20T08:24:46.730Z",
        noteId: "a87fb164-1455-442e-85d6-193fcb8b6868",
        title: "Pdf title"
      },
      {
        _id: "616fd27bc29d930377f4c2d8",
        courseId: "666",
        elementId: "335aadc6-8109-43c5-85c9-367cb1292530",
        notesPositionInContent: "1/2",
        description: "<p>pdf 1</p>",
        userId: "1",
        contentType: "document",
        isPinned: false,
        createdOn: "2021-10-20T08:25:31.339Z",
        updatedOn: "2021-10-20T08:25:31.339Z",
        noteId: "a7b30db4-657f-438a-91f3-53552d012dk6",
        title: "Pdf title"
      }];

    spyOn(notesService, 'getNotesByElementId').withArgs("666", "a7b30db4-657f-438a-91f3-53552d012d26").and.resolveTo(relatedNotes);
    spyOn(component, 'loadrelatedNotes');
    component.currentNoteId = "a7b30db4-657f-438a-91f3-53552d012d26";
    component.allNotes = relatedNotes;
    component.courseId = "666";
    component.loadrelatedNotes();
    fixture.detectChanges();
    expect(component.loadrelatedNotes).toHaveBeenCalled();
  }));

  it('should edit note', fakeAsync(async () => {
    component.courseId = "666";
    component.allNotes = allNotes.body;
    spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    spyOn(component, 'editNote').and.callThrough();
    component.editNote(component.allNotes[0], event, "editNoteModal");
    tick();
    fixture.detectChanges();
    expect(component.editNote).toHaveBeenCalled();
    flush();
  }));

  it('should cancel create note', fakeAsync(async () => {
    spyOn(component, 'cancelCreateNote').and.callThrough();
    component.cancelCreateNote();
    fixture.detectChanges();
    expect(component.cancelCreateNote).toHaveBeenCalled();
    flush();
  }));

  it('should close toast', fakeAsync(async () => {
    component.courseId = "666";
    component.allNotes = allNotes;
    spyOn(component, 'editNote').and.callThrough();
    await component.editNote("a7b30db4-657f-438a-91f3-53552d012d26", event, "editNoteModal");
    tick(1000);
    fixture.detectChanges();
    flush();
    spyOn(component, 'closeToast').and.callThrough();
    component.closeToast();
    tick(1000);
    fixture.detectChanges();
    expect(component.closeToast).toHaveBeenCalled();
    flush();
  }));

  it('should send Confirm Status for modal', fakeAsync(async () => {
    spyOn(component, 'sendConfirmStatus').and.callThrough();
    component.sendConfirmStatus(true);
    fixture.detectChanges();
    expect(component.sendConfirmStatus).toHaveBeenCalled();
  }));

  it('should show notes Create Form', fakeAsync(async () => {
    spyOn(component, 'showCreateForm').and.callThrough();
    component.showCreateForm();
    fixture.detectChanges();
    expect(component.showCreateForm).toHaveBeenCalled();
    flush();
  }));

  it('sumbitting note Creation form with status 200', () => {
    const formData: any = {
      description: "Knowledge of trade ,stock market,investement ",
      notesPositionInContent: "1"
    };
    const result: any = { "status": 200 };
    component.notePositionInContent = "1";
    fixture.detectChanges();
    component.noteCreateForm.controls['description'].setValue("Sample Description");
    fixture.detectChanges();
    spyOn(component, "sumbitNoteCreateForm").and.callThrough();
    spyOn(notesService, "saveNote").and.resolveTo(result);
    const spyOnSaveFolder: any = notesService.saveNote(formData, "666", "6136ec7b0e5ea068100e16f5");
    component.sumbitNoteCreateForm();
    fixture.detectChanges();
    expect(spyOnSaveFolder instanceof Promise).toEqual(true);
  });

  xit('sumbitting note Creation form with status 404', () => {
    const formData: any = {
      description: "Knowledge of trade ,stock market,investement ",
      notesPositionInContent: "1"
    };
    spyOn(component, 'sumbitNoteCreateForm').and.callThrough();
    const expectedResponce = { status: 404, error: 'something went wrong' };
    spyOn(notesService, 'saveNote').and.callFake(() => {
      return throwError(expectedResponce).toPromise();
    });
    const spyOnSaveFolder: any = notesService.saveNote(formData, "666", "6136ec7b0e5ea068100e16f5");
    component.sumbitNoteCreateForm();
    fixture.detectChanges();
    tick(1000);
    expect(spyOnSaveFolder).toBeUndefined;
  });

  it('sumbitting note edit form with status 200', () => {
    const formData: any = {
      description: "Knowledge of trade ,stock market,investement ",
      notesPositionInContent: "1"
    };
    component.editNote("a7b30db4-657f-438a-91f3-53552d012d26", event, "editNoteModal");
    const result: any = { "status": 200 };
    component.notePositionInContent = "1";
    fixture.detectChanges();
    component.noteEditForm.controls['description'].setValue("Sample Description");
    component.noteEditForm.controls['notesPositionInContent'].setValue("1");
    fixture.detectChanges();
    spyOn(notesService, "editNote").and.resolveTo(result);
    const spyOnSaveFolder: any = notesService.editNote(formData, "6136ec7b0e5ea068100e16f5");
    component.sumbitNoteEditForm();
    fixture.detectChanges();
    expect(spyOnSaveFolder instanceof Promise).toEqual(true);
  });

  it('should cancel create note', fakeAsync(async () => {
    component.editNote("a7b30db4-657f-438a-91f3-53552d012d26", event, "editNoteModal");
    spyOn(component, 'cancelNote').and.callThrough();
    component.cancelNote();
    tick(500);
    fixture.detectChanges();
    expect(component.cancelNote).toHaveBeenCalled();
    flush();
  }));

  xit('should refresh Notes', fakeAsync(async () => {
    const allNotes: any = [
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
        title: "Pdf title"
      },
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
        _id: "616fd27bc29d930377f4c2d8",
        courseId: "666",
        elementId: "335aadc6-8109-43c5-85c9-367cb1292531",
        notesPositionInContent: "1/2",
        description: "<p>Audio</p>",
        userId: "1",
        contentType: "audio",
        isPinned: false,
        createdOn: "2021-10-20T08:25:31.339Z",
        updatedOn: "2021-10-20T08:25:31.339Z",
        noteId: "a7b30db4-657f-438a-91f3-53552d012dk6",
        title: "This Content has been deleted."
      }

    ];
    component.allNotes = allNotes;
    spyOn(component, 'refreshNotes').and.callThrough();
    component.getMessageTranslations();
    fixture.detectChanges();
    expect(component.refreshNotes).toHaveBeenCalled();
  }));

  it("should go to the specific content", () => {
    const data = {
      contentType: "document",
      courseId: "1142",
      createdOn: "2022-01-05T08:35:27.578Z",
      description: "<p>test note</p>",
      elementId: "39e3c6c8-cedf-4516-ada8-ff9856998b89",
      isPinned: true,
      noteId: "55cf1385-4b4e-4933-aa86-a030104694bd",
      notesPositionInContent: "3/88",
      title: "Test Document Content",
      updatedOn: "2022-01-05T08:35:27.578Z",
      userId: "1",
      _id: "61d5584f4c3575036f93c90a"
    };
    spyOn(router, 'navigate').and.resolveTo(true);
    spyOn(component, 'goToContent').withArgs(data).and.callThrough();
    component.goToContent(data);
    fixture.detectChanges();
    expect(component.goToContent).toHaveBeenCalled();
    flush();
  });
});
