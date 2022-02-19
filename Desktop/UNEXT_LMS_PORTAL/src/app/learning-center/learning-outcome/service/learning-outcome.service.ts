/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { LearningOutcomeTypes } from 'src/app/enums/learning-outcome';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';
import { StorageKey } from 'src/app/enums/storageKey';
import { firstValueFrom } from 'rxjs';
import { ILearningOutComeResponse } from 'src/app/Models/common-interfaces';

@Injectable({
  providedIn: 'root'
})
export class LearningOutcomeService {
  messagesTranslations:any={
    outcomeCreatedToast: "learningOutcomeModel.successMessages.create.learningOutcome",
    categoryCreatedToast: "learningOutcomeModel.successMessages.create.learningCategory",
    objectiveCreatedToast: "learningOutcomeModel.successMessages.create.learningObjective",
    outcomeEditedToast: "learningOutcomeModel.successMessages.edit.learningOutcome",
    categoryEditedToast: "learningOutcomeModel.successMessages.edit.learningCategory",
    objectiveEditedToast: "learningOutcomeModel.successMessages.edit.learningObjective",
    copy: "learningOutcomeListView.copySucessMessage",
    delete: "learningOutcomeListView.deleteSucessMessage",
    remove: "learningOutcomeListView.removeSucessMessage",
    unlink: "learningOutcomeListView.unlinkSucess",
    outcomeDeleteErrorMessage: "learningOutcomeListView.errorMessages.delete.learningOutcome",
    categoryDeleteErrorMessage: "learningOutcomeListView.errorMessages.delete.learningCategory",
    objectiveDeleteErrorMessage: "learningOutcomeListView.errorMessages.delete.learningObjective",
    completeMandatoryFields: "admin.rubrics.mandatoryFields",
    attach: "learningOutcomeListView.attachSuccess",
    edit: "learningOutcomeListView.editSuccess"
  }
  hoverMessageTranslations:any={
    applicableToContentMessage1: "learningOutcomeModel.tooltipMessages.inUse.applicableTo.content.firstPoint",
    applicableToContentMessage2: "learningOutcomeModel.tooltipMessages.inUse.applicableTo.content.secondPoint",
    applicableToActivityMessage1: "learningOutcomeModel.tooltipMessages.inUse.applicableTo.activity.firstPoint",
    applicableToActivityMessage2: "learningOutcomeModel.tooltipMessages.inUse.applicableTo.activity.secondPoint",
    applicableToBothMessage: "learningOutcomeModel.tooltipMessages.inUse.applicableTo.both.firstPoint",
    statusMessage1: "learningOutcomeModel.tooltipMessages.activity.statusMessage.firstPoint",
    statusMessage2: "learningOutcomeModel.tooltipMessages.activity.statusMessage.secondPoint",
    statusMessageForInUse: "learningOutcomeModel.tooltipMessages.inUse.statusMessage",
  }
  
