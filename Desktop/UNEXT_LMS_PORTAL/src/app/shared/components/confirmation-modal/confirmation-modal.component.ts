import { TranslateService } from '@ngx-translate/core';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalConfig = {
    message: 'confirmModal.text',
    confirmBtn: 'confirmModal.confirmButton',
    cancelBtn: 'confirmModal.cancelButton'
  };
  @Output() confirmStatus = new EventEmitter();

  constructor(private translate: TranslateService) {

  }
  sendConfirmStatus(value = true): void {
    this.confirmStatus.emit(value);
  }

}
