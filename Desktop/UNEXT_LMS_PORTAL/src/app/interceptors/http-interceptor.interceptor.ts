import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoggingService } from '../services/logging.service';
import { DialogService } from '../services/dialog.service';
import { Dialog } from '../Models/Dialog';
import { DialogTypes } from '../enums/Dialog';
import { RubricOperations } from '../enums/rubricOperations';

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {

  constructor(private logService: LoggingService, private dialogService: DialogService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // this.logService.info(JSON.stringify(event));
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        const unauthorizedStatusCode = [401, 400];
        const versionMisMatchCode = [409];
        if (unauthorizedStatusCode.includes(error.status)) {
          if(error.error!=="Invalid Username/Password" && !error.error.includes("already exists, Please choose some different title for this") && error.error !== RubricOperations.RUBRIC_DUPLICATE_TITLE_ERROR_MESSAGE && !error.error.includes("Please delink before deletion") && !error.error.includes("Please Grade all") && !error.error.match(/^Please add the entry point of the package file name as/g)){
            this.fireErrorToast('httpInterceptor.unauthorizedErrorMessage');
          }
        }
        if (versionMisMatchCode.includes(error.status) && error.error === 'httpInterceptor.courseContentUpdated') {
          this.fireErrorToast('httpInterceptor.versionMismatchErrorMessage');
          
        }
        return throwError(error);
      }));
  }
  async fireErrorToast(message: string):Promise<void>{
    
    const dialogOption: Dialog ={
      type: DialogTypes.ERROR,
      title: {
        translationKey: message
      }
    };
    await this.dialogService.showAlertDialog(dialogOption);
    window.location.reload();
  }
}
