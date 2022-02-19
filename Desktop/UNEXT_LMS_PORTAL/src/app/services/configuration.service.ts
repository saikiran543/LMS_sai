/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { LocalConfigService } from './local.config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configuration: any = new Map();
  constructor(private localconfig: LocalConfigService, private http: HttpClient) {
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async init(): Promise<any> {
    let configDomain = this.getDomainFromUrl();
    const isLocal = (configDomain === "localhost");

    if (isLocal) {
      configDomain = this.localconfig.getConfigDomain();
    }

    if (configDomain) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const domainConfig: any = await this.fetchConfiguration(configDomain);
      this.addConfiguration(domainConfig);
    }

    if (isLocal) { //it will override cloud configuration map from local configuration
      const localConfigution = this.localconfig.getLocalConfig();
      this.addConfiguration(localConfigution);
    }
    return this.configuration;
  }

  async fetchConfiguration(domain: string): Promise<void> {
    return this.getResponse(Service.CONFIGURATION, `domainconfiguration/${domain}`, HttpMethod.GET);
  }

  getDomainFromUrl(): string {
    const { hostname } = new URL(window.location.href); // "localhost";//write code here to detect the domain based on the address bar url
    return hostname;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public addConfiguration(configuration: any): void {
    for (const key of Object.keys(configuration)) {
      this.configuration.set(key, configuration[key]);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getResponseAsObservable(serviceName: Service, apiPath: string, method: HttpMethod = HttpMethod.GET, payLoad = {}): Observable<any> {
    let baseUrl = this.localconfig.getApiBaseUrl();
    baseUrl = baseUrl?baseUrl:'https://edunxtdev01.unext.tech';
    const url = `${baseUrl}/api/${serviceName}/${apiPath}`;
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers: httpHeaders, body: payLoad };
    return this.http.request(method, url, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getResponse(serviceName: Service, apiPath: string, method: HttpMethod = HttpMethod.GET, payLoad = {}): Promise<any> {

    return await this.getResponseAsObservable(serviceName, apiPath, method, payLoad).toPromise();
  }

  getName(): string {

    return this.configuration.get("name");
  }

  getEnv(): string {
    return this.configuration.get("environment");
  }

  getDomain(): string {
    return this.configuration.get("domain");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAttribute(key: any): any {
    return this.configuration.get(key);
  }

  getApiBaseUrl(): string {
    return this.configuration.get("apiBaseUrl");
  }

}
