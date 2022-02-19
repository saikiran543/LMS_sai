/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rubric-information',
  templateUrl: './rubric-information.component.html',
  styleUrls: ['./rubric-information.component.scss']
})
export class RubricInformationComponent implements OnInit {
  @Output() closeInfoDialog = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }
  closeForm(value: boolean) : void{
    const payload = { type: value};
    this.closeInfoDialog.emit(payload);
  }
}
