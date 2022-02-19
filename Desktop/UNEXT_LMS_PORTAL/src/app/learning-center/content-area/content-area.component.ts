/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { ContentService } from '../course-services/content.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng7BootstrapBreadcrumbService } from 'ng7-bootstrap-breadcrumb';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/app/services/dialog.service';
import { Dialog } from 'src/app/Models/Dialog';
import { RouteOperationService } from 'src/app/services/route-operation.service';
import { Subject, takeUntil } from 'rxjs';
import { CourseListService } from '../course-services/course-list.service';
import * as lodash from 'lodash';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProgressWrapperComponent } from './progress/shared/progress-wrapper/progress-wrapper.component';
import { ProgressOperations } from 'src/app/enums/progressOperations';
import { ScreenSizeKey } from 'src/app/enums/screenSizeKey';

@Component({
  selector: 'app-content-area',
  templateUrl: './content-area.component.html',
  styleUrls: ['./content-area.component.scss']
})
export class CourseComponent {
    
  view!: string;
  previewModeOfTree = false;
  courseId!: string;
  selectedCourseData!: any;
  breadcrumb!:any;
  private unsubscribe$ = new Subject<void>();
  currentDevice!: string;
  isInitializeContentBuilder!: boolean //it used to initialize content-builder based on query params
  // eslint-disable-next-line max-params
  IsShowProgress!: boolean
  type!: string
  modalRef!:NgbModalRef;
  constructor(private courseListService: CourseListService, private storageService: StorageService,private activateRoute: ActivatedRoute,private router: Router, private contentService: ContentService, private ng7BootstrapBreadcrumbService: Ng7BootstrapBreadcrumbService,private toastService: ToastrService, private translate: TranslateService, private dialogService: DialogService,private routeOperation:RouteOperationService, private ngbModal: NgbModal){

  }

  async ngOnInit(): Promise<void> {
    this.storageService.listen('previewMode').subscribe((data)=>{
      this.previewModeOfTree = data;
    });
    this.view = this.storageService.get(StorageKey.USER_CURRENT_VIEW);
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.routeOperation.listenAllParams().pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {

      if (res.queryParams && res.queryParams.rightNav && res.queryParams.rightNav === 'contentBuilder') {
        this.isInitializeContentBuilder = true;
      }
      else {
        this.isInitializeContentBuilder = false;
      }
      
      try {
        //this.storageService.get(StorageKey.COURSE_JSON);
        if(this.courseId !== res.params.courseId){
          this.courseId = res.params.courseId;
          this.getContent(res.params.courseId);
        }else{
          this.storageService.get(StorageKey.COURSE_JSON);
        }
      } catch (error) {
        this.getContent(res.params.courseId);
      }
      //this.getContent(res.params.courseId);

      this.selectedCourseData = this.courseListService.getCourseList();
      
    });
    this.breadcrumb = { semester: 'semester1', courseName: lodash.find(this.selectedCourseData, {id: this.courseId})?.title };
    this.ng7BootstrapBreadcrumbService.updateBreadcrumbLabels(this.breadcrumb);
    this.router.navigate([], { relativeTo: this.activateRoute, queryParams: { courseDropDown: true}, queryParamsHandling: 'merge'});
  }

  getContent(courseId: string): void {
    this.contentService.getContentDetails(courseId, true);
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async publishAll(){
    try{
      await this.contentService.publishAll(this.courseId);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(error:any){
      if (error.status !== 409) {
      
        const message = error.message;
        const dialog: Dialog = {title: { translationKey: message}};
        await this.dialogService.showAlertDialog(dialog);
      }
    }
  }

  async resume(): Promise<void> {
    try{
      const elementId = await this.contentService.resume(this.courseId);
      if(elementId){
        this.router.navigate([`./list/content/${elementId}`], { relativeTo: this.activateRoute, queryParams: { toc: true }, queryParamsHandling: 'merge' });
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(error:any){
      if (error.status !== 409) {
      
        const message = error.message;
        const dialog: Dialog = {title: { translationKey: message}};
        await this.dialogService.showAlertDialog(dialog);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  onClick(event: any): void {
    switch (event) {
      case 'contentBuilder':
        this.router.navigate([], { relativeTo: this.activateRoute, queryParams: { rightNav: event }, queryParamsHandling: 'merge' });
        break;
      case 'contentPreview':
        this.router.navigate([], { relativeTo: this.activateRoute, queryParams: { preview: 'true' }, queryParamsHandling: 'merge' });
        break;
      case 'contentPublishAll':
        this.publishAll();
        break;
      case 'resume':
        this.resume();
        break;
      case ProgressOperations._CLASS_PROGRESS:
      case ProgressOperations._MY_PROGRESS:
        this.currentDevice = this.storageService.get(StorageKey.CURRENT_DEVICE);
        if(this.currentDevice === ScreenSizeKey.MOBILE && event === ProgressOperations._MY_PROGRESS){
          this.openResponsiveModal(event);
        }else{
          this.IsShowProgress = this.IsShowProgress ? false: true;
          this.type = event;
        }
        break;
      default:
        break;
    }
  }
  openResponsiveModal(type: string): void{
    const modalDialogClass = 'content-builder-modal add-learning-objective-modal';
    this.modalRef = this.ngbModal.open(ProgressWrapperComponent, { backdrop: true, size: 'xl', centered: true, modalDialogClass: modalDialogClass, backdropClass: 'dialog-modal' });
    this.modalRef.componentInstance.type = type;
  }
  ngOnDestroy(): void{
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}