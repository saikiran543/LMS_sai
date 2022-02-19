import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {NgbModal, NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmationModalComponent} from "../shared/components/confirmation-modal/confirmation-modal.component";
import { Dialog } from '../Models/Dialog';
import { AlertModalComponent } from '../shared/components/alert-modal/alert-modal.component';
import { SelectionModelComponent } from '../shared/components/selection-model/selection-model.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  ngbModelOptions: NgbModalOptions ={
    backdrop: 'static',
    size: 'md'
  }
  constructor(private translate: TranslateService, private ngbModal: NgbModal) {
    
  }
  
  public showConfirmDialog(dialog: Dialog): Promise<boolean> {
    dialog.ngbModelOptions = {...this.ngbModelOptions,...dialog.ngbModelOptions};
    const modalRef:NgbModalRef = this.ngbModal.open(ConfirmationModalComponent, dialog.ngbModelOptions);
    return this.executeDialog(dialog, modalRef);
  }

  public showAlertDialog(dialog: Dialog): Promise<boolean> {
    dialog.ngbModelOptions = {...this.ngbModelOptions,...dialog.ngbModelOptions};
    const modalRef:NgbModalRef = this.ngbModal.open(AlertModalComponent, dialog.ngbModelOptions);
    return this.executeDialog(dialog, modalRef);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public showSelectionDialog(dialog: Dialog): Promise<any> {
    dialog.ngbModelOptions = {...this.ngbModelOptions,...dialog.ngbModelOptions};
    const modalRef:NgbModalRef = this.ngbModal.open(SelectionModelComponent, dialog.ngbModelOptions);
    modalRef.componentInstance.modalConfig.options = dialog.options;
    return this.executeDialog(dialog, modalRef);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async executeDialog(dialog:Dialog, modalRef:NgbModalRef) {
    const translatedTitle = await this.translate.get(dialog.title.translationKey,dialog.title.translateArgs).toPromise();
    const component = modalRef.componentInstance;
    component.modalConfig.type = dialog.type;
    component.modalConfig.message = translatedTitle;
    return new Promise<boolean>((resolve) => {
      component.confirmStatus.subscribe((status: boolean) => {
        modalRef.close();
        resolve(status);
      });
    });

  }
}
