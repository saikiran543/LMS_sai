import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { StorageKey } from '../enums/storageKey';
import { ConfigurationService } from './configuration.service';
import { HttpClientService } from './http-client.service';

import { LoginSettingService } from './login.setting.service';
import { StorageService } from './storage.service';

// eslint-disable-next-line max-lines-per-function
describe('LoginSettingService', () => {
  let service: LoginSettingService;
  let httpClient: HttpClientService;
  let configService: ConfigurationService;
  let storageService: StorageService;
  // eslint-disable-next-line max-lines-per-function
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        ConfigurationService,
        StorageService,
        HttpClientService
      ]
    });
    service = TestBed.inject(LoginSettingService);
    httpClient = TestBed.inject(HttpClientService);
    configService = TestBed.inject(ConfigurationService);
    storageService = TestBed.inject(StorageService);
    const commonConfig = {
      bannerHash: "7233c3cd4ed761e65247daa1115ab34ee4965c501126b908148cbac8a14be663",
      brandingBannerHorizontalImageHash: {value: "1d0269da1b19d46171d9562c4e8aab4ae684ba31016ca03bd8d26f9bcad19173", default: true},
      brandingBannerHorizontalSplitImageHash: {value: "c3e49f28afcd420ccaef4086a18747a96ebc593c0a059614e58abb0afbab09a5", default: true},
      brandingBannerVerticalImageHash: {value: "541a3ec83d62abcdcd297f5e4a97388a2c3d239d12b34d59df1bb3b3dc09bde7", default: true},
      brandingPageImageHash: "13e6f01c97fe7655cf8d0bc0a37fe85782aadfd7340b4eadf0e8a644453d49b3",
      forgotPasswordBannerImageHash: "24211ce2a57701104e55b50dc105ec7d951a89ab8af21abe71a3ec5fa5399462",
      loginBannerImageHash: {value: "79ea12ec0e1da06f320a7fd67e81fd568d92545383dd0d11b9009a88722a346c", default: true},
      logoBannerImageHash: "eb255e47f169ea5d3ef6dbad6a03871d5d7986120e6c7fc7d7965dde1ab3e251",
      logoHash: "121dd371bc7030ce2fd63bdb8ef945276960e179bd979ded718aa8ca6d7e355d",
      logoImageHash: {value: "04702ac24258ddd544143fc1cdb336cdb2ab840893a443f5f5ad7eddc103c9d7", default: true},
      logoImageUrl: "https://edunxtdev01.unext.tech/api/configservice/domainconfiguration/imagecontent/logoImageContent?orgId=capgemini&hash=121dd371bc7030ce2fd63bdb8ef945276960e179bd979ded718aa8ca6d7e355d",
      logoRedirectUrl: "http://unext.com"
      
    };
    const loginConfig = {
      bannerImageUrl: "https://edunxtdev01.unext.tech/api/configservice/domainconfiguration/imagecontent/loginBannerImageContent?orgId=capgemini&hash=70f34bbf9edfe2857ebf916023c4ef3926c0ac5ad0257792295fa4d6a39fc565",
      bannerOnHover: "Test banner on hover",
      defaultHeaderText: "Welcome to your online learning environment. Wish you an amazing experience ahead !!",
      headerTextOnHover: "Welcome to unext edit",
      logoOnHover: "http://unext.comm",
      poweredByLogo: true,
      ssoText: "SSO",
      supportText: "Support text",
      welcomeText: "To UNext Learning Portal",
      welcomeTextOnHover: "To UNext Learning Portal"
    };

    spyOn(configService,'getApiBaseUrl').and.returnValue('https://edunxtdev01.unext.tech');
    spyOn(configService,'getAttribute').and.returnValue('capgemini');
    
    const spyGet = spyOn(storageService,'get');
    spyGet.withArgs(StorageKey.COMMON_CONFIG).and.returnValue(commonConfig).withArgs(StorageKey.LOGIN_CONFIG).and.returnValue(loginConfig);
    
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be initialize with login configurations', async () => {
    const responseSpy = spyOn(httpClient, 'getResponse');
    responseSpy.and.returnValue(Promise.resolve({expectedResult: "someData"}));
    const expectedResult = {
      apiBaseUrl: "https://edunxtdev01.unext.tech",
      bannerHash: "7233c3cd4ed761e65247daa1115ab34ee4965c501126b908148cbac8a14be663",
      bannerImageUrl: "https://edunxtdev01.unext.tech/api/configservice/domainconfiguration/imagecontent/loginBannerImageContent?orgId=capgemini&hash=79ea12ec0e1da06f320a7fd67e81fd568d92545383dd0d11b9009a88722a346c",
      bannerOnHover: "Test banner on hover",
      brandingBannerHorizontalImageHash: {value: "1d0269da1b19d46171d9562c4e8aab4ae684ba31016ca03bd8d26f9bcad19173", default: true},
      brandingBannerHorizontalSplitImageHash: {value: "c3e49f28afcd420ccaef4086a18747a96ebc593c0a059614e58abb0afbab09a5", default: true},
      brandingBannerVerticalImageHash: {value: "541a3ec83d62abcdcd297f5e4a97388a2c3d239d12b34d59df1bb3b3dc09bde7", default: true},
      brandingPageImageHash: "13e6f01c97fe7655cf8d0bc0a37fe85782aadfd7340b4eadf0e8a644453d49b3",
      defaultHeaderText: "Welcome to your online learning environment. Wish you an amazing experience ahead !!",
      forgotPasswordBannerImageHash: "24211ce2a57701104e55b50dc105ec7d951a89ab8af21abe71a3ec5fa5399462",
      headerTextOnHover: "Welcome to unext edit",
      loginBannerImageHash: {value: "79ea12ec0e1da06f320a7fd67e81fd568d92545383dd0d11b9009a88722a346c", default: true},
      logoBannerImageHash: "eb255e47f169ea5d3ef6dbad6a03871d5d7986120e6c7fc7d7965dde1ab3e251",
      logoHash: "121dd371bc7030ce2fd63bdb8ef945276960e179bd979ded718aa8ca6d7e355d",
      logoImageHash: {value: "04702ac24258ddd544143fc1cdb336cdb2ab840893a443f5f5ad7eddc103c9d7", default: true},
      logoImageUrl: "https://edunxtdev01.unext.tech/api/configservice/domainconfiguration/imagecontent/logoImageContent?orgId=capgemini&hash=04702ac24258ddd544143fc1cdb336cdb2ab840893a443f5f5ad7eddc103c9d7",
      logoOnHover: "http://unext.comm",
      logoRedirectUrl: "http://unext.com",
      orgId: "capgemini",
      poweredByLogo: true,
      ssoText: "SSO",
      supportText: "Support text",
      welcomeText: "To UNext Learning Portal",
      welcomeTextOnHover: "To UNext Learning Portal"
    };
    await service.initializeData();
    expect(service.loginConfiguration).toEqual(expectedResult);
  });

  it('should set a key and value in login configuration and return them', async () => {
    const responseSpy = spyOn(httpClient, 'getResponse');
    responseSpy.and.returnValue(Promise.resolve({expectedResult: "someData"}));
    await service.initializeData();
    service.set('key1','value1');
    expect(service.loginConfiguration['key1']).toEqual('value1');
    expect(service.get('key1')).toEqual('value1');
  });

  it('should get the whole configuration', async () => {
    const responseSpy = spyOn(httpClient, 'getResponse');
    responseSpy.and.returnValue(Promise.resolve({expectedResult: "someData"}));
    const expectedResult = {
      apiBaseUrl: "https://edunxtdev01.unext.tech",
      bannerHash: "7233c3cd4ed761e65247daa1115ab34ee4965c501126b908148cbac8a14be663",
      bannerImageUrl: "https://edunxtdev01.unext.tech/api/configservice/domainconfiguration/imagecontent/loginBannerImageContent?orgId=capgemini&hash=79ea12ec0e1da06f320a7fd67e81fd568d92545383dd0d11b9009a88722a346c",
      bannerOnHover: "Test banner on hover",
      brandingBannerHorizontalImageHash: {value: "1d0269da1b19d46171d9562c4e8aab4ae684ba31016ca03bd8d26f9bcad19173", default: true},
      brandingBannerHorizontalSplitImageHash: {value: "c3e49f28afcd420ccaef4086a18747a96ebc593c0a059614e58abb0afbab09a5", default: true},
      brandingBannerVerticalImageHash: {value: "541a3ec83d62abcdcd297f5e4a97388a2c3d239d12b34d59df1bb3b3dc09bde7", default: true},
      brandingPageImageHash: "13e6f01c97fe7655cf8d0bc0a37fe85782aadfd7340b4eadf0e8a644453d49b3",
      defaultHeaderText: "Welcome to your online learning environment. Wish you an amazing experience ahead !!",
      forgotPasswordBannerImageHash: "24211ce2a57701104e55b50dc105ec7d951a89ab8af21abe71a3ec5fa5399462",
      headerTextOnHover: "Welcome to unext edit",
      loginBannerImageHash: {value: "79ea12ec0e1da06f320a7fd67e81fd568d92545383dd0d11b9009a88722a346c", default: true},
      logoBannerImageHash: "eb255e47f169ea5d3ef6dbad6a03871d5d7986120e6c7fc7d7965dde1ab3e251",
      logoHash: "121dd371bc7030ce2fd63bdb8ef945276960e179bd979ded718aa8ca6d7e355d",
      logoImageHash: {value: "04702ac24258ddd544143fc1cdb336cdb2ab840893a443f5f5ad7eddc103c9d7", default: true},
      logoImageUrl: "https://edunxtdev01.unext.tech/api/configservice/domainconfiguration/imagecontent/logoImageContent?orgId=capgemini&hash=04702ac24258ddd544143fc1cdb336cdb2ab840893a443f5f5ad7eddc103c9d7",
      logoOnHover: "http://unext.comm",
      logoRedirectUrl: "http://unext.com",
      orgId: "capgemini",
      poweredByLogo: true,
      ssoText: "SSO",
      supportText: "Support text",
      welcomeText: "To UNext Learning Portal",
      welcomeTextOnHover: "To UNext Learning Portal"
    };
    await service.initializeData();
    expect(service.getWholeConfiguration()).toEqual(expectedResult);
  });

  it('should publish data', async () => {
    const responseSpy = spyOn(httpClient, 'getResponse');
    responseSpy.and.returnValue(Promise.resolve({expectedResult: "someData"}));
    const httpClientSpy = spyOn(httpClient, 'getResponseAsObservable');
    httpClientSpy.and.returnValue(of({status: "success"}));
    await service.initializeData();
    const publishData = await service.publish();
    expect(publishData).toBeTrue();
    httpClientSpy.and.returnValue(of(false));
    const publishDataError = await service.publish();
    expect(publishDataError).toBeFalse();
  });
  it('should upload Image', async () => {
    service.orgId = configService.getAttribute('orgId');
    const responseSpy = spyOn(httpClient, 'getResponse');
    responseSpy.and.returnValue(Promise.resolve({status: "success"}));
    await service.initializeData();
    const ImageData = await service.updateImage('ImageTest','base64string');
    expect(ImageData).toBeTrue();
    responseSpy.and.returnValue(Promise.resolve({status: "failed"}));
    const ImageDataError = await service.updateImage('ImageTest','base64string');
    expect(ImageDataError).toBeFalse();
  });
});
