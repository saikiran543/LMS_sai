/* eslint-disable max-params */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';
import { ContentType } from 'src/app/enums/contentType';
import { NotesService } from 'src/app/learning-center/course-services/notes.service';
import { DialogService } from 'src/app/services/dialog.service';
import { NotesLeftPaneComponent } from '../notes-left-pane/notes-left-pane.component';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { Dialog } from 'src/app/Models/Dialog';
import { DialogTypes } from 'src/app/enums/Dialog';

@Component({
  selector: 'app-notes-right-pane',
  templateUrl: './notes-right-pane.component.html',
  styleUrls: ['./notes-right-pane.component.scss']
})
export class NotesRightPaneComponent implements OnInit {
  allNotes: any = "";
  courseId = ""
  currentNoteId = "";
  currentNote: any = {};
  relatedNotes: any = [];
  specificContentNotes: any = [];
  noteEdit = false;
  notesToast = false;
  toastType = 'error'
  toastMessage: any = "";
  noteCreateForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
    notesPositionInContent: new FormControl(''),
  });
  noteEditForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
    notesPositionInContent: new FormControl(''),
  });
  messagesTranslations: any = {
    deleteNode: 'toc.deleteConfirm',
  }
  activeNode: any;
  modelRef!: NgbModalRef;
  currentElementId: any;
  notePositionInContent: any;
  createForm = false;
  elementRelatedNotes:any;
  currentNoteTitle:any;
  contentTypes:any = ContentType;
  unPinnedNotes:any = [];
  pinnedNotes:any = [];
  noteDetails: any;
  submiting = false;
  @ViewChild(ToastContainerDirective, { static: false })
  toastContainer!: ToastContainerDirective;
  @Output() confirmStatus = new EventEmitter();
  @Input() configurationOfNotes: any = { isCreateNotesRequired: false, relatedNotesDashboard: true, contentPlayerView: false, contentPlayerRelatedNotes: false, type: '', height: 'fixed' };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notesService: NotesService,
    private notesLeftPaneComponent: NotesLeftPaneComponent,
    private ngbModal: NgbModal,
    private translate: TranslateService,
    private toastrService: ToastrService,
    private dialogService: DialogService,
    private storageService: StorageService,
    private routeOperationService: RouteOperationService) {
    this.notesService.notePositionInContent.subscribe((notePositionInContent:any) => {
      this.notePositionInContent = notePositionInContent.toString();
      this.ngOnInit();
    });
    this.notesService.noteEmitter.subscribe((id:any) => {
      this.relatedNotes = [];
      this.currentNoteId = id;
      if(this.currentNoteId){
        this.getAllNotes();
        this.loadCurrentNote();
        this.loadrelatedNotes();
      }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.notesService.getNotesState().subscribe(async (val: any) => {
      await this.getAllNotes();
      await this.loadCurrentNote();
      await this.loadrelatedNotes();
    });

  }

  async ngOnInit() {
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    this.courseId = snapshot?.root.firstChild?.firstChild?.firstChild?.firstChild?.params.courseId;
    if (!this.configurationOfNotes.contentPlayerView) {
      this.routeOperationService.listen('noteId').subscribe(async (data: string) => {
        this.currentNoteId = data;
        await this.getAllNotes();
        await this.loadCurrentNote();
        await this.loadrelatedNotes();
      });
    }
    else {
      combineLatest([this.activatedRoute.parent?.parent?.parent?.params, this.activatedRoute.params, this.activatedRoute.queryParams]).subscribe(async (params: any) => {
        this.currentElementId = params[0].id;
      });

      await this.getAllNotes();

      if (this.currentElementId) {
        await this.notesService.getNotesByElementId(this.courseId, this.currentElementId).then((res: any) => {
          this.relatedNotes = this.chronologicalOrder(res.body);
        });
        if (this.configurationOfNotes.contentPlayerRelatedNotes || this.configurationOfNotes.isCreateNotesRequired) {
          this.contentTypeNotes();
        }
      } else {
        await this.loadrelatedNotes();
      }
    }
  }
  async getCurrentElementId(noteId:any){
    if(!this.currentElementId && !noteId){
      this.currentElementId = this.allNotes[0].elementId;
    }else if(noteId){
      this.allNotes.forEach((element:any) => {
        if(element.noteId === noteId){
          this.currentElementId = element.elementId;
        }
      });
    }else{
      this.currentNoteId = this.allNotes[0].noteId;
    }
  }
  async getAllNotes(){
    if(this.courseId){
      await this.notesService.getAllNotes(this.courseId).then((res: any) => {
        this.allNotes = res.body;
        this.notesService.emptyNotes(this.allNotes.length);
        
      });
    }
  }

  async getElementDetail(): Promise<any> {
    await this.storageService.listen(StorageKey.ELEMENT_DETAIL).subscribe((res: any) => { this.noteDetails = res; } );
  }

  async contentTypeNotes() {
    if (this.relatedNotes.length > 0) {
      await this.getElementDetail();
      const finiteNoteContentTypes: Array<string> = [ContentType.PDF, ContentType.DOCUMENT];
      const infiniteNoteContentTypes: Array<string> = [ContentType.IMAGE, ContentType.WEBLINK, ContentType.SCORM, ContentType.HTML, ContentType.EPUB];
      const infiniteNoteExtensions: Array<string> = ["xls", "xlsx", "epub"];
      if (finiteNoteContentTypes.includes(this.relatedNotes[0].contentType) && !infiniteNoteExtensions.includes(this.noteDetails.fileExtension)) {
        const positionOfNotesArray: any = [];
        this.relatedNotes.forEach((element: any) => {
          if (!positionOfNotesArray.includes(element.notePositionInContent)) {
            positionOfNotesArray.push(element.notesPositionInContent);
          }
          if (element.notesPositionInContent === this.notePositionInContent) {
            this.specificContentNotes = [element];
          }
        });
        if (positionOfNotesArray.includes(this.notePositionInContent)) {
          this.configurationOfNotes.isCreateNotesRequired = false;
          this.configurationOfNotes.relatedNotesDashboard = false;
          this.configurationOfNotes.contentPlayerRelatedNotes = true;
        } else {
          this.configurationOfNotes.isCreateNotesRequired = true;
          this.configurationOfNotes.relatedNotesDashboard = false;
          this.configurationOfNotes.contentPlayerRelatedNotes = false;
        }
      } else if (infiniteNoteContentTypes.includes(this.relatedNotes[0].contentType) || infiniteNoteExtensions.includes(this.noteDetails.fileExtension)) {
        this.specificContentNotes = this.relatedNotes;
        this.configurationOfNotes.isCreateNotesRequired = true;
        this.configurationOfNotes.contentPlayerRelatedNotes = true;
        this.notePositionInContent = "";
      } else {
        console.log("Other content type");
      }
    } else {
      this.configurationOfNotes.isCreateNotesRequired = true;
      this.configurationOfNotes.relatedNotesDashboard = false;
      this.configurationOfNotes.contentPlayerRelatedNotes = false;
    }
  }

  async getMessageTranslations() {
    for (const key in this.messagesTranslations) {
      if (Object.prototype.hasOwnProperty.call(this.messagesTranslations, key)) {
        this.messagesTranslations[key] = await this.translate.get(this.messagesTranslations[key]).toPromise();
      }
    }
  }

  loadCurrentNote() {
    if(this.allNotes.length > 0){
      this.allNotes.forEach((element: any) => {
        if (element.noteId === this.currentNoteId) {
          this.currentNote = element;
          if (element.title.indexOf("...") >= 0){
            const noteTitle = element.title.split("...")[1];
            this.currentNoteTitle =noteTitle;
          }else{
            this.currentNoteTitle = element.title;
          }
        }
      });
    }
  }

  chronologicalOrder(array: any) {
    // eslint-disable-next-line id-length
    return array.sort(function (a: any, b: any) {
      return Number(new Date(b.updatedOn)) - Number(new Date(a.updatedOn));
    });
  }

  async loadrelatedNotes() {
    this.relatedNotes = [];
    let currentElement:any;
    if(this.allNotes.length > 0){
      this.allNotes.forEach((element: any) => {
        if (element.noteId === this.currentNoteId) {
          currentElement = element;
        }
      });
      if(currentElement){
        let elementRelatedNotes: any;
        await this.notesService.getNotesByElementId(this.courseId, currentElement.elementId).then((res: any) => {
          elementRelatedNotes = res.body;
        });
        this.relatedNotes = [];
        elementRelatedNotes.forEach((element: any) => {
          if (element.noteId !== this.currentNoteId) {
            this.relatedNotes.push(element);
          }
        });
        this.relatedNotes = this.chronologicalOrder(this.relatedNotes);
      }
    }
  }

  loadNote(noteId: any, event: any): void {
    this.notesService.noteEmitter.next(noteId);
    if(event){
      event.stopPropagation();
    }
    setTimeout(() => {
      const dom:any = document.getElementById('note_' + noteId);
      dom.scrollIntoView();
      (document.getElementById('notes-right-panel') as HTMLInputElement).scrollTop = 0;
    }, 750);
  
  }

  pin(noteId: any, event:Event, from: any) {
    event.stopPropagation();
    this.allNotes.forEach((element:any) => {
      if(element.noteId === noteId){
        if(element.isPinned){
          this.notesService.pinUnpin(noteId, false).then(async (res: any) => {
            if (res.status === 200) {
              if(from === 'related'){
                await this.notesService.setNotesStateFromRelative(noteId);
                await this.isPinnedUpdate(noteId);
              }else{
                this.notesService.setNotesState(noteId);
              }
            }
            else {
              throw new Error("Something went wrong!!");
            }
          }).catch((err:any) => {
            this.notesToast = true;
            this.toastType = "error";
            this.toastMessage = err.error;
          });
        }else{
          this.notesService.pinUnpin(noteId, true).then(async (res: any) => {
            if (res.status === 200) {
              if(from === 'related'){
                await this.notesService.setNotesStateFromRelative(noteId);
                await this.isPinnedUpdate(noteId);
              }else{
                this.notesService.setNotesState(noteId);
              }
            }
            else {
              throw new Error("Something went wrong!!");
            }
          }).catch((err:any) => {
            this.notesToast = true;
            this.toastType = "error";
            this.toastMessage = err.error;
          });
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async isPinnedUpdate(noteId: any){
    this.loadrelatedNotes();
  }
  sumbitNoteCreateForm() {
    this.notesToast = false;
    this.submiting = true;
    if (this.noteCreateForm.valid) {
      this.noteCreateForm.controls['notesPositionInContent'].setValue(this.notePositionInContent);
      this.notesService.saveNote(this.noteCreateForm.value, this.courseId, this.currentElementId).then((res: any) => {
        if (res.status === 200) {
          this.submiting = false;
          this.notesToast = true;
          this.toastType = "success";
          let createdSuccessMessage;
          this.translate.get("notes.createdSuccessMessage").subscribe(val => {
            createdSuccessMessage = val;
          });
          this.toastMessage = createdSuccessMessage;
          this.noteCreateForm.reset();
          this.ngOnInit();
          this.notesService.setNotesState(true);
          this.createForm = false;
        }
      }).catch((err:any) => {
        this.submiting = false;
        this.notesToast = true;
        this.toastType = "error";
        this.toastMessage = err.error;
      });
    }

  }

  async refreshNotes() {
    this.notesService.noteEmitter.next(this.allNotes[0].noteId);
    this.ngOnInit();
  }

  sumbitNoteEditForm() {
    this.notesToast = false;
    this.submiting = true;
    if (this.noteEditForm.valid) {
      this.notesService.editNote(this.noteEditForm.value, this.currentNoteId).then(async (res: any) => {
        if (res.status === 200) {
          this.submiting = false;
          this.noteEdit = false;
          this.modelRef.close();
          this.notesToast = true;
          this.toastType = "success";
          let updatedSuccessMessage;
          this.translate.get("notes.updatedSuccessMessage").subscribe(val => {
            updatedSuccessMessage = val;
          });
          this.toastMessage = updatedSuccessMessage;
          if(this.configurationOfNotes.isCreateNotesRequired || this.configurationOfNotes.contentPlayerRelatedNotes){
            this.ngOnInit();
          }else{
            this.notesService.noteEmitter.next(this.currentNoteId);
            await this.notesService.setNotesState(this.currentNoteId);
          }
        }
      }).catch((err:any) => {
        this.submiting = false;
        if (err.status === 401) {
          this.noteEdit = false;
          this.notesToast = true;
          this.toastType = "error";
          this.toastMessage = err.error;
        } else if (err.status === 404) {
          this.noteEdit = false;
          this.notesToast = true;
          this.toastType = "error";
          this.toastMessage = err.error;
        }
      });
    }
  }

  editNote(note: any, event: any, modal: any) {
    this.modelRef = this.ngbModal.open(modal, { backdrop: 'static', centered: true, modalDialogClass: 'edit-note', animation: true });
    this.noteEditForm.patchValue(note);
    this.noteEdit = true;
    this.currentNoteId = note.noteId;
    event.stopPropagation();
  }

  async deleteNote(note: any, event: any, from:any) {
    event.stopPropagation();
    console.log(note);
    
    const confirmation = await this.dialogService.showConfirmDialog({title: {translationKey: 'notes.deleteConfirmation'}});
    if (confirmation) {
      await this.getCurrentElementId(note.noteId);
      await this.notesService.deleteNote(note.noteId).then(async (res: any) => {
        if (res.status === 200) {
          this.notesToast = true;
          this.toastType = "success";
          let deletedSuccessMessage;
          this.translate.get("notes.deletedSuccessMessage").subscribe(val => {
            deletedSuccessMessage = val;
          });
          this.toastMessage = deletedSuccessMessage;
          await this.notesService.getNotesByElementId(this.courseId, this.currentElementId).then(async (res: any) => {
            if(res.body.length > 0){
              if(from === 'related'){
                await this.notesService.setNotesState(this.currentNoteId);
              }else{
                this.currentNoteId = res.body.at(-1).noteId;
                await this.notesService.setNotesState(res.body.at(-1).noteId);
              }
              
            }else{
              await this.getAllNotes();
              this.allNotes.forEach((element:any) => {
                if(element.isPinned === true){
                  this.pinnedNotes.push(element);
                }else{
                  this.unPinnedNotes.push(element);
                }
              });
              this.unPinnedNotes = this.chronologicalOrder(this.unPinnedNotes);
              this.pinnedNotes = this.chronologicalOrder(this.pinnedNotes);
              this.storageService.set("pinnedNotes", this.pinnedNotes);
              this.storageService.set("unPinnedNotes", this.unPinnedNotes);
              if(this.pinnedNotes.length > 0){
                this.currentElementId = this.pinnedNotes[0].elementId;
                this.currentNoteId = this.pinnedNotes[0].noteId;
                await this.notesService.setNotesState(this.pinnedNotes[0].noteId);
              }else{
                this.currentElementId = this.unPinnedNotes[0].elementId;
                this.currentNoteId = this.unPinnedNotes[0].noteId;
                await this.notesService.setNotesState(this.unPinnedNotes[0].noteId);
              }
            }
          
            if(this.configurationOfNotes.isCreateNotesRequired || this.configurationOfNotes.contentPlayerRelatedNotes){
              this.ngOnInit();
            }else{
              this.loadCurrentNote();
              this.loadrelatedNotes();
            }
          });

        } else {
          throw new Error("Something went wrong!!");
        }

      }).catch((err:any) => {
        this.notesToast = true;
        this.toastType = "error";
        this.toastMessage = err.error || err;
      });
    } else {
      if(this.modelRef){
        this.modelRef.close();
      }
      this.sendConfirmStatus(false);
      // eslint-disable-next-line no-useless-return
      return;
    }
  }

  cancelNote() {
    this.noteEditForm.reset();
    this.noteEdit = false;
    this.modelRef.close();
  }

  cancelCreateNote() {
    this.noteCreateForm.reset();
    this.noteEdit = false;
    this.createForm = false;
  }

  closeToast(): void {
    this.notesToast = false;
    if (this.modelRef) {
      this.modelRef.close();
    }
  }

  sendConfirmStatus(value: boolean): void {
    const payload = { type: value, node: this.activeNode };
    this.confirmStatus.emit(payload);
  }

  showCreateForm() {
    this.createForm = true;
  }

  goToContent(currentNote: any) {
    const dialogConfig: Dialog = {
      type: DialogTypes.WARNING,
      title: {
        translationKey: 'qna.question.contentDeleted'
      }
    };
    if (currentNote.title !== "This Content has been deleted.") {
      this.router.navigate([`../content-area/list/content/${currentNote.elementId}`], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge' });
    }
    else {
      this.dialogService.showAlertDialog(dialogConfig);
    }
  }
}