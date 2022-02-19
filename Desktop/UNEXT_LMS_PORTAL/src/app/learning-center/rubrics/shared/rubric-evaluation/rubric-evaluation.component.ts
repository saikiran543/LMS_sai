/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { CommonService } from 'src/app/services/common.service';
import { RubricsService } from '../../service/rubrics.service';
import { EvaluationInstructionsModalComponent } from './evaluation-instructions-modal/evaluation-instructions-modal.component';

@Component({
  selector: 'app-rubric-evaluation',
  templateUrl: './rubric-evaluation.component.html',
  styleUrls: ['./rubric-evaluation.component.scss']
})
export class RubricEvaluationComponent implements OnInit {
  @Input() rubricId!: string;
  @Input() feedback!:FormControl;
  @Output() rubricEvaluationSave = new EventEmitter()
  rubricData!: any;
  evaluationInstructionsModalRef!: NgbModalRef;
  criterias!: any;
  levelNames!: string
  levelKeys: any = [];
  scores:any = [];
  totalSum = 0;
  selectedLevel!: number;
  levelPercentage!: number;
  innerWidth!: number;
  levelNumbers: any = [];
  showLeftArrow = false;
  showRightArrow = false;
  overRideScoreValidate = false;
  saveEvaluation = true;
  constructor(private rubricService: RubricsService, private CommonService: CommonService, private ngbModal: NgbModal) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.CommonService.rubricEvaluationSave.pipe(filter((data: any) => data.type === 'saveEvaluation')).subscribe((data: any) => {
      this.saveForm();
    });
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth >= 1920? 3: 2;
    this.loadDependencies();
  }
  async loadDependencies(){
    if(this.rubricId) {
      const {body} = await this.rubricService.sendMessageToBackEnd(Service.COURSE_SERVICE, `rubrics/${this.rubricId}`, HttpMethod.GET, '{}');
      this.rubricData = body;
      this.levelNames = body.levelNames;
      body.levelNames.forEach((level: any) => {
        this.levelKeys = [...this.levelKeys,...Object.keys(level)];
      });
      this.criterias = this.rubricData.criterias;
      this.criterias.forEach((element: any) => {
        this.getLevelNumbers(element);
        this.scoreCal(element, element.levelNumbers[0]);
        this.getLevelAndPercentage(element, element.levelNumbers[0]);
        
      });
      this.getTotalSum(this.criterias);
    }
  }
  getPercentage(criteria: any, key:string){
    return criteria.levels[key].percentage;
  }
  scoreCal(criteria: any, level: any){
    criteria["score"] = (Number(criteria.weightage)/100)*Number(criteria.levels[level.levelName].percentage);
  }
  getLevelAndPercentage(criteria: any, key: any, index?: number){
    criteria["selectedLevel"] = index ? key.levelNumber: 1;
    criteria["selectedLevelPercentage"] = Number(criteria.levels[key.levelName].percentage);
  }
  getLevelNumbers(criteria: any){
    this.levelNumbers = [];
    this.levelKeys.forEach((key: any, index: number) => {
      this.levelNumbers.push({levelNumber: index + 1, levelName: key});
    });
    criteria["levelNumbers"] = [...this.levelNumbers];
    criteria["showLeftArrow"] = this.levelKeys.length > this.innerWidth ? true: false;
    criteria["showRightArrow"] = false;
  }
  onLevelChange(criteria: any, level: any, index: number){
    this.scoreCal(criteria, level);
    this.getTotalSum(this.criterias);
    this.levelPercentage = criteria.levels[level.levelName].percentage;
    this.getLevelAndPercentage(criteria, level, index);
  }
  getTotalSum(criterias: any){
    this.totalSum = 0;
    criterias.forEach((criteria: any) => {
      this.totalSum += criteria.score;
    });
  }
  totalScoreCalculation(event: any, index: number){
    let percentageOfOverrideScore: number;
    let percentageOfNextLevel: number;
    const enteredValue = Number(event.target.value);
    let isLevelSelected = false;
    this.overRideScoreValidate = false;
    this.criterias[index].levelNumbers = [...this.levelNumbers];
    const firstLevelPercentage = (Number(this.criterias[index].weightage)/100)*Number(this.criterias[index].levels[this.levelKeys[0]].percentage);
    const lastLevelPercentage = (Number(this.criterias[index].weightage)/100)*Number(this.criterias[index].levels[this.levelKeys[this.levelKeys.length - 1]].percentage);
    //25 10 15 9 30
    if(this.levelKeys.length > 1){
      if(firstLevelPercentage > lastLevelPercentage){
        if(enteredValue > firstLevelPercentage || !(enteredValue >= lastLevelPercentage)){
          this.overRideScoreValidate = true;
        }// 10 25 15 30 9
      }else if(!(firstLevelPercentage <= enteredValue) || enteredValue > lastLevelPercentage){
        this.overRideScoreValidate = true;
      }
    } else if (enteredValue < 0 || enteredValue > firstLevelPercentage){
      this.overRideScoreValidate = true;
    }
    if(!this.overRideScoreValidate){
      this.saveEvaluation = true;
      this.levelKeys.forEach((key: string, _index: number) => {
        if((_index + 1) !== this.levelKeys.length){
          percentageOfOverrideScore = (Number(this.criterias[index].weightage)/100)*Number(this.criterias[index].levels[key].percentage);
          percentageOfNextLevel = (Number(this.criterias[index].weightage)/100)*Number(this.criterias[index].levels[this.levelKeys[_index + 1]].percentage);
          if(!isLevelSelected && enteredValue >= percentageOfOverrideScore && enteredValue > percentageOfNextLevel){
            this.criterias[index].selectedLevel = _index + 1;
            this.criterias[index].selectedLevelPercentage = this.criterias[index].levels[key].percentage;
            this.criterias[index].score = Number(event.target.value);
            isLevelSelected = true;
          }
        }else if(!isLevelSelected){
          this.criterias[index].selectedLevel = _index + 1;
          this.criterias[index].selectedLevelPercentage = this.criterias[index].levels[key].percentage;
          this.criterias[index].score = Number(event.target.value);
        }
      });
      if(this.criterias[index].selectedLevel > this.innerWidth){
        this.criterias[index].levelNumbers.splice(0, (this.criterias[index].selectedLevel - this.innerWidth));
      }
      this.getTotalSum(this.criterias);
    }else{
      this.overRideScoreValidate = false;
      this.saveEvaluation = false;
      this.criterias[index].selectedLevel = null;
      this.rubricService.showErrorToast(this.rubricService.messagesTranslations.rubricEvaluationError, 'toast-top-center');
    }
  }
  scrollLeft(criteria: any){
    criteria["showRightArrow"] = true;
    criteria.levelNumbers.splice(0, 1);
    criteria.showLeftArrow = criteria.levelNumbers.length > this.innerWidth ? true: false;
  }
  scrollRight(criteria: any){
    const _index = this.levelNumbers.findIndex((obj: any) => obj.levelNumber === criteria.levelNumbers[0].levelNumber);
    criteria.levelNumbers.splice(0, 0, this.levelNumbers[_index - 1]);
    criteria.levelNumbers.join();
    criteria.showRightArrow = criteria.levelNumbers[0].levelNumber - 1 === 0 ? false: true;
    criteria.showLeftArrow = criteria.levelNumbers.length > this.innerWidth ? true: false;
  }
  saveForm(){
    if(this.saveEvaluation){
      this.totalSum;
      const payLoad = {criteria: this.criterias, levelNames: this.levelNames, totalSum: this.totalSum, feedback: this.feedback?.value || ''};
      this.rubricEvaluationSave.emit(payLoad);
    }else{
      this.rubricService.showErrorToast(this.rubricService.messagesTranslations.rubricEvaluationError, 'toast-bottom-right');
    }
  }

  triggerEvaluationInstructionModal() {
    this.evaluationInstructionsModalRef = this.ngbModal.open(EvaluationInstructionsModalComponent, { backdrop: 'static', centered: true, modalDialogClass: 'evaluation-instructions-modal', animation: true });
  }
}
