/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { StorageKey } from '../enums/storageKey';
import { ConfigurationService } from './configuration.service';
import { HttpClientService } from './http-client.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoginSettingService {
  orgId!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loginConfiguration: any;
  logoOnHover!: string;
  logoImageUrl!: string;
  logoRedirectUrl!: string;

  constructor(private storageService: StorageService, private configuration: ConfigurationService, private httpClientService: HttpClientService) {
  }

  async initializeData(): Promise<void> {
    this.orgId = this.configuration.getAttribute("orgId");
    await this.getLoginLayoutConfigs(this.orgId);
  }

  async getLoginLayoutConfigs(orgId: string): Promise<void> {
    await this.fetchloginPageSettings(orgId);
    const loginConfiguration = this.storageService.get(StorageKey.LOGIN_CONFIG);
    const apiBaseUrl = this.configuration.getApiBaseUrl();
    this.loginConfiguration = { ...loginConfiguration, apiBaseUrl, orgId };
    this.loginConfiguration['logoImageUrl'] = this.loginConfiguration.logoImage_URL.value;
    this.loginConfiguration['bannerImageUrl'] = this.loginConfiguration.loginBannerImage_URL.value;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  set(key: string, value: any): void {
    this.loginConfiguration[key] = value;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  getWholeConfiguration(): any {
    return this.loginConfiguration;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  get(key: string): any {
    return this.loginConfiguration[key];
  }
  async publish(): Promise<boolean> {
    const publishData = await this.putData(Service.CONFIGURATION, 'domainconfiguration/loginPageSettings', HttpMethod.PUT);
    if (publishData) {
      await this.initializeData();
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async putData(serviceName: Service, apiPath: string, method: HttpMethod, payLoad = {}): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ...payLoadData } = this.loginConfiguration;
    payLoad = payLoadData;
    return await this.httpClientService.getResponseAsObservable(serviceName, apiPath, method, payLoad, true).toPromise();
  }

  async fetchloginPageSettings(orgId: string): Promise<any> {
    const payLoad = {};
    const loginConfiguration = await this.httpClientService.getResponse(Service.CONFIGURATION, `domainconfiguration/loginPageSettings/${orgId}`, HttpMethod.GET, payLoad, false);
    this.storageService.set(StorageKey.LOGIN_CONFIG, loginConfiguration.body);
  }

  async updateImage(imageName: string, imageContent: string): Promise<boolean> {
    const payLoad = {
      'orgId': this.orgId,
      'imageName': imageName,
      'imageContent': imageContent,
      'uriContext': "loginPage",
    };
    const imagePublish = await this.httpClientService.getResponse(Service.CONFIGURATION, `domainconfiguration/imageContent/`, HttpMethod.PUT, payLoad, true);
    if (imagePublish.status === "success") {
      return true;
    }
    return false;
  }

  async deleteImage(imageName: string): Promise<boolean> {
    const payLoad = {
      'orgId': this.orgId,
      'imageName': imageName,
    };
    const imageDelete = await this.httpClientService.getResponse(Service.CONFIGURATION, `domainconfiguration/imageContent/`, HttpMethod.DELETE, payLoad, true);
    if (imageDelete.status === 200) {
      return true;
    }
    return false;
  }
}
