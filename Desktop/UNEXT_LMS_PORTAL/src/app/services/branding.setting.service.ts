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
export class BrandingSettingService {

  orgId!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  brandingConfiguration: any;

  constructor(private storageService: StorageService, private configuration: ConfigurationService, private httpClientService: HttpClientService) {
  }

  async initializeData(): Promise<void> {
    this.orgId = this.configuration.getAttribute("orgId");
    await this.getBrandingPageConfigs(this.orgId);
    //await this.publish();
  }

  async getBrandingPageConfigs(orgId: string): Promise<void> {
    await this.fetchBrandingPageSettings(orgId);
    const brandingConfig = this.storageService.get(StorageKey.BRANDING_CONFIG);
    this.brandingConfiguration = { ...brandingConfig, orgId };
    this.brandingConfiguration.screenDuration = parseInt(this.brandingConfiguration.screenDuration);
    this.brandingConfiguration['brandingBannerVerticalImage'] = this.brandingConfiguration.brandingBannerVerticalImage_URL.value;
    this.brandingConfiguration['brandingBannerHorizontalImage'] = this.brandingConfiguration.brandingBannerHorizontalImage_URL.value;
    this.brandingConfiguration['brandingBannerHorizontalSplitImage'] = this.brandingConfiguration.brandingBannerHorizontalSplitImage_URL.value;
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  set(key: string, value: any): void {
    this.brandingConfiguration[key] = value;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWholeConfiguration(): any {
    return this.brandingConfiguration;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(key: string): any {
    return this.brandingConfiguration[key];
  }
  async publish(): Promise<boolean> {
    const publishData = await this.putData(Service.CONFIGURATION, 'domainconfiguration/brandingPageSettings', HttpMethod.PUT);
    if (publishData) {
      await this.initializeData();
      return true;
    }
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async putData(serviceName: Service, apiPath: string, method: HttpMethod, payLoad = {}): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ...payLoadData } = this.brandingConfiguration;
    payLoad = payLoadData;
    return await this.httpClientService.getResponseAsObservable(serviceName, apiPath, method, payLoad, true).toPromise();
  }
  async fetchBrandingPageSettings(orgId: string): Promise<void> {
    const brandingConfiguration = await this.httpClientService.getResponse(Service.CONFIGURATION, `domainconfiguration/genericSettings/${orgId}/brandingPage`, HttpMethod.GET, {});
    this.storageService.set(StorageKey.BRANDING_CONFIG, brandingConfiguration.body);
  }

  async updateImage(imageName: string, imageContent: string): Promise<boolean> {
    const payLoad = {
      'orgId': this.orgId,
      'imageName': imageName,
      'imageContent': imageContent,
      'uriContext': "brandingPage",
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
