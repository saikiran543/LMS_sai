import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Service } from '../enums/service';

import { ApiDiscoveryService } from './api-discovery.service';
import { ConfigurationService } from './configuration.service';

describe('ApiDiscoveryService', () => {
  let service: ApiDiscoveryService;
  let configService: ConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        ConfigurationService
      ]
    });

    configService = TestBed.inject(ConfigurationService);
    service = TestBed.inject(ApiDiscoveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return the service url from the configuration map", async () => {
    spyOn(configService, 'getAttribute').and.returnValue('http://localhost:3033/api/authrizationservice');
    const loginValue = service.fetchServiceUrl(Service.CONFIGURATION);
    expect(loginValue).toBe("http://localhost:3033/api/authrizationservice");
  });

  it("should generate the service url if its not exist in configuration map", async () => {
    spyOn(configService, 'getAttribute').and.returnValue(null);
    spyOn(configService, 'getApiBaseUrl').and.returnValue('http://localhost:3033');
    const loginValue = service.fetchServiceUrl(Service.CONFIGURATION);
    expect(loginValue).toBe("http://localhost:3033/api/configservice");

  });

});
