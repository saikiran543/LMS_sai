/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { ProgressOperations } from 'src/app/enums/progressOperations';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() view!:string;
  @Input() progressType!:string;
  @Input() progressValue!: number;
  @Input() isMyProgressLess!: boolean;
  circleWidth!: number
  needleValue!: number
  centralLabel!: string
  options = {}
  description!: string;
  progressText!: string
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.loadDependencies();
  }
  loadDependencies(): void{
    this.getType(this.progressType);
    this.intializeGraphData();
  }
  intializeGraphData(): void{
    this.circleWidth = 150;
    this.centralLabel = '';
    this.needleValue = this.progressValue;
    this.options = {
      hasNeedle: true,
      needleColor: this.getColor(ProgressOperations.NEEDLE_COLOR),
      needleSpeed: 1000,
      arcColors: [this.getColor(ProgressOperations.PROGRESS_COLOR), this.getColor(ProgressOperations.ARC_COLOR)],
      arcDelimiters: [this.getProgress()],
      rangeLabel: [],
      needleStartValue: 0,
    };
  }
  getColor(type: string): string {
    let color!: string;
    switch (type) {
      case ProgressOperations.NEEDLE_COLOR:
        color = this.progressType === ProgressOperations.CLASS_AVERAGE? '#043C77': '#FFFFFF';
        break;
      case ProgressOperations.PROGRESS_COLOR:
        color = this.progressType === ProgressOperations.CLASS_AVERAGE? '#043C77': this.progressType === ProgressOperations.MY_PROGRESS && this.isMyProgressLess? '#FFEF23': '#4AD395';
        break;
      case ProgressOperations.ARC_COLOR:
        color = this.progressType === ProgressOperations.CLASS_AVERAGE? '#FFFFFF': '#1A528C';
        break;
    }
    return color;
  }
  getType(type:string): void {
    switch (type) {
      case ProgressOperations._MY_PROGRESS:
        this.progressType = ProgressOperations.MY_PROGRESS;
        this.description = ProgressOperations.MY_COURSE;
        this.progressText = ProgressOperations.ON_PROGRESS;
        break;
      case ProgressOperations._CLASS_PROGRESS:
        this.progressType = ProgressOperations.CLASS_PROGRESS;
        this.description = ProgressOperations.CLASS_AVERAGE;
        this.progressText = ProgressOperations.OVERALL_PROGRESS;
        break;
      case ProgressOperations._CLASS_AVERAGE:
        this.progressType = ProgressOperations.CLASS_AVERAGE;
        this.description = ProgressOperations.CLASS_AVERAGE;
        this.progressText = ProgressOperations.ON_PROGRESS;
        break;
      default:
        break;
    }
  }
  getDescription(): any{
    return {description: this.description};
  }
  getProgress(): number{
    /* we did this calculation because library accepts value LARGER than 0 and LESS than 100 as its an open issue
      https://github.com/recogizer/angular-gauge-chart/issues/20
    */
    if(this.progressValue > 100){
      this.needleValue = 100;
      return 99.99;
    }else if(this.progressValue < 0){
      this.needleValue = 0;
      return 0.005;
    }
    return this.progressValue === 100 ? 99.99: this.progressValue === 0 ? 0.005 : this.progressValue;
  }
}
