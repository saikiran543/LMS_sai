/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RubricOperations } from 'src/app/enums/rubricOperations';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @Output() confirmStatus = new EventEmitter()
  @Output() onSelectStructure = new EventEmitter()

  criteria = [0,1,2,3,4,5,6];
  levels = [0,1,2,3,4,5,6,7,8,9,10];
  criteriaSelect = true;
  levelSelect = true;
  criteriaValue = 0;
  gradedLevelValue = 0;
  constructor() { }

  ngOnInit(): void {
  }
  onClick(value: boolean){
    const payload = { type: value};
    this.confirmStatus.emit(payload);
  }
  selectCriteria(type: string){
    if(type === 'minus' && this.criteriaValue > 0){
      this.criteriaValue -= 1;
      this.criteriaSelect = this.criteriaValue === 0? true: false;
    }
    if(type === 'plus'){
      this.criteriaValue += 1;
      this.criteriaSelect = false;
    }
    const level = this.criteriaValue > 0? this.gradedLevelValue > 0? this.gradedLevelValue: 1: 0;
    const payload = {type: RubricOperations.CRITERIA, value: this.criteriaValue, value1: level};
    this.onSelectStructure.emit(payload);
  }
  selectGradeLevel(type: string){
    if(type === 'minus' && this.gradedLevelValue > 0){
      this.gradedLevelValue -= 1;
      this.levelSelect = this.gradedLevelValue === 0? true : false;
    }
    if(type === 'plus'){
      this.gradedLevelValue += 1;
      this.levelSelect = false;
    }
    const criteria = this.gradedLevelValue > 0? this.criteriaValue > 0? this.criteriaValue: 1: 0;
    const payload = {type: RubricOperations.LEVELS, value: this.gradedLevelValue, value1: criteria};
    this.onSelectStructure.emit(payload);
  }
  changeValue(type: string, event: any){
    let payload;
    let criteria;
    let level;
    switch (type) {
      case RubricOperations.CRITERIA:
        type = RubricOperations.CRITERIA;
        this.criteriaValue = Number(event.target.value);
        this.criteriaSelect = this.criteriaValue === 0? true : false;
        level = this.criteriaValue > 0? this.gradedLevelValue > 0? this.gradedLevelValue: 1: 0;
        payload = {type: RubricOperations.CRITERIA, value: this.criteriaValue, value1: level};
        break;
      case RubricOperations.GRADED_LEVEL:
        type = RubricOperations.LEVELS;
        this.gradedLevelValue = Number(event.target.value);
        this.levelSelect = this.gradedLevelValue === 0? true : false;
        criteria = this.gradedLevelValue > 0? this.criteriaValue > 0? this.criteriaValue: 1: 0;
        payload = {type: RubricOperations.LEVELS, value: this.gradedLevelValue, value1: criteria};
        break;
      default:
        break;
    }
    this.onSelectStructure.emit(payload);
  }
  onKeyPress(event: any){
    let regex!: RegExp;
    // eslint-disable-next-line prefer-const
    regex = new RegExp(/^\d*\d{0,0}$/g);
    const value = event.key;
    if(!(value && String(value).match(regex))){
      event.preventDefault();
    }
  }
}