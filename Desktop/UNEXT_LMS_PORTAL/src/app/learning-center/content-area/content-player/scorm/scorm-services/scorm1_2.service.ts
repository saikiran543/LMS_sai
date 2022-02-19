/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';

@Injectable()
export class Scorm1_2Service {
  debug = true;
  cmiObj: any = new Object();
  LMSInitialize(dummyString: any) {
    if (this.debug) { console.log('*** LMSInitialize 1.2 ***'); }
    return "true";
  }
  
  // ------------------------------------------
  //   SCORM RTE Functions - Getting and Setting Values
  // ------------------------------------------
  LMSGetValue(varName: any) {
    if (this.debug) {
      console.log('*** LMSGetValue varName='+ varName +' varValue=value ***');
    }
    this.cmiObj["cmi.core.lesson_location"]="";
    this.cmiObj['cmi.core.lesson_status']='';
    this.cmiObj['cmi.core.session_time']='';
    this.cmiObj['cmi.suspend_data']="";
    this.cmiObj["cmi.core.exit"]="";
    return this.cmiObj[varName];
  }
  
  LMSSetValue(varName: any,varValue: any) {
    this.cmiObj[varName] = varValue;
    if (this.debug) {
      console.log('*** LMSSetValue varName='+varName
                            +' varValue='+varValue+' ***');
    }
    return "true";
  }
  
  LMSCommit(dummyString: any) {
    if (this.debug) { console.log('*** LMSCommit ***', dummyString); }
    return "true";
  }
  
  // ------------------------------------------
  //   SCORM RTE Functions - Closing The Session
  // ------------------------------------------
  LMSFinish(dummyString: any) {
    if (this.debug) { console.log('*** LMSFinish ***', dummyString); }
    return "true";
  }
  
  // ------------------------------------------
  //   SCORM RTE Functions - Error Handling
  // ------------------------------------------
  LMSGetLastError() {
    if (this.debug) { console.log('*** LMSGetLastError ***'); }
    return 0;
  }
  
  LMSGetDiagnostic(errorCode: any) {
    if (this.debug) {
      console.log('*** LMSGetDiagnostic errorCode='+errorCode+' ***');
    }
    return "diagnostic string";
  }
  
  LMSGetErrorString(errorCode: any) {
    if (this.debug) {
      console.log('*** LMSGetErrorString errorCode='+errorCode+' ***');
    }
    return "error string";
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
