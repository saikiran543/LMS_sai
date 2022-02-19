/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, distinctUntilChanged } from 'rxjs';
import { ScreenSizeKey } from 'src/app/enums/screenSizeKey';
import { StorageKey } from 'src/app/enums/storageKey';
import { NotesService } from 'src/app/learning-center/course-services/notes.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-notes-left-pane',
  templateUrl: './notes-left-pane.component.html',
  styleUrls: ['./notes-left-pane.component.scss']
})
export class NotesLeftPaneComponent implements OnInit {

  allNotes:any = "";
  courseId=""
  allContents: any = "";
  pinnedNotes:any = [];
  unPinnedNotes:any = [];
  currentNoteId: any = "";
  refreshUnPinnedNotes$ = new BehaviorSubject<boolean>(true);
  isMobileOrTablet!: boolean;
  @Output() isShow = new EventEmitter();
  // eslint-disable-next-line max-params
  constructor(private notesService: NotesService,private router:Router, private routeOperationService: RouteOperationService, private changeDetectorRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute, private storageService: StorageService) {
    this.notesService.noteEmitter.subscribe(id => {
      if (id) {
        this.currentNoteId = id;
        this.showNote(id);
      }
    });

    this.notesService.getNotesState().subscribe( async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      noteId) => {
      this.updateLeftpanel(noteId);
    });

    this.notesService.getNotesStateFromRelative().subscribe( async (noteId) =>{
      this.updateLeftpanelFromRelative(noteId);
    });
  }

  async ngOnInit() {
    this.getScreenType();
    await combineLatest([this.activatedRoute.parent?.parent?.parent?.params, this.activatedRoute.params, this.activatedRoute.queryParams]).subscribe(async (params: any) => {
      const courseId = params[1].courseId;
      this.courseId = courseId;
    });
    if(this.courseId){
      await this.initializeNotes();
    }
  }

  getScreenType(): void {
    this.storageService.listen(StorageKey.CURRENT_DEVICE).pipe(distinctUntilChanged()).subscribe(screenType => {
      this.isMobileOrTablet = screenType === ScreenSizeKey.MOBILE || screenType === ScreenSizeKey.TABLET ? true : false;
      switch (screenType) {
        case ScreenSizeKey.TABLET:
          this.isMobileOrTablet = true;
          break;
        case ScreenSizeKey.MOBILE:
          this.isMobileOrTablet = true;
          break;
        default:
          this.showNote(this.currentNoteId);
          break;
      }
    });
  }

  async updateLeftpanelFromRelative(noteId: any){
    this.pinnedNotes = [];
    this.unPinnedNotes = [];
    this.pinnedNotes = await this.storageService.get("pinnedNotes");
    this.unPinnedNotes = await this.storageService.get("unPinnedNotes");
    const isUnpinnned = await this.unPinnedNotes.filter((element: any) => {
      if(element.noteId === noteId){
        return element;
      }
    });
    const isPinnned = await this.pinnedNotes.filter((element: any) => {
      if(element.noteId === noteId){
        return element;
      }
    });
    if(isUnpinnned && isUnpinnned.length > 0){
      this.unPinnedNotes = await this.unPinnedNotes.filter((element: any) => {
        if(element.noteId !== noteId){
          return element;
        }
      });
      if(!this.pinnedNotes.includes(isUnpinnned[0])){
        isUnpinnned[0].isPinned = true;
        this.pinnedNotes.push(isUnpinnned[0]);
      }
    }else{
      this.pinnedNotes = await this.pinnedNotes.filter((element: any) => {
        if(element.noteId !== noteId){
          return element;
        }
      });
      if(!this.unPinnedNotes.includes(isPinnned[0])){
        isPinnned[0].isPinned = false;
        this.unPinnedNotes.push(isPinnned[0]);
      }
    }
    this.unPinnedNotes = await this.chronologicalOrder(this.unPinnedNotes);
    this.pinnedNotes = await this.chronologicalOrder(this.pinnedNotes);
    await this.storageService.set("pinnedNotes", this.pinnedNotes);
    await this.storageService.set("unPinnedNotes", this.unPinnedNotes);
  }

  async initializeNotes(){
    this.allNotes = [];
    await this.notesService.getAllNotes(this.courseId).then((res: any) => {
      this.allNotes = res.body;
      this.changeDetectorRef.detectChanges();
    });
    this.pinnedNotes = [];
    this.unPinnedNotes = [];
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

    await this.routeOperationService.listen('noteId').subscribe((data) => {
      this.currentNoteId = data;
    });
    if(this.currentNoteId){
      this.notesService.noteEmitter.next(this.currentNoteId);
    }else{
      // eslint-disable-next-line no-lonely-if
      if(this.pinnedNotes.length > 0){
        this.currentNoteId = await this.pinnedNotes.forEach((element: any) => {
          if (element.noteId === this.currentNoteId) {
            this.loadNote(element.noteId);
            return element.noteId;
          // eslint-disable-next-line no-else-return
          }else{
            return null;
          }
        });
        if(!this.currentNoteId){
          this.notesService.noteEmitter.next(this.pinnedNotes[0].noteId);
        }
      }else{
        this.currentNoteId = await this.unPinnedNotes.forEach((element: any) => {
          if (element.noteId === this.currentNoteId) {
            this.loadNote(element.noteId);
            return element.noteId;
          // eslint-disable-next-line no-else-return
          }else{
            return null;
          }
        });
        if(!this.currentNoteId){
          this.notesService.noteEmitter.next(this.unPinnedNotes[0].noteId);
        }
      }
    }
  }

  async updateLeftpanel(noteId: any){
    if(this.courseId){
      await this.notesService.getAllNotes(this.courseId).then((res: any) => {
        this.allNotes = res.body;
      });
    }
    if(this.allNotes.length > 0){
      this.pinnedNotes = [];
      this.unPinnedNotes = [];
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
      this.currentNoteId = noteId;
      this.showNote(noteId);
    }
  }

  refreshPinnedUnpinnedArray(){
    this.changeDetectorRef.detectChanges();
  }

  chronologicalOrder(array: any){
    // eslint-disable-next-line id-length
    return array.sort(function(a:any,b:any){
      return Number(new Date(b.updatedOn)) - Number(new Date(a.updatedOn));
    });
  }

  loadNote(noteId: any) {
    this.currentNoteId = noteId;
    this.routeOperationService.listen('noteId').subscribe((data: string) => {
      if (data && data !== "undefined") {
        this.currentNoteId = data;
      }
      this.showNote(this.currentNoteId);
    });
  }

  showNote(currentNoteId: string): void {
    if (this.isMobileOrTablet) {
      this.isShow.emit(true);
    }
    this.router.navigate(['./' + currentNoteId], { relativeTo: this.activatedRoute, queryParams: { courseDropDown: false, toc: false }, queryParamsHandling: 'merge' });
  }

  clickNote(noteId:any, event:any){
    event.stopPropagation();
    this.currentNoteId = noteId;
    this.showNote(noteId);
  }
  
  async unPin(noteId:any, pin:boolean, event: any){
    event.stopPropagation();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.notesService.pinUnpin(noteId, pin).then((res: any) => {
      if(res.status === 200){
        this.notesService.setNotesState(noteId);
      }
    });
  }

  scrollToSpecificNote(noteId: any): void {
    if(noteId !== true && noteId){
      const selectDOM = document.getElementById('note_'+noteId)as HTMLDivElement;
      if(selectDOM){
        (selectDOM).scrollIntoView(true);
      }
    }
  
  }
}
