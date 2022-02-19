/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from './authentication.service';
import { HttpClientService } from './http-client.service';
import { JWTService } from './jwt.service';

describe('AuthenticationService', () => {
  let httpClientservice: HttpClientService;
  let jwt: JWTService;
  let authService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        AuthenticationService,
        HttpClientService,
        JWTService
      ]
    });

    authService = TestBed.inject(AuthenticationService);
    httpClientservice = TestBed.inject(HttpClientService);
    jwt = TestBed.inject(JWTService);
  });

  it("should return true when login method is triggered", async () => {
    const expectedResult = { 'jwttoken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhbSIsImlhdCI6MTYyMzM0NDEyNywiZXhwIjoxNjIzMzQ1OTI3fQ.u-fm8bR7C5ylztm1BbVuuPQXspWOFOPW9lvta99o8jA', 'refreshToken': '11111' };
    spyOn(httpClientservice, 'getResponse').and.returnValue(Promise.resolve(expectedResult));
    spyOn(jwt, 'storeNewToken').and.returnValue();
    const loginValue = await authService.login("Ram", "12345");
    expect(loginValue).toBe(true);
  });

  it("should return true when validateToken method is triggered", async () => {
    spyOn(jwt, 'init').and.returnValue(Promise.resolve(true));
    const validateTokenValue = await authService.validateToken();
    expect(validateTokenValue).toBe(true);
  });

  it("should return success message if the user is valid", async () => {
    const expectedSuccessResult = {
      "Message": "Sucessfully sent Reset link to your email"
    };
    spyOn(httpClientservice, 'getResponse').and.returnValue(Promise.resolve(expectedSuccessResult));
    const forgotpasswordValue = await authService.forgotPassword("username1");
    expect(forgotpasswordValue).toEqual(expectedSuccessResult);
  });

  it("should return error message if the user is invalid", async () => {
    const expectedErrorResult = { body: "Email or Username is Invalid" };
    spyOn(httpClientservice, 'getResponse').and.returnValue(Promise.resolve(expectedErrorResult));
    const forgotpasswordValue = await authService.forgotPassword("username");
    expect(forgotpasswordValue).toEqual(expectedErrorResult);
  });

});

