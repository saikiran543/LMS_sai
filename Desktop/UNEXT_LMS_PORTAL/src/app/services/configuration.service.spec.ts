import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { ConfigurationService } from './configuration.service';
import { LocalConfigService } from './local.config.service';
import { of } from 'rxjs';

// eslint-disable-next-line max-lines-per-function
describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let localConfigService: LocalConfigService;
  let http: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        LocalConfigService,
        HttpClient
      ]
    });
    service = TestBed.inject(ConfigurationService);
    http = TestBed.inject(HttpClient);
    localConfigService = TestBed.inject(LocalConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get called below methods if its an local', async () => {
    const spyGetConfigDomain = spyOn(localConfigService, 'getConfigDomain');
    const spyGetLocalConfig = spyOn(localConfigService, 'getLocalConfig');
    const spyAddLocalConfigs = spyOn(service, 'addConfiguration');
    await service.init();
    expect(spyGetConfigDomain).toHaveBeenCalled();
    expect(spyGetLocalConfig).toHaveBeenCalled();
    expect(spyAddLocalConfigs).toHaveBeenCalled();
  });

  it('should read the local configuration and store into configuration map', async () => {
    service.configuration = new Map();
    const expectedResult = { "name": "localhost", "environment": "Dev", domain: "local", apiBaseUrl: "https://localhost" };
    spyOn(localConfigService, 'getLocalConfig').and.returnValue(expectedResult);
    const getLocalConfigValue = localConfigService.getLocalConfig();
    service.addConfiguration(getLocalConfigValue);
    expect(service.getApiBaseUrl()).toEqual(expectedResult.apiBaseUrl);
    expect(service.getEnv()).toEqual(expectedResult.environment);
    expect(service.getDomain()).toEqual(expectedResult.domain);
    expect(service.getName()).toEqual(expectedResult.name);
    expect(service.getAttribute('environment')).toEqual(expectedResult.environment);
  });

  it("should return expected result as a observable", async () => {
    const expectedResponce = { "_id": "60c0cf39a95e6b5648ff1884", "configurationId": "153df670-78d2-4844-8fa3-d0b855b1a00e", "configuration": { name: "edunewdev01", "environment": "Dev", domain: "edunewdev01", apibaseurl: "https://edunewdev01.unext.tech" }, "domain": "edunewdev01.unext.tech" };

    spyOn(http, 'request').and.returnValue(of(expectedResponce));
    service.getResponseAsObservable(Service.CONFIGURATION, 'domainconfiguration/edunewdev01.unext.tech', HttpMethod.POST, {}).subscribe(res => {
      expect(res).toEqual(expectedResponce);
    });
    service.getResponseAsObservable(Service.CONFIGURATION, 'domainconfiguration/edunewdev01.unext.tech', undefined, undefined).subscribe(res => {
      expect(res).toEqual(expectedResponce);
    });
  });

  it("should return expected result as a promise", async () => {
    const expectedResponce = { "_id": "60c0cf39a95e6b5648ff1884", "configurationId": "153df670-78d2-4844-8fa3-d0b855b1a00e", "configuration": { name: "edunewdev01", "environment": "Dev", domain: "edunewdev01", apibaseurl: "https://edunewdev01.unext.tech" }, "domain": "edunewdev01.unext.tech" };
    spyOn(http, 'request').and.returnValue(of(expectedResponce));
    let result = await service.getResponse(Service.CONFIGURATION, 'domainconfiguration/edunewdev01.unext.tech', HttpMethod.POST, {});
    expect(result).toEqual(expectedResponce);
    result = await service.getResponse(Service.CONFIGURATION, 'domainconfiguration/edunewdev01.unext.tech', undefined, undefined);
    expect(result).toEqual(expectedResponce);

  });

});
