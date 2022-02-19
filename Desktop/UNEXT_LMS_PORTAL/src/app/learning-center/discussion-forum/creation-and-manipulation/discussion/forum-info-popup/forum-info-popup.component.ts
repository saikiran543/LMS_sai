import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-forum-info-popup',
  templateUrl: './forum-info-popup.component.html',
  styleUrls: ['./forum-info-popup.component.scss']
})
export class ForumInfoPopupComponent {

  @Output() closeEvent = new EventEmitter();

  closeModal(): void {
    this.closeEvent.emit('true');
  }
}
