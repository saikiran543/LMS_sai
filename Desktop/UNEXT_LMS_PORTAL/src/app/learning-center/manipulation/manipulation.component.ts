/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ContentComponent } from '../content-area/creation-and-manipulation/content/content.component';
import { FolderComponent } from '../content-area/creation-and-manipulation/folder/folder.component';
import { UnitComponent } from '../content-area/creation-and-manipulation/unit/unit.component';
import { LocationSelectionComponent } from './location-selection/location-selection.component';
import { combineLatest } from 'rxjs';
import { DiscussionComponent } from '../discussion-forum/creation-and-manipulation/discussion/discussion.component';
import { LearningOutcomeModelComponent } from '../learning-outcome/creation-and-manipulation/learning-outcome-model/learning-outcome-model.component';
import { SelfTaskComponent } from '../calendar/creation-and-manipulation/self-task/self-task.component';

@Component({
  selector: 'app-manipulation',
  templateUrl: './manipulation.component.html',
  styleUrls: ['./manipulation.component.scss']
})
export class ManipulationComponent {

  courseId = '';

  modalRef!:NgbModalRef;

  constructor(private location: Location, private activatedRoute: ActivatedRoute, private ngbModal: NgbModal, private router: Router) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    combineLatest([this.activatedRoute.parent?.parent?.parent?.params, this.activatedRoute.params]).subscribe((paramsArray: any) => {
      const preventReinitilizing = this.router?.getCurrentNavigation()?.extras?.state?.preventReinitilizing;
      const params = {...paramsArray[0],...paramsArray[1]};
      if(!preventReinitilizing) {
        this.initializeForm(params);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeForm(params: any): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let component: any = null;

    switch (params.type) {
      case 'unit':
        component = UnitComponent;
        break;
      case 'folder':
        component = FolderComponent;
        break;
      case 'discussion-forum':
        component = DiscussionComponent;
        break;
      case 'learning-outcome':
        component = LearningOutcomeModelComponent;
        break;
      case 'self-task':
        component = SelfTaskComponent;
        break;
      default:
        component = ContentComponent;
        break;
    }

    let modelType: string;
    switch (params.operation) {
      case "create":
        switch (params.type) {
          case 'learning-outcome':
          case 'self-task':
            modelType = 'modelWithoutLocationSelection';
            break;
        
          default:
            modelType = 'modelWithLocationSelection';
            break;
        }
        break;
      default:
        modelType = 'modelWithoutLocationSelection';
        break;
    }
    
    if (modelType === 'modelWithLocationSelection') {
      this.modalRef = this.openPopup(LocationSelectionComponent,params);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.modalRef.componentInstance.confirmStatus.subscribe(async (res: any) => {
        if (res.type) {
          this.modalRef.close();
          params.parentElementId = res.node._id;
          params.currentActivtedRoute = this.activatedRoute;
          this.modalRef = this.openPopup(component, params);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.modalRef.componentInstance.confirmStatus.subscribe(() => {
            this.modalRef.close();
            this.location.back();
          });
       
        } else {
          this.modalRef.close();
          this.location.back();
        }
      });
    } else{
      params.currentActivtedRoute = this.activatedRoute;
      this.modalRef = this.openPopup(component, params);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.modalRef.componentInstance.confirmStatus.subscribe(() => {
        this.modalRef.close();
        this.location.back();
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  openPopup(component: any, params?:any): NgbModalRef {
    let modalDialogClass = '';
    if(component.name === 'LocationSelectionComponent'){
      modalDialogClass = 'content-builder-modal location-modal';
    }else{
      modalDialogClass = 'content-builder-modal content-modal';
    }
    const modelRef = this.ngbModal.open(component, { backdrop: 'static', size: 'xl', centered: true, modalDialogClass: modalDialogClass, animation: true });
    if (params) {
      modelRef.componentInstance.params= params;
    }
    return modelRef;
  }

  ngOnDestroy(){
    if(this.modalRef?.shown) {
      this.modalRef?.close();
    }
  }
}
