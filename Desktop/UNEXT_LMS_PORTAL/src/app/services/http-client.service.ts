import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { ApiDiscoveryService } from './api-discovery.service';
import { JWTService } from './jwt.service';
import { ConfigurationService } from './configuration.service';

export interface headersInterface {
  'Content-Type': string
}
@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(private http: HttpClient, private apiDiscoveryService: ApiDiscoveryService, private jwtService: JWTService, private configuration: ConfigurationService) { }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any,max-params
  async getResponse(serviceName: Service, apiPath: string, method: HttpMethod = HttpMethod.GET, payLoad: any, isAuthRequired = true, addedHeaders = {}): Promise<any> {
    const url = this.apiDiscoveryService.fetchServiceUrl(serviceName);
    const finalUrl = `${url}/${apiPath}`;
    const orgId = this.configuration.getAttribute("orgId");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let headers: any = {
      'Content-Type': 'application/json',
      'organizationId': orgId
    };
    if (isAuthRequired) {
      headers.Authorization = await this.jwtService.checkAuthentication();
    }
    headers = {...headers,...addedHeaders};
    const httpHeaders = new HttpHeaders(headers);
    const options = { headers: httpHeaders, body: payLoad, observe: "response" as const };
    return this.http.request(method, finalUrl, options).toPromise();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  getResponseAsObservable(serviceName: Service, apiPath: string, method: HttpMethod = HttpMethod.GET, payLoad = {}, isAuthRequired = true): Observable<any> {
    return from(this.getResponse(serviceName, apiPath, method, payLoad, isAuthRequired));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  getFileUploadResponse(signedUrl: string, file: any) {
    // const options = { reportProgress: true, observe: 'events' };
    return this.http.put(signedUrl, file, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
