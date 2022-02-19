import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { ApiDiscoveryService } from './api-discovery.service';
import { HttpClientService } from './http-client.service';
import { JWTService } from './jwt.service';

// eslint-disable-next-line max-lines-per-function
describe('HttpClientService', () => {
  let service: HttpClientService;
  let jwt: JWTService;
  let http: HttpClient;
  let apiDiscovery: ApiDiscoveryService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        HttpClientService,
        JWTService,
        ApiDiscoveryService,
        HttpClient
      ]
    });
    service = TestBed.inject(HttpClientService);
    apiDiscovery = TestBed.inject(ApiDiscoveryService);
    jwt = TestBed.inject(JWTService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return expected result as a promise", async () => {
    const expectedResponce =
      [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
    spyOn(jwt, 'checkAuthentication').and.resolveTo('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA');
    spyOn(apiDiscovery,'fetchServiceUrl').and.returnValue('http://localhost:3033/api/configservice');
    spyOn(http, 'request').and.returnValue(of(expectedResponce));
    let result = await service.getResponse(Service.USER_SERVICE, 'authentication/authenticate', HttpMethod.POST, {});
    expect(result).toEqual(expectedResponce);
    result = await service.getResponse(Service.USER_SERVICE, 'authentication/authenticate', undefined, {}, false);
    expect(result).toEqual(expectedResponce);

  });

  it("should return expected result as a observable", async () => {
    const expectedResponce =
      [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
    spyOn(jwt, 'checkAuthentication').and.resolveTo('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA');
    spyOn(apiDiscovery,'fetchServiceUrl').and.returnValue('http://localhost:3033/api/configservice');
    spyOn(http, 'request').and.returnValue(of(expectedResponce));
    service.getResponseAsObservable(Service.USER_SERVICE, 'authentication/authenticate', HttpMethod.POST, {}).subscribe(res => {
      expect(res).toEqual(expectedResponce);
    });
    service.getResponseAsObservable(Service.USER_SERVICE, 'authentication/authenticate', undefined, undefined, false).subscribe(res => {
      expect(res).toEqual(expectedResponce);
    });
  });
});
