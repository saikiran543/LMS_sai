import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthorizationService } from './authorization.service';
import { HttpClientService } from './http-client.service';

describe('AuthrizationService', () => {
  let service: AuthorizationService;
  let httpClientservice: HttpClientService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [HttpClientService],
    });
    httpClientservice = TestBed.inject(HttpClientService);
    service = TestBed.inject(AuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', async () => {
    const expectedResult = {
      read: { loginpage: true, brandingpage: true, emailtemplatepage: true },
    };
    spyOn(httpClientservice, 'getResponse').and.resolveTo(expectedResult);
    const data = [
      {
        actionName: 'read',
        resource: ['loginpage', 'brandingpage', 'emailtemplatepage'],
      },
    ];
    const {body} = await service.getAuthorizedActions(data);
    expect(body).toEqual(expectedResult);
  });
});
