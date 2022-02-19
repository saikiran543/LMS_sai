/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { HttpClientService } from 'src/app/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class RubricsService {

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  messagesTranslations: any = {
    deleteRubric: 'admin.rubrics.deleteRubric',
    copyRubric: 'admin.rubrics.copyRubric',
    alreadyExist: 'admin.rubrics.alreadyExist',
    alreadyExistLevel: 'admin.rubrics.alreadyExistLevel',
    rubricCreated: 'admin.rubrics.rubricCreated',
    rubricDraft: 'admin.rubrics.rubricDraft',
    rubricUpdate: 'admin.rubrics.rubricUpdate',
    mandatoryFields: 'admin.rubrics.mandatoryFields',
    percentageValidation: 'admin.rubrics.percentageValidation',
    weightagesValidation: 'admin.rubrics.weightagesValidation',
    rubricEvaluationError: 'admin.rubrics.rubricEvaluationError',
    percentageValueValidation: 'admin.rubrics.percentageValueValidation',
    rubricDuplicateTitleMessage: 'admin.rubrics.rubricDuplicateTitleMessage'
  }
  constructor(private httpClientService: HttpClientService, private translate: TranslateService, private toastService: ToastrService) {
    this.getMessageTranslations();
  }

  async getMessageTranslations(): Promise<void> {
    for (const key in this.messagesTranslations) {
      if (Object.prototype.hasOwnProperty.call(this.messagesTranslations, key)) {
        this.messagesTranslations[key] = await this.translate.get(this.messagesTranslations[key]).toPromise();
      }
    }
  }

  // eslint-disable-next-line max-params
  async sendMessageToBackEnd(serviceName: Service, apiPath: string, method:
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    HttpMethod, payLoad: any, isAuthRequired?: boolean, headers?: any) : Promise<any>{
    return await this.httpClientService.getResponse(serviceName, apiPath, method, payLoad, isAuthRequired, headers);
  }

  async fetchRubricById(rubricId: string): Promise<any> {
    const service = Service.COURSE_SERVICE;
    return this.httpClientService.getResponse(service, `rubrics/${rubricId}`, HttpMethod.GET, true).then((res) => res.body);
  }

  showSuccessToast(message: string): void{
    this.toastService.success(message, '', {
      positionClass: 'toast-top-right',
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }
  showWarningToast(message: string): void{
    this.toastService.warning(message, '', {
      positionClass: 'toast-top-center',
      closeButton: false,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }
  showErrorToast(message: string, position: string): void{
    this.toastService.error(message, '', {
      positionClass: position,
      closeButton: true,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false
    });
  }
}
