/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientService } from 'src/app/services/http-client.service';

import { Service } from 'src/app/enums/service';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;
  let httpClient: HttpClientService;

  const allNotes:any = { body: [
    {
      _id: "616fd24e29c8c3037056bb08",
      courseId: "111",
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
      courseId: "111",
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
      courseId: "111",
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
      courseId: "111",
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
  
  const relatedNotes = { body: [
    {
      _id: "61979e06007b720370265b45",
      courseId: "111",
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
      courseId: "111",
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
  
  const result = { "status": 200 };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClientService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(NotesService);
    httpClient = TestBed.inject(HttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call emptyNotes', () => {
    service.emptyNotes(0);
  });

  it('should call setNotesState', () => {
    const expextedNoteId = 'a7b30db4-657f-438a-91f3-53552d012d26';
    service.setNotesState(expextedNoteId);

    service.getNotesState().subscribe(async (noteId)=>{
      expect(noteId).toEqual(expextedNoteId);
    });
  });

  it('should call setNotesStateFromRelative', () => {
    const expextedNoteId = 'a7b30db4-657f-438a-91f3-53552d012d26';
    service.setNotesStateFromRelative(expextedNoteId);

    service.getNotesStateFromRelative().subscribe(async (noteId)=>{
      expect(noteId).toEqual(expextedNoteId);
    });

  });

  it('should call getAllNotes', fakeAsync(async () => {
    const courseId = '111';
    spyOn(httpClient, 'getResponse').withArgs(Service.COURSE_SERVICE, `course-notes?courseId=${courseId}`, HttpMethod.GET, true).and.returnValue(Promise.resolve(allNotes));
    const fecthedResult = await service.getAllNotes(courseId);
    expect(service.getAllNotes).toHaveBeenCalled;
    expect(fecthedResult).toEqual(allNotes);
  }));

  xit('should call getNotesByElementId', fakeAsync(async () => {
    const courseId = '111';
    const elementId = 'fe94023a-7896-451b-9c0a-9ee6488ae87b';
    const fecthedResult = await service.getNotesByElementId(courseId, elementId);
    spyOn(httpClient, 'getResponse').withArgs(Service.COURSE_SERVICE, `course-notes?courseId=${courseId}&elementId=${elementId}`, HttpMethod.GET, true).and.returnValue(Promise.resolve(relatedNotes));
    expect(service.getNotesByElementId).toHaveBeenCalled;
    expect(fecthedResult).toEqual(relatedNotes);
  }));

  it('should call saveNote', fakeAsync(async () => {
    const courseId = '111';
    const currentElementId = 'fe94023a-7896-451b-9c0a-9ee6488ae87b';
    const payLoad = {
      description: "Knowledge of trade ,stock market,investement ",
      notesPositionInContent: "1"
    };
    
    spyOn(httpClient, 'getResponse').withArgs(Service.COURSE_SERVICE, 'course-notes', HttpMethod.POST, payLoad, true).and.resolveTo(result);
    const fecthedResult = await service.saveNote(payLoad, courseId, currentElementId);
    expect(service.saveNote).toHaveBeenCalled;
    expect(fecthedResult).toEqual(result);
  }));

  it('should call pinUnpin', fakeAsync(async () => {
    const payLoad = {"isPinned": true};
    const pin = true;
    const noteId = 'a7b30db4-657f-438a-91f3-53552d012d26';
    spyOn(httpClient, 'getResponse').withArgs(Service.COURSE_SERVICE, `course-notes/${noteId}`,HttpMethod.PATCH, payLoad, true).and.resolveTo(result);
    const fecthedResult = await service.pinUnpin(noteId, pin);
    expect(service.pinUnpin).toHaveBeenCalled;
    expect(fecthedResult).toEqual(result);
    
  }));

  it('should call editNote', fakeAsync(async () => {
    const noteId = 'a7b30db4-657f-438a-91f3-53552d012d26';
    const payLoad = {
      description: "Knowledge of trade ,stock market,investement ",
      notesPositionInContent: "1"
    };
    spyOn(httpClient, 'getResponse').withArgs(Service.COURSE_SERVICE, `course-notes/${noteId}`, HttpMethod.PUT, payLoad, true).and.resolveTo(result);
    const fecthedResult = await service.editNote(payLoad, noteId);
    expect(service.editNote).toHaveBeenCalled;
    expect(fecthedResult).toEqual(result);
  }));

  it('should call deleteNote', fakeAsync(async () => {
    const noteId = 'a7b30db4-657f-438a-91f3-53552d012d26';
    spyOn(httpClient, 'getResponse').withArgs(Service.COURSE_SERVICE, `course-notes/${noteId}`, HttpMethod.DELETE, '', true).and.resolveTo(result);
    const fecthedResult = await service.deleteNote(noteId);
    expect(service.deleteNote).toHaveBeenCalled;
    expect(fecthedResult).toEqual(result);
  }));
});
