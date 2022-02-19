/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { HttpClientService } from 'src/app/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  noteEmitter = new BehaviorSubject<any>(undefined);
  notePositionInContent: Subject<any> = new Subject<any>();
  notePositionInContentValue: any;

  notesState = new Subject<any>();
  notes:any = new BehaviorSubject(1);
  pinUpinNoteId = new Subject<any>();
  constructor(private httpClientService: HttpClientService,) {
    this.notePositionInContent.subscribe((value) => {
      this.notePositionInContentValue = value;
    });

  }
  
  emptyNotes(data:any) {
    this.notes.next(data);
  }

  setNotesState(val: any) {
    this.notesState.next(val);
  }

  getNotesState(): Observable<any> {
    return this.notesState.asObservable();
  }

  setNotesStateFromRelative(val: any) {
    this.pinUpinNoteId.next(val);
  }

  getNotesStateFromRelative(): Observable<any> {
    return this.pinUpinNoteId.asObservable();
  }

  getAllNotes(courseId: string):Promise<void> {
    const response = this.httpClientService.getResponse(Service.COURSE_SERVICE, `course-notes?courseId=${courseId}`, HttpMethod.GET, true);
    return response;
  }

  getNotesByElementId(courseId: string, elementId:string) {
    const response = this.httpClientService.getResponse(Service.COURSE_SERVICE, `course-notes?courseId=${courseId}&elementId=${elementId}`, HttpMethod.GET, true);
    return response;
  }

  saveNote(payLoad: any, courseId:string, currentElementId:string){
    payLoad.courseId = courseId;
    payLoad.elementId = currentElementId;
    const response = this.httpClientService.getResponse(Service.COURSE_SERVICE, `course-notes`, HttpMethod.POST, payLoad, true);
    return response;
  }

  pinUnpin(noteId:any, pin:boolean){
    const payLoad = {"isPinned": pin};
    const response = this.httpClientService.getResponse(Service.COURSE_SERVICE, `course-notes/${noteId}`, HttpMethod.PATCH, payLoad, true);
    return response;
  }

  editNote(payLoad: any, noteId:any){
    const response = this.httpClientService.getResponse(Service.COURSE_SERVICE, `course-notes/${noteId}`, HttpMethod.PUT, payLoad, true);
    return response;
  }

  deleteNote(noteId:any){
    const response = this.httpClientService.getResponse(Service.COURSE_SERVICE, `course-notes/${noteId}`, HttpMethod.DELETE, '', true);
    return response;
  }

}
