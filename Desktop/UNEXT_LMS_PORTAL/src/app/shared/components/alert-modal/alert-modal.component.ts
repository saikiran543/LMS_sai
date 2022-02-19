import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent implements OnInit {

  statusIcon = '';
  buttonClass = '';
  modalConfig = {
    message: '',
    type: '',
    confirmBtn: 'alertModal.confirmButton'
  };

  @Output() confirmStatus = new EventEmitter();

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.initProperties();
  }

  initProperties(): void {
    if (this.modalConfig.type === 'success') {
      this.statusIcon = 'success.svg';
      this.buttonClass = 'success-btn';
    } else if (this.modalConfig.type === 'error') {
      this.statusIcon = 'icon-warning-red.svg';
      this.buttonClass = 'error-btn';
    } else if (this.modalConfig.type === 'warning') {
      this.statusIcon = 'icon-warning-orange.svg';
      this.buttonClass = 'warning-btn';
    }
  }

  sendConfirmStatus(): void {
    this.confirmStatus.emit(true);
  }

}
