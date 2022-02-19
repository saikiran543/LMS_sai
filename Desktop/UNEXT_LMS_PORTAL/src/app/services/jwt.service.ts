import { Injectable } from '@angular/core';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiDiscoveryService } from './api-discovery.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../constants/Constants';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { StorageKey } from '../enums/storageKey';
@Injectable({
  providedIn: 'root',
})
export class JWTService {
  private expiry = 0;
  private jwtToken = '';

  constructor(private storageService: StorageService,private apiDiscoveryService: ApiDiscoveryService, private http: HttpClient, private router: Router) { }
  async init(): Promise<boolean> {
    const jwtToken = localStorage.getItem(Constants.JWT_TOKEN) || null;
    if (!jwtToken) {
      return false;
    }
    const decodedToken = this.decodeJWTToken(jwtToken);
    this.expiry = decodedToken['exp'];
    this.jwtToken = jwtToken;
    const newToken = await this.validateAndFetchToken(jwtToken, this.expiry);
    return newToken ? true : false;

  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validateAndFetchToken(jwtToken: string, expiry: number): Promise<any> {
    if (!jwtToken || !expiry) {
      return null;
    }
    const currentTime = this.getCurrentTimeInSeconds();
    const isValid = this.checkTokenExpiry(expiry, currentTime);
    if (isValid) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tokenObj: any = {};
      tokenObj[Constants.JWT_TOKEN] = jwtToken;
      this.storeNewToken(tokenObj);
      return jwtToken;
    }
    const newJwtToken = await this.refreshJwtToken(jwtToken);
    if (newJwtToken) {
      this.storeNewToken(newJwtToken);
      return newJwtToken[Constants.JWT_TOKEN];
    }

    return null;

  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public storeNewToken(newJwtToken: any): void {
    const decodedNewToken = this.decodeJWTToken(newJwtToken[Constants.JWT_TOKEN]);
    const role = decodedNewToken.role;
    this.storageService.set(StorageKey.USER_DETAILS, decodedNewToken);
    this.storageService.set(StorageKey.USER_CURRENT_VIEW,role);
    this.storeJWTToken(Constants.JWT_TOKEN, newJwtToken[Constants.JWT_TOKEN]);
    this.expiry = decodedNewToken[Constants.EXPIRY];
    this.jwtToken = newJwtToken[Constants.JWT_TOKEN];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async refreshJwtToken(jwtToken: string): Promise<any> {
    try {
      const newJwt = await this.getResponse(Service.USER_SERVICE, 'authentication/refreshjwt', HttpMethod.POST, { jwttoken: jwtToken });
      return newJwt;
    } catch (error) {
      return null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async checkAuthentication(): Promise<any> {
    const token = await this.validateAndFetchToken(this.jwtToken, this.expiry);
    if (!token) {
      this.router.navigate(['login']);
      throw new Error('user is not authenticated');
    }
    return token;
  }

  checkTokenExpiry(expiry: number, currentTime: number): boolean {
    return expiry >= (currentTime + 2 * 60);
  }

  getCurrentTimeInSeconds(): number {
    return (Date.now() / 1000);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decodeJWTToken(token: string): any {
    const helper = new JwtHelperService();
    return helper.decodeToken(token);
  }
  storeJWTToken(tokenName: string, value: string): void {
    localStorage.setItem(tokenName, value);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  async getResponse(serviceName: Service, apiPath: string, method: HttpMethod, payLoad: any): Promise<any> {
    const url = this.apiDiscoveryService.fetchServiceUrl(serviceName);
    const finalUrl = `${url}/${apiPath}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers: any = {
      'Content-Type': 'application/json',
    };
    const httpHeaders = new HttpHeaders(headers);
    const options = { headers: httpHeaders, body: payLoad };
    return this.http.request(method, finalUrl, options).toPromise();
  }

}
