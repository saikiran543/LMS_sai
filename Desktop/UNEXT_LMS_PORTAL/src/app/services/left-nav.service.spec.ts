/* eslint-disable max-lines-per-function */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthorizationService } from './authorization.service';
import { HttpClientService } from './http-client.service';

import { LeftNavService } from './left-nav.service';

describe('LeftNavService', () => {
  let service: LeftNavService;
  let authorizationService: AuthorizationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        AuthorizationService,
        HttpClientService,
      ]
    });
    service = TestBed.inject(LeftNavService);
    authorizationService = TestBed.inject(AuthorizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be return expected LeftMenuItems', async () => {
    const expectedResult = [
      {
        id: 'loginpage',
        icon: 'assets/images/icons/icon-loginpage.svg',
        displayName: 'Login Page',
        authorizationReqd: true,
      },
      {
        id: 'brandingpage',
        icon: 'assets/images/icons/icon-brandingpage.svg',
        displayName: 'Branding Page',
        authorizationReqd: true,
      },
      {
        id: 'emailtemplatepage',
        icon: 'assets/images/icons/icon-emailtemplate.svg',
        displayName: 'Email Template Page',
        authorizationReqd: false,
      },
    ];
    const data = {body: {
      "VIEW_LOGINPAGE": {"NA": true},
      "VIEW_BRANDINGPAGE": {"NA": true},
      "VIEW_EMAILTEMPLATEPAGE": {"NA": true}
    }};
    spyOn(authorizationService,'getAuthorizedActions').and.resolveTo(data);
    const result = await service.getLeftMenuItems('configAndSettings');
    expect(result).toEqual(expectedResult);
  });

  it('should be return expected sideBar items', async () => {
    const expectedResult = [
      {
        id: 'dashboard',
        icon: 'assets/images/icons/icon-dashboard.svg',
        displayName: 'Dashboard',
        position: 'top',
        authorizationReqd: true,
        leftMenu: false,
        title: '',
      },
      {
        id: 'communities',
        icon: 'assets/images/icons/icon-learningcentre.svg',
        displayName: '',
        position: 'top',
        authorizationReqd: true,
        leftMenu: true,
        title: 'Communities',
      },
      {
        id: 'configAndSettings',
        icon: 'assets/images/icons/icon-configandsettings.png',
        displayName: '',
        position: 'bottom',
        authorizationReqd: true,
        leftMenu: true,
        title: 'Config & Settings',
      },
    ];
    const data = {body: {
      "VIEW_DASHBOARD": {"NA": true},
      "VIEW_COMMUNITIES": {"NA": true},
      "VIEW_CONFIGANDSETTINGS": {"NA": true}
    }};
    spyOn(authorizationService,'getAuthorizedActions').and.resolveTo(data);
    const result = await service.getSideBarItems();
    expect(result).toEqual(expectedResult);
  });

  it('should be return expected result based on permission', async () => {
    const expectedResult = [
      {
        id: 'dashboard',
        icon: 'assets/images/icons/icon-dashboard.svg',
        displayName: 'Dashboard',
        position: 'top',
        authorizationReqd: true,
        leftMenu: false,
        title: '',
      },
      {
        id: 'configAndSettings',
        icon: 'assets/images/icons/icon-configandsettings.png',
        displayName: '',
        position: 'bottom',
        authorizationReqd: true,
        leftMenu: true,
        title: 'Config & Settings',
      },
    ];

    const data = {body: {
      "VIEW_DASHBOARD": {"NA": true},
      "VIEW_COMMUNITIES": {"NA": false},
      "VIEW_CONFIGANDSETTINGS": {"NA": true}
    }};
    spyOn(authorizationService,'getAuthorizedActions').and.resolveTo(data);
    const result = await service.getSideBarItems();
    expect(result).toEqual(expectedResult);
  });
});
