import { Injectable } from '@angular/core';
import { Service } from '../enums/service';
import { ServiceConfig } from '../service.config';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ApiDiscoveryService {

  constructor(private configurationService: ConfigurationService) {
  }

  public fetchServiceUrl(service: Service): string {
    const serviceUrl = this.configurationService.getAttribute(service + '_URL');
    if (serviceUrl) {
      return serviceUrl;
    }
    const baseUrl = this.configurationService.getApiBaseUrl();
    return `${baseUrl}/${ServiceConfig[service]['apiBase']}`;
  }
}