  constructor(private httpClientService: HttpClientService,private translate: TranslateService,private storageService:StorageService) {
    this.getMessageTranslations();
    this.getHoverMessageTranslations();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getMessageTranslations() {
    for (const key in this.messagesTranslations) {
      if (Object.prototype.hasOwnProperty.call(this.messagesTranslations, key)) {
        this.messagesTranslations[key] = await this.translate.get(this.messagesTranslations[key]).toPromise();
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getHoverMessageTranslations() {
    for (const key in this.hoverMessageTranslations) {
      if (Object.prototype.hasOwnProperty.call(this.hoverMessageTranslations, key)) {
        this.hoverMessageTranslations[key] = await this.translate.get(this.hoverMessageTranslations[key]).toPromise();
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async create(type:string,parentId:string,payload={}){
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
        return await this.httpClientService.getResponse(Service.COURSE_SERVICE,`learning-outcomes?parentId=${parentId}`,HttpMethod.POST, payload,true);
      case LearningOutcomeTypes.CATEGORY:
        return await this.httpClientService.getResponse(Service.COURSE_SERVICE,`learning-categories?parentId=${parentId}`,HttpMethod.POST, payload,true);
      case LearningOutcomeTypes.OBJECTIVE:
        return await this.httpClientService.getResponse(Service.COURSE_SERVICE,`learning-objectives?parentId=${parentId}`,HttpMethod.POST, payload,true);
      default:
        break;
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async edit(id:string,parentId:string,type:string,payload={},courseId?:string){
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
        return await this.httpClientService.getResponse(Service.COURSE_SERVICE,`learning-outcomes/${id}?parentId=${parentId}`,HttpMethod.PUT, payload,true);
      case LearningOutcomeTypes.CATEGORY:
        return await this.httpClientService.getResponse(Service.COURSE_SERVICE,`learning-categories/${id}?parentId=${parentId}`,HttpMethod.PUT, payload,true);
      case LearningOutcomeTypes.OBJECTIVE:
        return await this.httpClientService.getResponse(Service.COURSE_SERVICE,`learning-objectives/${id}?parentId=${parentId}&courseId=${courseId}`,HttpMethod.PUT, payload,true);
      default:
        break;
    }
  }
  
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async copy(serviceName: Service,type:string,id:string){
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
        return await this.httpClientService.getResponse(serviceName,`learning-outcomes/${id}/copy`,HttpMethod.POST,{},true);
      case LearningOutcomeTypes.CATEGORY:
        return await this.httpClientService.getResponse(serviceName,`learning-categories/${id}/copy`,HttpMethod.POST,{},true);
      case LearningOutcomeTypes.OBJECTIVE:
        return await this.httpClientService.getResponse(serviceName,`learning-objectives/${id}/copy`,HttpMethod.POST,{},true);
      default:
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async delete(serviceName: Service,type:string,id:string){
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
        return await this.httpClientService.getResponse(serviceName,`learning-outcomes/${id}`,HttpMethod.DELETE,{},true);
      case LearningOutcomeTypes.CATEGORY:
        return await this.httpClientService.getResponse(serviceName,`learning-categories/${id}`,HttpMethod.DELETE,{},true);
      case LearningOutcomeTypes.OBJECTIVE:
        return await this.httpClientService.getResponse(serviceName,`learning-objectives/${id}`,HttpMethod.DELETE,{},true);
      default:
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async checkIfMapped(serviceName: Service, elementId:string, type: string){
    return await this.httpClientService.getResponse(serviceName,`learning-objectives-mappings/${type}/${elementId}/is-mapped`,HttpMethod.GET,{},true);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async unlinkElement(courseId: string, payLoad={}){
    return await this.httpClientService.getResponse(Service.COURSE_SERVICE,`learning-objectives-mappings?courseId=${courseId}`,HttpMethod.DELETE,payLoad,true);
  }

  // eslint-disable-next-line max-params
  async getAll(serviceName: Service,type:string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    parentId:string,page?:number,limit?:number,courseId?:string):Promise<any>{
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
      {
        const responce: ILearningOutComeResponse = await this.httpClientService.getResponse(serviceName,`learning-outcomes?parentId=${parentId}&page=${page}&limit=${limit}`,HttpMethod.GET,{},true);
        return responce.body;
      }
       
      case LearningOutcomeTypes.CATEGORY:
      {
        const responce: ILearningOutComeResponse = await this.httpClientService.getResponse(serviceName,`learning-categories?parentId=${parentId}&courseId=${courseId}&page=${page}&limit=${limit}`,HttpMethod.GET,{},true);
        return responce.body;
      }
      case LearningOutcomeTypes.OBJECTIVE:
      {
        const responce: ILearningOutComeResponse = await this.httpClientService.getResponse(serviceName,`learning-objectives?parentId=${parentId}&courseId=${courseId}&page=${page}&limit=${limit}`,HttpMethod.GET,{},true);
        return responce.body;
      }
      default:
        break;
    }
  }

  // eslint-disable-next-line max-params
  async get(serviceName: Service,type:string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    id:string,courseId:string):Promise<any>{
    switch (type) {
      case LearningOutcomeTypes.OUTCOME:
      {
        const responce: ILearningOutComeResponse = await this.httpClientService.getResponse(serviceName,`learning-outcomes/${id}`,HttpMethod.GET,{},true);
        return responce.body;
      }
         
      case LearningOutcomeTypes.CATEGORY:
      {
        const responce: ILearningOutComeResponse = await this.httpClientService.getResponse(serviceName,`learning-categories/${id}`,HttpMethod.GET,{},true);
        return responce.body;
      }
      case LearningOutcomeTypes.OBJECTIVE:
      {
        const responce: ILearningOutComeResponse = await this.httpClientService.getResponse(serviceName,`learning-objectives/${id}?courseId=${courseId}`,HttpMethod.GET,{},true);
        return responce.body;
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async attach(courseId:string, payload: any): Promise<any> {
    const serviceName = Service.COURSE_SERVICE;
    const reponse: ILearningOutComeResponse = await this.httpClientService.getResponse(serviceName,`learning-objectives-mappings?courseId=${courseId}`, HttpMethod.POST, payload,true);
    return reponse.body;

  }

  async getLearningObjectivesById(objectiveId: string): Promise<any> {
    const serviceName = Service.COURSE_SERVICE;
    const response = await this.httpClientService.getResponse(serviceName, `learning-objectives/${objectiveId}`, HttpMethod.GET, true);
    return response.body;
  }

  async getElementType(subType: string): Promise<string>{
    const response: ILearningOutComeResponse = await this.httpClientService.getResponse(Service.COURSE_SERVICE, `content-activity-type/type?elementType=${subType}`, HttpMethod.GET, null);
    return response.body.type;
  }

  async getElementDetail(courseId: string, elementId: string): Promise<any> {
    const resp = await this.addHeadersInterceptor(Service.COURSE_SERVICE, `course-content/${courseId}/element-detail/${elementId}`, HttpMethod.GET, true);
    return resp.body;
  }
  
  async addHeadersInterceptor(serviceName: Service, apiPath: string, method: HttpMethod = HttpMethod.GET, payLoad:boolean, isAuthRequired = true): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers: any = {
      'user-current-view': this.storageService.get(StorageKey.USER_CURRENT_VIEW)
    };
    try {
      headers['doc-version'] = this.storageService.get(StorageKey.DOC_VERSION);
      // eslint-disable-next-line no-empty
    } catch (error) {
      headers['doc-version']= await firstValueFrom(this.storageService.listen(StorageKey.DOC_VERSION));

    }
    return await this.httpClientService.getResponse(serviceName, apiPath, method, payLoad, isAuthRequired, headers);
  }

  // eslint-disable-next-line max-lines-per-function
  async getAttachedOutcomes(elementId : string) : Promise<any>{
    const response = await this.httpClientService.getResponse(Service.COURSE_SERVICE,`learning-objectives-mappings?elementId=${elementId}`, HttpMethod.GET, null,true);
    return response.body;
  }
}
