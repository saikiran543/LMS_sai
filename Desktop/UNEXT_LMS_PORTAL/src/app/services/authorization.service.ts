import { Injectable } from '@angular/core';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private httpClientService: HttpClientService) { }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  async getAuthorizedActions(data:any) :Promise<any>{
    return await this.httpClientService.getResponse(Service.USER_SERVICE, 'authorization/access', HttpMethod.POST, data);
  }
}
