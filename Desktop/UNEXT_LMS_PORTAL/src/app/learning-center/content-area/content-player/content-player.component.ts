/* eslint-disable max-lines-per-function */
/* eslint-disable max-params */
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb';
import { Subject, takeUntil } from 'rxjs';
import { ContentType } from 'src/app/enums/contentType';
import { ProgressOperations } from 'src/app/enums/progressOperations';
import { ScreenSizeKey } from 'src/app/enums/screenSizeKey';
import { StorageKey } from 'src/app/enums/storageKey';
import { LeftNavService } from 'src/app/services/left-nav.service';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { StorageService } from 'src/app/services/storage.service';
import { ContentPlayerService } from '../../course-services/content-player.service';
import { QuestionAnswerService } from '../../course-services/question-answer.service';
import { ProgressWrapperComponent } from '../progress/shared/progress-wrapper/progress-wrapper.component';

@Component({
  selector: 'app-content-player',
  templateUrl: './content-player.component.html',
  styleUrls: ['./content-player.component.scss']
})
export class ContentPlayerComponent implements OnInit {
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  // eslint-disable-next-line no-invalid-this
  position = new FormControl(this.positionOptions[0]);
  leftMenuActive!: string;
  view!:string;
  IsShowProgress = false;
  type!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  courseId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elementData: any = null
  $unsubscribeRouteOperationService = new Subject<void>();
  modalRef!:NgbModalRef;
  constructor(private leftNavService: LeftNavService, private activatedRoute: ActivatedRoute, private contentPlayerService: ContentPlayerService, private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService, private router: Router, private storageService: StorageService, private questionAnswerService: QuestionAnswerService, private routeOperationService: RouteOperationService, private ngbModal: NgbModal) {

  }

  // eslint-disable-next-line max-lines-per-function
  async ngOnInit(): Promise<void> {
    this.storageService.set('previewMode',true);
    this.view = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    this.routeOperationService.listenAllParams().pipe(takeUntil(this.$unsubscribeRouteOperationService)).subscribe(async ({params, queryParams}) => {
      this.leftMenuActive = queryParams.leftMenu;
      if(params.id && params.courseId){
        await this.initializeForm(params.id, params.courseId);
      }
      this.storageService.set(StorageKey.ELEMENT_ID, params.id);
      this.courseId = params.courseId;
      const breadcrumb = {contentName: 'Course Introduction', courseId: params.courseId, semester: 'semester1', courseName: 'Crash course in Account & Finance'};
      this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(breadcrumb);
    });

    this.leftNavService.getNodeFromToc().subscribe(
      val => {
        if(val && this.courseId){
          this.initializeForm(val, this.courseId);
        }
      });

  }

  private async initializeForm(elementId:string, courseId:string): Promise<void> {
    const response = await this.contentPlayerService.getElementDetail(courseId, elementId);
    this.elementData = response.body;
    this.storageService.set(StorageKey.ELEMENT_DETAIL, this.elementData);
    let navigationUrl ='';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const snapshot:any = this.activatedRoute.snapshot;
    const eligibleSharedModulePaths = ['qna', 'ratings'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sharedModulePathExists = snapshot._urlSegment.segments.some((segment:any) => eligibleSharedModulePaths.includes(segment.path));
    if(sharedModulePathExists) {
      return;
    }
    switch(this.elementData.type.toLowerCase()){
      case 'unit':
      case 'folder':
        navigationUrl = 'unit-folder';
        break;
      case 'image':
        navigationUrl = 'image';
        break;
      case 'weblink':
        navigationUrl = 'weblink';
        break;
      case 'epub':
        navigationUrl = 'epub';
        break;
      case 'scorm':
        navigationUrl = 'scorm';
        break;
      case 'html':
        navigationUrl = 'html';
        break;
      case 'document':
        switch(this.elementData.fileExtension){
          case 'pdf':
            navigationUrl = 'pdf';
            break;
          case 'xls':
          case 'xlsx':
            navigationUrl = 'excel';
            break;
          case 'doc':
          case 'docx':
            navigationUrl = 'other-attachements';
            break;
          default:
            navigationUrl = 'other-attachements';
            break;
        }
        break;
      default:
        navigationUrl = 'other-attachements';
        break;
    }
    if(this.elementData.type === ContentType.DISCUSSION_FORUM) {
      this.router.navigate(['learning-center/' + courseId + '/discussion-forums/forum-detail/' + elementId], { queryParams: {toc: false},queryParamsHandling: 'merge' });
      this.leftNavService.nodeActionPreviousNext.next(false);
      return;
    }
    if(this.router.url.includes('/content/')){
      this.router.navigate(["../"+elementId+"/"+navigationUrl], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve', replaceUrl: true });
    }else{
      this.router.navigate(["./content/"+elementId+"/"+navigationUrl], { relativeTo: this.activatedRoute, queryParamsHandling: 'preserve', replaceUrl: true });
    }
  }
  redirectToFacultyTree():void{
    const queryParams : Params = {
      changeStatus: this.elementData.elementId
    };
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute, queryParams: queryParams, queryParamsHandling: 'merge'});
  }

  showProgress(event: string): void {
    const currentDevice = this.storageService.get(StorageKey.CURRENT_DEVICE);
    switch (event) {
      case ProgressOperations._CLASS_PROGRESS:
      case ProgressOperations._MY_PROGRESS:
        if(currentDevice === ScreenSizeKey.MOBILE && event === ProgressOperations._MY_PROGRESS){
          this.openResponsiveModal(event);
        }else{
          this.IsShowProgress = this.IsShowProgress ? false: true;
          this.type = event;
        }
    }
  }

  ngOnDestroy() : void{
    this.storageService.set('previewMode',false);
    this.$unsubscribeRouteOperationService.complete();
  }

  openResponsiveModal(type: string): void{
    const modalDialogClass = 'content-builder-modal add-learning-objective-modal';
    this.modalRef = this.ngbModal.open(ProgressWrapperComponent, { backdrop: true, size: 'xl', centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
    this.modalRef.componentInstance.type = type;
  }
}
