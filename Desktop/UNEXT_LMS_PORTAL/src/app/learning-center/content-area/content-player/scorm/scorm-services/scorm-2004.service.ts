/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';

@Injectable()
export class Scorm2004Service {
  debug = false;
  cmiObj: any = new Object();
  Initialize(value?: any): string{
    if (this.debug) { console.log('*** LMSInitialize 2004 ***', value); }
    return "true";
  }
  Terminate(): void{
    if (this.debug) { console.log('*** Terminating ***'); }
  }
  GetValue(varName: any): any{
    console.log('GEt value', varName);
    
    return this.cmiObj[varName];
  }
  SetValue(varName: any,varValue: any): any{
    this.cmiObj[varName] = varValue;
    if (this.debug) {console.log('*** LMSSetValue varName='+varName+' varValue='+varValue+' ***');}
    return "true";
  }
  Commit(value: any): any{
    if (this.debug) {console.log('*** LMS Commit ***', value);}
    return "true";
  }
  GetLastError(): void{
    if (this.debug) { console.log('*** Last Error ***'); }
  }
  GetErrorString(): void{
    if (this.debug) { console.log('*** Error String ***'); }
  }
  GetDiagnostic(): void{
    if (this.debug) { console.log('*** Disgnostic ***'); }
  }
  scormProgressDetails(){
    const currentSlide = parseInt(this.cmiObj['cmi.core.lesson_location'].split(',')[0].trim());
    const totalSlides = parseInt(this.cmiObj['cmi.core.lesson_location'].split(',')[1].trim());
    const progress = Math.trunc(+((currentSlide/totalSlides)*100));
    return {
      progress: progress,
      lastAccessedPoint: this.cmiObj['cmi.suspend_data']
    };
  }
}
