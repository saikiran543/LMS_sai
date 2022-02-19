import { Injectable } from '@angular/core';
import { Constants } from '../constants/Constants';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { HttpClientService } from './http-client.service';
import { JWTService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClientService, private jwt: JWTService) { }
  public async login(username: string, password: string): Promise<boolean> {
    // eslint-disable-next-line no-useless-catch
    try {
      const {body} = await this.httpClient.getResponse(Service.USER_SERVICE, 'authentication/authenticate', HttpMethod.POST, { username: username, password: password }, false);
      this.jwt.storeNewToken(body);
      return body[Constants.JWT_TOKEN] ? true : false;
    } catch (error) {
      throw error;
    }
    
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async validateToken() {
    return await this.jwt.init();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async forgotPassword(usernameoremail: string): Promise<any> {
    return await this.httpClient.getResponse(Service.USER_SERVICE, 'authentication/forgotPassword', HttpMethod.POST, { userNameOrEmail: usernameoremail }, false);
  }

}
