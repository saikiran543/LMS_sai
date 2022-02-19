/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { HttpClientService } from 'src/app/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(private httpClientService: HttpClientService) { }

  // eslint-disable-next-line max-params
  async sendMessageToBackEnd(serviceName: Service, apiPath: string, method:
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    HttpMethod, payLoad: any, isAuthRequired?: boolean, headers?: any) : Promise<any>{
    return await this.httpClientService.getResponse(serviceName, apiPath, method, payLoad, isAuthRequired, headers);
  }
}
