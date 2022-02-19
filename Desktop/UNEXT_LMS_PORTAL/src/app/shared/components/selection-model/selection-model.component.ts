import { Component, Output,EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-selection-model',
  templateUrl: './selection-model.component.html',
  styleUrls: ['./selection-model.component.scss']
})
export class SelectionModelComponent {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalConfig:any = {
    type: 'singleSelect',
    message: 'confirmModal.text',
    options: [],
    confirmBtn: 'confirmModal.confirmButton',
    cancelBtn: 'confirmModal.cancelButton',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedOptions: any

  @Output() confirmStatus = new EventEmitter();

  constructor(private translate: TranslateService) {

  }
  sendConfirmStatus(): void {
    this.confirmStatus.emit(this.selectedOptions);
  }

  sendCancelStatus(): void {
    this.confirmStatus.emit(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  selectOptions(option:any) : void{
    if (this.modalConfig.type ==='singleSelect' && !option.disable) {
      this.selectedOptions = option;
    }
  }
}
