import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-popup-self-task',
  templateUrl: './popup-self-task.component.html',
  styleUrls: ['./popup-self-task.component.scss']
})
export class PopupSelfTaskComponent {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any = {};
  @Output() cancelStatus = new EventEmitter()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  charactersRemaining(time: number): any{
    return {
      remainder: time
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  closePopup(){
    this.cancelStatus.emit(true);
  }

}
