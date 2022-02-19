/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpMethod } from 'src/app/enums/httpMethod';
import { Service } from 'src/app/enums/service';
import { HttpClientService } from 'src/app/services/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private httpClientService: HttpClientService) {}

  // eslint-disable-next-line max-params
  async sendToBackend(serviceName: Service, apiPath: string, method:
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    HttpMethod, payLoad={}, isAuthRequired?: boolean, headers?: any) : Promise<any>{
    return await this.httpClientService.getResponse(serviceName, apiPath, method, payLoad, isAuthRequired, headers);
  }

}
