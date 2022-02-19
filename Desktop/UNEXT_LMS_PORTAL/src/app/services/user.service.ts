import { Injectable } from '@angular/core';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getUser(userId: string): Promise<any>{
    return await this.httpClientService.getResponse(Service.USER_SERVICE, `authentication/getUser/${userId}`, HttpMethod.GET, {});
  }
}
