import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HttpMethod } from '../enums/httpMethod';
import { Service } from '../enums/service';
import { LoginLayoutComponent } from '../login-layout/login-layout.component';
import { ApiDiscoveryService } from './api-discovery.service';

import { JWTService } from './jwt.service';

// eslint-disable-next-line max-lines-per-function
describe('JWTService', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any = {};
  let http: HttpClient;
  let service: JWTService;
  let apiDiscoveryService: ApiDiscoveryService;
  const routes: Routes = [

    { path: 'login', component: LoginLayoutComponent },

  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
      ],
      providers: [ApiDiscoveryService, HttpClient]
    });
    service = TestBed.inject(JWTService);
    http = TestBed.inject(HttpClient);
    apiDiscoveryService = TestBed.inject(ApiDiscoveryService);

    spyOn(localStorage, 'getItem').and.callFake(function (key) {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });
    spyOn(localStorage, 'clear').and.callFake(function () {
      store = {};
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a boolean', async () => {
    localStorage.clear();
    const result = await service.init();

    expect(result).toEqual(false);
  });

  it('should store the token', async () => {
    const data = { 'jwttoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA', 'refreshToken': '11111' };
    await service.storeNewToken(data);
    expect(localStorage.getItem('jwttoken')).toEqual(data.jwttoken);
  });

  it('should store the token', async () => {
    localStorage.clear();
    expect(localStorage.getItem('jwttoken')).toBeUndefined();
  });

  it('should return a boolean', async () => {
    localStorage.clear();
    store = { 'jwttoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA', 'refreshToken': '11111' };
    const mockValidateAndFetchToken = spyOn(service, 'validateAndFetchToken');
    mockValidateAndFetchToken.and.resolveTo('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA');
    spyOn(service, 'getCurrentTimeInSeconds').and.returnValue(1623344127);
    let result = await service.init();
    expect(result).toEqual(true);
    mockValidateAndFetchToken.and.resolveTo(null);
    result = await service.init();
    expect(result).toEqual(false);
  });

  it('validateAndFetchToken method should return a same token if token is valid', async () => {
    const expectedResult = { 'jwttoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ2MDQ3fQ.TblhdfB5mL2qAsv1lamyuPZE7dqd6_hqy7bfuLCbWOg', 'refreshToken': '11111' };
    spyOn(service, 'getCurrentTimeInSeconds').and.returnValue(1623345927);
    const result = await service.validateAndFetchToken(expectedResult.jwttoken, 1623346047);
    expect(result).toEqual(expectedResult.jwttoken);
  });

  it('validateAndFetchToken method should return a fresh token if token get expired', async () => {
    const existingToken = { 'jwttoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA', 'refreshToken': '11111' };
    const expectedResult = { 'jwttoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o', 'refreshToken': '11111' };
    const MockRefreshToen = spyOn(service, 'refreshJwtToken').and.resolveTo(expectedResult);
    const mockStoreNewToken = spyOn(service, 'storeNewToken');
    spyOn(service, 'getCurrentTimeInSeconds').and.returnValue(1623345927);
    const result = await service.validateAndFetchToken(existingToken.jwttoken, 1623345927);
    expect(MockRefreshToen).toHaveBeenCalled();
    expect(mockStoreNewToken).toHaveBeenCalled();
    expect(result).toEqual(expectedResult.jwttoken);
  });

  it('should return a null token if any exception occurs', async () => {
    const expectedResult = { 'jwttoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA', 'refreshToken': '11111' };
    const MockgetResponse = spyOn(service, 'getResponse').and.throwError('');
    spyOn(service, 'getCurrentTimeInSeconds').and.returnValue(1623345927);
    const result = await service.validateAndFetchToken(expectedResult.jwttoken, 1623345927);
    expect(MockgetResponse).toHaveBeenCalled();
    expect(result).toEqual(null);
  });

  it('should return a null token if any inputs are empty or null', async () => {
    const expectedResult = { 'jwttoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA', 'refreshToken': '11111' };
    spyOn(service, 'getCurrentTimeInSeconds').and.returnValue(1623345927);
    const result = await service.validateAndFetchToken(expectedResult.jwttoken, 1623345927);
    expect(result).toEqual(null);
  });

  it('should return a fresh token', async () => {
    const expectedResult = { 'jwttoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA', 'refreshToken': '11111' };
    spyOn(service, 'getResponse').and.returnValue(Promise.resolve(expectedResult));
    const result = await service.refreshJwtToken(expectedResult.jwttoken);
    expect(result).toEqual(expectedResult);
  });

  it('should return boolean based on input', async () => {
    let result = await service.checkTokenExpiry(1623346047, 1623345927);
    expect(result).toBe(true);
    result = await service.checkTokenExpiry(16233460, 1623345927);
    expect(result).toBe(false);
  });

  it(' should return current date in seconds', async () => {
    const result = await service.getCurrentTimeInSeconds();
    expect(result).toBeInstanceOf(Number);
  });

  it('decodeJWTToken method should decode json token into expected result', async () => {
    const jwttoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA';
    const expectedResult = { username: 'Ram', iat: 1623344127, exp: 1623345927 };
    const result = service.decodeJWTToken(jwttoken);
    expect(result).toEqual(expectedResult);
  });

  it('should return token', async () => {
    const jwttoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA';
    const mockValidateAndFetchToken = spyOn(service, 'validateAndFetchToken');
    mockValidateAndFetchToken.and.resolveTo(null);
    let result = await service.checkAuthentication();
    expect(result).toEqual(null);
    const location = TestBed.inject(Location);
    expect(location.path()).toBe('/login');

    mockValidateAndFetchToken.and.resolveTo(jwttoken);
    result = await service.checkAuthentication();
    expect(result).toEqual(jwttoken);
  });

  it('return the http responce', async () => {
    const expectedResult = { 'jwttoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA', 'refreshToken': '11111' };
    const apiDiscoveryServiceSpy = spyOn(apiDiscoveryService, 'fetchServiceUrl');
    apiDiscoveryServiceSpy.and.returnValue('http://localhost:3033/api/configservice');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const httpSpy: any = spyOn(http, 'request');
    httpSpy.and.returnValue(of(expectedResult));
    const result = await service.getResponse(Service.USER_SERVICE, 'authentication/authenticate', HttpMethod.POST, {
      password: "Ram",
      username: "12345"
    });
    expect(result).toEqual(expectedResult);
  });
});
