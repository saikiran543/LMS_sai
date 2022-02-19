/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RubricOperations } from 'src/app/enums/rubricOperations';

@Component({
  selector: 'app-rubric-attach',
  templateUrl: './rubric-attach.component.html',
  styleUrls: ['./rubric-attach.component.scss']
})
export class RubricAttachComponent implements OnInit {
  params: any = {};
  @Output() confirmStatus = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }
  clickEvent(event: any){
    switch (event) {
      case RubricOperations.CANCEL:
        this.confirmStatus.emit();
        break;
    
      default:
        break;
    }
  }
}
